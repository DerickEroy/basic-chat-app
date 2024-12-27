import { useState } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (newValue: T) => void] {
  const [value, setValue] = useState<T>(() => {
    const storedValue = JSON.parse(localStorage.getItem(key)!) ?? initialValue;
    return storedValue;
  });

  function setter(newValue: T) {
    localStorage.setItem(key, JSON.stringify(newValue));
    setValue(newValue);
  }

  return [value, setter];
}
