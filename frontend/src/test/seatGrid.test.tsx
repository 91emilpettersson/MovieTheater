import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import SeatGrid from "../components/SeatGrid";
import { api } from "../api/Api";

const mockSeats = [
  { seatNumber: 1, isAvailable: true },
  { seatNumber: 2, isAvailable: false },
];

describe("SeatGrid", () => {
  beforeEach(() => {
    vi.spyOn(api, "getSeats").mockResolvedValue(mockSeats);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders seats correctly", async () => {
    render(<SeatGrid />);
    await waitFor(() => expect(api.getSeats).toHaveBeenCalled());
    expect(screen.getAllByTestId("seat-grid").length).toBe(1);
    expect(screen.getAllByTestId("seat-button").length).toBe(mockSeats.length);
  });
});
