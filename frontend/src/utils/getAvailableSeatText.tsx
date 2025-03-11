export const getAvailableSeatText = (
  hoveredSeatNumber: number | null,
  isHoveredSeatAvaiable: boolean
) => {
  return hoveredSeatNumber !== null
    ? `Seat number ${hoveredSeatNumber + 1} is ${isHoveredSeatAvaiable ? "" : "not "}available.`
    : "Choose seats";
};
