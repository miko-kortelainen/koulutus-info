import { Button, Field, Input, NativeSelect, Stack } from "@chakra-ui/react";
import { type FormEvent, useState } from "react";
import { isScoreType, SCORE_TYPES, type ScoreType } from "../scoreTypes";

interface ScoreFormProps {
  onSubmit: (selectionMethod: ScoreType, score: number) => void;
}

interface FormErrors {
  score?: string;
  selectionMethod?: string;
}

const parseScore = (value: string): number | null => {
  const normalizedValue = value.trim().replace(",", ".");
  if (normalizedValue === "") return null;

  const score = Number(normalizedValue);
  return Number.isFinite(score) && score >= 0 ? score : null;
};

export default function ScoreForm({ onSubmit }: ScoreFormProps) {
  const [selectionMethod, setSelectionMethod] = useState("");
  const [scoreInput, setScoreInput] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const score = parseScore(scoreInput);
    const nextErrors: FormErrors = {};
    if (!isScoreType(selectionMethod)) nextErrors.selectionMethod = "Valitse pistetyyppi.";
    if (score === null) nextErrors.score = "Anna pistemäärä numerona.";

    setErrors(nextErrors);
    if (!isScoreType(selectionMethod) || score === null) return;

    onSubmit(selectionMethod, score);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap={4}>
        <Field.Root invalid={Boolean(errors.selectionMethod)} required>
          <Field.Label>Pistetyyppi</Field.Label>
          <NativeSelect.Root>
            <NativeSelect.Field
              onChange={(event) => {
                setSelectionMethod(event.target.value);
                setErrors((current) => ({ ...current, selectionMethod: undefined }));
              }}
              value={selectionMethod}
            >
              <option disabled value="">
                Valitse pistetyyppi
              </option>
              {SCORE_TYPES.map(({ label, value }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
          <Field.ErrorText>{errors.selectionMethod}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={Boolean(errors.score)} required>
          <Field.Label>Pistemäärä</Field.Label>
          <Input
            inputMode="decimal"
            onChange={(event) => {
              setScoreInput(event.target.value);
              setErrors((current) => ({ ...current, score: undefined }));
            }}
            placeholder="Esimerkiksi 120,5"
            value={scoreInput}
          />
          <Field.ErrorText>{errors.score}</Field.ErrorText>
        </Field.Root>

        <Button alignSelf={{ base: "stretch", md: "flex-start" }} type="submit">
          Näytä koulutukset
        </Button>
      </Stack>
    </form>
  );
}
