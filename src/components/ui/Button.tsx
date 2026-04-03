import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  leftIcon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  icon,
  leftIcon,
  iconPosition = 'left',
  fullWidth = false,
  className,
  children,
  ...props
}: ButtonProps) => {
  const displayIcon = icon || leftIcon;

  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'bg-transparent border border-[var(--primary)] text-[var(--primary)] hover:bg-[rgba(0,122,255,0.05)]',
    ghost: 'bg-transparent text-[var(--text-secondary)] hover:bg-[rgba(120,120,128,0.08)]',
    danger: 'bg-gradient-to-b from-[#FF3B30] to-[#D63029] text-white shadow-[0_1px_3px_rgba(255,59,48,0.3),0_4px_12px_rgba(255,59,48,0.2)] hover:shadow-[0_2px_6px_rgba(255,59,48,0.3),0_6px_20px_rgba(255,59,48,0.25)]'
  };

  const sizes = {
    sm: 'px-4 py-2 text-[15px] rounded-[var(--radius-full)]',
    md: 'px-6 py-3 text-[17px] rounded-[var(--radius-full)]',
    lg: 'px-8 py-4 text-[19px] rounded-[var(--radius-full)]'
  };

  return (
    <button
      className={twMerge(
        clsx(
          'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-[var(--duration-fast)] ease-[var(--spring-smooth)] disabled:opacity-40 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          'active:scale-[0.97] active:transition-[transform_50ms]',
          className
        )
      )}
      {...props}
    >
      {displayIcon && iconPosition === 'left' && <span className="flex-shrink-0">{displayIcon}</span>}
      {children}
      {displayIcon && iconPosition === 'right' && <span className="flex-shrink-0">{displayIcon}</span>}
    </button>
  );
};
