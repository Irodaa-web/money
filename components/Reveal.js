'use client';
import { useEffect, useRef } from 'react';

// Content stays readable without JavaScript or with reduced motion enabled.
export default function Reveal({ children, className = '', id }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.disconnect();
      }
    }, { threshold: 0.08 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <section ref={ref} id={id} className={`reveal-section ${className}`}>{children}</section>;
}
