import { Box, Link, Separator, Stack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const landing = () => navigate("/");
  const stats = () => navigate("/hakijamaarat");
  const schools = () => navigate("/koulutukset");

  return (
    <Box p={3} px={6}>
      <Stack direction="row" justifyContent={{ base: "center", md: "left" }}>
        <Link fontSize="xl" onClick={landing}>
          etusivu
        </Link>

        <Separator orientation="vertical" />

        <Link fontSize="xl" onClick={stats}>
          hakijamäärät
        </Link>

        <Separator orientation="vertical" />

        <Link fontSize="xl" onClick={schools}>
          koulutukset
        </Link>
      </Stack>
    </Box>
  );
}
