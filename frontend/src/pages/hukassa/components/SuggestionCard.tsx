import { Badge, Card, HStack, Link, Progress, Text, VStack } from "@chakra-ui/react";
import { type SemanticSearchResult } from "../hooks/useSemanticSearch";
import { COLORS } from "@/theme";
import { HiLocationMarker } from "react-icons/hi";

type Props = {
  result: SemanticSearchResult;
};

export default function SuggestionCard({ result }: Props) {
  const sopivuus = (
    <Progress.Root value={result.score * 100} width="100%" alignItems="center">
      <HStack gap="5">
        <Progress.Track flex="1">
          <Progress.Range bg={COLORS.yellowGreen} />
        </Progress.Track>
        <Progress.ValueText color="fg.muted">{`${(result.score * 100).toFixed(2)}% sopiva`}</Progress.ValueText>
      </HStack>
    </Progress.Root>
  );

  return (
    <Card.Root size="sm">
      <Card.Header>
        <Text fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" textWrap="balanced">
          {result.label}
        </Text>
      </Card.Header>
      <Card.Body>
        <VStack alignItems="flex-start" gap={4}>
          <HStack>
            <Badge bg={COLORS.mintLeaf} fontWeight="semibold" mr="auto" size={{ base: "sm", md: "lg" }}>
              <HiLocationMarker /> {result.school}
            </Badge>
          </HStack>
          {sopivuus}
          <Link
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            fontSize="sm"
            textDecoration="underline"
            textDecorationStyle="dotted"
          >
            Katso opintopolussa
          </Link>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}
