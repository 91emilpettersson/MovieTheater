import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "../App";
import { api } from "../api/Api";
import { Seat } from "../types/Seat";

const mockSeats: Seat[] = [
  { seatNumber: 1, isAvailable: true },
  { seatNumber: 2, isAvailable: true },
];

//Tests that colors change. Tests that there is a book button. Tests that there are SeatButtons.
describe("App Integration Tests", () => {
  beforeEach(() => {
    vi.spyOn(api, "getSeats").mockResolvedValue(mockSeats);
    vi.spyOn(api, "bookSeats").mockImplementation((seats: number[]) =>
      Promise.resolve<Seat[]>(
        seats.map((seat) => ({ seatNumber: seat, isAvailable: false }))
      )
    );
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // Deprecated
        removeListener: vi.fn(), // Deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should allow selecting seats and booking them", async () => {
    render(<App />);

    const seatButtons = await screen.findAllByTestId("seat-button");
    expect(seatButtons).toHaveLength(2);

    const firstSeatButton = seatButtons[0];
    const secondSeatButton = seatButtons[1];

    const firstSeatBackgroundColor =
      window.getComputedStyle(firstSeatButton).backgroundColor;
    const seacondBackgroundSeatColor =
      window.getComputedStyle(secondSeatButton).backgroundColor;

    const green = "rgb(0, 100, 0)";
    const blue = "rgb(0, 0, 139)";
    const red = "rgb(255, 0, 0)";

    expect(firstSeatBackgroundColor).toBe(green);
    expect(seacondBackgroundSeatColor).toBe(green);

    fireEvent.click(firstSeatButton);
    fireEvent.click(secondSeatButton);

    const firstSelectedSeatBackgroundColor =
      window.getComputedStyle(firstSeatButton).backgroundColor;
    const secondSelectedBackgroundSeatColor =
      window.getComputedStyle(secondSeatButton).backgroundColor;

    expect(firstSelectedSeatBackgroundColor).toBe(blue);
    expect(secondSelectedBackgroundSeatColor).toBe(blue);

    expect(firstSeatButton.getAttribute("disabled")).toBeNull();
    expect(secondSeatButton.getAttribute("disabled")).toBeNull();

    const bookButton = screen.getByTestId("book-button");

    fireEvent.click(bookButton);

    const updatedSeatButtons = await screen.findAllByTestId("seat-button");

    const firstUpdatedSeatButton = updatedSeatButtons[0];
    const secondUpdatedSeatButton = updatedSeatButtons[1];

    const firstBookedSeatBackgroundColor = window.getComputedStyle(
      firstUpdatedSeatButton
    ).backgroundColor;
    const secondBookedBackgroundSeatColor = window.getComputedStyle(
      secondUpdatedSeatButton
    ).backgroundColor;

    expect(firstBookedSeatBackgroundColor).toBe(red);
    expect(secondBookedBackgroundSeatColor).toBe(red);

    expect(firstUpdatedSeatButton.getAttribute("disabled")).not.toBeNull();
    expect(secondUpdatedSeatButton.getAttribute("disabled")).not.toBeNull();
  });
});
