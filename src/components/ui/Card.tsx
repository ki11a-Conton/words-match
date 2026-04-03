import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  glass?: boolean;
  hoverable?: boolean;
}

export const Card = ({ children, className, glass = false, hoverable = false, ...props }: CardProps) => (
  <div
    className={twMerge(
      clsx(
        'bg-white rounded-2xl shadow-lg border border-gray-100',
        glass && 'bg-white/90 backdrop-blur-sm',
        hoverable && 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
        className
      )
    )}
    {...props}
  >
    {children}
  </div>
);

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export const CardHeader = ({ children, className, ...props }: CardHeaderProps) => (
  <div className={twMerge('p-6 border-b border-gray-100', className)} {...props}>
    {children}
  </div>
);

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  className?: string;
}

export const CardTitle = ({ children, className, ...props }: CardTitleProps) => (
  <h3 className={twMerge('text-xl font-bold text-gray-900', className)} {...props}>
    {children}
  </h3>
);

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export const CardContent = ({ children, className, ...props }: CardContentProps) => (
  <div className={twMerge('p-6', className)} {...props}>
    {children}
  </div>
);

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export const CardFooter = ({ children, className, ...props }: CardFooterProps) => (
  <div className={twMerge('p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl', className)} {...props}>
    {children}
  </div>
);
