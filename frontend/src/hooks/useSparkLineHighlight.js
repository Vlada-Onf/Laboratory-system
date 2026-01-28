import { useState, useCallback } from 'react';

export function useSparkLineHighlight(length) {
  const [highlightIndex, setHighlightIndex] = useState(null);

  const onKeyDown = useCallback(
    (event) => {
      if (!length) {
        return;
      }

      if (event.key === 'ArrowLeft') {
        setHighlightIndex((p) => {
          return p === null ? length - 1 : (length + p - 1) % length;
        });
      }

      if (event.key === 'ArrowRight') {
        setHighlightIndex((p) => {
          return p === null ? 0 : (p + 1) % length;
        });
      }
    },
    [length]
  );

  const onFocus = useCallback(() => {
    setHighlightIndex((p) => {
      return p === null ? 0 : p;
    });
  }, []);

  const handleHighlightChange = useCallback((axisItems) => {
    setHighlightIndex(() => {
      return axisItems[0]?.dataIndex ?? null;
    });
  }, []);

  return {
    highlightIndex,
    setHighlightIndex,
    onKeyDown,
    onFocus,
    handleHighlightChange,
  };
}
