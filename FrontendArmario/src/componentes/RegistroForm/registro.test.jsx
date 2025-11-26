import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { RegistroForm } from "./RegistroForm";

function renderWithRouter(ui) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

describe("RegistroForm Component", () => {
  it("renderiza los campos del formulario", () => {
    renderWithRouter(<RegistroForm />);


    expect(screen.getByLabelText(/^nombre$/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/^correo electrónico$/i)).toBeInTheDocument();

    expect(
      screen.getByLabelText(/confirmar correo electrónico/i)
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/^contraseña$/i)).toBeInTheDocument();

    expect(
      screen.getByLabelText(/confirmar contraseña/i)
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/^región$/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/^comuna$/i)).toBeInTheDocument();
  });
});