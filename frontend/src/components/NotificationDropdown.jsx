import {
  FaBox,
  FaShoppingCart,
  FaUserPlus,
} from "react-icons/fa";

const notifications = [
  {
    title: "New Product Added",
    desc: "Gaming Laptop has been added.",
    icon: <FaBox className="text-blue-500" />,
    time: "2 min ago",
  },
  {
    title: "New Order",
    desc: "Order #ORD-1004 received.",
    icon: <FaShoppingCart className="text-green-500" />,
    time: "15 min ago",
  },
  {
    title: "New User Registered",
    desc: "Rahul Sharma joined.",
    icon: <FaUserPlus className="text-purple-500" />,
    time: "1 hour ago",
  },
];

const NotificationDropdown = () => {
  return (
    <div className="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-2xl border overflow-hidden z-50">

      <div className="px-5 py-4 border-b">

        <h2 className="font-bold text-xl">
          Notifications
        </h2>

      </div>

      <div className="max-h-96 overflow-y-auto">

        {notifications.map((item, index) => (

          <div
            key={index}
            className="flex gap-4 p-4 hover:bg-gray-100 transition cursor-pointer"
          >

            <div className="text-2xl">

              {item.icon}

            </div>

            <div>

              <h3 className="font-semibold">

                {item.title}

              </h3>

              <p className="text-gray-500 text-sm">

                {item.desc}

              </p>

              <span className="text-xs text-gray-400">

                {item.time}

              </span>

            </div>

          </div>

        ))}

      </div>

      <button
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
      >
        View All Notifications
      </button>

    </div>
  );
};

export default NotificationDropdown;