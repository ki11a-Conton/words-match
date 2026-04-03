import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export const ProgressBar = ({
  value,
  max = 100,
  color = 'primary',
  size = 'md',
  showLabel = false,
  label,
  className
}: ProgressBarProps) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const colors = {
    primary: 'bg-gradient-to-r from-indigo-500 to-purple-500',
    success: 'bg-gradient-to-r from-green-400 to-green-500',
    warning: 'bg-gradient-to-r from-yellow-400 to-orange-500',
    danger: 'bg-gradient-to-r from-red-400 to-red-500'
  };

  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  return (
    <div className={twMerge('w-full', className)}>
      {label && <div className="mb-2 text-sm font-medium text-gray-700">{label}</div>}
      <div className={twMerge(
        'w-full bg-gray-200 rounded-full overflow-hidden',
        sizes[size]
      )}>
        <div
          className={twMerge(
            'h-full transition-all duration-500 ease-out rounded-full',
            colors[color]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-sm text-gray-600 text-right">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
};
