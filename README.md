# Hummanizer

> Make AI-written text sound naturally human — warm, clear, and engaging.

Hummanizer is a web application that transforms AI-generated or overly formal text into natural, conversational language. It leverages Google's **Gemini API** to rewrite content while preserving the original meaning, adding personality, warmth, and an approachable tone.

---

## Features

- **One-click humanization** — Paste your text, click "Humanize", and get a naturally rewritten version instantly.
- **Multi-API-key rotation** — Supports multiple Gemini API keys with automatic failover. When one key hits its quota limit, the app seamlessly switches to the next.
- **Copy to clipboard** — Quickly copy the humanized output with a single click.
- **Split-screen UI** — Clean side-by-side layout with input on the left and output on the right.
- **Responsive design** — Panels stack vertically on smaller screens (< 768px).
- **Dark / Light mode** — Automatically adapts to system color-scheme preference.

---

## Tech Stack

| Layer     | Technology                                                  |
| --------- | ----------------------------------------------------------- |
| Framework | [React 19](https://react.dev/) with JSX                    |
| Build     | [Vite 6](https://vite.dev/)                                |
| AI Model  | [Google Gemini](https://ai.google.dev/) (`gemini-3-flash-preview`) via `@google/genai` |
| HTTP      | [Axios](https://axios-http.com/) (available, primary calls use GenAI SDK) |
| Linting   | ESLint 9 with React Hooks & React Refresh plugins           |

---

## Project Structure

```
Hummanizer/
├── frontend/
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   └── HumanizerForm.jsx   # Reusable form component
│   │   ├── App.jsx                 # Main app logic & Gemini API integration
│   │   ├── App.css                 # App-level styles (split-screen layout)
│   │   ├── index.css               # Global / base styles
│   │   └── main.jsx                # React entry point
│   ├── .env                        # API keys (not committed)
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** (comes with Node.js)
- One or more **Google Gemini API keys** — [get one here](https://aistudio.google.com/app/apikey)

### Installation

```bash
# Clone the repository
git clone https://github.com/akshit-sharma-15/Hummanizer.git
cd Hummanizer/frontend

# Install dependencies
npm install
```

### Configuration

Create a `.env` file in the `frontend/` directory with your Gemini API key(s):

```env
VITE_GEMINI_API_KEY_1=your_first_api_key_here
VITE_GEMINI_API_KEY_2=your_second_api_key_here   # optional
VITE_GEMINI_API_KEY_3=your_third_api_key_here     # optional
```

You can add as many keys as you like (`VITE_GEMINI_API_KEY_4`, `_5`, …). The app picks them up automatically and rotates through them when quota limits are reached.

### Run Development Server

```bash
npm run dev
```

The app will be available at **http://localhost:5173** (default Vite port).

### Build for Production

```bash
npm run build
npm run preview   # preview the production build locally
```

---

## How It Works

1. The user pastes text into the input panel and clicks **Humanize**.
2. The app sends the text along with a carefully crafted prompt to Google's Gemini model.
3. The prompt instructs Gemini to:
   - Rewrite the text in a conversational, warm tone.
   - Inject natural filler phrases (*"I think"*, *"honestly"*, *"you know"*, etc.).
   - Avoid overly formal or robotic language.
   - Preserve the original meaning and context.
4. The humanized text appears in the output panel, ready to copy.

If the active API key's quota is exhausted (HTTP 429 / `RESOURCE_EXHAUSTED`), the app automatically retries with the next configured key.

---

## Scripts

| Command           | Description                        |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Start Vite dev server with HMR     |
| `npm run build`   | Production build to `dist/`        |
| `npm run preview` | Serve the production build locally |
| `npm run lint`    | Run ESLint across the project      |

---

## License

This project is open source. Feel free to use, modify, and distribute.
