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
    vi.spyOn(api, "bookSeats").mockImplementation(
      (
        seats: number[] //korrekt?
      ) =>
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

    // Wait for seats to load
    const seatButtons = await screen.findAllByTestId("seat-button");
    expect(seatButtons).toHaveLength(2);

    //check not selected
    const firstSeatButton = seatButtons[0];
    const secondSeatButton = seatButtons[1];

    const firstSeatBackgroundColor =
      window.getComputedStyle(firstSeatButton).backgroundColor;
    const seacondBackgroundSeatColor =
      window.getComputedStyle(secondSeatButton).backgroundColor;

    const green = "rgb(0, 100, 0)";
    const blue = "rgb(0, 0, 139)";
    const red = "rgb(255, 0, 0)";

    //Kolla grön

    expect(firstSeatBackgroundColor).toBe(green);
    expect(seacondBackgroundSeatColor).toBe(green);

    fireEvent.click(firstSeatButton);
    fireEvent.click(secondSeatButton);

    const firstSelectedSeatBackgroundColor =
      window.getComputedStyle(firstSeatButton).backgroundColor;
    const secondSelectedBackgroundSeatColor =
      window.getComputedStyle(secondSeatButton).backgroundColor;

    // Check if seats are selected
    expect(firstSelectedSeatBackgroundColor).toBe(blue); //Updated?
    expect(secondSelectedBackgroundSeatColor).toBe(blue);

    expect(firstSeatButton.getAttribute("disabled")).toBeNull();
    expect(secondSeatButton.getAttribute("disabled")).toBeNull();

    // Click the book button
    const bookButton = screen.getByTestId("book-button");

    //Mocka book seats
    fireEvent.click(bookButton);

    // Wait for seats to be updated
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
