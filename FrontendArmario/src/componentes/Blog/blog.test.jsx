import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { Eventos } from "./Blog";

describe("Componente Eventos (Blogs.jsx)", () => {
  it("renderiza el título principal", () => {
    render(
      <MemoryRouter>
        <Eventos />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: /nuestros eventos/i })
    ).toBeInTheDocument();
  });

  it("muestra las tarjetas de los eventos", () => {
    render(
      <MemoryRouter>
        <Eventos />
      </MemoryRouter>
    );

    const mysticum = screen.getAllByRole("heading", {
      name: /mysticum teatempore/i,
    });
    expect(mysticum.length).toBeGreaterThan(0);

    const feriaAddams = screen.getAllByRole("heading", {
      name: /feria addams/i,
    });
    expect(feriaAddams.length).toBeGreaterThan(0);

    // AHORA: usar getAllByAltText porque hay más de 1 imagen con ese alt
    const gothicImgs = screen.getAllByAltText(/evento gótico/i);
    expect(gothicImgs.length).toBeGreaterThan(0);

    const metalImgs = screen.getAllByAltText(/concierto metal/i);
    expect(metalImgs.length).toBeGreaterThan(0);
  });

  it("muestra los botones 'Ver más'", () => {
    render(
      <MemoryRouter>
        <Eventos />
      </MemoryRouter>
    );

    const botones = screen.getAllByRole("button", { name: /ver más/i });
    expect(botones.length).toBe(2);
  });

  it("los modales existen en el DOM", () => {
    render(
      <MemoryRouter>
        <Eventos />
      </MemoryRouter>
    );

    expect(document.getElementById("modalEvento1")).toBeInTheDocument();
    expect(document.getElementById("modalEvento2")).toBeInTheDocument();
  });
});
