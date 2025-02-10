import { useState, ChangeEvent } from 'react';

type TUseChangeParams<S> = S | (() => S);

function useChange<
  E extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  T extends string | number | readonly string[] | undefined,
>(initialValue: TUseChangeParams<T>): [T, (event: ChangeEvent<E>) => void] {
  const [value, setValue] = useState<T>(initialValue);

  const handleChange = (event: ChangeEvent<E>) => {
    setValue(event.target.value as unknown as T);
  };

  return [value, handleChange];
}

export default useChange;
