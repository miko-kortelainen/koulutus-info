import { Button, Field, IconButton, Input, Stack, Text } from "@chakra-ui/react";
import { useRef } from "react";
import { HiOutlineTrash } from "react-icons/hi";
import {
  type KieliLevel,
  type KieliType,
  type MathLevel,
  REAALIAINEET,
  YO_GRADES,
  type YoGrade,
  type YoInput,
} from "../lib/yoScoring";
import FormSelect from "./FormSelect";

export interface YoKieliRow {
  id: number;
  name: string;
  type: KieliType | "";
  level: KieliLevel | "";
  grade: YoGrade | "";
}

export interface YoReaaliaineRow {
  id: number;
  subject: string;
  grade: YoGrade | "";
}

export interface YoFormState {
  aidinkieli: YoGrade | "";
  matematiikkaLevel: MathLevel;
  matematiikkaGrade: YoGrade | "";
  kielet: YoKieliRow[];
  reaaliaineet: YoReaaliaineRow[];
}

export interface YoFormErrors {
  aidinkieli?: string;
  kielet?: string;
  reaaliaineet?: string;
}

export const emptyYoFormState = (): YoFormState => ({
  aidinkieli: "",
  matematiikkaLevel: "pitkä",
  matematiikkaGrade: "",
  kielet: [],
  reaaliaineet: [],
});

export const parseYoForm = (state: YoFormState): { input: YoInput; errors?: undefined } | { errors: YoFormErrors } => {
  const errors: YoFormErrors = {};
  if (!state.aidinkieli) errors.aidinkieli = "Valitse äidinkielen arvosana.";
  if (state.kielet.some((kieli) => !kieli.name.trim() || !kieli.type || !kieli.level || !kieli.grade))
    errors.kielet = "Täytä kaikki lisätyt kielet tai poista keskeneräinen rivi.";
  else if (
    new Set(state.kielet.map((kieli) => kieli.name.trim().toLocaleLowerCase("fi-FI"))).size !== state.kielet.length
  )
    errors.kielet = "Saman kielen voi lisätä vain kerran.";
  if (state.reaaliaineet.some((reaaliaine) => !reaaliaine.subject || !reaaliaine.grade)) {
    errors.reaaliaineet = "Täytä kaikki lisätyt reaaliaineet tai poista keskeneräinen rivi.";
  } else if (new Set(state.reaaliaineet.map((reaaliaine) => reaaliaine.subject)).size !== state.reaaliaineet.length) {
    errors.reaaliaineet = "Saman reaaliaineen voi lisätä vain kerran.";
  }

  if (Object.keys(errors).length > 0) return { errors };

  return {
    input: {
      aidinkieli: state.aidinkieli as YoGrade,
      matematiikka: state.matematiikkaGrade
        ? { level: state.matematiikkaLevel, grade: state.matematiikkaGrade }
        : undefined,
      kielet: state.kielet.map((kieli) => ({
        type: kieli.type as KieliType,
        level: kieli.level as KieliLevel,
        grade: kieli.grade as YoGrade,
      })),
      reaaliaineet: state.reaaliaineet.map((reaaliaine) => ({
        subject: reaaliaine.subject,
        grade: reaaliaine.grade as YoGrade,
      })),
    },
  };
};

interface YoFormProps {
  errors: YoFormErrors;
  onChange: (state: YoFormState) => void;
  value: YoFormState;
}

const GRADE_OPTIONS = YO_GRADES.map((grade) => ({ label: grade, value: grade }));
const KIELI_TYPE_OPTIONS: { label: string; value: KieliType }[] = [
  { label: "Vieras kieli", value: "vieras" },
  { label: "Toinen kotimainen kieli", value: "kotimainen" },
];
const KIELI_LEVEL_OPTIONS: { label: string; value: KieliLevel }[] = [
  { label: "Pitkä", value: "pitkä" },
  { label: "Keskipitkä", value: "keskipitkä" },
  { label: "Lyhyt", value: "lyhyt" },
];
const MATH_LEVEL_OPTIONS: { label: string; value: MathLevel }[] = [
  { label: "Pitkä", value: "pitkä" },
  { label: "Lyhyt", value: "lyhyt" },
];
const MATH_GRADE_OPTIONS: { label: string; value: YoGrade | "ei-kirjoitettu" }[] = [
  { label: "Ei kirjoitettu", value: "ei-kirjoitettu" },
  ...GRADE_OPTIONS,
];
const REAALIAINE_OPTIONS = REAALIAINEET.map((subject) => ({ label: subject, value: subject }));

interface KieliRowProps {
  index: number;
  kieli: YoKieliRow;
  onRemove: () => void;
  onUpdate: (patch: Partial<YoKieliRow>) => void;
}

function KieliRow({ index, kieli, onRemove, onUpdate }: KieliRowProps) {
  const rowNumber = index + 1;

  return (
    <Stack align={{ md: "flex-end" }} direction={{ base: "column", md: "row" }} gap={2}>
      <Input
        aria-label={`Kieli ${rowNumber}`}
        onChange={(event) => onUpdate({ name: event.target.value })}
        placeholder="Esimerkiksi englanti"
        value={kieli.name}
      />
      <FormSelect
        ariaLabel={`Kielen ${rowNumber} tyyppi`}
        items={KIELI_TYPE_OPTIONS}
        onChange={(type) => onUpdate({ type })}
        placeholder="Kielen tyyppi"
        value={kieli.type}
      />
      <FormSelect
        ariaLabel={`Kielen ${rowNumber} oppimäärä`}
        items={KIELI_LEVEL_OPTIONS}
        onChange={(level) => onUpdate({ level })}
        placeholder="Oppimäärä"
        value={kieli.level}
      />
      <FormSelect
        ariaLabel={`Kielen ${rowNumber} arvosana`}
        items={GRADE_OPTIONS}
        onChange={(grade) => onUpdate({ grade })}
        placeholder="Arvosana"
        value={kieli.grade}
      />
      <IconButton
        alignSelf={{ base: "flex-end", md: "auto" }}
        aria-label={`Poista kieli ${rowNumber}`}
        onClick={onRemove}
        type="button"
        variant="ghost"
      >
        <HiOutlineTrash />
      </IconButton>
    </Stack>
  );
}

interface ReaaliaineRowProps {
  index: number;
  onRemove: () => void;
  onUpdate: (patch: Partial<YoReaaliaineRow>) => void;
  reaaliaine: YoReaaliaineRow;
}

function ReaaliaineRow({ index, onRemove, onUpdate, reaaliaine }: ReaaliaineRowProps) {
  const rowNumber = index + 1;

  return (
    <Stack align={{ md: "flex-end" }} direction={{ base: "column", md: "row" }} gap={2}>
      <FormSelect
        ariaLabel={`Reaaliaine ${rowNumber}`}
        items={REAALIAINE_OPTIONS}
        onChange={(subject) => onUpdate({ subject })}
        placeholder="Valitse reaaliaine"
        value={reaaliaine.subject}
      />
      <FormSelect
        ariaLabel={`Reaaliaineen ${rowNumber} arvosana`}
        items={GRADE_OPTIONS}
        onChange={(grade) => onUpdate({ grade })}
        placeholder="Arvosana"
        value={reaaliaine.grade}
      />
      <IconButton
        alignSelf={{ base: "flex-end", md: "auto" }}
        aria-label={`Poista reaaliaine ${rowNumber}`}
        onClick={onRemove}
        type="button"
        variant="ghost"
      >
        <HiOutlineTrash />
      </IconButton>
    </Stack>
  );
}

export default function YoForm({ errors, onChange, value }: YoFormProps) {
  const nextId = useRef(0);

  const addKieli = () =>
    onChange({
      ...value,
      kielet: [...value.kielet, { id: nextId.current++, name: "", type: "", level: "", grade: "" }],
    });
  const removeKieli = (id: number) => onChange({ ...value, kielet: value.kielet.filter((kieli) => kieli.id !== id) });
  const updateKieli = (id: number, patch: Partial<YoKieliRow>) =>
    onChange({
      ...value,
      kielet: value.kielet.map((kieli) => (kieli.id === id ? { ...kieli, ...patch } : kieli)),
    });

  const addReaaliaine = () =>
    onChange({
      ...value,
      reaaliaineet: [...value.reaaliaineet, { id: nextId.current++, subject: "", grade: "" }],
    });
  const removeReaaliaine = (id: number) =>
    onChange({ ...value, reaaliaineet: value.reaaliaineet.filter((reaaliaine) => reaaliaine.id !== id) });
  const updateReaaliaine = (id: number, patch: Partial<YoReaaliaineRow>) =>
    onChange({
      ...value,
      reaaliaineet: value.reaaliaineet.map((reaaliaine) =>
        reaaliaine.id === id ? { ...reaaliaine, ...patch } : reaaliaine,
      ),
    });

  const aidinkieliField = (
    <Field.Root invalid={Boolean(errors.aidinkieli)} required>
      <Field.Label>Äidinkieli</Field.Label>
      <FormSelect
        ariaLabel="Äidinkieli"
        items={GRADE_OPTIONS}
        onChange={(aidinkieli) => onChange({ ...value, aidinkieli })}
        placeholder="Valitse arvosana"
        value={value.aidinkieli}
      />
      <Field.ErrorText>{errors.aidinkieli}</Field.ErrorText>
    </Field.Root>
  );

  const matematiikkaField = (
    <Stack as="fieldset" border="0" gap={2} minW={0} p={0} width="full">
      <Text as="legend" fontSize="sm" fontWeight="medium">
        Matematiikka
      </Text>
      <Stack direction={{ base: "column", md: "row" }} gap={2} width="full">
        <FormSelect
          ariaLabel="Matematiikan oppimäärä"
          items={MATH_LEVEL_OPTIONS}
          onChange={(matematiikkaLevel) => onChange({ ...value, matematiikkaLevel })}
          placeholder="Valitse oppimäärä"
          value={value.matematiikkaLevel}
        />
        <FormSelect
          ariaLabel="Matematiikan arvosana"
          items={MATH_GRADE_OPTIONS}
          onChange={(grade) => onChange({ ...value, matematiikkaGrade: grade === "ei-kirjoitettu" ? "" : grade })}
          placeholder="Valitse arvosana"
          value={value.matematiikkaGrade || "ei-kirjoitettu"}
        />
      </Stack>
    </Stack>
  );

  const kieletField = (
    <Stack
      aria-describedby={errors.kielet ? "yo-languages-error" : undefined}
      aria-invalid={Boolean(errors.kielet)}
      as="fieldset"
      border="0"
      gap={2}
      minW={0}
      p={0}
      width="full"
    >
      <Text as="legend" fontSize="sm" fontWeight="medium">
        Kielet
      </Text>
      <Stack gap={2} width="full">
        {value.kielet.map((kieli, index) => (
          <KieliRow
            index={index}
            key={kieli.id}
            kieli={kieli}
            onRemove={() => removeKieli(kieli.id)}
            onUpdate={(patch) => updateKieli(kieli.id, patch)}
          />
        ))}
      </Stack>
      {errors.kielet ? (
        <Text color="fg.error" fontSize="sm" id="yo-languages-error">
          {errors.kielet}
        </Text>
      ) : null}
      <Button alignSelf="flex-start" mt={1} onClick={addKieli} size="sm" type="button" variant="ghost">
        + Lisää kieli
      </Button>
    </Stack>
  );

  const reaaliaineetField = (
    <Stack
      aria-describedby={errors.reaaliaineet ? "yo-real-subjects-error" : undefined}
      aria-invalid={Boolean(errors.reaaliaineet)}
      as="fieldset"
      border="0"
      gap={2}
      minW={0}
      p={0}
      width="full"
    >
      <Text as="legend" fontSize="sm" fontWeight="medium">
        Reaaliaineet
      </Text>
      <Stack gap={2} width="full">
        {value.reaaliaineet.map((reaaliaine, index) => (
          <ReaaliaineRow
            index={index}
            key={reaaliaine.id}
            onRemove={() => removeReaaliaine(reaaliaine.id)}
            onUpdate={(patch) => updateReaaliaine(reaaliaine.id, patch)}
            reaaliaine={reaaliaine}
          />
        ))}
      </Stack>
      {errors.reaaliaineet ? (
        <Text color="fg.error" fontSize="sm" id="yo-real-subjects-error">
          {errors.reaaliaineet}
        </Text>
      ) : null}
      <Button alignSelf="flex-start" mt={1} onClick={addReaaliaine} size="sm" type="button" variant="ghost">
        + Lisää reaaliaine
      </Button>
    </Stack>
  );

  return (
    <Stack gap={4}>
      {aidinkieliField}
      {matematiikkaField}
      {kieletField}
      {reaaliaineetField}
    </Stack>
  );
}
