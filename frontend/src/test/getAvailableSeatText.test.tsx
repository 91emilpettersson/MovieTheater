import { expect, it } from "vitest";
import { getAvailableSeatText } from "../utils/getAvailableSeatText";

it("should return 'Choose Seats' when no seat is hovered over", () => {
  const hoveredSeatNumber = null;

  expect(getAvailableSeatText(hoveredSeatNumber, true)).toStrictEqual(
    "Choose seats"
  );
  expect(getAvailableSeatText(hoveredSeatNumber, false)).toStrictEqual(
    "Choose seats"
  );
});

it("should indicate avaiability on available seat", () => {
  const hoveredSeatNumber = 42;
  const isSeatAvailable = true;

  expect(
    getAvailableSeatText(hoveredSeatNumber, isSeatAvailable)
  ).toStrictEqual("Seat number 43 is available.");
});

it("should indicate no avaiability on unavailable seat", () => {
  const hoveredSeatNumber = 42;
  const isSeatAvailable = false;

  expect(
    getAvailableSeatText(hoveredSeatNumber, isSeatAvailable)
  ).toStrictEqual("Seat number 43 is not available.");
});
