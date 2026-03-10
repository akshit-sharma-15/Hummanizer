import { useState } from 'react'
import { GoogleGenAI } from '@google/genai'
import './App.css'

const DEFAULT_PROMPT = 'Rewrite the text and not use (okay,so,alright) etc keyword in starting. use frequently (I think, I feel, in my experience, personally, I believe, so, actually, basically, well, you know, kind of, sort of, maybe, often, sometimes, it seems, could be, generally, really, very, super, totally, honestly, definitely, amazingly, surprisingly, you might notice, as you can see, think about it, consider, and then, but also, on the other hand, at the same time, for example) keywords and informal words.note:do not use ("kind of sort of", "I feel", "maybe later",so)these type of keywords and use (the) keyword mostly in the text. Make the text more engaging and conversational, as if spoken by a real person. Keep the original meaning and context intact, but add a touch of personality and warmth. Avoid overly formal language or jargon. Aim for a friendly and approachable tone that resonates with everyday conversations.'

// Collect all non-empty API keys from env (VITE_GEMINI_API_KEY_1, _2, _3, ...)
const API_KEYS = Object.entries(import.meta.env)
  .filter(([key, val]) => /^VITE_GEMINI_API_KEY_\d+$/.test(key) && val)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, val]) => val)

// Pre-create a GoogleGenAI client per key
const aiClients = API_KEYS.map((key) => new GoogleGenAI({ apiKey: key }))

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
    if (aiClients.length === 0) {
      setError('No API keys configured. Add VITE_GEMINI_API_KEY_1, _2, etc. to your .env file.')
      return
    }
    setLoading(true)
    setError('')

    for (let i = 0; i < aiClients.length; i++) {
      try {
        const response = await aiClients[i].models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `${DEFAULT_PROMPT}\n\nText: ${text}`,
        })

        setOutputText(response.text || '')
        setLoading(false)
        return // success - stop trying more keys
      } catch (err) {
        const isQuotaError = err?.status === 429 ||
          err?.message?.includes('429') ||
          err?.message?.includes('RESOURCE_EXHAUSTED') ||
          err?.message?.includes('quota')

        if (isQuotaError && i < aiClients.length - 1) {
          // This key is exhausted, try the next one
          console.warn(`API key ${i + 1} quota exceeded, switching to key ${i + 2}...`)
          continue
        }

        // Last key or non-quota error
        if (isQuotaError) {
          setError(`All ${aiClients.length} API key(s) exhausted. Wait for quota reset or add more keys.`)
        } else {
          setError(err.message || 'Unknown error')
        }
      }
    }

    setLoading(false)
  }

  return (
    <>
      <header className="app-header" aria-label="Hummanizer header">
        <div className="brand">Hummanizer</div>
        <div className="tagline">Make AI-written text sound naturally human - warm, clear, and engaging.</div>
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
              {loading ? 'Humanizing...' : 'Humanize'}
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
            <div className="output output-box">{loading ? 'Waiting for response...' : outputText}</div>
          )}
        </section>
      </div>
    </>
  )
}


