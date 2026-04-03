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
    primary: 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    outline: 'border-2 border-indigo-500 text-indigo-500 hover:bg-indigo-50',
    ghost: 'text-gray-600 hover:bg-gray-100',
    danger: 'bg-red-500 text-white hover:bg-red-600'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3.5 text-lg'
  };

  return (
    <button
      className={twMerge(
        clsx(
          'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
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
