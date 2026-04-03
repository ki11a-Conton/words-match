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
        'bg-white rounded-[var(--radius-xl)] shadow-[0_2px_8px_rgba(0,0,0,0.04),0_8px_32px_rgba(0,0,0,0.04)]',
        glass && 'glass-card',
        hoverable && 'transition-all duration-[var(--duration-fast)] ease-[var(--spring-smooth)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08),0_12px_40px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 active:scale-[0.98]',
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
  <div className={twMerge('p-5 border-b border-[var(--separator)]', className)} {...props}>
    {children}
  </div>
);

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  className?: string;
}

export const CardTitle = ({ children, className, ...props }: CardTitleProps) => (
  <h3 className={twMerge('text-[21px] font-bold text-[var(--text-primary)]', className)} {...props}>
    {children}
  </h3>
);

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export const CardContent = ({ children, className, ...props }: CardContentProps) => (
  <div className={twMerge('p-5', className)} {...props}>
    {children}
  </div>
);

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export const CardFooter = ({ children, className, ...props }: CardFooterProps) => (
  <div className={twMerge('p-5 border-t border-[var(--separator)] bg-[rgba(120,120,128,0.04)] rounded-b-[var(--radius-xl)]', className)} {...props}>
    {children}
  </div>
);
