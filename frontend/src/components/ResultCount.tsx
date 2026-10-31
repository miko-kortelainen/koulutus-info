import { Skeleton, Text } from "@chakra-ui/react";

interface ResultCountProps {
  count: number;
  loading: boolean;
  error: boolean;
}

export default function ResultCount({ count, loading, error }: ResultCountProps) {
  return (
    <Text aria-live="polite" color="fg.muted" fontSize="xs" ml="auto" visibility={error ? "hidden" : "visible"}>
      <Skeleton as="span" loading={loading}>
        {loading ? "0000 hakutulosta" : `${count} ${count === 1 ? "hakutulos" : "hakutulosta"}`}
      </Skeleton>
    </Text>
  );
}
