import { Input } from "@chakra-ui/react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export default function SearchInput({ value, onChange, placeholder }: SearchInputProps) {
  return (
    <Input
      aria-label={placeholder}
      flex={1}
      minHeight="9"
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      size="sm"
      value={value}
    />
  );
}
