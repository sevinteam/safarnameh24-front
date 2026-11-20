import { useState, useEffect, useRef } from 'react';

export type ScrollDirection = 'up' | 'down' | null;

export interface ScrollThresholds {
  /** Minimum scroll offset before triggering collapse */
  thresholdOffset?: number;
  /** Minimum pixel delta to consider as a valid scroll movement */
  deltaThreshold?: number;
}

// ------------------------------

export const useScrollDirection = ({
  thresholdOffset = 80,
  deltaThreshold = 10,
}: ScrollThresholds = {}) => {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(null);
  const [isScrolledPastThreshold, setIsScrolledPastThreshold] =
    useState<boolean>(false);

  const prevScrollY = useRef<number>(0);
  const ticking = useRef<boolean>(false);

  useEffect(() => {
    // Keep reference in sync at mount
    prevScrollY.current = window.scrollY;

    const updateScrollDirection = () => {
      const currentScrollY = window.scrollY;
      const difference = currentScrollY - prevScrollY.current;

      // Check if user has passed initial threshold
      setIsScrolledPastThreshold(currentScrollY > thresholdOffset);

      // Ignore micro scrolls (below deltaThreshold)
      if (Math.abs(difference) < deltaThreshold) {
        ticking.current = false;
        return;
      }

      // At the absolute top, always expand header
      if (currentScrollY <= thresholdOffset) {
        setScrollDirection('up');
      } else if (difference > 0) {
        setScrollDirection('down');
      } else {
        setScrollDirection('up');
      }

      prevScrollY.current = currentScrollY > 0 ? currentScrollY : 0;
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [thresholdOffset, deltaThreshold]);

  return { scrollDirection, isScrolledPastThreshold };
};
