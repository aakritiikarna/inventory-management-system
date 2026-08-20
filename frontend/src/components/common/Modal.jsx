import { FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  width = "max-w-2xl",
}) => {

  if (!isOpen) return null;

  return (

    <AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      >

        <motion.div
          initial={{
            scale: 0.9,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          exit={{
            scale: 0.9,
            opacity: 0,
          }}
          transition={{ duration: 0.2 }}
          className={`bg-white rounded-2xl shadow-xl w-full ${width}`}
        >

          {/* Header */}

          <div className="flex items-center justify-between px-6 py-4 border-b">

            <h2 className="text-xl font-semibold text-gray-800">
              {title}
            </h2>

            <button
              onClick={onClose}
              className="text-gray-500 hover:text-red-500 transition"
            >
              <FaTimes size={18} />
            </button>

          </div>

          {/* Body */}

          <div className="p-6">

            {children}

          </div>

        </motion.div>

      </motion.div>

    </AnimatePresence>

  );

};

export default Modal;