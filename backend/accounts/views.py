"""
accounts/views.py

Views for:
- User registration (public)
- JWT login / token refresh (via SimpleJWT, with our custom serializer)
- Logout (blacklists the refresh token)
- Logged-in user's own profile (view/update)
- Change password
- Admin-only user management (list/create/update/delete any user)
"""

from django.contrib.auth import get_user_model
from rest_framework import generics, status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import User
from .permissions import IsAdmin, IsAdminOrSelf
from .serializers import (
    AdminCreateUserSerializer,
    ChangePasswordSerializer,
    CustomTokenObtainPairSerializer,
    RegisterSerializer,
    UserProfileSerializer,
)

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """
    POST /api/accounts/register/
    Public endpoint. Anyone can create a STAFF account (role is forced
    to STAFF in the serializer regardless of what is submitted).
    """

    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        # Immediately issue tokens so the frontend can log the user in
        # right after registering, without a second round trip.
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "user": UserProfileSerializer(user).data,
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            },
            status=status.HTTP_201_CREATED,
        )


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    POST /api/accounts/login/
    Drop-in replacement for SimpleJWT's default login view, using our
    CustomTokenObtainPairSerializer so the response includes role/user
    info alongside the access & refresh tokens.
    """

    serializer_class = CustomTokenObtainPairSerializer


class LogoutView(APIView):
    """
    POST /api/accounts/logout/
    Blacklists the provided refresh token so it can no longer be used
    to obtain new access tokens. Requires
    rest_framework_simplejwt.token_blacklist in INSTALLED_APPS
    (already configured in settings.py).
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response(
                {"detail": "Refresh token is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except TokenError:
            return Response(
                {"detail": "Invalid or expired refresh token."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            {"detail": "Successfully logged out."}, status=status.HTTP_205_RESET_CONTENT
        )


class ProfileView(generics.RetrieveUpdateAPIView):
    """
    GET  /api/accounts/profile/  -> current user's profile
    PUT/PATCH /api/accounts/profile/ -> update own profile
    (role/username are read-only, enforced in the serializer)
    """

    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class ChangePasswordView(APIView):
    """
    POST /api/accounts/change-password/
    Requires old_password, new_password, new_password_confirm.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"detail": "Password changed successfully."}, status=status.HTTP_200_OK
        )


class AdminUserViewSet(viewsets.ModelViewSet):
    """
    Full CRUD on user accounts, for Admins only.

    Endpoints (via DefaultRouter, registered in urls.py):
        GET    /api/accounts/users/         -> list all users
        POST   /api/accounts/users/         -> create a user with any role
        GET    /api/accounts/users/{id}/    -> retrieve a user
        PUT    /api/accounts/users/{id}/    -> update a user
        PATCH  /api/accounts/users/{id}/    -> partial update
        DELETE /api/accounts/users/{id}/    -> delete a user

    Uses IsAdminOrSelf so that, in principle, a non-admin could be
    permitted object-level access to their own record if this ViewSet
    were ever exposed more broadly — but list/create is further locked
    to IsAdmin only via get_permissions(), since listing all users or
    creating arbitrary-role accounts must never be available to
    non-admins.
    """

    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = AdminCreateUserSerializer
    permission_classes = [IsAdmin]

    def get_serializer_class(self):
        # Don't require/expose password on retrieve/list/update unless
        # explicitly creating a new account.
        if self.action in ["update", "partial_update"]:
            return UserProfileSerializerForAdmin
        return AdminCreateUserSerializer

    def get_permissions(self):
        # Kept simple and strict: every action on this ViewSet requires
        # IsAdmin. (IsAdminOrSelf is imported for use by other,
        # narrower-scoped endpoints if added later.)
        return [IsAdmin()]


class UserProfileSerializerForAdmin(UserProfileSerializer):
    """
    Like UserProfileSerializer, but allows an Admin to update a
    target user's role and active status too (unlike a user editing
    their own profile, where role must stay read-only).
    """

    class Meta(UserProfileSerializer.Meta):
        read_only_fields = ["id", "username", "date_joined"]
        fields = UserProfileSerializer.Meta.fields + ["is_active_employee"]
