import { motion, AnimatePresence } from 'framer-motion';
import { IoClose, IoCheckmarkCircle, IoWarning, IoInformationCircle } from 'react-icons/io5';

const icons = {
  success: IoCheckmarkCircle,
  error: IoWarning,
  info: IoInformationCircle,
};

const colors = {
  success: 'border-green-200 bg-green-50 text-green-800',
  error: 'border-red-200 bg-red-50 text-red-800',
  info: 'border-blue-200 bg-blue-50 text-blue-800',
};

export default function Toast({ toasts, removeToast }) {
  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = icons[toast.type] || IoInformationCircle;
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 80 }}
              className={`flex items-center gap-3 rounded-2xl border px-5 py-4 shadow-xl backdrop-blur-xl ${colors[toast.type]}`}
            >
              <Icon className="text-xl shrink-0" />
              <span className="text-sm font-medium">{toast.message}</span>
              <button onClick={() => removeToast(toast.id)} className="ml-2 opacity-60 hover:opacity-100">
                <IoClose />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
