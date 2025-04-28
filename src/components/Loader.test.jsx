import { render, screen } from "@testing-library/react";
import Loader from "./Loader";

test("renders loading indicator", () => {
  render(<Loader />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});
