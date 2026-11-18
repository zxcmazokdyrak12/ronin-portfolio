import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useLang } from '../i18n/LangContext';

// Свиток-модалка: закрывается по Esc, клику по фону и кнопке.
// Пока открыта — блокирует прокрутку страницы и держит фокус внутри.
export default function Modal({ open, onClose, labelledBy, wide = false, children }) {
  const panelRef = useRef(null);
  const { t } = useLang();

  useEffect(() => {
    if (!open) return;

    const prevFocus = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus?.();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            initial={{ scaleY: 0.2, opacity: 0, y: 30 }}
            animate={{ scaleY: 1, opacity: 1, y: 0 }}
            exit={{ scaleY: 0.2, opacity: 0, y: 30 }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            style={{ originY: 0 }}
            className={`relative bg-paper text-ink p-6 sm:p-8 ${wide ? 'max-w-4xl' : 'max-w-xl'} w-full max-h-[90vh] overflow-y-auto outline-none border-3 border-ink shadow-[10px_10px_0_0_var(--accent)]`}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label={t('project.close')}
              className="absolute top-3 right-3 p-1 border-2 border-transparent hover:border-ink transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
