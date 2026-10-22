import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', hover = true, onClick, ...props }) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : undefined}
      onClick={onClick}
      className={`glass rounded-3xl p-6 ${hover ? 'card-hover cursor-default' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
