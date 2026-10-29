import { Portal, Stack, Toast, Toaster as ChakraToaster, createToaster } from "@chakra-ui/react";

export const toaster = createToaster({ placement: "bottom", duration: 4000 });

export default function Toaster() {
  return (
    <Portal>
      <ChakraToaster toaster={toaster}>
        {(toast) => (
          <Toast.Root bg="toastBg" color="toastFg" px="3" py="2" whiteSpace="nowrap" width="fit-content">
            <Toast.Indicator color="toastFg" />
            <Stack direction="row" align="center" gap="2">
              {toast.title ? <Toast.Title fontSize={{ base: "xs", sm: "sm" }}>{toast.title}</Toast.Title> : null}
              {toast.description ? (
                <Toast.Description fontSize={{ base: "xs", sm: "sm" }}>{toast.description}</Toast.Description>
              ) : null}
            </Stack>
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  );
}
