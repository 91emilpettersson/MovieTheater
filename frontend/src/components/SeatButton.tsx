import styled from "styled-components";

const StyledButton = styled.button<{
  $isAvailable: boolean;
  $isSelected: boolean;
}>`
  width: 50px;
  height: 50px;
  font-size: 1em;
  padding: 0.25em 1em;
  border: 2px solidrgb(3, 3, 3);
  border-radius: 3px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: ${(props) => {
    if (!props.$isAvailable) {
      return "red";
    }

    if (props.$isSelected) {
      return "blue";
    }

    return "green";
  }};

  &:hover {
    background-color: ${(props) => {
      if (!props.$isAvailable) {
        return "red";
      }

      if (props.$isSelected) {
        return "darkblue";
      }

      return "darkgreen";
    }};
  }

  cursor: ${(props) => (props.$isAvailable ? "pointer" : "not-allowed")};
`;

type SeatButtonProps = {
  $isAvailable: boolean;
  $isSelected: boolean;
  $isDisabled: boolean;
  onClick: () => void;
};

const SeatButton = ({
  $isAvailable,
  $isSelected,
  $isDisabled,
  onClick,
}: SeatButtonProps) => {
  return (
    <StyledButton
      $isAvailable={$isAvailable}
      $isSelected={$isSelected}
      disabled={$isDisabled}
      onClick={onClick}
      data-testid="seat-button"
    >
      {$isAvailable ? "" : "X"}
    </StyledButton>
  );
};

export default SeatButton;
