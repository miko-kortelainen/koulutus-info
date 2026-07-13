import { Box, Button, Field, Input, Stack, Tabs, Text } from "@chakra-ui/react";
import { type SubmitEvent, useState } from "react";
import { HiOutlineCalculator } from "react-icons/hi";
import { COLORS } from "@/theme";
import { calculateAmmScore } from "../lib/ammScoring";
import { calculateYoScore } from "../lib/yoScoring";
import { isScoreType, type ScoreType } from "../scoreTypes";
import AmmForm, { type AmmFormErrors, emptyAmmFormState, parseAmmForm } from "./AmmForm";
import YoForm, { emptyYoFormState, parseYoForm, type YoFormErrors } from "./YoForm";

interface ScoreFormProps {
  onModeChange: () => void;
  onSubmit: (selectionMethod: ScoreType, score: number) => void;
}

const parseAmkScore = (value: string): number | null => {
  const normalizedValue = value.trim().replace(",", ".");
  if (normalizedValue === "") return null;

  const score = Number(normalizedValue);
  return Number.isFinite(score) && score >= 0 ? score : null;
};

export default function ScoreForm({ onModeChange, onSubmit }: ScoreFormProps) {
  const [mode, setMode] = useState<ScoreType>("Todistusvalinta (YO)");
  const [yoState, setYoState] = useState(emptyYoFormState());
  const [yoErrors, setYoErrors] = useState<YoFormErrors>({});
  const [ammState, setAmmState] = useState(emptyAmmFormState());
  const [ammErrors, setAmmErrors] = useState<AmmFormErrors>({});
  const [amkScoreInput, setAmkScoreInput] = useState("");
  const [amkScoreError, setAmkScoreError] = useState<string>();

  const handleModeChange = (value: string) => {
    if (!isScoreType(value)) return;

    setMode(value);
    setYoErrors({});
    setAmmErrors({});
    setAmkScoreError(undefined);
    onModeChange();
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (mode === "Todistusvalinta (YO)") {
      const result = parseYoForm(yoState);
      if (!("input" in result)) {
        setYoErrors(result.errors);
        return;
      }
      setYoErrors({});
      onSubmit(mode, calculateYoScore(result.input));
      return;
    }

    if (mode === "Todistusvalinta (AMM)") {
      const result = parseAmmForm(ammState);
      if (!("input" in result)) {
        setAmmErrors(result.errors);
        return;
      }
      setAmmErrors({});
      onSubmit(mode, calculateAmmScore(result.input));
      return;
    }

    if (mode === "AMK-valintakoe") {
      const score = parseAmkScore(amkScoreInput);
      setAmkScoreError(score === null ? "Anna pistemäärä numerona." : undefined);
      if (score === null) return;
      onSubmit(mode, score);
      return;
    }
  };

  const amkScoreField = (
    <Field.Root invalid={Boolean(amkScoreError)} required={mode === "AMK-valintakoe"}>
      <Field.Label>Pistemäärä</Field.Label>
      <Input
        inputMode="decimal"
        onChange={(event) => {
          setAmkScoreInput(event.target.value);
          setAmkScoreError(undefined);
        }}
        placeholder="Esimerkiksi 120,5"
        size="xs"
        value={amkScoreInput}
      />
      <Field.ErrorText>{amkScoreError}</Field.ErrorText>
    </Field.Root>
  );

  return (
    <form onSubmit={handleSubmit}>
      <Tabs.Root onValueChange={({ value }) => handleModeChange(value)} value={mode}>
        <Stack gap={2}>
          <Text fontWeight="medium">Valintatapa</Text>
          <Tabs.List aria-label="Valintatapa" borderRadius="md" borderWidth="1px" width="full">
            {(
              [
                ["Todistusvalinta (YO)", "YO"],
                ["Todistusvalinta (AMM)", "AMM"],
                ["AMK-valintakoe", "AMK-valintakoe"],
              ] as const
            ).map(([value, label]) => (
              <Tabs.Trigger
                flex="1"
                fontSize="sm"
                justifyContent="center"
                key={value}
                px={{ base: 1, md: 3 }}
                value={value}
              >
                {label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </Stack>

        <Box borderColor="border" borderRadius="lg" borderWidth="1px" mt={4} p={{ base: 3, md: 5 }}>
          <Tabs.Content p={0} value="Todistusvalinta (YO)">
            <YoForm
              errors={yoErrors}
              onChange={(state) => {
                setYoState(state);
                setYoErrors({});
              }}
              value={yoState}
            />
          </Tabs.Content>
          <Tabs.Content p={0} value="Todistusvalinta (AMM)">
            <AmmForm
              errors={ammErrors}
              onChange={(state) => {
                setAmmState(state);
                setAmmErrors({});
              }}
              value={ammState}
            />
          </Tabs.Content>
          <Tabs.Content p={0} value="AMK-valintakoe">
            {amkScoreField}
          </Tabs.Content>

          <Box display="flex" justifyContent="flex-end">
            <Button
              bg={COLORS.accent}
              mt={4}
              size="xs"
              type="submit"
              variant="solid"
              width={{ base: "full", md: "auto" }}
            >
              <HiOutlineCalculator aria-hidden="true" />
              Laske pisteet / näytä koulutukset
            </Button>
          </Box>
        </Box>
      </Tabs.Root>
    </form>
  );
}
