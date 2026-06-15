import React, { useEffect, useRef, useState } from 'react';

/**
 * CustomCursor — trailing clay-colored circle that follows the mouse
 * with slight lag, activated only within interactive zones.
 * Add class `cursor-zone` to any container you want to trigger this.
 */
function CustomCursor() {
  const cursorRef = useRef(null);
  const posRef = useRef({ x: -100, y: -100 });
  const currentPosRef = useRef({ x: -100, y: -100 });
  const [enlarged, setEnlarged] = useState(false);
  const rafRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };

      // Check if hovering an interactive element
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const isInteractive = el && (
        el.closest('button') ||
        el.closest('a') ||
        el.closest('.wax-seal') ||
        el.closest('.rsvp-chip') ||
        el.closest('.cursor-zone')
      );
      setEnlarged(!!isInteractive);
    };

    const loop = () => {
      const lag = 0.15;
      currentPosRef.current.x += (posRef.current.x - currentPosRef.current.x) * lag;
      currentPosRef.current.y += (posRef.current.y - currentPosRef.current.y) * lag;

      if (cursorRef.current) {
        cursorRef.current.style.left = `${currentPosRef.current.x}px`;
        cursorRef.current.style.top  = `${currentPosRef.current.y}px`;
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    document.addEventListener('mousemove', onMove);
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor ${enlarged ? 'enlarged' : ''}`}
      aria-hidden="true"
    />
  );
}

export default CustomCursor;
