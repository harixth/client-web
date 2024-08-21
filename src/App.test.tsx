import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";

// Import the App component
import App from "./App";

describe("App", () => {
  it("renders the component with initial values", () => {
    const { container } = render(<App />);
    expect(container.querySelector(".container")).toBeInTheDocument();

    expect(screen.getByText(/Longitude:/)).toBeInTheDocument();
    expect(screen.getByText(/Latitude:/)).toBeInTheDocument();
    expect(screen.getByText(/Zoom:/)).toBeInTheDocument();

    expect(container.querySelector(".map-container")).toBeInTheDocument();

    const driverText = screen.getByText(/Driver/);
    expect(driverText).toBeInTheDocument();
    expect(driverText).toHaveTextContent("1 Driver");

    const rangeInput = screen.getByRole("slider");
    expect(rangeInput).toBeInTheDocument();
    expect(rangeInput).toHaveValue("1");
  });

  it("updates driver count when range input is changed", () => {
    render(<App />);

    const rangeInput = screen.getByRole("slider");

    // Simulate changing the range input value
    fireEvent.change(rangeInput, { target: { value: "10" } });

    // Test if the driver count text is updated
    expect(screen.getByText("10 Drivers")).toBeInTheDocument();
  });
});
