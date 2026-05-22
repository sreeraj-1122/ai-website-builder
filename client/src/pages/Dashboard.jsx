import { ArrowLeft, Check, Plus, Rocket, Share2, LayoutGrid, Clock, Sparkles } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { motion as Motion } from "motion/react"
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../App'
import Navbar from '../components/Navbar'

// MUI Imports
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'

function Dashboard() {
    const { userData } = useSelector(state => state.user)
    const navigate = useNavigate()
    const [websites, setWebsites] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [copiedId, setCopiedId] = useState(null)

    const handleDeploy = async (id) => {
        try {
            const result = await axios.get(`${serverUrl}/api/website/deploy/${id}`, { withCredentials: true })
            window.open(`${result.data.url}`, "_blank")
            setWebsites((prev) =>
                prev.map((w) =>
                    w._id === id ? { ...w, deployed: true, deployUrl: result.data.url } : w
                )
            )
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const handleGetAllWebsites = async () => {
            setLoading(true)
            try {
                const result = await axios.get(`${serverUrl}/api/website/get-all`, { withCredentials: true })
                setWebsites(result.data || [])
                setLoading(false)
            } catch (error) {
                console.log(error)
                setError(error.response?.data?.message || "Error fetching websites")
                setLoading(false)
            }
        }
        handleGetAllWebsites()
    }, [])

    const handleCopy = async (site) => {
        await navigator.clipboard.writeText(site.deployUrl)
        setCopiedId(site._id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    return (
        <div className='min-h-screen bg-[--color-bg-base] text-[--color-text-primary]'>
            <Navbar position="sticky" />

            <div className='max-w-7xl mx-auto px-5 sm:px-6 py-10'>

                {/* ── WELCOME CARD ── */}
                <Motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                    <Card className="mb-10 relative p-8 overflow-hidden" style={{ background: 'var(--color-bg-surface)' }}>
                        {/* Accent blob */}
                        <div className='absolute top-0 right-0 w-64 h-36 bg-gradient-to-bl from-zinc-500/5 to-transparent rounded-2xl pointer-events-none' />
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <p className='text-xs uppercase tracking-[0.18em] text-[--color-text-muted] mb-2 font-semibold'>Welcome back</p>
                                <h1 className='font-display text-3xl font-700 tracking-tight text-[--color-text-primary]'>{userData.name}</h1>
                                <p className='text-sm text-[--color-text-secondary] mt-2'>
                                    {websites?.length
                                        ? `${websites.length} website${websites.length === 1 ? '' : 's'} in your workspace`
                                        : 'Your workspace is empty — build your first website!'
                                    }
                                </p>
                            </div>
                            <Button
                                variant="contained"
                                onClick={() => navigate("/generate")}
                                startIcon={<Plus size={14} />}
                                style={{ borderRadius: '10px', padding: '10px 20px', fontWeight: 600, height: '42px' }}
                            >
                                New Website
                            </Button>
                        </div>
                    </Card>
                </Motion.div>

                {/* ── STATES ── */}
                {loading && (
                    <div className="mt-24 flex flex-col items-center gap-3 text-[--color-text-secondary]">
                        <div className='h-5 w-5 rounded-full border-2 border-[--color-text-primary] border-t-transparent animate-spin' />
                        <p className='text-sm font-medium'>Loading your websites…</p>
                    </div>
                )}

                {error && !loading && (
                    <div className="mt-24 text-center text-sm text-[--color-accent-red] font-medium">{error}</div>
                )}

                {!loading && !error && websites?.length === 0 && (
                    <Motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 rounded-2xl border border-dashed border-[--color-border-strong] p-16 text-center"
                    >
                        <div className='h-12 w-12 mx-auto mb-4 rounded-xl bg-[--color-bg-elevated] border border-[--color-border-subtle] grid place-items-center'>
                            <Plus size={20} className='text-[--color-text-muted]' />
                        </div>
                        <p className='text-sm text-[--color-text-secondary] mb-4'>No websites yet</p>
                        <Button
                            variant="contained"
                            onClick={() => navigate("/generate")}
                            startIcon={<Plus size={14} />}
                            style={{ borderRadius: '8px', fontWeight: 600 }}
                        >
                            Create your first website
                        </Button>
                    </Motion.div>
                )}

                {/* ── GRID ── */}
                {!loading && !error && websites?.length > 0 && (
                    <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'>
                        {websites.map((w, i) => {
                            const copied = copiedId === w._id
                            return (
                                <Motion.div
                                    key={w._id}
                                    initial={{ opacity: 0, y: 24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                                    whileHover={{ y: -5 }}
                                    className="flex"
                                >
                                    <Card className="group overflow-hidden flex flex-col w-full hover:border-[--color-border-strong]" style={{ background: 'var(--color-bg-surface)' }}>
                                        {/* Preview */}
                                        <div
                                            className='relative h-44 bg-[--color-preview-shell] overflow-hidden cursor-pointer border-b border-[--color-border-subtle]'
                                            onClick={() => navigate(`/editor/${w._id}`)}
                                        >
                                            <iframe
                                                srcDoc={w.latestCode}
                                                className='absolute inset-0 w-[143%] h-[143%] scale-[0.7] origin-top-left pointer-events-none bg-white'
                                            />
                                            {/* Overlay on hover */}
                                            <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4'>
                                                <span className='text-xs text-white/85 font-semibold'>Open Workspace →</span>
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className='p-5 flex flex-col gap-4 flex-1 justify-between'>
                                            <div>
                                                <h3 className='font-semibold text-sm line-clamp-2 leading-snug text-[--color-text-primary]'>{w.title}</h3>
                                                <p className='flex items-center gap-1.5 text-xs text-[--color-text-muted] mt-2'>
                                                    <Clock size={11} />
                                                    Updated {new Date(w.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </p>
                                            </div>

                                            {/* Status badge */}
                                            {w.deployed && (
                                                <div className='flex items-center gap-1.5'>
                                                    <Chip
                                                        label="Live"
                                                        size="small"
                                                        style={{ fontSize: '0.65rem', height: '20px' }}
                                                    />
                                                </div>
                                            )}

                                            {/* Action button */}
                                            {!w.deployed ? (
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    onClick={() => handleDeploy(w._id)}
                                                    startIcon={<Rocket size={13} />}
                                                    style={{ width: '100%', borderRadius: '8px', fontWeight: 600 }}
                                                >
                                                    Deploy site
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={() => handleCopy(w)}
                                                    style={{
                                                        width: '100%',
                                                        borderRadius: '8px',
                                                        fontWeight: 500,
                                                        borderColor: copied ? 'var(--color-accent-green)' : 'var(--color-border-subtle)',
                                                        color: copied ? 'var(--color-accent-green)' : 'var(--color-text-secondary)',
                                                        backgroundColor: copied ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
                                                    }}
                                                    startIcon={copied ? <Check size={13} /> : <Share2 size={13} />}
                                                >
                                                    {copied ? "Copied!" : "Copy link"}
                                                </Button>
                                            )}
                                        </div>
                                    </Card>
                                </Motion.div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard