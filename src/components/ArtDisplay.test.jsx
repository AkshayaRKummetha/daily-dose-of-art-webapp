import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ArtDisplay from "./ArtDisplay";

const mockArt = {
  objectID: 1,
  title: "Starry Night",
  artistDisplayName: "Vincent van Gogh",
  objectDate: "1889",
  medium: "Oil on canvas",
  primaryImage: "https://images.metmuseum.org/CRDImages/ep/original/DT1567.jpg",
  objectURL: "https://www.metmuseum.org/art/collection/search/436535"
};

test("renders artwork details and favorite button", () => {
  render(<ArtDisplay art={mockArt} isFavorite={false} onFavorite={() => {}} />);
  expect(screen.getByText(/Starry Night/i)).toBeInTheDocument();
  expect(screen.getByText(/Vincent van Gogh/i)).toBeInTheDocument();
  expect(screen.getByText(/1889/i)).toBeInTheDocument();
  expect(screen.getByText(/Oil on canvas/i)).toBeInTheDocument();
  expect(screen.getByRole("img")).toHaveAttribute("src", mockArt.primaryImage);
  expect(screen.getByRole("link", { name: /learn more/i })).toHaveAttribute("href", mockArt.objectURL);
  expect(screen.getByRole("button", { name: /add to favorites/i })).toBeInTheDocument();
});

test("calls onFavorite when favorite button is clicked", () => {
  const onFavorite = jest.fn();
  render(<ArtDisplay art={mockArt} isFavorite={false} onFavorite={onFavorite} />);
  fireEvent.click(screen.getByRole("button", { name: /add to favorites/i }));
  expect(onFavorite).toHaveBeenCalledWith(mockArt);
});
