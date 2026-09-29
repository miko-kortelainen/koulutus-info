import { SimpleGrid, Tabs } from "@chakra-ui/react";
import QuickLinkCard from "@/pages/index/components/QuickLinkCard";
import { quickLinkSections } from "@/pages/index/components/quickLinks";
import { COLORS } from "@/theme";

interface QuickLinkTabsProps {
  value: string;
  onValueChange: (value: string) => void;
}

export default function QuickLinkTabs({ value, onValueChange }: QuickLinkTabsProps) {
  return (
    <Tabs.Root onValueChange={(details) => onValueChange(details.value)} size="sm" value={value} width="100%">
      <Tabs.List aria-label="Pikalinkit koulutusasteittain">
        {quickLinkSections.map(({ heading, id }) => (
          <Tabs.Trigger
            flex={1}
            fontWeight="semibold"
            justifyContent="center"
            key={id}
            letterSpacing="wide"
            value={id}
          >
            {heading}
          </Tabs.Trigger>
        ))}
        <Tabs.Indicator bg={COLORS.surfaceMuted} />
      </Tabs.List>
      {quickLinkSections.map(({ id, links }) => (
        <Tabs.Content key={id} pt={6} px={0} value={id}>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} width="100%">
            {links.map((link) => (
              <QuickLinkCard key={link.href} {...link} />
            ))}
          </SimpleGrid>
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
