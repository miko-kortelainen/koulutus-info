import OptionSelect from "@/components/OptionSelect";
import { YEAR_OPTIONS, type YearOption } from "@/config/yearOptions";

interface YearControlProps {
  value: YearOption;
  onChange: (value: YearOption) => void;
}

export default function YearControl({ value, onChange }: YearControlProps) {
  return (
    <OptionSelect
      ariaLabel="Vuosi"
      items={YEAR_OPTIONS}
      onChange={onChange}
      placeholder="Valitse vuosi"
      size="sm"
      value={value}
    />
  );
}
