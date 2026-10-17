import React from 'react';
import { soundEngine } from '../../utils/audio';

interface CurtainButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'white' | 'cyan' | 'red';
  className?: string;
  id?: string;
}

export const CurtainButton: React.FC<CurtainButtonProps> = ({
  children,
  onClick,
  href,
  variant = 'white',
  className = '',
  id,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    soundEngine.playClick();
    if (onClick) {
      onClick();
    }
  };

  const borderClass =
    variant === 'cyan'
      ? 'border-[#00E5FF] text-[#00E5FF]'
      : variant === 'red'
      ? 'border-[#FF2A4D] text-[#FF2A4D]'
      : 'border-white text-white';

  const fillClass =
    variant === 'cyan'
      ? 'bg-[#00E5FF]'
      : variant === 'red'
      ? 'bg-[#FF2A4D]'
      : 'bg-white';

  const textHoverClass =
    variant === 'cyan'
      ? 'group-hover:text-black'
      : variant === 'red'
      ? 'group-hover:text-white'
      : 'group-hover:text-black';

  const content = (
    <button
      id={id}
      type="button"
      onClick={handleClick}
      className={`px-10 py-4 border-2 ${borderClass} uppercase tracking-[0.15em] text-xs font-bold relative overflow-hidden group cursor-pointer inline-block text-center select-none font-din transition-all duration-300 ${className}`}
      style={{ borderRadius: '0px' }}
    >
      {/* Absolute fill layer sliding from bottom with cubic-bezier */}
      <span
        className={`absolute inset-0 ${fillClass} translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] pointer-events-none`}
      />
      {/* Button text sitting above */}
      <span
        className={`relative z-10 transition-colors duration-300 ${textHoverClass} block`}
      >
        {children}
      </span>
    </button>
  );

  if (href) {
    return (
      <a href={href} className="inline-block" style={{ textDecoration: 'none' }} onClick={() => soundEngine.playClick()}>
        {content}
      </a>
    );
  }

  return content;
};

