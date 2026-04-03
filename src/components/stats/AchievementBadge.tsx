import { Card, CardContent } from '../ui/Card';
import { Trophy } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Badge } from '../../types';

interface AchievementBadgeProps {
  badge?: Badge;
  name?: string;
  description?: string;
  icon?: ReactNode;
  unlocked: boolean;
  unlockedAt?: Date;
}

export const AchievementBadge = ({
  badge,
  name: propName,
  description: propDescription,
  icon,
  unlocked,
  unlockedAt
}: AchievementBadgeProps) => {
  const displayName = badge?.name || propName || '';
  const displayDescription = badge?.description || propDescription || '';

  return (
    <Card className={!unlocked ? 'opacity-50' : ''}>
      <CardContent className="text-center">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
          unlocked 
            ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' 
            : 'bg-gray-200 text-gray-400'
        }`}>
          {icon || <Trophy size={32} />}
        </div>
        <h4 className="font-bold text-gray-900">{displayName}</h4>
        <p className="text-sm text-gray-600 mt-1">{displayDescription}</p>
        {unlocked && unlockedAt && (
          <p className="text-xs text-gray-500 mt-2">
            {new Date(unlockedAt).toLocaleDateString('zh-CN')}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
