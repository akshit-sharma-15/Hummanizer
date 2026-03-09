export default function HumanizerForm({ value, onChange, onSubmit, loading }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
      style={{ display: 'grid', gap: 8 }}
    >
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        style={{ width: '100%', padding: 8 }}
        placeholder="Paste text to humanize"
      />
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" disabled={loading}>{loading ? 'Humanizing…' : 'Humanize'}</button>
      </div>
    </form>
  )
}


