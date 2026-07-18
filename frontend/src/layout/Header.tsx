import { Box, CloseButton, Drawer, HStack, IconButton, Image, Link, Portal, Stack, Text } from "@chakra-ui/react";
import {
  HiMenu,
  HiOutlineAcademicCap,
  HiOutlineCalculator,
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
    href: "/pistelaskuri/",
    label: "pistelaskuri",
    description: "Arvioi yhteishaun pistemääräsi",
    icon: HiOutlineCalculator,
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
      <HStack gap={2} justifyContent="space-between" px={2} py={1}>
        <Link
          _hover={{ textDecoration: "none" }}
          alignItems="center"
          display="flex"
          fontWeight="bold"
          gap={2}
          href="/"
          letterSpacing="widest"
          ml={3}
        >
          <Image alt="" boxSize={6} src="/images/logo.png" />
          <Text as="span" fontSize="md">
            yhteishaku
            <Text as="span" color="fg.accent">
              .app
            </Text>
          </Text>
        </Link>

        <Drawer.Root placement="end" size={{ base: "full", md: "xs" }}>
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
                    yhteishaku
                    <Text as="span" color="fg.accent">
                      .app
                    </Text>
                  </Drawer.Title>
                </Drawer.Header>
                <Drawer.Body>
                  <Box aria-label="Päänavigointi" as="nav">
                    <Stack as="ul" fontSize="xl" gap={{ base: 8, md: 10 }} listStyleType="none">
                      {links.map(({ href, label, description, icon: Icon }) => (
                        <Box as="li" key={href}>
                          {/* ActionTrigger closes the drawer on click; vike client routing keeps the layout mounted */}
                          <Drawer.ActionTrigger asChild>
                            <Link display="block" href={href}>
                              <HStack gap={2}>
                                <Icon color={COLORS.accentFg} size="1rem" />
                                <Text as="span">{label}</Text>
                              </HStack>
                              <Text
                                color="fg.muted"
                                fontSize="sm"
                                textDecor="underline"
                                textDecorationColor={COLORS.accentFg}
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
      </HStack>
    </Box>
  );
}
