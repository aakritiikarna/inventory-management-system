"""
accounts/serializers.py

Serializers for:
- User registration
- User profile (view/update)
- Change password
- JWT login (custom claims via SimpleJWT's TokenObtainPairSerializer)
"""

from django.contrib.auth import password_validation
from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    """
    Handles new user registration.

    Password is write-only and validated through Django's built-in
    password validators (configured in settings.AUTH_PASSWORD_VALIDATORS).
    `password_confirm` is a non-model field used only to verify the user
    typed their password correctly.
    """

    password = serializers.CharField(
        write_only=True, required=True, style={"input_type": "password"}
    )
    password_confirm = serializers.CharField(
        write_only=True, required=True, style={"input_type": "password"}
    )

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "employee_id",
            "role",
            "password",
            "password_confirm",
        ]
        # Role defaults to STAFF unless explicitly set; in practice, only
        # an Admin-created account (via a different, permission-locked
        # endpoint) should be able to set role=ADMIN. Self-registration
        # is restricted to STAFF in validate() below for safety.
        extra_kwargs = {
            "email": {"required": True},
        }

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError(
                {"password_confirm": "Passwords do not match."}
            )
        # Run Django's password strength validators (length, common
        # password checks, similarity to username, etc.)
        password_validation.validate_password(attrs["password"])

        # Prevent privilege escalation through self-registration: anyone
        # hitting the public /register/ endpoint can only ever create a
        # STAFF account. Admin/Warehouse Manager accounts must be created
        # by an existing Admin via the user-management endpoint.
        requested_role = attrs.get("role")
        if requested_role and requested_role != User.Role.STAFF:
            attrs["role"] = User.Role.STAFF
        return attrs

    def create(self, validated_data):
        validated_data.pop("password_confirm")
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class AdminCreateUserSerializer(serializers.ModelSerializer):
    """
    Used by Admins to create users with any role (Admin, Warehouse
    Manager, or Staff). Locked down at the view level with an
    IsAdmin permission class.
    """

    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "employee_id",
            "role",
            "password",
            "is_active_employee",
        ]

    def validate_password(self, value):
        password_validation.validate_password(value)
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Used for viewing and updating the logged-in user's own profile.
    Role and username are read-only here — users cannot promote
    themselves or rename their account; that's an Admin-only action
    via AdminCreateUserSerializer / a dedicated admin update endpoint.
    """

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "employee_id",
            "profile_picture",
            "role",
            "date_joined",
        ]
        read_only_fields = ["id", "username", "role", "date_joined"]


class ChangePasswordSerializer(serializers.Serializer):
    """
    Requires the current password before allowing it to be changed,
    to prevent someone with a hijacked, already-logged-in session
    from locking the real owner out.
    """

    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True)
    new_password_confirm = serializers.CharField(required=True, write_only=True)

    def validate_old_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value

    def validate(self, attrs):
        if attrs["new_password"] != attrs["new_password_confirm"]:
            raise serializers.ValidationError(
                {"new_password_confirm": "New passwords do not match."}
            )
        password_validation.validate_password(attrs["new_password"])
        return attrs

    def save(self, **kwargs):
        user = self.context["request"].user
        user.set_password(self.validated_data["new_password"])
        user.save()
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Extends SimpleJWT's default login serializer to embed extra claims
    (role, username, email) directly into the JWT access token. This
    lets the React frontend read the user's role straight from the
    decoded token without an extra API call after login.
    """

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["username"] = user.username
        token["email"] = user.email
        token["role"] = user.role
        token["full_name"] = f"{user.first_name} {user.last_name}".strip()
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Also return basic user info alongside the tokens, so the
        # frontend can populate its auth context immediately on login
        # without decoding the JWT manually.
        data["user"] = {
            "id": self.user.id,
            "username": self.user.username,
            "email": self.user.email,
            "role": self.user.role,
            "first_name": self.user.first_name,
            "last_name": self.user.last_name,
        }
        return data
