import { ButtonGroup, HStack, IconButton, Pagination as ChakraPagination } from "@chakra-ui/react";

interface PaginationProps {
  count: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ count, page, pageSize, onPageChange }: PaginationProps) {
  return (
    <ChakraPagination.Root count={count} pageSize={pageSize} page={page} onPageChange={(e) => onPageChange(e.page)}>
      <HStack justify="center">
        <ButtonGroup variant="ghost">
          <ChakraPagination.Items
            render={(page) => (
              <IconButton
                variant={{ base: "ghost", _selected: "outline" }}
                onClick={() => window.scrollTo({ top: 0, behavior: "auto" })}
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
