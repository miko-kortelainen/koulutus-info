import { Box, CloseButton, Drawer, HStack, IconButton, Link, Portal, Separator, Stack, Text } from "@chakra-ui/react";
import {
  HiMenu,
  HiOutlineAcademicCap,
  HiOutlineChartBar,
  HiOutlineChatAlt2,
  HiOutlineHeart,
  HiOutlineLibrary,
  HiOutlineQuestionMarkCircle,
  HiOutlineTrendingUp,
} from "react-icons/hi";
import { COLORS } from "@/theme";

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
  { href: "/ukk/", label: "ukk", description: "Usein kysytyt kysymykset", icon: HiOutlineQuestionMarkCircle },
  { href: "/palaute/", label: "palaute", description: "Anna palautetta tai kehitysehdotus", icon: HiOutlineChatAlt2 },
];

export default function Header() {
  return (
    <Box as="header">
      <HStack gap={2} px={2}>
        <Drawer.Root placement="start" size={{ base: "full", md: "xs" }}>
          <Drawer.Trigger asChild>
            <IconButton aria-label="avaa navigointi" size="xl" variant="ghost">
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
                  <Box aria-label="navigointi" as="nav">
                    <Stack as="ul" fontSize="xl" gap={{ base: 8, md: 10 }} listStyleType="none">
                      {links.map(({ href, label, description, icon: Icon }) => (
                        <Box as="li" key={href}>
                          {/* ActionTrigger closes the drawer on click; vike client routing keeps the layout mounted */}
                          <Drawer.ActionTrigger asChild>
                            <Link display="block" href={href}>
                              <HStack gap={2}>
                                <Icon color={COLORS.accent} size="1rem" />
                                <Text as="span">{label}</Text>
                              </HStack>
                              <Text
                                color="fg.muted"
                                fontSize="sm"
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
                  <CloseButton aria-label="sulje navigointi" size="xl" />
                </Drawer.CloseTrigger>
              </Drawer.Content>
            </Drawer.Positioner>
          </Portal>
        </Drawer.Root>
        <Link _hover={{ textDecoration: "none" }} fontWeight="bold" href="/" letterSpacing="widest">
          yhteishaku.app
        </Link>
      </HStack>
      <Separator />
    </Box>
  );
}
