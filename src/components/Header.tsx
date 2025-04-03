import { useTheme } from "../hooks/useTheme";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav>
      <header>
        <h1>Grade Calculator</h1>
        <p>
          Made by{" "}
          <a
            href="https://www.anahatmudgal.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Anahat Mudgal
          </a>
        </p>
      </header>
      <span>
        <button onClick={toggleTheme}>
          {theme === "light" ? "Light 🌞" : "Dark 🌚"}
        </button>
        <a
          className="nav-link"
          href="https://github.com/AnahatM/Grade-Calculator/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>🔨</span> View Code
        </a>
      </span>
    </nav>
  );
}
