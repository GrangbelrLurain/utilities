import { formatObjectLiteral } from '@/utils/text-format/obj-format';
import clsx from 'clsx';
import { ComponentPropsWithoutRef, useRef } from 'react';

type TObjTextarea = ComponentPropsWithoutRef<'textarea'>;

const ObjTextarea = ({ defaultValue, className, onChange, ...props }: TObjTextarea) => {
  const objTextareaRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = () => {
    requestAnimationFrame(() => {
      if (!objTextareaRef.current) return;
      objTextareaRef.current.style.height = 'auto';
      objTextareaRef.current.style.height = objTextareaRef.current.scrollHeight + 20 + 'px';
    });
  };

  const textFormatObj = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter 키를 눌렀을 때만 포맷팅 시도
    if (e.key === 'Enter' || (e.altKey && e.shiftKey && e.key === 'F')) {
      const value = objTextareaRef.current?.value;
      if (!value?.trim()) return;

      try {
        const formattedValue = formatObjectLiteral(value);

        if (objTextareaRef.current) {
          objTextareaRef.current.value = formattedValue;
        }
      } catch (error) {
        console.log(error);
        return;
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    textFormatObj(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    autoResize();
    onChange?.(e);
  };

  const handlePaste = () => {
    autoResize();
  };

  return (
    <textarea
      className={clsx('textarea', className)}
      defaultValue={defaultValue}
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      onPaste={handlePaste}
      ref={objTextareaRef}
      {...props}
    />
  );
};

export default ObjTextarea;
