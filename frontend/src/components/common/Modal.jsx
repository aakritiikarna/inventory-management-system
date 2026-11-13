import { FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Modal = ({ isOpen, onClose, title, children, width = "max-w-2xl" }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className={`bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full ${width} max-h-[90vh] overflow-y-auto`}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              {title}
            </h2>

            <button
              onClick={onClose}
              className="text-gray-500 dark:text-gray-400 hover:text-red-500 transition cursor-pointer"
            >
              <FaTimes size={18} />
            </button>
          </div>

          <div className="p-6">{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Modal;
