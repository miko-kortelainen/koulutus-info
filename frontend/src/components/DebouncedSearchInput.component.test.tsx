import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import DebouncedSearchInput from "@/components/DebouncedSearchInput";
import { renderWithChakra } from "@/test/render";

test("updates the input immediately and publishes only the latest debounced value", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  const onInput = vi.fn();
  renderWithChakra(<DebouncedSearchInput onChange={onChange} onInput={onInput} placeholder="Etsi koulutuksia" />);
  onChange.mockClear();

  const input = screen.getByRole("textbox", { name: "Etsi koulutuksia" });
  await user.type(input, "Law");
  expect(input).toHaveValue("Law");
  expect(onInput).toHaveBeenCalledTimes(3);
  expect(onChange).not.toHaveBeenCalled();

  await waitFor(() => expect(onChange).toHaveBeenCalledExactlyOnceWith("Law"));

  await user.clear(input);
  expect(input).toHaveValue("");
  expect(onChange).toHaveBeenCalledTimes(1);
  await waitFor(() => expect(onChange).toHaveBeenLastCalledWith(""));
});
