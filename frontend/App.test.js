import { render, screen } from "@testing-library/react";
import App from "./App";

test("prikazuje naslov aplikacije", () => {
  render(<App />);
  expect(screen.getByText(/Local Helper/i)).toBeInTheDocument();
});
