import { motion } from "framer-motion";

const CustomButton = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  icon,
}) => {

  const styles = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white",

    secondary:
      "bg-gray-200 hover:bg-gray-300 text-gray-800",

    success:
      "bg-green-600 hover:bg-green-700 text-white",

    danger:
      "bg-red-600 hover:bg-red-700 text-white",

    warning:
      "bg-yellow-500 hover:bg-yellow-600 text-white",
  };

  return (

    <motion.button
      whileHover={{
        scale: 1.03,
      }}
      whileTap={{
        scale: 0.97,
      }}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        inline-flex
        items-center
        gap-2
        px-5
        py-2.5
        rounded-xl
        font-medium
        transition
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${styles[variant]}
      `}
    >

      {icon}

      {children}

    </motion.button>

  );

};

export default CustomButton;