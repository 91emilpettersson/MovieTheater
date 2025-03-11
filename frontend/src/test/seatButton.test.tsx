import { describe, it, expect, vi } from "vitest"; // Import Vitest utilities
import { render, screen, fireEvent } from "@testing-library/react"; // Use React Testing Library
import SeatButton from "../components/SeatButton";

//Tests that there is a SeatButton component and that it behaves like a button.
//Tests that it's text shifts on it's availability

describe("SeatButton", () => {
  it("renders the button", () => {
    render(
      <SeatButton
        onClick={() => {}}
        $isAvailable={false}
        $isSelected={false}
        $isDisabled={false}
      />
    );
    const button = screen.getByTestId("seat-button");
    expect(button).toBeTruthy();
  });

  it("calls onClick when not disabled and clicked", () => {
    const handleClick = vi.fn();
    render(
      <SeatButton
        onClick={handleClick}
        $isAvailable={true}
        $isSelected={false}
        $isDisabled={false}
      />
    );
    const button = screen.getByTestId("seat-button");
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled and clicked", () => {
    const handleClick = vi.fn();
    render(
      <SeatButton
        onClick={handleClick}
        $isAvailable={false}
        $isSelected={false}
        $isDisabled={true}
      />
    );
    const button = screen.getByTestId("seat-button");
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("renders the button with an 'X' when it is not available", () => {
    render(
      <SeatButton
        onClick={() => {}}
        $isAvailable={false}
        $isSelected={false}
        $isDisabled={false}
      />
    );
    const button = screen.getByTestId("seat-button");
    expect(button.textContent).toEqual("X");
  });

  it("renders the button without an 'X' when it is available", () => {
    render(
      <SeatButton
        onClick={() => {}}
        $isAvailable={true}
        $isSelected={false}
        $isDisabled={false}
      />
    );
    const button = screen.getByTestId("seat-button");
    expect(button.textContent).toEqual("");
  });
});
