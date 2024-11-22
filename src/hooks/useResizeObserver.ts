import { useEffect, useState } from "react";

export default function useResizeObserver() {
  const [boundaries, setBoundaries] = useState({
    height: innerHeight,
    width: innerWidth,
  });

  useEffect(() => {
    let timerId: number;
    const observer = new ResizeObserver((entries) => {
      const [entry] = entries;
      if (timerId) {
        clearTimeout(timerId);
      }

      timerId = setTimeout(() => {
        const { height, width } = entry.contentRect;
        setBoundaries({
          height,
          width,
        });
      }, 200);
    });
    observer.observe(document.body);
    return () => {
      observer.disconnect();
    };
  }, []);

  return boundaries;
}
