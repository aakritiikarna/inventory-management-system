import { useEffect, useRef, useState } from "react";

/**
 * Small requestAnimationFrame-based count-up, used instead of the
 * `react-countup` package, which (alongside the recharts sparklines)
 * is what was actually crashing the KPI cards here. No external
 * dependency, nothing for a library version mismatch to break.
 */
const CountUp = ({ end, duration = 1.2, separator = "," }) => {
  const [value, setValue] = useState(0);
  const frame = useRef(null);

  useEffect(() => {
    const target = Number.isFinite(end) ? end : 0;
    const start = performance.now();
    const ms = duration * 1000;

    const tick = (now) => {
      const progress = Math.min((now - start) / ms, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setValue(target * eased);
      if (progress < 1) {
        frame.current = requestAnimationFrame(tick);
      } else {
        setValue(target);
      }
    };

    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [end, duration]);

  const rounded = Math.round(value);
  return <>{separator ? rounded.toLocaleString() : rounded}</>;
};

export default CountUp;
