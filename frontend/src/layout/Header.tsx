import { COLORS } from "@/theme";
import { Box, CloseButton, Drawer, IconButton, Link, Portal, Separator, Stack, Text } from "@chakra-ui/react";
import { HiMenu } from "react-icons/hi";

const links = [
  { href: "/hakijamaarat", label: "hakijamäärät", description: "Katso hakijamäärät koulutuksittain" },
  { href: "/koulutukset", label: "koulutukset", description: "Selaa yhteishaussa olevia koulutuksia" },
  { href: "/trendit", label: "trendit", description: "Vertaa alojen ja koulujen hakijamääriä" },
  { href: "/hukassa", label: "hukassa?", description: "Apua koulutusvalinnan tekemiseen" },
  { href: "/palaute", label: "palaute", description: "Anna palautetta tai kehitysehdotus" },
];

export default function Header() {
  return (
    <Box as="header">
      <Drawer.Root placement="start" size={{ base: "full", md: "xs" }}>
        <Drawer.Trigger asChild>
          <IconButton aria-label="avaa navigointi" variant="ghost" size="xl">
            <HiMenu />
          </IconButton>
        </Drawer.Trigger>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title fontWeight="bold" letterSpacing="widest">
                  yhteishaku.app
                </Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
                <Box as="nav" aria-label="navigointi">
                  <Stack as="ul" gap={{ base: 8, md: 10 }} fontSize="xl" listStyleType="none">
                    {links.map(({ href, label, description }) => (
                      <Box as="li" key={href}>
                        {/* ActionTrigger closes the drawer on click; vike client routing keeps the layout mounted */}
                        <Drawer.ActionTrigger asChild>
                          <Link href={href} display="block">
                            {label}
                            <Text
                              fontSize="sm"
                              color="fg.muted"
                              textDecor="underline"
                              textDecorationColor={COLORS.accent}
                              textDecorationStyle="dotted"
                              textDecorationThickness={2}
                            >
                              {description}
                            </Text>
                          </Link>
                        </Drawer.ActionTrigger>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Drawer.Body>
              <Drawer.CloseTrigger asChild>
                <CloseButton size="xl" aria-label="sulje navigointi" />
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
      <Separator />
    </Box>
  );
}
