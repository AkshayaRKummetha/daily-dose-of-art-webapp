import { render, screen, fireEvent } from "@testing-library/react";
import ErrorMessage from "./ErrorMessage";

test("renders error message and retry button", () => {
  const onRetry = jest.fn();
  render(<ErrorMessage message="Test error" onRetry={onRetry} />);
  expect(screen.getByText(/test error/i)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /retry/i }));
  expect(onRetry).toHaveBeenCalled();
});
