import styled from "styled-components";

const StyledButton = styled.button<{ $isDisabled: boolean }>`
  width: 10em;
  height: 2em;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;

  cursor: ${(props) => (props.$isDisabled ? "not-allowed" : "pointer")};
`;

type BookButtonProps = {
  onClick: () => void;
  isDisabled: boolean;
};

const BookButton = ({ onClick, isDisabled }: BookButtonProps) => {
  return (
    <StyledButton
      $isDisabled={isDisabled}
      disabled={isDisabled}
      onClick={onClick}
      data-testid="book-button"
    >
      Book seats
    </StyledButton>
  );
};

export default BookButton;
