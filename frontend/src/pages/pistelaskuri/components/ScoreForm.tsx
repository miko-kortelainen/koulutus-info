import { Button, Field, Input, Stack } from "@chakra-ui/react";
import { type FormEvent, useState } from "react";
import { calculateAmmScore } from "../lib/ammScoring";
import { calculateYoScore } from "../lib/yoScoring";
import { isScoreType, SCORE_TYPES, type ScoreType } from "../scoreTypes";
import AmmForm, { type AmmFormErrors, emptyAmmFormState, parseAmmForm } from "./AmmForm";
import FormSelect from "./FormSelect";
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
  const [mode, setMode] = useState<ScoreType | "">("");
  const [yoState, setYoState] = useState(emptyYoFormState());
  const [yoErrors, setYoErrors] = useState<YoFormErrors>({});
  const [ammState, setAmmState] = useState(emptyAmmFormState());
  const [ammErrors, setAmmErrors] = useState<AmmFormErrors>({});
  const [amkScoreInput, setAmkScoreInput] = useState("");
  const [amkScoreError, setAmkScoreError] = useState<string>();
  const [modeError, setModeError] = useState<string>();

  const handleModeChange = (value: string) => {
    setMode(isScoreType(value) ? value : "");
    setYoState(emptyYoFormState());
    setYoErrors({});
    setAmmState(emptyAmmFormState());
    setAmmErrors({});
    setAmkScoreInput("");
    setAmkScoreError(undefined);
    setModeError(undefined);
    onModeChange();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
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

    setModeError("Valitse pistetyyppi.");
  };

  const modeField = (
    <Field.Root invalid={Boolean(modeError)} required>
      <Field.Label>Pistetyyppi</Field.Label>
      <FormSelect
        ariaLabel="Pistetyyppi"
        items={SCORE_TYPES}
        onChange={handleModeChange}
        placeholder="Valitse pistetyyppi"
        value={mode}
      />
      <Field.ErrorText>{modeError}</Field.ErrorText>
    </Field.Root>
  );

  const amkScoreField = (
    <Field.Root invalid={Boolean(amkScoreError)} required>
      <Field.Label>Pistemäärä</Field.Label>
      <Input
        inputMode="decimal"
        onChange={(event) => {
          setAmkScoreInput(event.target.value);
          setAmkScoreError(undefined);
        }}
        placeholder="Esimerkiksi 120,5"
        value={amkScoreInput}
      />
      <Field.ErrorText>{amkScoreError}</Field.ErrorText>
    </Field.Root>
  );

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap={4}>
        {modeField}

        {mode === "Todistusvalinta (YO)" ? (
          <YoForm
            errors={yoErrors}
            onChange={(state) => {
              setYoState(state);
              setYoErrors({});
            }}
            value={yoState}
          />
        ) : null}
        {mode === "Todistusvalinta (AMM)" ? (
          <AmmForm
            errors={ammErrors}
            onChange={(state) => {
              setAmmState(state);
              setAmmErrors({});
            }}
            value={ammState}
          />
        ) : null}
        {mode === "AMK-valintakoe" ? amkScoreField : null}

        <Button alignSelf={{ base: "stretch", md: "flex-start" }} type="submit">
          Näytä koulutukset
        </Button>
      </Stack>
    </form>
  );
}
