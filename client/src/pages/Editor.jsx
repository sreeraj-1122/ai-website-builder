import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { serverUrl } from '../App'
import { useState } from 'react'
import { Check, Code2, History, Image, MessageSquare, Monitor, Rocket, Send, Share2, Sparkles, Wand2, X } from 'lucide-react'
import { useRef } from 'react'
import { AnimatePresence, motion as Motion } from 'motion/react'

import Editor from '@monaco-editor/react';
import Navbar from '../components/Navbar'

// MUI Imports
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import Dialog from '@mui/material/Dialog'
import Drawer from '@mui/material/Drawer'
import Chip from '@mui/material/Chip'
import Skeleton from '@mui/material/Skeleton'
import IconButton from '@mui/material/IconButton'

const THINKING_STEPS = [
    "Understanding your request…",
    "Planning layout changes…",
    "Improving responsiveness…",
    "Applying animations…",
    "Finalizing update…",
]

function WebsiteEditor() {
    const { id } = useParams()
    const [website, setWebsite] = useState(null)
    const [error, setError] = useState("")
    const [code, setCode] = useState("")
    const [messages, setMessages] = useState([])
    const [prompt, setPrompt] = useState("")
    const iframeRef = useRef(null)
    const [updateLoading, setUpdateLoading] = useState(false)
    const [thinkingIndex, setThinkingIndex] = useState(0)
    const [showCode, setShowCode] = useState(false)
    const [showFullPreview, setShowFullPreview] = useState(false)
    const [showChat, setShowChat] = useState(false)
    const [shareCopied, setShareCopied] = useState(false)

    const handleUpdate = async () => {
        if (!prompt) return
        setUpdateLoading(true)
        const text = prompt
        setPrompt("")
        setMessages((m) => [...m, { role: "user", content: text }])
        try {
            const result = await axios.post(`${serverUrl}/api/website/update/${id}`, { prompt: text }, { withCredentials: true })
            setUpdateLoading(false)
            setMessages((m) => [...m, { role: "ai", content: result.data.message }])
            setCode(result.data.code)
        } catch (error) {
            setUpdateLoading(false)
            console.log(error)
        }
    }

    const handleDeploy = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/website/deploy/${website._id}`, { withCredentials: true })
            window.open(`${result.data.url}`, "_blank")
            setWebsite((current) => ({ ...current, deployed: true, deployUrl: result.data.url }))
        } catch (error) {
            console.log(error)
        }
    }

    const handleShare = async () => {
        const origin = window.location.origin
        const fallbackUrl = `${origin}/site/${website.slug || website._id || id}`
        const shareUrl = website.deployUrl || fallbackUrl
        try {
            await navigator.clipboard.writeText(shareUrl)
            setShareCopied(true)
            setTimeout(() => setShareCopied(false), 2000)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (!updateLoading) return;
        const i = setInterval(() => {
            setThinkingIndex((i) => (i + 1) % THINKING_STEPS.length)
        }, 1200)

        return () => clearInterval(i)
    }, [updateLoading])

    useEffect(() => {
        const handleGetWebsite = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/website/get-by-id/${id}`, { withCredentials: true })
                setWebsite(result.data)
                setCode(result.data.latestCode)
                setMessages(result.data.conversation)
            } catch (error) {
                console.log(error)
                setError(error.response?.data?.message || "Error getting website")
            }
        }
        handleGetWebsite()
    }, [id])

    useEffect(() => {
        if (!iframeRef.current || !code) return;
        const blob = new Blob([code], { type: "text/html" })
        const url = URL.createObjectURL(blob)
        iframeRef.current.src = url
        return () => URL.revokeObjectURL(url)
    }, [code])

    const renderChat = () => (
        <>
            <div className='flex-1 overflow-y-auto px-4 py-6 space-y-6'>
                {messages.map((m, i) => (
                    <div
                        key={i}
                        className={`group max-w-[88%] ${m.role === "user" ? "ml-auto" : "mr-auto"}`}
                    >
                        {m.role !== "user" && (
                            <div className='mb-1.5 flex items-center gap-1.5 px-1 text-[10px] uppercase tracking-wider text-[--color-text-muted] font-semibold'>
                                <Sparkles size={11} />
                                GenWeb AI
                            </div>
                        )}
                        <div
                            className={`px-4 py-3 rounded-2xl text-sm leading-relaxed border transition duration-200 ${m.role === "user"
                                ? "bg-[--color-bubble-user-bg] text-[--color-bubble-user-text] border-transparent shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                                : "bg-[--color-bubble-ai-bg] text-[--color-bubble-ai-text] border-[--color-border-subtle] shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
                                }`}
                        >
                            {m.content}
                        </div>
                    </div>
                ))}

                {updateLoading &&
                    <div className='max-w-[88%] mr-auto w-full space-y-2'>
                        <div className='mb-1.5 flex items-center gap-1.5 px-1 text-[10px] uppercase tracking-wider text-[--color-text-muted] font-semibold'>
                            <Sparkles size={11} className="text-violet-400" />
                            GenWeb AI
                        </div>
                        <div className='px-4 py-3.5 rounded-2xl bg-[--color-bg-elevated] border border-[--color-border-subtle] w-full space-y-3.5 shadow-sm'>
                            <div className="flex items-center gap-2 text-xs text-[--color-text-secondary] italic">
                                <span className="h-2 w-2 rounded-full bg-[--color-accent-green] animate-pulse" />
                                {THINKING_STEPS[thinkingIndex]}
                            </div>
                            <div className="space-y-2">
                                <Skeleton variant="text" width="90%" height={16} />
                                <Skeleton variant="text" width="75%" height={16} />
                                <Skeleton variant="text" width="60%" height={16} />
                            </div>
                        </div>
                    </div>
                }
            </div>

            <div className='p-3 bg-[--color-bg-surface] border-t border-[--color-border-subtle]'>
                <div className='rounded-xl bg-[--color-bg-elevated] border border-[--color-border-subtle] p-2.5 transition focus-within:border-[--color-border-strong]'>
                    <textarea
                        placeholder='Describe a change...'
                        className='h-20 w-full resize-none bg-transparent px-3 py-1.5 text-sm outline-none border-0 text-[--color-text-primary] placeholder:text-[--color-text-muted]'
                        onChange={(e) => setPrompt(e.target.value)}
                        value={prompt}
                    />
                    <div className='flex items-center justify-between gap-3 mt-3'>
                        <div className='flex min-w-0 flex-wrap gap-1.5'>
                            <Button
                                variant="outlined"
                                startIcon={<Image size={12} />}
                                style={{ borderRadius: '99px', padding: '4px 10px', fontSize: '0.7rem', height: '24px' }}
                            >
                                Image
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<History size={12} />}
                                style={{ borderRadius: '99px', padding: '4px 10px', fontSize: '0.7rem', height: '24px' }}
                            >
                                History
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<Wand2 size={12} />}
                                style={{ borderRadius: '99px', padding: '4px 10px', fontSize: '0.7rem', height: '24px' }}
                            >
                                Suggest
                            </Button>
                        </div>
                        <Tooltip title="Send Message">
                            <Button
                                variant="contained"
                                disabled={updateLoading}
                                onClick={handleUpdate}
                                style={{ height: '36px', width: '36px', minWidth: '36px', padding: 0, borderRadius: '10px' }}
                            >
                                <Send size={15} />
                            </Button>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </>
    )

    if (error) {
        return (
            <div className='h-screen flex items-center justify-center bg-[--color-bg-base] text-[--color-accent-red] font-semibold text-sm'>
                {error}
            </div>
        )
    }
    if (!website) {
        return (
            <div className='h-screen flex flex-col items-center justify-center bg-[--color-bg-base] text-[--color-text-secondary] gap-3'>
                <div className='h-5 w-5 rounded-full border-2 border-[--color-text-secondary] border-t-transparent animate-spin' />
                <span className='text-sm font-medium'>Loading Workspace...</span>
            </div>
        )
    }

    return (
        <div className='h-screen w-screen flex flex-col bg-[--color-bg-base] text-[--color-text-primary] overflow-hidden'>
            <Navbar position="sticky" />
            <div className='flex-1 flex overflow-hidden relative'>
                <aside className='hidden lg:flex w-[340px] xl:w-[380px] flex-col bg-[--color-bg-surface] border-r border-[--color-border-subtle] z-10'>
                    <Header />
                    {renderChat()}
                </aside>

                <div className='flex-1 flex flex-col overflow-hidden'>
                <div className='h-12 px-4 flex justify-between items-center bg-[--color-bg-surface] border-b border-[--color-border-subtle] z-10'>
                    <div className='flex min-w-0 items-center gap-3'>
                        <span className='max-w-[45vw] truncate text-sm font-medium text-[--color-text-primary]'>{website.title}</span>
                        <Chip
                            icon={<Sparkles size={12} className="!text-[--color-text-primary]" />}
                            label="Live"
                            size="small"
                            style={{ height: '20px', fontSize: '0.65rem' }}
                        />
                    </div>
                    <div className='flex items-center gap-1.5'>
                        {!website.deployed && (
                            <Tooltip title="Deploy Website to Live URL">
                                <Button
                                    variant="contained"
                                    onClick={handleDeploy}
                                    style={{ height: '32px', borderRadius: '8px', padding: '0 12px', fontSize: '0.8rem', fontWeight: 600 }}
                                    startIcon={<Rocket size={13} />}
                                >
                                    Deploy
                                </Button>
                            </Tooltip>
                        )}
                       
                        <Tooltip title="Open AI Chat">
                            <IconButton
                                onClick={() => setShowChat(true)}
                                className="lg:hidden"
                                style={{ height: '32px', width: '32px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)', background: 'var(--color-bg-elevated)', color: 'var(--color-text-secondary)' }}
                            >
                                <MessageSquare size={15} />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="View Source Code">
                            <IconButton
                                onClick={() => setShowCode(true)}
                                style={{ height: '32px', width: '32px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)', background: 'var(--color-bg-elevated)', color: 'var(--color-text-secondary)' }}
                            >
                                <Code2 size={15} />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Fullscreen Preview">
                            <IconButton
                                onClick={() => setShowFullPreview(true)}
                                style={{ height: '32px', width: '32px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)', background: 'var(--color-bg-elevated)', color: 'var(--color-text-secondary)' }}
                            >
                                <Monitor size={15} />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title={shareCopied ? "Link Copied!" : "Copy Live URL"}>
                            <IconButton
                                onClick={handleShare}
                                style={{ height: '32px', width: '32px', borderRadius: '8px', border: '1px solid transparent', background: 'var(--color-accent-blue)', color: 'var(--color-bg-base)', '&:hover': { background: 'var(--color-accent-blue-hover)' } }}
                            >
                                {shareCopied ? <Check size={15} /> : <Share2 size={15} />}
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>

                <div className='flex-1 bg-[--color-preview-shell] p-4 flex items-center justify-center overflow-hidden'>
                    <div className='h-full w-full bg-white rounded-2xl overflow-hidden border border-[--color-border-subtle] shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] flex flex-col'>
                        {/* Address bar chassis */}
                        <div className='h-8 bg-[--color-bg-elevated] px-4 flex items-center gap-1.5 border-b border-[--color-border-subtle] shrink-0'>
                            <div className='h-2 w-2 rounded-full bg-zinc-300 dark:bg-zinc-700' />
                            <div className='h-2 w-2 rounded-full bg-zinc-300 dark:bg-zinc-700' />
                            <div className='h-2 w-2 rounded-full bg-zinc-300 dark:bg-zinc-700' />
                            <div className='h-4 bg-[--color-bg-surface] rounded border border-[--color-border-subtle] px-2 flex items-center ml-4 gap-1.5' style={{ width: '220px' }}>
                                <div className='h-1.5 w-1.5 rounded-full bg-[--color-accent-green]' />
                                <span className='text-[8px] text-[--color-text-muted] font-medium tracking-wide'>localhost:3000</span>
                            </div>
                        </div>
                        <iframe ref={iframeRef} sandbox='allow-scripts allow-same-origin allow-forms' className='flex-1 w-full border-0 bg-white' />
                    </div>
                </div>
            </div>

            {/* Mobile Chat Drawer */}
            <Drawer
                anchor="right"
                open={showChat}
                onClose={() => setShowChat(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'var(--color-bg-base)',
                    }
                }}
            >
                <div className="flex flex-col h-full">
                    <Header onclose={() => setShowChat(false)} />
                    {renderChat()}
                </div>
            </Drawer>

            {/* Source Code Side Drawer */}
            <Drawer
                anchor="right"
                open={showCode}
                onClose={() => setShowCode(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: { xs: '100%', lg: '45%' },
                        backgroundColor: '#1e1e1e', // Monaco dark mode compatibility
                        borderLeft: '1px solid var(--color-border-subtle)',
                        boxShadow: 'var(--premium-shadow)',
                    }
                }}
            >
                <div className='h-12 px-4 flex justify-between items-center bg-[#1e1e1e] border-b border-zinc-800 shrink-0'>
                    <span className='text-sm font-medium text-zinc-300 font-mono'>index.html</span>
                    <IconButton onClick={() => setShowCode(false)} style={{ color: 'var(--color-text-secondary)' }}>
                        <X size={16} />
                    </IconButton>
                </div>
                <div className='flex-1 overflow-hidden'>
                    <Editor
                        theme='vs-dark'
                        value={code}
                        language='html'
                        onChange={(v) => setCode(v)}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 13,
                            lineNumbers: 'on',
                        }}
                    />
                </div>
            </Drawer>

            {/* Fullscreen Preview Dialog */}
            <Dialog
                fullScreen
                open={showFullPreview}
                onClose={() => setShowFullPreview(false)}
            >
                <div className='relative w-full h-full bg-white'>
                    <iframe className='w-full h-full border-0 bg-white' srcDoc={code} sandbox='allow-scripts allow-same-origin allow-forms'/>
                    <IconButton
                        onClick={() => setShowFullPreview(false)}
                        style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', '&:hover': { backgroundColor: 'rgba(0,0,0,0.8)' } }}
                    >
                        <X size={20} />
                    </IconButton>
                </div>
            </Dialog>
            </div>
        </div>
    )

    function Header({ onclose }) {
        return (
            <div className='h-12 px-4 flex items-center justify-between bg-[--color-bg-surface] border-b border-[--color-border-subtle] shrink-0'>
                <span className='flex min-w-0 items-center gap-2 text-sm text-[--color-text-primary] font-medium'>
                    <Sparkles size={14} className='shrink-0 text-violet-400' />
                    <span>GenWeb AI Workspace</span>
                </span>
                {onclose && (
                    <IconButton onClick={onclose} style={{ color: 'var(--color-text-secondary)' }}>
                        <X size={16} />
                    </IconButton>
                )}
            </div>
        )
    }
}

export default WebsiteEditor
