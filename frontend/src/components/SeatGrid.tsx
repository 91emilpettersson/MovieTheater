import { useState, useEffect } from "react";
import { api } from "../api/Api";
import styled from "styled-components";
import SeatButton from "./SeatButton";
import BookButton from "./BookButton";
import { Seat } from "../types/Seat";
import { updateSelectedSeat } from "../utils/updateSelectedSeat";
import { getAvailableSeatText } from "../utils/getAvailableSeatText";
import toast from "react-hot-toast";

const StyledSeatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 10px;
  padding: 10px;
  width: 100%;
  max-width: 600px;
  justify-content: center;
`;

const maxSeatCount = 6;

const SeatGrid = () => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [hoveredSeatNumber, setHoveredSeatNumber] = useState<number | null>(
    null
  );
  const [isHoveredSeatAvailable, setIsHoveredSeatAvailable] =
    useState<boolean>(false);

  const handleClickSeat = (clickedSeatNumber: number) => {
    setSelectedSeats((prevSeats) =>
      updateSelectedSeat(prevSeats, clickedSeatNumber)
    );
  };

  const selectedSeatsLength = selectedSeats.length;
  const isBookingDisabled =
    selectedSeatsLength === 0 || selectedSeatsLength > maxSeatCount;

  const handleButtonClick = async () => {
    if (isBookingDisabled) {
      toast.error(`You cant book more than ${maxSeatCount} seats.`);
      return;
    }

    const updatedSeats = await api.bookSeats(selectedSeats);

    if (updatedSeats !== null) {
      toast.success(
        "You booked the following seats: " +
          selectedSeats.map((seat) => seat + 1).sort()
      );
      setSeats(updatedSeats);
    }

    setSelectedSeats([]);
  };

  useEffect(() => {
    api.getSeats().then((seatsFromApi) => {
      if (seatsFromApi !== null) {
        setSeats(seatsFromApi);
      }
    });
  }, []);

  const availableSeatText = getAvailableSeatText(
    hoveredSeatNumber,
    isHoveredSeatAvailable
  );

  return (
    <div>
      <h3>You can book a maximum of six seats.</h3>
      <h4>{availableSeatText}</h4>
      <p>MOVIE SCREEN</p>
      <StyledSeatGrid data-testid="seat-grid">
        {seats.map((seat) => (
          <div
            key={seat.seatNumber}
            onMouseEnter={() => {
              setHoveredSeatNumber(seat.seatNumber);
              setIsHoveredSeatAvailable(seat.isAvailable);
            }}
            onMouseLeave={() => {
              setHoveredSeatNumber(null);
              setIsHoveredSeatAvailable(false);
            }}
          >
            <SeatButton
              $isAvailable={seat.isAvailable}
              $isSelected={selectedSeats.includes(seat.seatNumber)}
              $isDisabled={!seat.isAvailable}
              onClick={() => handleClickSeat(seat.seatNumber)}
            />
          </div>
        ))}
      </StyledSeatGrid>
      <BookButton onClick={handleButtonClick} isDisabled={isBookingDisabled} />
    </div>
  );
};

export default SeatGrid;
