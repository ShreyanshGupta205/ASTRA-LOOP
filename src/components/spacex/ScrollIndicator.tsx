import React from 'react';
import { motion } from 'framer-motion';

interface ScrollIndicatorProps {
  onClick?: () => void;
  targetId?: string;
  className?: string;
}

export const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({
  onClick,
  targetId,
  className = '',
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 cursor-pointer z-20 group ${className}`}
      aria-label="Scroll Down"
    >
      {/* Animated pulsing vertical line */}
      <motion.div
        animate={{
          y: [0, 8, 0],
          opacity: [0.4, 1, 0.4],
        }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="w-[1.5px] h-8 bg-gradient-to-b from-white/20 via-white to-white/0"
      />
      {/* Sharp chevron arrow */}
      <svg
        className="w-4 h-4 text-white/70 group-hover:text-white transition-colors"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="square" strokeLinejoin="miter" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
};
