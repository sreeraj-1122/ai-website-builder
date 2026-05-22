import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion as Motion } from "motion/react"
import LoginModal from '../components/LoginModal'
import { useDispatch, useSelector } from 'react-redux'
import { Code2, Coins, Globe, Sparkles, Wand2, ArrowRight, Zap, Layers, LogOut, LayoutDashboard, Clock } from "lucide-react"
import { serverUrl } from '../App'
import axios from 'axios'
import { setUserData } from '../redux/userSlice'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

// MUI Imports
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Skeleton from '@mui/material/Skeleton'

function Home() {
    const highlights = [
        {
            title: "AI Generated Code",
            icon: Code2,
            desc: "Production-ready HTML, CSS, and JS — no templates, no shortcuts. Real code built for real projects.",
            tag: "Powered by Claude"
        },
        {
            title: "Fully Responsive",
            icon: Layers,
            desc: "Every layout adapts flawlessly across devices. Mobile-first, desktop-polished, always pixel-perfect.",
            tag: "All breakpoints"
        },
        {
            title: "Ship Instantly",
            icon: Zap,
            desc: "Deploy your site with one click. Get a live URL to share, embed, or build on — in seconds.",
            tag: "One-click deploy"
        },
    ]

    const [openLogin, setOpenLogin] = useState(false)
    const { userData } = useSelector(state => state.user)
    const [websites, setWebsites] = useState(null)
    const [loadingWebsites, setLoadingWebsites] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (!userData) return;
        const handleGetAllWebsites = async () => {
            setLoadingWebsites(true)
            try {
                const result = await axios.get(`${serverUrl}/api/website/get-all`, { withCredentials: true })
                setWebsites(result.data || [])
            } catch (error) {
                console.log(error)
            } finally {
                setLoadingWebsites(false)
            }
        }
        handleGetAllWebsites()
    }, [userData])

    return (
        <div className='relative min-h-screen bg-[--color-bg-base] text-[--color-text-primary] overflow-x-hidden'>

            <Navbar onLoginClick={() => setOpenLogin(true)} />


            {/* ── HERO ── */}
            <section className='max-w-7xl mx-auto pt-28 md:pt-36 pb-28 px-5 sm:px-6'>
                <div className='text-center lg:text-left grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center'>
                    <div>
                        <Motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className='inline-flex items-center gap-2 rounded-full border border-[--color-border-subtle] bg-[--color-bg-elevated] px-3.5 py-1.5 text-xs text-[--color-text-secondary] mb-8'
                        >
                            <span className='h-1.5 w-1.5 rounded-full bg-[--color-accent-green] animate-pulse' />
                            AI website builder · production-ready output
                        </Motion.div>

                        <Motion.h1
                            initial={{ opacity: 0, y: 28 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.16, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                            className="font-display text-5xl sm:text-6xl md:text-[4.5rem] font-800 tracking-tight leading-[1.01] text-[--color-text-primary]"
                        >
                            Build stunning<br />
                            websites <span className='gradient-text'>with AI</span>
                        </Motion.h1>

                        <Motion.p
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.26 }}
                            className='mt-6 max-w-lg mx-auto lg:mx-0 text-[--color-text-secondary] text-lg leading-relaxed'
                        >
                            Describe your idea and watch AI generate a modern,
                            responsive, production-ready website in minutes.
                        </Motion.p>

                        <Motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.34 }}
                            className='mt-9 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start'
                        >
                            <Button
                                variant="contained"
                                onClick={() => userData ? navigate("/dashboard") : setOpenLogin(true)}
                                style={{ borderRadius: '12px', padding: '14px 28px', fontWeight: 600 }}
                                endIcon={<ArrowRight size={16} strokeWidth={2.5} />}
                            >
                                {userData ? "Go to dashboard" : "Start building free"}
                            </Button>
                            {!userData && (
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate("/pricing")}
                                    style={{ borderRadius: '12px', padding: '14px 28px', fontWeight: 500 }}
                                >
                                    View pricing
                                </Button>
                            )}
                        </Motion.div>

                        {!userData && (
                            <Motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.44 }}
                                className='mt-4 text-xs text-[--color-text-muted]'
                            >
                                No credit card required · 3 free websites to start
                            </Motion.p>
                        )}
                    </div>

                    {/* Browser Mockup */}
                    <Motion.div
                        initial={{ opacity: 0, y: 32, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className='hidden lg:block'
                    >
                        <Card className='relative rounded-2xl overflow-hidden border border-[--color-border-subtle] shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)]' style={{ background: 'var(--color-bg-base)', border: '1px solid var(--color-border-subtle)' }}>
                            {/* Browser chrome */}
                            <div className='bg-[--color-bg-elevated] px-4 py-3 flex items-center gap-3 border-b border-[--color-border-subtle]'>
                                <div className='flex gap-1.5'>
                                    <span className='h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700' />
                                    <span className='h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700' />
                                    <span className='h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700' />
                                </div>
                                <div className='flex-1 mx-4'>
                                    <div className='h-6 rounded-md bg-[--color-bg-hover] flex items-center px-3 gap-2 border border-[--color-border-subtle]'>
                                        <div className='h-2 w-2 rounded-full bg-[--color-accent-green] opacity-80' />
                                        <span className='text-[10px] text-[--color-text-muted]'>preview.genweb.ai</span>
                                    </div>
                                </div>
                            </div>
                            {/* Preview content */}
                            <div className='bg-[--color-bg-base] p-6'>
                                {/* Hero bar */}
                                <div className='h-32 rounded-xl bg-[--color-bg-elevated] border border-[--color-border-subtle] mb-5 flex items-end p-4'>
                                    <div className='space-y-2'>
                                        <div className='h-3.5 w-36 rounded-full bg-[--color-text-primary] opacity-20' />
                                        <div className='h-2.5 w-24 rounded-full bg-[--color-text-secondary] opacity-15' />
                                    </div>
                                </div>
                                {/* Text lines */}
                                <div className='h-2.5 w-2/3 rounded-full bg-[--color-border-subtle] mb-2.5' />
                                <div className='h-2.5 w-5/6 rounded-full bg-[--color-border-subtle] mb-6' opacity={0.6} />
                                {/* Cards row */}
                                <div className='grid grid-cols-3 gap-3'>
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className='h-20 rounded-lg bg-[--color-bg-elevated] border border-[--color-border-subtle] p-3'>
                                            <div className='h-5 w-5 rounded-md bg-[--color-text-primary] opacity-10 mb-2.5' />
                                            <div className='h-2 rounded-full bg-[--color-border-strong] mb-1.5' />
                                            <div className='h-2 rounded-full bg-[--color-border-subtle] w-3/4' />
                                        </div>
                                    ))}
                                </div>
                                {/* Button skeleton */}
                                <div className='mt-5 flex gap-2'>
                                    <div className='h-8 w-28 rounded-lg bg-[--color-text-primary] opacity-10' />
                                    <div className='h-8 w-20 rounded-lg bg-[--color-bg-elevated] border border-[--color-border-subtle]' />
                                </div>
                            </div>
                        </Card>
                    </Motion.div>
                </div>
            </section>

            {/* ── HIGHLIGHTS ── */}
            {!userData && (
                <section className='max-w-7xl mx-auto px-5 sm:px-6 pb-32'>
                    {/* Section label */}
                    <Motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className='mb-12 text-center'
                    >
                        <p className='text-xs uppercase tracking-[0.2em] text-[--color-text-muted] mb-3'>What you get</p>
                        <h2 className='font-display text-3xl font-700 tracking-tight'>Built different</h2>
                    </Motion.div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                        {highlights.map((h, i) => (
                            <Motion.div
                                key={i}
                                initial={{ opacity: 0, y: 36 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -4 }}
                                className="flex"
                            >
                                <Card className="relative group w-full p-7 overflow-hidden flex flex-col justify-between hover:border-[--color-border-strong]" style={{ background: 'var(--color-bg-surface)' }}>
                                    <div>
                                        <div className='mb-5 inline-flex items-center justify-center h-10 w-10 rounded-xl bg-[--color-bg-elevated] border border-[--color-border-subtle]'>
                                            <h.icon size={18} className='text-[--color-text-primary]' />
                                        </div>

                                        <div className="mb-3">
                                            <Chip label={h.tag} size="small" style={{ fontSize: '0.65rem' }} />
                                        </div>
                                        <h3 className='font-display text-lg font-600 tracking-tight mb-2'>{h.title}</h3>
                                        <p className='text-sm text-[--color-text-secondary] leading-relaxed'>{h.desc}</p>
                                    </div>
                                </Card>
                            </Motion.div>
                        ))}
                    </div>
                </section>
            )}

            {/* ── RECENT WEBSITES ── */}
            {userData && (loadingWebsites || websites?.length > 0) && (
                <section className='max-w-7xl mx-auto px-5 sm:px-6 pb-32'>
                    {/* Section Header */}
                    <div className='flex items-center justify-between mb-12'>
                        <div>
                            <p className='text-xs uppercase tracking-[0.2em] text-[--color-text-muted] font-bold mb-3'>Your projects</p>
                            <h2 className='font-display text-4xl font-800 tracking-tight'>Recently edited</h2>
                        </div>
                        <Button
                            variant="outlined"
                            onClick={() => navigate("/dashboard")}
                            endIcon={<ArrowRight size={14} />}
                            style={{ fontWeight: 600, borderRadius: '99px', padding: '8px 20px' }}
                        >
                            View all
                        </Button>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                        {loadingWebsites ? (
                            [...Array(3)].map((_, i) => (
                                <Card key={i} className="group rounded-3xl overflow-hidden w-full border border-[--color-border-subtle] shadow-sm p-4" style={{ background: 'var(--color-bg-surface)' }}>
                                    <Skeleton variant="rectangular" width="100%" height={200} style={{ borderRadius: '16px' }} />
                                    <div className='mt-6 space-y-3 px-2'>
                                        <Skeleton variant="text" width="60%" height={28} />
                                        <div className='flex justify-between items-center'>
                                            <Skeleton variant="text" width="40%" height={20} />
                                            <Skeleton variant="circular" width={24} height={24} />
                                        </div>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            websites.slice(0, 3).map((w, i) => (
                                <Motion.div
                                    key={w._id}
                                    initial={{ opacity: 0, y: 24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                    whileHover={{ y: -8 }}
                                    onClick={() => navigate(`/editor/${w._id}`)}
                                    className="flex"
                                >
                                    <Card className="group cursor-pointer rounded-3xl overflow-hidden w-full transition-all duration-300 hover:border-[--color-border-strong] hover:shadow-xl hover:shadow-[--color-bg-hover] p-2" style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-subtle)' }}>
                                        {/* Preview Container */}
                                        <div className='relative h-52 bg-[--color-preview-shell] overflow-hidden rounded-2xl border border-[--color-border-subtle]'>
                                            <iframe
                                                srcDoc={w.latestCode}
                                                className='absolute inset-0 w-[143%] h-[143%] scale-[0.7] origin-top-left pointer-events-none bg-white'
                                                title={w.title}
                                            />
                                            {/* Overlay gradient on hover */}
                                            <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400' />
                                            {/* Edit Icon */}
                                            <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400 transform group-hover:scale-100 scale-90'>
                                                <div className='h-12 w-12 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center shadow-2xl'>
                                                    <Wand2 size={20} className='text-white' />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Info Section */}
                                        <div className='px-4 py-5 flex flex-col justify-between flex-1 gap-3'>
                                            <h3 className='font-bold text-lg line-clamp-1 text-[--color-text-primary] group-hover:text-[--color-accent-blue] transition-colors'>{w.title}</h3>
                                            <div className='flex items-center justify-between'>
                                                <p className='text-sm text-[--color-text-secondary] flex items-center gap-1.5 font-medium'>
                                                    <Clock size={14} className="opacity-70" />
                                                    {new Date(w.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </p>
                                                <div className="h-7 w-7 rounded-full bg-[--color-bg-elevated] grid place-items-center border border-[--color-border-subtle] group-hover:bg-[--color-text-primary] group-hover:text-[--color-bg-base] transition-colors">
                                                    <ArrowRight size={14} />
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </Motion.div>
                            ))
                        )}
                    </div>
                </section>
            )}

            {/* ── FOOTER ── */}
            <footer className='border-t border-[--color-border-subtle] pt-16 pb-8 px-5 mt-16 bg-gradient-to-b from-[--color-bg-base] to-[--color-bg-surface] relative overflow-hidden'>
                {/* Decorative glow */}
                <div className='absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[--color-accent-blue] opacity-[0.03] blur-[120px] rounded-full pointer-events-none' />
                
                <div className='max-w-7xl mx-auto relative z-10'>
                    {/* Footer Content */}
                    <div className='grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 mb-16'>
                        {/* Brand */}
                        <div className='md:col-span-5 lg:col-span-4'>
                            <div className='flex items-center gap-3 mb-6'>
                                <div className='h-9 w-9 rounded-xl bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-950 dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-50 grid place-items-center shadow-lg border border-[--color-border-subtle]'>
                                    <Sparkles size={16} className='text-white dark:text-black' />
                                </div>
                                <span className='font-display text-xl font-800 tracking-tight'>GenWeb.ai</span>
                            </div>
                            <p className='text-sm text-[--color-text-secondary] leading-relaxed max-w-sm font-medium'>
                                The AI-powered website builder. Create stunning, production-ready sites in minutes without writing a single line of code.
                            </p>
                        </div>

                        {/* Product */}
                        <div className='md:col-span-2 lg:col-span-2 lg:col-start-7'>
                            <h4 className='text-sm font-bold mb-6 text-[--color-text-primary] uppercase tracking-wider'>Product</h4>
                            <ul className='space-y-4'>
                                <li><a href="#" className='text-sm font-medium text-[--color-text-secondary] hover:text-[--color-text-primary] transition-colors'>Features</a></li>
                                <li><a href="#" className='text-sm font-medium text-[--color-text-secondary] hover:text-[--color-text-primary] transition-colors'>Pricing</a></li>
                                <li><a href="#" className='text-sm font-medium text-[--color-text-secondary] hover:text-[--color-text-primary] transition-colors'>Changelog</a></li>
                            </ul>
                        </div>

                        {/* Company */}
                        <div className='md:col-span-2 lg:col-span-2'>
                            <h4 className='text-sm font-bold mb-6 text-[--color-text-primary] uppercase tracking-wider'>Company</h4>
                            <ul className='space-y-4'>
                                <li><a href="#" className='text-sm font-medium text-[--color-text-secondary] hover:text-[--color-text-primary] transition-colors'>About</a></li>
                                <li><a href="#" className='text-sm font-medium text-[--color-text-secondary] hover:text-[--color-text-primary] transition-colors'>Blog</a></li>
                                <li><a href="#" className='text-sm font-medium text-[--color-text-secondary] hover:text-[--color-text-primary] transition-colors'>Contact</a></li>
                            </ul>
                        </div>

                        {/* Legal */}
                        <div className='md:col-span-3 lg:col-span-2'>
                            <h4 className='text-sm font-bold mb-6 text-[--color-text-primary] uppercase tracking-wider'>Legal</h4>
                            <ul className='space-y-4'>
                                <li><a href="#" className='text-sm font-medium text-[--color-text-secondary] hover:text-[--color-text-primary] transition-colors'>Privacy Policy</a></li>
                                <li><a href="#" className='text-sm font-medium text-[--color-text-secondary] hover:text-[--color-text-primary] transition-colors'>Terms of Service</a></li>
                                <li><a href="#" className='text-sm font-medium text-[--color-text-secondary] hover:text-[--color-text-primary] transition-colors'>Cookie Policy</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Footer Bottom */}
                    <div className='flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-[--color-border-subtle]'>
                        <p className='text-sm font-medium text-[--color-text-muted]'>
                            &copy; {new Date().getFullYear()} GenWeb.ai. All rights reserved.
                        </p>
                        <div className='flex items-center gap-8'>
                            <a href="#" className='text-sm font-medium text-[--color-text-secondary] hover:text-[--color-text-primary] transition-colors'>Twitter</a>
                            <a href="#" className='text-sm font-medium text-[--color-text-secondary] hover:text-[--color-text-primary] transition-colors'>GitHub</a>
                            <a href="#" className='text-sm font-medium text-[--color-text-secondary] hover:text-[--color-text-primary] transition-colors'>Discord</a>
                        </div>
                    </div>
                </div>
            </footer>

            {openLogin && <LoginModal open={openLogin} onClose={() => setOpenLogin(false)} />}
        </div>
    )
}

export default Home