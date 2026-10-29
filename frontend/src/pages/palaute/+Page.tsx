import { Button, Link, Stack, Text, Textarea } from "@chakra-ui/react";
import { type SubmitEvent, useState } from "react";
import PageContainer from "@/layout/PageContainer";
import PageIntro from "@/layout/PageIntro";

const FORMSUBMIT_URL = "https://formsubmit.co/834cceb5eea9f272c02b5e0b16c11f18";

export default function PalautePage() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const body = new FormData();
      body.append("message", message);
      body.append("_subject", "Palaute – yhteishaku.app");
      body.append("_captcha", "false");
      const res = await fetch(FORMSUBMIT_URL, {
        method: "POST",
        headers: { Accept: "application/json" },
        body,
      });
      if (!res.ok) throw new Error(`formsubmit error ${res.status}`);
      setStatus("sent");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  const form =
    status === "sent" ? (
      <Text color="fg.muted" role="status">
        Kiitos palautteesta!
      </Text>
    ) : (
      <Stack as="form" gap={4} onSubmit={handleSubmit} width="full">
        <Textarea
          aria-label="Palaute"
          minH="10rem"
          name="message"
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Kirjoita palautteesi tähän..."
          required
          value={message}
        />

        <Button
          alignSelf="flex-end"
          bg="accent"
          color="onAccent"
          loading={status === "sending"}
          size="sm"
          type="submit"
        >
          Lähetä
        </Button>

        {status === "error" && (
          <Text color="fg.muted" role="alert">
            Lähetys epäonnistui, yritä uudelleen.
          </Text>
        )}
      </Stack>
    );

  return (
    <>
      <PageIntro
        description={
          <>
            Huomasitko virheen tai keksitkö kehitysidean? Kerro siitä alla tai laita sähköpostia{" "}
            <Link color="fg.accent" href="mailto:miko@kortelainen.dev" textDecoration="underline">
              miko@kortelainen.dev
            </Link>
            .
          </>
        }
        title="Palaute"
      />
      <PageContainer align="flex-start">{form}</PageContainer>
    </>
  );
}
