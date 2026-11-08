'use client';

import React from 'react';
import { soundFx } from '@/utils/audio';

interface PixelButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  variant?: 'green' | 'amber' | 'pink' | 'slate';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export const PixelButton: React.FC<PixelButtonProps> = ({
  children,
  onClick,
  variant = 'green',
  size = 'md',
  className = '',
  disabled = false,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return;
    soundFx.playPick();
    if (onClick) onClick(e);
  };

  const getVariantStyles = () => {
    if (disabled) {
      return 'bg-[#475569] text-[#94a3b8] border-t-2 border-l-2 border-[#64748b] border-b-4 border-r-4 border-[#1e293b] cursor-not-allowed opacity-60';
    }

    switch (variant) {
      case 'amber':
        return 'bg-[#d97706] hover:bg-[#b45309] text-amber-50 border-t-2 border-l-2 border-[#fde68a] border-b-4 border-r-4 border-[#78350f] active:border-b-2 active:border-r-2 active:translate-y-0.5 shadow-[0_4px_0_#451a03]';
      case 'pink':
        return 'bg-[#db2777] hover:bg-[#be185d] text-pink-50 border-t-2 border-l-2 border-[#fbcfe8] border-b-4 border-r-4 border-[#831843] active:border-b-2 active:border-r-2 active:translate-y-0.5 shadow-[0_4px_0_#500724]';
      case 'slate':
        return 'bg-[#334155] hover:bg-[#1e293b] text-slate-100 border-t-2 border-l-2 border-[#94a3b8] border-b-4 border-r-4 border-[#0f172a] active:border-b-2 active:border-r-2 active:translate-y-0.5 shadow-[0_4px_0_#020617]';
      case 'green':
      default:
        return 'bg-[#15803d] hover:bg-[#166534] text-emerald-50 border-t-2 border-l-2 border-[#86efac] border-b-4 border-r-4 border-[#14532d] active:border-b-2 active:border-r-2 active:translate-y-0.5 shadow-[0_4px_0_#052e16]';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 font-pixel text-[10px]';
      case 'lg':
        return 'px-6 py-3 font-pixel text-xs sm:text-sm';
      case 'md':
      default:
        return 'px-4 py-2 font-pixel text-[11px] sm:text-xs';
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`relative inline-flex items-center justify-center gap-2 rounded-none font-bold uppercase tracking-wider transition-all cursor-pointer select-none ${getVariantStyles()} ${getSizeStyles()} ${className}`}
    >
      {children}
    </button>
  );
};
