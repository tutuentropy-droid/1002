import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  value?: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: number;
  showLabel?: boolean;
}

export function StarRating({
  value = 0,
  onChange,
  readOnly = false,
  size = 20,
  showLabel = true,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0);

  const displayValue = hoverValue || value;
  const labels = ['', '很差', '一般', '还行', '推荐', '神作'];

  const handleClick = (rating: number) => {
    if (!readOnly && onChange) {
      onChange(rating);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            className={cn(
              'star',
              displayValue >= star ? 'star-active' : 'star-inactive',
              readOnly && 'cursor-default hover:scale-100'
            )}
            onClick={() => handleClick(star)}
            onMouseEnter={() => !readOnly && setHoverValue(star)}
            onMouseLeave={() => !readOnly && setHoverValue(0)}
            aria-label={`${star}星`}
          >
            <Star
              size={size}
              fill={displayValue >= star ? 'currentColor' : 'none'}
              strokeWidth={2}
              className={displayValue >= star && !readOnly ? 'animate-star-pop' : ''}
            />
          </button>
        ))}
      </div>
      {showLabel && displayValue > 0 && (
        <span className="text-sm text-songyan-600 font-medium">
          {labels[displayValue]}
        </span>
      )}
    </div>
  );
}
