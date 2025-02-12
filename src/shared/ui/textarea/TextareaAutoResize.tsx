import { useState, useEffect, useRef } from 'react';

const TextareaAutoResize = ({
  style,
  value,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  const [height, setHeight] = useState(0);

  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    setHeight(ref.current?.scrollHeight || 0);
  }, [value]);

  return <textarea ref={ref} value={value} style={{ height, ...style }} {...props} />;
};

export default TextareaAutoResize;
