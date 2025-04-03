import { useTheme } from "../hooks/useTheme";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav>
      <header>
        <h1>Grade Calculator</h1>
        <p>by Anahat Mudgal</p>
      </header>
      <button onClick={toggleTheme}>
        {theme === "light" ? "Light 🌞" : "Dark 🌚"}
      </button>
    </nav>
  );
}
