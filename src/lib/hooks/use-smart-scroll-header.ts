import { useEffect, useRef, useState } from 'react';

interface UseSmartScrollHeaderOptions {
  /** Offset from top where the collapse behavior becomes active */
  topThreshold?: number;
  /** Pixels user must scroll down consecutively before header collapses */
  scrollDownThreshold?: number;
  /** Pixels user must scroll up consecutively before header re-appears */
  scrollUpThreshold?: number;
}

export const useSmartScrollHeader = ({
  topThreshold = 100,
  scrollDownThreshold = 40,
  scrollUpThreshold = 15,
}: UseSmartScrollHeaderOptions = {}) => {
  // true = collapsed (only search bar visible), false = expanded (navbar + search bar visible)
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const prevScrollY = useRef<number>(0);
  const accumulatedDistance = useRef<number>(0);
  const lastDirection = useRef<'up' | 'down' | null>(null);

  useEffect(() => {
    prevScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - prevScrollY.current;

      // 1. Always expand when near the absolute top
      if (currentScrollY <= topThreshold) {
        setIsCollapsed(false);
        accumulatedDistance.current = 0;
        prevScrollY.current = currentScrollY;
        return;
      }

      const currentDirection = deltaY > 0 ? 'down' : 'up';

      // Reset accumulated distance if scroll direction reverses
      if (lastDirection.current !== currentDirection) {
        accumulatedDistance.current = 0;
        lastDirection.current = currentDirection;
      }

      accumulatedDistance.current += Math.abs(deltaY);

      // 2. Trigger collapse only if continuous downward scroll exceeds threshold
      if (
        currentDirection === 'down' &&
        accumulatedDistance.current >= scrollDownThreshold
      ) {
        setIsCollapsed(true);
        accumulatedDistance.current = 0;
      }

      // 3. Trigger expand only if continuous upward scroll exceeds threshold
      if (
        currentDirection === 'up' &&
        accumulatedDistance.current >= scrollUpThreshold
      ) {
        setIsCollapsed(false);
        accumulatedDistance.current = 0;
      }

      prevScrollY.current = currentScrollY > 0 ? currentScrollY : 0;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [topThreshold, scrollDownThreshold, scrollUpThreshold]);

  return { isCollapsed };
};
