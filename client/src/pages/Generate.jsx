import { ArrowLeft, Wand2, Sparkles, ArrowRight } from 'lucide-react'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion as Motion, AnimatePresence } from "motion/react"
import { useState } from 'react'
import axios from "axios"
import { serverUrl } from '../App'
import Navbar from '../components/Navbar'

// MUI Imports
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'

const PHASES = [
    "Analyzing your idea…",
    "Designing layout & structure…",
    "Writing HTML & CSS…",
    "Adding animations & interactions…",
    "Final quality checks…",
]

const SUGGESTIONS = [
    "A SaaS landing page for a project management tool",
    "A portfolio site for a UX designer",
    "A restaurant website with menu and reservations",
    "A personal blog with dark theme",
]

function Generate() {
    const navigate = useNavigate()
    const [prompt, setPrompt] = useState("")
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [phaseIndex, setPhaseIndex] = useState(0)
    const [error, setError] = useState("")
    const [focused, setFocused] = useState(false)

    const handleGenerateWebsite = async () => {
        if (!prompt.trim() || loading) return
        setLoading(true)
        setError("")
        try {
            const result = await axios.post(`${serverUrl}/api/website/generate`, { prompt }, { withCredentials: true })
            setProgress(100)
            setLoading(false)
            navigate(`/editor/${result.data.websiteId}`)
        } catch (error) {
            setLoading(false)
            setError(error.response?.data?.message || "Something went wrong")
        }
    }

    useEffect(() => {
        if (!loading) {
            const timeout = setTimeout(() => { setPhaseIndex(0); setProgress(0) }, 0)
            return () => clearTimeout(timeout)
        }
        let value = 0
        let phase = 0
        const interval = setInterval(() => {
            const increment = value < 20 ? Math.random() * 1.5 : value < 60 ? Math.random() * 1.2 : Math.random() * 0.6
            value = Math.min(value + increment, 93)
            phase = Math.min(Math.floor((value / 100) * PHASES.length), PHASES.length - 1)
            setProgress(Math.floor(value))
            setPhaseIndex(phase)
        }, 1200)
        return () => clearInterval(interval)
    }, [loading])

    const charCount = prompt.length
    const maxChars = 1000

    return (
        <div className='min-h-screen bg-[--color-bg-base] text-[--color-text-primary]'>
            <Navbar position="sticky" />

            <div className='max-w-3xl mx-auto px-5 sm:px-6 py-16'>

                {/* ── HEADING ── */}
                <Motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center mb-12"
                >
                    <div className='mx-auto mb-5 h-12 w-12 rounded-xl bg-[--color-bg-surface] border border-[--color-border-subtle] grid place-items-center shadow-md shadow-black/10'>
                        <Wand2 size={20} className='text-[--color-text-primary]' />
                    </div>
                    <h1 className='font-display text-4xl md:text-5xl font-800 tracking-tight leading-tight mb-4'>
                        Describe your<br />
                        <span className='gradient-text'>perfect website</span>
                    </h1>
                    <p className='text-[--color-text-secondary] max-w-md mx-auto leading-relaxed text-sm'>
                        Be as detailed as you like — layout, colors, sections, copy.
                        The more context, the better the result.
                    </p>
                </Motion.div>

                {/* ── PROMPT CARD ── */}
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.55 }}
                >
                    <Card className={`overflow-hidden transition-all duration-200`} style={{ background: 'var(--color-bg-surface)', border: focused ? '1px solid var(--color-text-primary)' : '1px solid var(--color-border-subtle)' }}>
                        <div className='px-5 pt-4 pb-2.5 flex items-center gap-2 border-b border-[--color-border-subtle]'>
                            <div className='h-1.5 w-1.5 rounded-full bg-[--color-accent-green] animate-pulse' />
                            <span className='text-xs text-[--color-text-muted] font-semibold'>New website prompt</span>
                        </div>

                        <textarea
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            onChange={(e) => setPrompt(e.target.value.slice(0, maxChars))}
                            value={prompt}
                            placeholder='e.g. A modern SaaS landing page for a project management app. Include a hero section with a headline and CTA, a features grid, pricing section with 3 tiers, and a footer. Use a dark theme with indigo accents...'
                            className='w-full h-52 px-5 pt-4 pb-2 bg-transparent resize-none text-sm leading-relaxed text-[--color-text-primary] placeholder:text-[--color-text-muted] outline-none border-0'
                            disabled={loading}
                        />

                        <div className='px-5 pb-4 flex items-center justify-between'>
                            <span className={`text-xs transition ${charCount > maxChars * 0.9 ? 'text-[--color-accent-amber]' : 'text-[--color-text-muted]'}`}>
                                {charCount}/{maxChars}
                            </span>
                            <Button
                                variant="contained"
                                onClick={handleGenerateWebsite}
                                disabled={!prompt.trim() || loading}
                                style={{ borderRadius: '10px', height: '38px', fontWeight: 600 }}
                                endIcon={loading ? null : <ArrowRight size={14} />}
                            >
                                {loading ? (
                                    <>
                                        <div className='h-3.5 w-3.5 mr-2 rounded-full border-2 border-white/40 border-t-white animate-spin' />
                                        Generating…
                                    </>
                                ) : (
                                    "Generate website"
                                )}
                            </Button>
                        </div>
                    </Card>
                </Motion.div>

                {/* Error */}
                <AnimatePresence>
                    {error && (
                        <Motion.p
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className='mt-3 text-sm text-[--color-accent-red] text-center font-medium'
                        >
                            {error}
                        </Motion.p>
                    )}
                </AnimatePresence>

                {/* ── SUGGESTIONS ── */}
                {!loading && (
                    <Motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className='mt-8'
                    >
                        <p className='text-xs text-[--color-text-muted] uppercase tracking-[0.14em] mb-3 text-center font-semibold'>Try an example</p>
                        <div className='flex flex-wrap gap-2 justify-center'>
                            {SUGGESTIONS.map((s, i) => (
                                <Button
                                    key={i}
                                    variant="outlined"
                                    onClick={() => setPrompt(s)}
                                    style={{ borderRadius: '99px', padding: '6px 14px', fontSize: '0.75rem', borderColor: 'var(--color-border-subtle)', color: 'var(--color-text-secondary)', background: 'var(--color-bg-surface)' }}
                                >
                                    {s}
                                </Button>
                            ))}
                        </div>
                    </Motion.div>
                )}

                {/* ── PROGRESS ── */}
                <AnimatePresence>
                    {loading && (
                        <Motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            <Card className="mt-8 p-6 animate-pulse" style={{ background: 'var(--color-bg-surface)' }}>
                                {/* Phase steps */}
                                <div className='flex flex-col gap-3 mb-6'>
                                    {PHASES.map((phase, i) => (
                                        <div key={i} className={`flex items-center gap-3 text-sm transition-all duration-300 ${
                                            i < phaseIndex
                                                ? 'text-[--color-accent-green]'
                                                : i === phaseIndex
                                                ? 'text-[--color-text-primary]'
                                                : 'text-[--color-text-muted]'
                                        }`}>
                                            <div className={`h-5 w-5 rounded-full border flex-shrink-0 grid place-items-center transition-all ${
                                                i < phaseIndex
                                                    ? 'bg-emerald-500/10 border-[--color-accent-green]'
                                                    : i === phaseIndex
                                                    ? 'border-[--color-text-primary] bg-[--color-bg-hover]'
                                                    : 'border-[--color-border-subtle] bg-transparent'
                                            }`}>
                                                {i < phaseIndex ? (
                                                    <svg width="9" height="9" viewBox="0 0 12 12" fill="none" className="text-[--color-accent-green]">
                                                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                ) : i === phaseIndex ? (
                                                    <div className='h-1.5 w-1.5 rounded-full bg-[--color-text-primary] animate-pulse' />
                                                ) : null}
                                            </div>
                                            {phase}
                                        </div>
                                    ))}
                                </div>

                                {/* Progress bar */}
                                <div className='h-1 w-full bg-[--color-bg-hover] rounded-full overflow-hidden'>
                                    <Motion.div
                                        className="h-full rounded-full bg-[--color-text-primary]"
                                        animate={{ width: `${progress}%` }}
                                        transition={{ ease: "easeOut", duration: 0.8 }}
                                    />
                                </div>
                                <div className='flex items-center justify-between mt-4'>
                                    <p className='text-xs text-[--color-text-muted]'>
                                        Est. time remaining: <span className='text-[--color-text-secondary] font-semibold'>~8–12 min</span>
                                    </p>
                                    <span className='text-xs font-semibold tabular-nums text-[--color-text-secondary]'>{progress}%</span>
                                </div>
                            </Card>
                        </Motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    )
}

export default Generate