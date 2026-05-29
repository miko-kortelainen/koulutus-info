import { Box, Link, Separator, Stack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const landing = () => navigate("/");
  const degrees = () => navigate("/koulutukset");

  return (
    <Box p={2} px={6} textAlign="left">
      <Stack direction="row">
        <Link fontSize="xl" onClick={landing}>
          etusivu
        </Link>

        <Separator orientation="vertical" />

        <Link fontSize="xl" onClick={degrees}>
          koulutukset
        </Link>
      </Stack>
    </Box>
  );
}
