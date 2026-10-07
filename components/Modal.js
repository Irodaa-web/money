'use client';
import { useEffect, useRef, useId } from 'react';
import Icon from './Icon';
export default function Modal({ title, description, onClose, children, locked = false, className = '' }) {
  const ref = useRef(null);
  const heading = useId();
  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusable = () => [...ref.current.querySelectorAll('button:not(:disabled), input, select, textarea, a[href], [tabindex="0"]')];
    focusable()[0]?.focus();
    function key(event) {
      if (event.key === 'Escape' && !locked) onClose?.();
      if (event.key !== 'Tab') return;
      const items = focusable();
      if (!items.length) { event.preventDefault(); return; }
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && (document.activeElement === first || !ref.current.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !ref.current.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
    }
    document.addEventListener('keydown', key);
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', key); previous?.focus?.(); };
  }, [onClose, locked]);
  return <div className={`modal-backdrop ${className}`} onMouseDown={event => { if (event.target === event.currentTarget && !locked) onClose?.(); }}><section className="modal" ref={ref} role="dialog" aria-modal="true" aria-labelledby={heading}><div className="modal-title"><div><h2 id={heading}>{title}</h2>{description && <p>{description}</p>}</div>{onClose && <button className="icon-button" aria-label="Yopish" onClick={onClose} disabled={locked}><Icon name="close" /></button>}</div>{children}</section></div>;
}
