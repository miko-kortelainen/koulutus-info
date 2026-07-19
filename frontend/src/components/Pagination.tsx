import { ButtonGroup, Pagination as ChakraPagination, HStack, IconButton } from "@chakra-ui/react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

interface PaginationProps {
  count: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ count, page, pageSize, onPageChange }: PaginationProps) {
  const handlePageChange = (nextPage: number) => {
    window.scrollTo({ top: 0, behavior: "auto" });
    onPageChange(nextPage);
  };

  return (
    <ChakraPagination.Root
      count={count}
      onPageChange={(e) => handlePageChange(e.page)}
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
          <ChakraPagination.PrevTrigger asChild>
            <IconButton variant="ghost">
              <HiChevronLeft />
            </IconButton>
          </ChakraPagination.PrevTrigger>
          <ChakraPagination.Items
            render={(page) => <IconButton variant={{ base: "ghost", _selected: "outline" }}>{page.value}</IconButton>}
          />
          <ChakraPagination.NextTrigger asChild>
            <IconButton variant="ghost">
              <HiChevronRight />
            </IconButton>
          </ChakraPagination.NextTrigger>
        </ButtonGroup>
      </HStack>
    </ChakraPagination.Root>
  );
}
