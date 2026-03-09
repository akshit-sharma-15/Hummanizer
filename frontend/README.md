# Hummanizer (Gemini-powered)

## Setup

1. Create `frontend/.env` with:

```
VITE_GEMINI_API_KEY=your_api_key_here
```

2. Install and run:

```
npm install
npm run dev
```

Open `http://localhost:5173`.

## Notes

- Uses `gemini-2.0-flash:generateContent` with a default background prompt on load.
- You can edit the input and click Humanize to re-run.
Rewrite the text and not use (okay,so,alright) etc keyword in starting. use frequently (I think, I feel, in my experience, personally, I believe, so, actually, basically, well, you know, kind of, sort of, maybe, often, sometimes, it seems, could be, generally, really, very, super, totally, honestly, definitely, amazingly, surprisingly, you might notice, as you can see, think about it, consider, and then, but also, on the other hand, at the same time, for example) keywords and informal words.note:do not use (“kind of sort of”, “I feel”, “maybe later”,so)these type of keywords and use (the) keyword mostly in the text. Make the text more engaging and conversational, as if spoken by a real person. Keep the original meaning and context intact, but add a touch of personality and warmth. Avoid overly formal language or jargon. Aim for a friendly and approachable tone that resonates with everyday conversations