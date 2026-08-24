import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface RatingStarsProps {
  value?: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function RatingStars({ value = 0, onChange, readonly = false, size = 'md', className }: RatingStarsProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const handleMouseEnter = (index: number) => {
    if (!readonly) setHoverValue(index);
  };

  const handleMouseLeave = () => {
    if (!readonly) setHoverValue(null);
  };

  const handleClick = (index: number) => {
    if (!readonly && onChange) {
      onChange(index);
    }
  };

  const displayValue = hoverValue !== null ? hoverValue : value;

  return (
    <div className={twMerge('flex items-center gap-1.5', className)} onMouseLeave={handleMouseLeave}>
      {[1, 2, 3, 4, 5].map((index) => {
        const isFilled = index <= displayValue;
        return (
          <motion.div
            key={index}
            whileHover={!readonly ? { scale: 1.15 } : {}}
            whileTap={!readonly ? { scale: 0.9 } : {}}
            onMouseEnter={() => handleMouseEnter(index)}
            onClick={() => handleClick(index)}
            className={clsx(
              'cursor-pointer transition-colors',
              readonly && 'cursor-default'
            )}
          >
            <Star
              className={clsx(
                sizes[size],
                isFilled ? 'fill-pastel-apricot text-pastel-apricot drop-shadow-sm' : 'fill-gray-100 text-gray-200'
              )}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
