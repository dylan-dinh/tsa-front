import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
}

export const useIntersectionObserver = (options: UseIntersectionObserverOptions = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const elementRef = useRef<any>(null);

  useEffect(() => {
    if (Platform.OS !== 'web' || !elementRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: options.threshold || 0.5,
        rootMargin: options.rootMargin || '0px',
      }
    );

    observer.observe(elementRef.current);

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [options.threshold, options.rootMargin]);

  return { elementRef, isIntersecting };
}; 