import { useEffect, useState } from "react";
import SearchInput from "@/components/SearchInput";
import useDebounce from "@/hooks/useDebounce";

interface DebouncedSearchInputProps {
  onChange: (value: string) => void;
  onInput: () => void;
  placeholder: string;
}

export default function DebouncedSearchInput({ onChange, onInput, placeholder }: DebouncedSearchInputProps) {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value, 300);

  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  return (
    <SearchInput
      onChange={(nextValue) => {
        setValue(nextValue);
        onInput();
      }}
      placeholder={placeholder}
      value={value}
    />
  );
}
