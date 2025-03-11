export const updateSelectedSeat = (
  prevSeats: number[],
  clickedSeatNumber: number,
) =>
  prevSeats.includes(clickedSeatNumber)
    ? prevSeats.filter((prevSeat) => prevSeat !== clickedSeatNumber)
    : [...prevSeats, clickedSeatNumber];
