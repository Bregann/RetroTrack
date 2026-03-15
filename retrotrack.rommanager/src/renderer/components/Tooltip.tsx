import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  text: string;
  children: React.ReactElement;
}

export default function Tooltip({ text, children }: TooltipProps) {
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const ref = useRef<HTMLElement>(null);

  const show = () => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos({ top: r.top + r.height / 2, left: r.right + 8 });
  };

  const hide = () => setPos(null);

  // Clone child to attach ref and mouse events
  const child = children as React.ReactElement<React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }>;
  const cloned = {
    ...child,
    props: {
      ...child.props,
      ref,
      onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
        show();
        child.props.onMouseEnter?.(e);
      },
      onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
        hide();
        child.props.onMouseLeave?.(e);
      },
    },
  } as React.ReactElement;

  return (
    <>
      {cloned}
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
