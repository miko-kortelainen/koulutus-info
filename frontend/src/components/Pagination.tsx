import { ButtonGroup, Pagination as ChakraPagination, HStack, IconButton } from "@chakra-ui/react";

interface PaginationProps {
  count: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ count, page, pageSize, onPageChange }: PaginationProps) {
  return (
    <ChakraPagination.Root
      count={count}
      onPageChange={(e) => onPageChange(e.page)}
      page={page}
      pageSize={pageSize}
      translations={{
        rootLabel: "Sivutus",
        prevTriggerLabel: "Edellinen sivu",
        nextTriggerLabel: "Seuraava sivu",
        itemLabel: ({ page, totalPages }) => `Sivu ${page}/${totalPages}`,
      }}
    >
      <HStack justify="center">
        <ButtonGroup variant="ghost">
          <ChakraPagination.Items
            render={(page) => (
              <IconButton
                onClick={() => window.scrollTo({ top: 0, behavior: "auto" })}
                variant={{ base: "ghost", _selected: "outline" }}
              >
                {page.value}
              </IconButton>
            )}
          />
        </ButtonGroup>
      </HStack>
    </ChakraPagination.Root>
  );
}
