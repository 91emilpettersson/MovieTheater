import { expect, it } from "vitest";
import { updateSelectedSeat } from "../utils/updateSelectedSeat";

it("should select an unselected chair when clicked", () => {
  const selectedSeats = [0, 1, 2];
  const clickedSeat = 3;
  const newSelectedSeats = [0, 1, 2, 3];
  expect(updateSelectedSeat(selectedSeats, clickedSeat)).toStrictEqual(
    newSelectedSeats,
  );
});

it("should unselect an selected chair when clicked", () => {
  const selectedSeats = [0, 1, 2];
  const clickedSeat = 2;
  const newSelectedSeats = [0, 1];
  expect(updateSelectedSeat(selectedSeats, clickedSeat)).toStrictEqual(
    newSelectedSeats,
  );
});
