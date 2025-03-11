import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import BookButton from "../components/BookButton";

describe("BookButton", () => {
  it("renders the button", () => {
    render(<BookButton onClick={() => {}} isDisabled={false} />);
    const button = screen.getByTestId("book-button");
    expect(button).toBeTruthy();
  });

  it("calls onClick when not disabled and clicked", () => {
    const handleClick = vi.fn();
    render(<BookButton onClick={handleClick} isDisabled={false} />);
    const button = screen.getByTestId("book-button");
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled and clicked", () => {
    const handleClick = vi.fn();
    render(<BookButton onClick={handleClick} isDisabled={true} />);
    const button = screen.getByTestId("book-button");
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
