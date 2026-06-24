import { Box, Link, Separator, Stack } from "@chakra-ui/react";
import { navigate } from "vike/client/router";

export default function Header() {
  const landing = () => navigate("/");
  const stats = () => navigate("/hakijamaarat");
  const schools = () => navigate("/koulutukset");
  // const trends = () => navigate("/trendit");

  return (
    <Box p={3} px={6}>
      <Stack direction="row" justifyContent={{ base: "center", md: "left" }} fontSize={{ base: "lg", md: "xl" }}>
        <Link onClick={landing}>etusivu</Link>

        <Separator orientation="vertical" />

        <Link onClick={stats}>hakijamäärät</Link>

        <Separator orientation="vertical" />

        <Link onClick={schools}>koulutukset</Link>

        {/* <Separator orientation="vertical" />

        <Link onClick={trends}>trendit</Link> */}
      </Stack>
    </Box>
  );
}
