import { COLORS } from "@/theme";
import { Box, CloseButton, Drawer, HStack, IconButton, Link, Portal, Separator, Stack, Text } from "@chakra-ui/react";
import {
  HiOutlineAcademicCap,
  HiOutlineChartBar,
  HiOutlineChatAlt2,
  HiOutlineQuestionMarkCircle,
  HiOutlineTrendingUp,
  HiMenu,
  HiOutlineEmojiSad,
  HiOutlineLibrary,
  HiOutlineHeart,
} from "react-icons/hi";

const links = [
  {
    href: "/hakijamaarat/",
    label: "hakijamäärät",
    description: "Katso hakijamäärät koulutuksittain",
    icon: HiOutlineChartBar,
  },
  {
    href: "/koulutukset/",
    label: "koulutukset",
    description: "Selaa yhteishaussa olevia koulutuksia",
    icon: HiOutlineAcademicCap,
  },
  {
    href: "/koulut/",
    label: "koulut",
    description: "Selaa korkeakouluja ja niiden tilastoja",
    icon: HiOutlineLibrary,
  },
  {
    href: "/tallennetut/",
    label: "tallennetut",
    description: "Katso tallentamasi koulutukset",
    icon: HiOutlineHeart,
  },
  {
    href: "/trendit/",
    label: "trendit",
    description: "Vertaa alojen ja koulujen hakijamääriä",
    icon: HiOutlineTrendingUp,
  },
  {
    href: "/hukassa/",
    label: "hukassa?",
    description: "Apua koulutusvalinnan tekemiseen",
    icon: HiOutlineEmojiSad,
  },
  { href: "/ukk/", label: "ukk", description: "Usein kysytyt kysymykset", icon: HiOutlineQuestionMarkCircle },
  { href: "/palaute/", label: "palaute", description: "Anna palautetta tai kehitysehdotus", icon: HiOutlineChatAlt2 },
];

export default function Header() {
  return (
    <Box as="header">
      <HStack gap={2} px={2}>
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
                      {links.map(({ href, label, description, icon: Icon }) => (
                        <Box as="li" key={href}>
                          {/* ActionTrigger closes the drawer on click; vike client routing keeps the layout mounted */}
                          <Drawer.ActionTrigger asChild>
                            <Link href={href} display="block">
                              <HStack gap={2}>
                                <Icon size="1rem" color={COLORS.accent} />
                                <Text as="span">{label}</Text>
                              </HStack>
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
        <Link href="/" fontWeight="bold" letterSpacing="widest" _hover={{ textDecoration: "none" }}>
          yhteishaku.app
        </Link>
      </HStack>
      <Separator />
    </Box>
  );
}
