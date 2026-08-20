import { AnimatePresence, motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";

const Drawer = ({
  open,
  onClose,
  title,
  children,
  width = "w-[500px]",
}) => {

  return (

    <AnimatePresence>

      {open && (

        <>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              duration: 0.3,
            }}
            className={`fixed right-0 top-0 h-screen ${width} bg-white shadow-2xl z-50 flex flex-col`}
          >

            {/* Header */}

            <div className="flex items-center justify-between px-6 py-5 border-b">

              <h2 className="text-xl font-bold text-gray-800">
                {title}
              </h2>

              <button
                onClick={onClose}
                className="text-gray-500 hover:text-red-500"
              >
                <FaTimes />
              </button>

            </div>

            {/* Body */}

            <div className="flex-1 overflow-y-auto p-6">

              {children}

            </div>

          </motion.div>

        </>

      )}

    </AnimatePresence>

  );

};

export default Drawer;