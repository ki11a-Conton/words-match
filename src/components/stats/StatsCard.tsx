import { Card, CardContent } from '../ui/Card';
import type { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color?: 'indigo' | 'emerald' | 'amber' | 'violet';
  trend?: string;
  trendUp?: boolean;
  description?: string;
}

export const StatsCard = ({
  title,
  value,
  icon,
  color = 'indigo',
  trend,
  trendUp = true,
  description
}: StatsCardProps) => {
  const colorClasses = {
    indigo: 'from-indigo-100 to-purple-100 text-indigo-600',
    emerald: 'from-emerald-100 to-teal-100 text-emerald-600',
    amber: 'from-amber-100 to-orange-100 text-amber-600',
    violet: 'from-violet-100 to-fuchsia-100 text-violet-600'
  };

  return (
    <Card>
      <CardContent>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
            {trend && (
              <p className={`text-sm mt-1 ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
                {trendUp ? '↑' : '↓'} {trend}
              </p>
            )}
            {description && (
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            )}
          </div>
          <div className={`p-3 bg-gradient-to-br ${colorClasses[color]} rounded-xl`}>
            <div>{icon}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
