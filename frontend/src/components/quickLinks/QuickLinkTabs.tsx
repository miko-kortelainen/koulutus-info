import { SimpleGrid, Tabs } from "@chakra-ui/react";
import QuickLinkCard from "@/components/quickLinks/QuickLinkCard";
import { quickLinkSections } from "@/components/quickLinks/quickLinks";
import { COLORS } from "@/theme";

interface QuickLinkTabsProps {
  sections?: typeof quickLinkSections;
  value: string;
  onValueChange: (value: string) => void;
}

export default function QuickLinkTabs({ value, onValueChange, sections = quickLinkSections }: QuickLinkTabsProps) {
  return (
    <Tabs.Root onValueChange={(details) => onValueChange(details.value)} size="sm" value={value} width="100%">
      <Tabs.List aria-label="Pikalinkit koulutusasteittain">
        {sections.map(({ heading, id }) => (
          <Tabs.Trigger flex={1} fontWeight="semibold" justifyContent="center" key={id} letterSpacing="wide" value={id}>
            {heading}
          </Tabs.Trigger>
        ))}
        <Tabs.Indicator bg={COLORS.surfaceMuted} />
      </Tabs.List>
      {sections.map(({ id, links }) => (
        <Tabs.Content key={id} pt={6} px={0} value={id}>
          <SimpleGrid as="ul" columns={{ base: 1, md: 2 }} gap={6} listStyleType="none" width="100%">
            {links.map((link) => (
              <li key={link.href}>
                <QuickLinkCard {...link} />
              </li>
            ))}
          </SimpleGrid>
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
