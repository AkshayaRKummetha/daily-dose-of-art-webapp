import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FavoritesList from "./FavoritesList";

const favorites = [
  {
    objectID: 1,
    title: "Starry Night",
    artistDisplayName: "Vincent van Gogh"
  }
];

test("renders favorites and handles select and remove", () => {
  const onSelect = jest.fn();
  const onRemove = jest.fn();
  render(<FavoritesList favorites={favorites} onSelect={onSelect} onRemove={onRemove} />);
  expect(screen.getByText(/Starry Night/i)).toBeInTheDocument();
  fireEvent.click(screen.getByText(/Starry Night/i));
  expect(onSelect).toHaveBeenCalledWith(favorites[0]);
  fireEvent.click(screen.getByRole("button", { name: /remove/i }));
  expect(onRemove).toHaveBeenCalledWith(1);
});

test("shows message when no favorites", () => {
  render(<FavoritesList favorites={[]} onSelect={() => {}} onRemove={() => {}} />);
  expect(screen.getByText(/no favorites yet/i)).toBeInTheDocument();
});
