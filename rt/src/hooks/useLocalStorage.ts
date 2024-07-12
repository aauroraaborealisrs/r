import { useCallback } from "react";


const useLocalStorage = (key: string, initialValue: string) => {
  const getStoredValue = () => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialValue;
  };

  
  const value = getStoredValue();
  const setStoredValue = useCallback((newValue: string) => {
    
    if (newValue === "") {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(newValue));
    }
  }, [key]);

  return [value, setStoredValue] as [string, (value: string) => void];
};

export default useLocalStorage;
