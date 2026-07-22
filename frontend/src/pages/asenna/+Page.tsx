import { Heading, Image, Stack, Text } from "@chakra-ui/react";
import PageContainer from "@/layout/PageContainer";

const steps = [
  {
    title: "Avaa Safarin valikko",
    description: "Avaa yhteishaku.app Safarissa ja napauta oikean alakulman kolmea pistettä.",
    image: "/images/asenna-opas/step1.jpg",
    alt: "Safarin alavalikko, jossa kolmen pisteen painike on korostettu",
  },
  {
    title: "Valitse Jaa",
    description: "Napauta avautuvasta valikosta Jaa.",
    image: "/images/asenna-opas/step2.jpg",
    alt: "Safarin valikko, jossa Jaa-toiminto on korostettu",
  },
  {
    title: "Lisää Koti-valikkoon",
    description: "Skrollaa alas ja valitse Lisää Koti-valikkoon.",
    image: "/images/asenna-opas/step3.jpg",
    alt: "Safarin jakovalikko, jossa Lisää Koti-valikkoon on korostettu",
  },
  {
    title: "Viimeistele lisäys",
    description: "Pidä Avaa verkkoappina käytössä ja napauta Lisää. Tämän jälkeen sivusto löytyy kotinäytöltäsi.",
    image: "/images/asenna-opas/step4.jpg",
    alt: "Lisää Koti-valikkoon -näkymä, jossa Avaa verkkoappina ja Lisää ovat korostettuina",
  },
] as const;

export default function InstallGuidePage() {
  return (
    <PageContainer align="flex-start">
      <Stack gap={2}>
        <Heading as="h1" size="lg">
          Lisää yhteishaku.app iPhonesi kotinäytölle.
        </Heading>
        <Text color="fg.muted" fontSize="sm" textWrap="pretty">
          Kotinäytöltä sivu löytyy nopeasti ja avautuu oman sovelluksen tapaan.
        </Text>
      </Stack>

      <Stack as="ol" gap={12} listStyleType="none" m={0} maxW="2xl" p={0}>
        {steps.map((step, index) => (
          <Stack as="li" gap={4} key={step.image}>
            <Stack gap={1}>
              <Heading as="h2" size="md">
                {index + 1}. {step.title}
              </Heading>
              <Text color="fg.muted" fontSize="sm" textWrap="pretty">
                {step.description}
              </Text>
            </Stack>
            <Image
              alt={step.alt}
              borderColor="border"
              borderRadius="xl"
              borderWidth="1px"
              loading="lazy"
              maxW="24rem"
              src={step.image}
              width="100%"
            />
          </Stack>
        ))}
      </Stack>
    </PageContainer>
  );
}
