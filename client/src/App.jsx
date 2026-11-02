import { useState } from 'react'
import axios from 'axios'

const API = 'http://localhost:5000/api/cases'

export default function App() {
  const [page, setPage] = useState('home')
  const [premise, setPremise] = useState('')
  const [difficulty, setDifficulty] = useState('easy')
  const [mystery, setMystery] = useState(null)
  const [hint, setHint] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [selectedSuspect, setSelectedSuspect] = useState('')
  const [busyClue, setBusyClue] = useState('')

  const createMystery = async () => {
    if (premise.trim().length < 10) {
      setError('Please enter a mystery premise of at least 10 characters.')
      return
    }

    try {
      setLoading(true)
      setError('')
      const response = await axios.post(API, { premise, difficulty })
      setMystery(response.data.case)
      setHint('')
      setResult(null)
      setPage('investigation')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create the mystery. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const discoverClue = async (clueId) => {
    try {
      setBusyClue(clueId)
      const response = await axios.post(
        `${API}/${mystery._id}/clues/${clueId}/discover`
      )

      const updatedCase = response.data.case
      if (updatedCase) {
        setMystery(updatedCase)
      } else {
        setMystery(prev => ({
          ...prev,
          discoveredClueIds: [...(prev.discoveredClueIds || []), clueId]
        }))
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to discover this clue.')
    } finally {
      setBusyClue('')
    }
  }

  const requestHint = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await axios.post(`${API}/${mystery._id}/hints`)
      setHint(response.data.hint || response.data.message || 'Think carefully about the evidence.')
      if (response.data.case) setMystery(response.data.case)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to get a hint.')
    } finally {
      setLoading(false)
    }
  }

  const accuseSuspect = async () => {
    if (!selectedSuspect) {
      setError('Please select a suspect before making your accusation.')
      return
    }

    try {
      setLoading(true)
      setError('')
      const response = await axios.post(`${API}/${mystery._id}/accuse`, {
        suspectId: selectedSuspect
      })
      setResult(response.data)
      setPage('result')
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to submit your accusation.')
    } finally {
      setLoading(false)
    }
  }

  const resetApp = () => {
    setPage('home')
    setMystery(null)
    setPremise('')
    setHint('')
    setResult(null)
    setSelectedSuspect('')
    setError('')
  }

  const discovered = mystery?.discoveredClueIds || []

  return (
    <div className="min-h-screen bg-[#080b14] text-white">
      <header className="border-b border-white/10 bg-[#0c1020]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <button onClick={resetApp} className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400 text-2xl text-black">
              🔍
            </span>
            <span className="text-left">
              <span className="block text-lg font-black tracking-wide">
                MYSTERY<span className="text-amber-400">ROOM</span>
              </span>
              <span className="text-xs tracking-[0.25em] text-gray-500">
                THINK. INVESTIGATE. SOLVE.
              </span>
            </span>
          </button>

          <div className="hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs text-emerald-300 sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            AI ENGINE READY
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12">

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
            <button onClick={() => setError('')} className="float-right font-bold">
              ✕
            </button>
          </div>
        )}

        {page === 'home' && (
          <section className="py-12 text-center">
            <div className="mb-8 inline-flex rounded-full border border-amber-400/30 bg-amber-400/10 px-5 py-2 text-xs font-bold tracking-[0.2em] text-amber-300">
              ✦ YOUR NEXT CASE AWAITS ✦
            </div>

            <h1 className="mx-auto max-w-4xl text-5xl font-black leading-tight sm:text-7xl">
              EVERY MYSTERY
              <br />
              HAS A <span className="text-amber-400">SECRET.</span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-gray-400">
              Step into the investigator's world. Examine evidence, question
              suspects, uncover hidden clues and let your intelligence lead
              you to the truth.
            </p>

            <button
              onClick={() => setPage('create')}
              className="mt-10 rounded-xl bg-amber-400 px-9 py-4 font-black text-black shadow-lg shadow-amber-400/20 transition hover:scale-105 hover:bg-amber-300"
            >
              START INVESTIGATION →
            </button>

            <div className="mx-auto mt-20 grid max-w-4xl gap-5 text-left sm:grid-cols-3">
              {[
                ['🕵️', 'INVESTIGATE', 'Explore suspects and discover hidden evidence.'],
                ['🧩', 'CONNECT CLUES', 'Use logic and reasoning to uncover the truth.'],
                ['⚖️', 'MAKE YOUR CASE', 'Accuse the culprit and reveal the solution.']
              ].map(([icon, title, description]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-[#111729] p-7">
                  <div className="text-3xl">{icon}</div>
                  <h3 className="mt-5 font-black tracking-wider text-amber-300">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-400">{description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {page === 'create' && (
          <section className="mx-auto max-w-2xl py-8">
            <button onClick={() => setPage('home')} className="mb-8 text-sm text-gray-400 hover:text-amber-300">
              ← Back to Home
            </button>

            <div className="rounded-3xl border border-white/10 bg-[#111729] p-7 sm:p-10">
              <div className="text-sm font-bold tracking-[0.2em] text-amber-400">
                CASE GENERATOR
              </div>

              <h1 className="mt-3 text-4xl font-black">Create Your Mystery</h1>
              <p className="mt-3 leading-7 text-gray-400">
                Give the AI a starting point. It will create a mystery filled
                with suspects, clues and secrets.
              </p>

              <label className="mt-9 block text-sm font-bold text-gray-200">
                YOUR MYSTERY PREMISE
              </label>

              <textarea
                value={premise}
                onChange={e => setPremise(e.target.value)}
                placeholder="Example: A priceless diamond disappears from a locked mansion during a birthday celebration..."
                rows={5}
                className="mt-3 w-full resize-none rounded-xl border border-white/10 bg-[#080b14] p-4 text-white outline-none transition focus:border-amber-400"
              />

              <label className="mt-8 block text-sm font-bold text-gray-200">
                SELECT DIFFICULTY
              </label>

              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  ['easy', 'EASY', '3 Suspects'],
                  ['medium', 'MEDIUM', '4 Suspects'],
                  ['hard', 'HARD', '5 Suspects']
                ].map(([value, title, subtitle]) => (
                  <button
                    key={value}
                    onClick={() => setDifficulty(value)}
                    className={`rounded-xl border p-4 text-center transition ${
                      difficulty === value
                        ? 'border-amber-400 bg-amber-400/10 text-amber-300'
                        : 'border-white/10 bg-[#080b14] text-gray-400 hover:border-white/30'
                    }`}
                  >
                    <span className="block font-black">{title}</span>
                    <span className="mt-2 block text-xs">{subtitle}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={createMystery}
                disabled={loading}
                className="mt-9 w-full rounded-xl bg-amber-400 py-4 font-black text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'GENERATING YOUR MYSTERY...' : 'GENERATE MYSTERY ✦'}
              </button>

              <p className="mt-4 text-center text-xs text-gray-500">
                Powered by Google Gemini AI
              </p>
            </div>
          </section>
        )}

        {page === 'investigation' && mystery && (
          <section>
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold tracking-[0.2em] text-amber-400">
                  ACTIVE INVESTIGATION
                </p>
                <h1 className="mt-2 text-3xl font-black sm:text-4xl">{mystery.title}</h1>
              </div>
              <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-sm font-bold uppercase text-amber-300">
                {mystery.difficulty}
              </span>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#111729] p-6">
              <h2 className="font-black text-amber-300">📁 CASE FILE</h2>
              <p className="mt-4 leading-8 text-gray-300">
                {mystery.openingNarrative || mystery.premise}
              </p>
              {mystery.setting && (
                <p className="mt-3 text-sm text-gray-500">📍 {mystery.setting}</p>
              )}
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              <div>
                <h2 className="mb-5 text-2xl font-black">🕵️ Suspects</h2>
                <div className="space-y-4">
                  {mystery.suspects?.map((suspect, index) => (
                    <div key={suspect.id} className="rounded-2xl border border-white/10 bg-[#111729] p-5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 font-black text-amber-300">
                          {index + 1}
                        </span>
                        <div>
                          <h3 className="font-bold">{suspect.name}</h3>
                          <p className="text-xs text-amber-300">{suspect.role}</p>
                        </div>
                      </div>
                      <p className="mt-4 text-sm leading-6 text-gray-400">
                        {suspect.description}
                      </p>
                      <p className="mt-3 text-sm text-gray-300">
                        <span className="text-amber-300">Alibi:</span> {suspect.alibi}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="mb-5 text-2xl font-black">🔎 Evidence Room</h2>
                <div className="space-y-4">
                  {mystery.clues?.map((clue, index) => {
                    const isFound = discovered.includes(clue.id)

                    return (
                      <div key={clue.id} className="rounded-2xl border border-white/10 bg-[#111729] p-5">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="font-bold">
                            {index + 1}. {clue.title}
                          </h3>
                          <span className={`text-xs font-bold ${isFound ? 'text-emerald-400' : 'text-gray-500'}`}>
                            {isFound ? 'DISCOVERED' : 'HIDDEN'}
                          </span>
                        </div>

                        {isFound ? (
                          <p className="mt-4 text-sm leading-7 text-gray-300">
                            {clue.discoveredText || clue.description}
                          </p>
                        ) : (
                          <button
                            disabled={busyClue === clue.id}
                            onClick={() => discoverClue(clue.id)}
                            className="mt-4 rounded-lg border border-amber-400/40 px-4 py-2 text-sm font-bold text-amber-300 hover:bg-amber-400/10 disabled:opacity-50"
                          >
                            {busyClue === clue.id ? 'Investigating...' : 'Discover Clue →'}
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-6">
                  <h3 className="font-black text-amber-300">💡 Need a Hint?</h3>
                  <p className="mt-2 text-sm text-gray-400">
                    Ask the AI to guide your investigation without revealing the culprit.
                  </p>
                  <button
                    onClick={requestHint}
                    disabled={loading}
                    className="mt-4 rounded-lg bg-amber-400 px-5 py-3 text-sm font-black text-black disabled:opacity-50"
                  >
                    {loading ? 'THINKING...' : 'GET AI HINT'}
                  </button>
                  {hint && (
                    <p className="mt-4 rounded-lg bg-black/30 p-4 text-sm leading-7 text-gray-200">
                      💡 {hint}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-10 rounded-2xl border border-amber-400/30 bg-[#111729] p-7 text-center">
              <h2 className="text-2xl font-black">Ready to Solve the Mystery?</h2>
              <p className="mt-2 text-gray-400">
                Review your evidence carefully before accusing a suspect.
              </p>
              <button
                onClick={() => setPage('accuse')}
                className="mt-6 rounded-xl bg-amber-400 px-8 py-4 font-black text-black hover:bg-amber-300"
              >
                MAKE YOUR ACCUSATION →
              </button>
            </div>
          </section>
        )}

        {page === 'accuse' && mystery && (
          <section className="mx-auto max-w-2xl py-10">
            <div className="rounded-3xl border border-white/10 bg-[#111729] p-8">
              <div className="text-center text-5xl">⚖️</div>
              <h1 className="mt-5 text-center text-3xl font-black">Name Your Suspect</h1>
              <p className="mt-3 text-center leading-7 text-gray-400">
                The evidence has been examined. Who do you believe is responsible?
              </p>

              <div className="mt-8 space-y-3">
                {mystery.suspects?.map(suspect => (
                  <button
                    key={suspect.id}
                    onClick={() => setSelectedSuspect(suspect.id)}
                    className={`w-full rounded-xl border p-5 text-left transition ${
                      selectedSuspect === suspect.id
                        ? 'border-amber-400 bg-amber-400/10'
                        : 'border-white/10 bg-[#080b14] hover:border-white/30'
                    }`}
                  >
                    <span className="font-bold">{suspect.name}</span>
                    <span className="mt-1 block text-sm text-gray-400">{suspect.role}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={accuseSuspect}
                disabled={loading}
                className="mt-8 w-full rounded-xl bg-amber-400 py-4 font-black text-black hover:bg-amber-300 disabled:opacity-50"
              >
                {loading ? 'SUBMITTING...' : 'CONFIRM MY ACCUSATION'}
              </button>

              <button
                onClick={() => setPage('investigation')}
                className="mt-4 w-full py-3 text-sm text-gray-400 hover:text-white"
              >
                ← Return to Investigation
              </button>
            </div>
          </section>
        )}

        {page === 'result' && result && (
          <section className="mx-auto max-w-3xl py-10">
            <div className="rounded-3xl border border-white/10 bg-[#111729] p-8 text-center sm:p-12">
              <div className="text-6xl">{result.isCorrect ? '🏆' : '🔍'}</div>
              <p className="mt-6 text-sm font-bold tracking-[0.2em] text-amber-400">
                INVESTIGATION COMPLETE
              </p>

              <h1 className="mt-4 text-4xl font-black">
                {result.isCorrect ? 'CASE SOLVED!' : 'CASE CLOSED'}
              </h1>

              <p className="mt-4 text-gray-400">
                {result.isCorrect
                  ? 'Excellent detective work. You identified the culprit!'
                  : 'Your accusation was incorrect. The truth has now been revealed.'}
              </p>

              <div className="mt-9 rounded-2xl bg-[#080b14] p-7">
                <p className="text-xs font-bold tracking-widest text-gray-500">FINAL SCORE</p>
                <p className="mt-3 text-6xl font-black text-amber-400">
                  {result.score ?? 0}
                </p>
                <p className="mt-2 text-sm text-gray-500">POINTS</p>
              </div>

              <div className="mt-8 text-left">
                <h2 className="text-xl font-black text-amber-300">🧩 The Truth</h2>
                <p className="mt-4 leading-8 text-gray-300">
                  Culprit: <strong>{result.culpritName || result.culpritId}</strong>
                </p>
                <p className="mt-3 leading-8 text-gray-400">
                  {result.solutionExplanation}
                </p>

                {result.reasoningChain?.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-bold">How the mystery was solved</h3>
                    <ol className="mt-3 list-inside list-decimal space-y-3 text-sm leading-7 text-gray-400">
                      {result.reasoningChain.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>

              <button
                onClick={resetApp}
                className="mt-10 w-full rounded-xl bg-amber-400 py-4 font-black text-black hover:bg-amber-300"
              >
                START A NEW MYSTERY →
              </button>
            </div>
          </section>
        )}

      </main>

      <footer className="mt-16 border-t border-white/10 px-6 py-8 text-center">
        <p className="text-sm font-bold tracking-widest text-gray-500">
          MYSTERY ROOM · POWERED BY GEMINI AI
        </p>
        <p className="mt-2 text-xs text-gray-600">
          Every clue matters. Every decision counts.
        </p>
      </footer>
    </div>
  )
}