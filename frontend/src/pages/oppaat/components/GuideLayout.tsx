import { Box, Heading, HStack, Link, Stack, Text } from "@chakra-ui/react";
import type { MDXComponents, MDXProps } from "mdx/types.js";
import type { ComponentProps, ComponentType, ReactNode } from "react";
import PageContainer from "@/layout/PageContainer";
import { formatGuideDate, getGuide } from "../guides";

interface GuideLayoutProps {
  slug: string;
  Content: ComponentType<MDXProps>;
  source: string;
}

interface GuideHeading {
  id: string;
  label: string;
}

const defaultRelated = [
  {
    href: "/pistelaskuri/",
    label: "Pistelaskuri",
    description: "Arvioi yhteishaun pistemääräsi omilla arvosanoillasi.",
  },
  {
    href: "/koulutukset/",
    label: "Koulutukset",
    description: "Selaa yhteishaussa olevia koulutuksia ja pisterajoja.",
  },
  {
    href: "/hakijamaarat/",
    label: "Hakijamäärät",
    description: "Katso hakijamäärät ja hakupaine koulutuksittain.",
  },
];

export function guideHeadingId(label: string): string {
  return label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getGuideHeadings(source: string): GuideHeading[] {
  const headings: GuideHeading[] = [];
  const ids = new Set<string>();
  let fence: { marker: "`" | "~"; length: number } | undefined;

  for (const [index, line] of source.split(/\r?\n/).entries()) {
    const fenceStart = line.match(/^ {0,3}(`{3,}|~{3,})/);
    if (!fence && fenceStart) {
      fence = { marker: fenceStart[1][0] as "`" | "~", length: fenceStart[1].length };
      continue;
    }
    if (fence) {
      if (new RegExp(`^ {0,3}\\${fence.marker}{${fence.length},}[ \\t]*$`).test(line)) fence = undefined;
      continue;
    }
    if (!/^##(?: |$)/.test(line) || line.startsWith("###")) continue;

    const match = line.match(/^## (.+)$/);
    if (!match || match[1] !== match[1].trim()) {
      throw new Error(`Invalid guide heading on line ${index + 1}: use an exact non-empty "## Heading" line`);
    }

    const label = match[1];
    if (/\s+#+$/.test(label)) {
      throw new Error(`Invalid guide heading on line ${index + 1}: closing hashes are not supported`);
    }
    if (/[\\`*_{}[\]<>#]/.test(label)) {
      throw new Error(`Invalid guide heading on line ${index + 1}: Markdown and JSX are not supported`);
    }

    const id = guideHeadingId(label);
    if (!id) throw new Error(`Invalid guide heading on line ${index + 1}: normalized ID is empty`);
    if (ids.has(id)) throw new Error(`Guide heading ID collision "${id}" on line ${index + 1}`);

    ids.add(id);
    headings.push({ id, label });
  }

  return headings;
}

export function Callout({ title = "Huomio", children }: { title?: string; children: ReactNode }) {
  return (
    <Box bg="bg.muted" borderColor="accent" borderLeftWidth="3px" borderRadius="md" px={4} py={3}>
      <Text color="accent" fontSize="xs" fontWeight="semibold" letterSpacing="wider" textTransform="uppercase">
        {title}
      </Text>
      <Box mt={1}>{children}</Box>
    </Box>
  );
}

function GuideLink({ href, children }: ComponentProps<"a">) {
  const external = href?.startsWith("http://") || href?.startsWith("https://");
  return (
    <Link
      href={href}
      rel={external ? "noopener noreferrer" : undefined}
      target={external ? "_blank" : undefined}
      textDecoration="underline"
    >
      {children}
    </Link>
  );
}

const mdxComponents = {
  h2: ({ children }: ComponentProps<"h2">) => {
    if (typeof children !== "string") throw new Error("Guide h2 headings must contain plain text only");
    return (
      <Heading
        _first={{ mt: 0 }}
        as="h2"
        id={guideHeadingId(children)}
        mt={{ base: 5, md: 7 }}
        scrollMarginTop={6}
        size="lg"
        textWrap="balance"
      >
        {children}
      </Heading>
    );
  },
  h3: ({ children }: ComponentProps<"h3">) => (
    <Heading as="h3" size="md" textWrap="balance">
      {children}
    </Heading>
  ),
  p: ({ children }: ComponentProps<"p">) => <Text>{children}</Text>,
  ul: ({ children }: ComponentProps<"ul">) => (
    <Stack as="ul" gap={2} listStyleType="disc" pl={5}>
      {children}
    </Stack>
  ),
  ol: ({ children }: ComponentProps<"ol">) => (
    <Stack as="ol" gap={2} listStyleType="decimal" pl={5}>
      {children}
    </Stack>
  ),
  a: GuideLink,
  blockquote: ({ children }: ComponentProps<"blockquote">) => <Callout>{children}</Callout>,
  Callout,
} satisfies MDXComponents;

export default function GuideLayout({ slug, Content, source }: GuideLayoutProps) {
  const meta = getGuide(slug);
  const headings = getGuideHeadings(source);

  return (
    <PageContainer align="flex-start">
      <Stack gap={{ base: 6, md: 8 }} width="100%">
        <Stack as="header" gap={3}>
          <Link color="fg.muted" fontSize="sm" href="/oppaat/" textDecoration="underline">
            ← Oppaat
          </Link>
          <Box bg="accent" borderRadius="full" height={1} width={10} />
          <Heading as="h1" size={{ base: "xl", md: "2xl" }} textWrap="balance">
            {meta.title}
          </Heading>
          <Text color="fg.muted" fontSize={{ base: "md", md: "lg" }} maxW="42rem" textWrap="pretty">
            {meta.lede}
          </Text>
          <Text color="fg.muted" fontSize="xs">
            Päivitetty {formatGuideDate(meta.updated)}
          </Text>
        </Stack>

        {headings.length > 1 && (
          <Stack
            aria-label="Sisällys"
            as="nav"
            borderColor="border"
            borderRadius="lg"
            borderWidth="1px"
            gap={2}
            maxW="42rem"
            p={{ base: 4, md: 5 }}
          >
            <Text color="fg.muted" fontSize="xs" fontWeight="semibold" letterSpacing="wider" textTransform="uppercase">
              Sisältö
            </Text>
            <Stack as="ol" gap={2} listStyleType="none">
              {headings.map((heading, index) => (
                <HStack align="baseline" as="li" gap={3} key={heading.id}>
                  <Text as="span" color="accent" fontSize="sm" fontVariantNumeric="tabular-nums" fontWeight="semibold">
                    {String(index + 1).padStart(2, "0")}
                  </Text>
                  <Link href={`#${heading.id}`} textDecoration="underline">
                    {heading.label}
                  </Link>
                </HStack>
              ))}
            </Stack>
          </Stack>
        )}

        <Stack as="article" fontSize="md" gap={3} lineHeight="tall" maxW="42rem" textWrap="pretty">
          <Content components={mdxComponents} />
        </Stack>

        <Stack aria-label="Liittyvät sivut" as="nav" gap={3}>
          <Heading as="h2" size="md">
            Jatka seuraavaksi
          </Heading>
          <Stack direction={{ base: "column", md: "row" }} gap={3}>
            {defaultRelated.map((item) => (
              <Link
                _hover={{ borderColor: "accent", textDecoration: "none" }}
                borderColor="border"
                borderRadius="lg"
                borderWidth="1px"
                display="block"
                flex={1}
                href={item.href}
                key={item.href}
                p={4}
              >
                <Text fontWeight="semibold">
                  {item.label}{" "}
                  <Text as="span" color="accent">
                    →
                  </Text>
                </Text>
                <Text color="fg.muted" fontSize="sm" mt={1}>
                  {item.description}
                </Text>
              </Link>
            ))}
          </Stack>
        </Stack>

        {!!meta.sources?.length && (
          <Stack as="section" borderColor="border" borderTopWidth="1px" gap={2} maxW="42rem" pt={4}>
            <Heading as="h2" size="sm">
              Lähteet
            </Heading>
            <Stack as="ul" color="fg.muted" fontSize="sm" gap={2} listStyleType="disc" pl={5}>
              {meta.sources.map((source) => (
                <li key={source.href}>
                  <GuideLink href={source.href}>{source.label}</GuideLink>
                </li>
              ))}
            </Stack>
          </Stack>
        )}
      </Stack>
    </PageContainer>
  );
}
