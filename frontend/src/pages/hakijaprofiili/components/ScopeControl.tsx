import { Tabs } from "@chakra-ui/react";
import type { HakijaprofiiliKohdeTyyppi } from "@/api/dataValidation";

const SCOPES: { value: HakijaprofiiliKohdeTyyppi; label: string }[] = [
  { value: "koulu", label: "Korkeakoulu" },
  { value: "koulutusala", label: "Koulutusala" },
  { value: "tutkinto", label: "Tutkinto" },
];

interface ScopeControlProps {
  value: HakijaprofiiliKohdeTyyppi;
  onChange: (value: HakijaprofiiliKohdeTyyppi) => void;
}

export default function ScopeControl({ value, onChange }: ScopeControlProps) {
  return (
    <Tabs.Root onValueChange={({ value: next }) => onChange(next as HakijaprofiiliKohdeTyyppi)} size="sm" value={value}>
      <Tabs.List aria-label="Kohteen tyyppi" borderRadius="md" borderWidth="1px" width="full">
        {SCOPES.map(({ value: scope, label }) => (
          <Tabs.Trigger
            _selected={{ color: "fg.accent" }}
            flex="1"
            fontSize="xs"
            fontWeight="semibold"
            justifyContent="center"
            key={scope}
            letterSpacing="wide"
            minH={9}
            value={scope}
          >
            {label}
          </Tabs.Trigger>
        ))}
        <Tabs.Indicator bg="bg.muted" />
      </Tabs.List>
    </Tabs.Root>
  );
}
