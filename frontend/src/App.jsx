import { useEffect, useState } from 'react'
import './App.css'

const DEFAULT_PROMPT = 'Rewrite the text and not use (okay,so,alright) etc keyword in starting. use frequently (I think, I feel, in my experience, personally, I believe, so, actually, basically, well, you know, kind of, sort of, maybe, often, sometimes, it seems, could be, generally, really, very, super, totally, honestly, definitely, amazingly, surprisingly, you might notice, as you can see, think about it, consider, and then, but also, on the other hand, at the same time, for example) keywords and informal words.note:do not use (“kind of sort of”, “I feel”, “maybe later”,so)these type of keywords and use (the) keyword mostly in the text. Make the text more engaging and conversational, as if spoken by a real person. Keep the original meaning and context intact, but add a touch of personality and warmth. Avoid overly formal language or jargon. Aim for a friendly and approachable tone that resonates with everyday conversations.'

export default function App() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  async function callGeminiAPI(text) {
    const trimmed = (text || '').trim()
    if (!trimmed) {
      setOutputText('')
      setError('')
      return
    }
    setLoading(true)
    setError('')
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY
      if (!apiKey) {
        throw new Error('Missing VITE_GEMINI_API_KEY in .env')
      }

      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: `${DEFAULT_PROMPT}\n\nText: ${text}` },
              ],
            },
          ],
        }),
      })

      if (!response.ok) {
        const details = await response.text()
        throw new Error(`Gemini error ${response.status}: ${details}`)
      }

      const data = await response.json()
      const candidate = data?.candidates?.[0]
      const partText = candidate?.content?.parts?.[0]?.text || ''
      setOutputText(partText)
    } catch (err) {
      setError(err.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  // Do not auto-call on mount; wait for user input

  return (
    <>
      <header className="app-header" aria-label="Hummanizer header">
        <div className="brand">Hummanizer</div>
        <div className="tagline">Make AI‑written text sound naturally human — warm, clear, and engaging.</div>
      </header>

      <div className="content" aria-label="Main content area">
        <section className="stack" aria-label="Input section">
        <label htmlFor="prompt" className="label">Your Text</label>
        <textarea
          id="prompt"
          className="textarea textarea-lg"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={6}
          placeholder="Paste or type the text you want to humanize..."
        />
        <div className="button-row right">
          <button onClick={() => callGeminiAPI(inputText)} disabled={loading || !(inputText || '').trim()}>
            {loading ? 'Humanizing…' : 'Humanize'}
          </button>
          <button className="btn-secondary" onClick={() => { setInputText(''); setOutputText(''); setError('') }} disabled={loading}>
            Clear
          </button>
        </div>
        </section>

        <section className="panel" aria-label="Output section">
        <div className="output-toolbar">
          <div className="panel-title">Humanized Output</div>
          <button
            className="btn-secondary"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(error ? error : outputText)
                setCopied(true)
                setTimeout(() => setCopied(false), 1500)
              } catch (_) {}
            }}
            disabled={!outputText && !error}
            aria-label="Copy output"
            title="Copy output"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        {error ? (
          <div className="output output-box" style={{ color: '#ef4444' }}>{error}</div>
        ) : (
          <div className="output output-box">{loading ? 'Waiting for response…' : outputText}</div>
        )}
        </section>
      </div>
    </>
  )
}


