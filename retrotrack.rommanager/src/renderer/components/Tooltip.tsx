import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

export default function Tooltip({ text, children }: TooltipProps) {
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const wrapperRef = useRef<HTMLSpanElement>(null);

  const show = () => {
    if (!wrapperRef.current) return;
    const el =
      (wrapperRef.current.firstElementChild as HTMLElement | null) ??
      wrapperRef.current;
    const r = el.getBoundingClientRect();
    setPos({ top: r.top + r.height / 2, left: r.right + 8 });
  };

  const hide = () => setPos(null);

  return (
    <>
      <span
        ref={wrapperRef}
        style={{ display: 'contents' }}
        onMouseEnter={show}
        onMouseLeave={hide}
      >
        {children}
      </span>
      {pos &&
        createPortal(
          <>
            <div
              className="sidebar-tooltip"
              style={{ top: pos.top, left: pos.left }}
            >
              {text}
            </div>
            <div
              className="sidebar-tooltip-arrow"
              style={{ top: pos.top, left: pos.left - 6 }}
            />
          </>,
          document.body,
        )}
    </>
  );
}
