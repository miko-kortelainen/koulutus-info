import { Input } from "@chakra-ui/react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchInput({ value, onChange, placeholder = "Search" }: SearchInputProps) {
  return (
    <Input maxW="320px" placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} />
  );
}
