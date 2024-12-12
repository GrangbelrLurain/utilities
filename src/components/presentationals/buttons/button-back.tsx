import clsx from 'clsx';
import { ComponentPropsWithoutRef } from 'react';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';

const ButtonBack = ({ className, ...props }: ComponentPropsWithoutRef<'button'>) => {
  return (
    <button className={clsx('btn btn-ghost', className)} {...props}>
      <MdOutlineKeyboardArrowLeft />
    </button>
  );
};

export default ButtonBack;
