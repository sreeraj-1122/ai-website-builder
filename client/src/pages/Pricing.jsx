import { ArrowLeft, Check, Coins, Sparkles, ArrowRight, LayoutDashboard, LogOut } from 'lucide-react';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

import { motion as Motion } from "motion/react"
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';
import ThemeToggle from '../components/ThemeToggle';
import { setUserData } from '../redux/userSlice';

// MUI Imports
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

const plans = [
    {
        key: "free",
        name: "Free",
        price: "₹0",
        credits: 100,
        description: "Perfect to explore GenWeb.ai",
        features: [
            "AI website generation",
            "Responsive HTML output",
            "Basic animations",
        ],
        popular: false,
        button: "Get Started",
    },
    {
        key: "pro",
        name: "Pro",
        price: "₹499",
        credits: 500,
        description: "For serious creators & freelancers",
        features: [
            "Everything in Free",
            "Faster generation",
            "Edit & regenerate",
        ],
        popular: true,
        button: "Upgrade to Pro",
    },
    {
        key: "enterprise",
        name: "Enterprise",
        price: "₹1499",
        credits: 1000,
        description: "For teams & power users",
        features: [
            "Unlimited iterations",
            "Highest priority",
            "Team collaboration",
            "Dedicated support",
        ],
        popular: false,
        button: "Contact Sales",
    },
];

function Pricing() {
    const navigate = useNavigate()
    const { userData } = useSelector(state => state.user)
    const [loading, setLoading] = useState(null)
    const [anchorEl, setAnchorEl] = useState(null)
    const dispatch = useDispatch()

    const handleLogOut = async () => {
        try {
            await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
            dispatch(setUserData(null))
            setAnchorEl(null)
        } catch (error) {
            console.log(error)
        }
    }

    const handleBuy = async (planKey) => {
        if (!userData) {
            navigate("/")
            return
        }
        if (planKey === "free") {
            navigate("/dashboard")
            return
        }
        setLoading(planKey)
        try {
            const result = await axios.post(`${serverUrl}/api/billing`, { planType: planKey }, { withCredentials: true })
            window.location.assign(result.data.sessionUrl)
        } catch (error) {
            console.log(error)
            setLoading(null)
        }
    }

    return (
        <div className='relative min-h-screen overflow-x-hidden bg-[--color-bg-base] text-[--color-text-primary] px-5 sm:px-6 pt-24 pb-24'>
            {/* ── NAVBAR ── */}
            <Motion.header
                initial={{ y: -56, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className='fixed top-0 left-0 right-0 z-50'
            >
                <div className='glass border-x-0 border-t-0 border-b border-[--color-border-subtle]'>
                    <div className='max-w-7xl mx-auto px-6 h-14 flex justify-between items-center'>
                        {/* Logo */}
                        <div className='flex items-center gap-3 cursor-pointer select-none' onClick={() => navigate("/")}>
                            <div className='h-8 w-8 rounded-xl bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-950 dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-50 grid place-items-center shadow-lg border border-[--color-border-subtle]'>
                                <Sparkles size={14} className='text-white dark:text-black' />
                            </div>
                            <span className='font-display font-700 text-lg tracking-tight'>
                                GenWeb<span className='text-[--color-text-secondary]'>.ai</span>
                            </span>
                        </div>

                        {/* Right */}
                        <div className='flex items-center gap-3'>
                            <ThemeToggle />

                            {!userData ? (
                                <Button
                                    variant="contained"
                                    onClick={() => navigate("/")}
                                    style={{ borderRadius: '10px', padding: '6px 16px', fontWeight: 600 }}
                                    endIcon={<ArrowRight size={14} />}
                                >
                                    Get Started
                                </Button>
                            ) : (
                                <div className='flex items-center gap-3'>
                                    {/* Credits Badge */}
                                    <div
                                        className='hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[--color-bg-elevated] border border-[--color-border-subtle] text-xs'
                                    >
                                        <Coins size={12} className='text-[--color-accent-amber]' />
                                        <span className='font-semibold text-[--color-text-primary]'>{userData.credits}</span>
                                    </div>

                                    {/* Profile Menu */}
                                    <div>
                                        <button
                                            className='flex items-center justify-center h-9 w-9 rounded-full bg-[--color-bg-hover] transition hover:bg-[--color-border-strong] cursor-pointer outline-none border-0'
                                            onClick={(e) => setAnchorEl(e.currentTarget)}
                                            title={userData.name}
                                        >
                                            <Avatar
                                                src={userData?.avatar || `https://ui-avatars.com/api/?name=${userData.name}`}
                                                alt={userData.name}
                                                slotProps={{ img: { referrerPolicy: 'no-referrer' } }}
                                                style={{ width: 36, height: 36 }}
                                            />
                                        </button>

                                        <Menu
                                            anchorEl={anchorEl}
                                            open={Boolean(anchorEl)}
                                            onClose={() => setAnchorEl(null)}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'right',
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                        >
                                            <div className='px-4 py-2.5 border-b border-[--color-border-subtle] mb-1.5' style={{ width: 220 }}>
                                                <p className='text-sm font-semibold truncate text-[--color-text-primary]'>{userData.name}</p>
                                                <p className='text-xs text-[--color-text-muted] truncate mt-0.5'>{userData.email}</p>
                                            </div>
                                            <MenuItem onClick={() => { navigate("/dashboard"); setAnchorEl(null); }}>
                                                <LayoutDashboard size={15} className='text-[--color-text-secondary] mr-2.5' /> Dashboard
                                            </MenuItem>
                                            <MenuItem onClick={() => { handleLogOut(); setAnchorEl(null); }} style={{ color: 'var(--color-accent-red)' }}>
                                                <LogOut size={15} className='mr-2.5' /> Logout
                                            </MenuItem>
                                        </Menu>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Motion.header>

            <Motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 max-w-4xl mx-auto text-center mb-16"
            >
                <h1 className='text-4xl md:text-5xl font-bold mb-4 tracking-tight text-[--color-text-primary]'>Simple, transparent pricing</h1>
                <p className='text-[--color-text-secondary] text-lg'>Buy credits once. Build anytime.</p>
            </Motion.div>

            <div className='relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6'>
                {plans.map((p, i) => (
                    <Motion.div
                        key={i}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.12 }}
                        whileHover={{ y: -10 }}
                        className="flex"
                    >
                        <Card
                            className="relative p-7 flex flex-col justify-between w-full hover:border-[--color-border-strong]"
                            style={{
                                background: 'var(--color-bg-surface)',
                                border: p.popular ? '1px solid var(--color-text-primary)' : '1px solid var(--color-border-subtle)',
                                boxShadow: p.popular ? '0 10px 40px rgba(0, 0, 0, 0.05)' : 'none',
                            }}
                        >
                            {p.popular && (
                                <div className='absolute top-5 right-5'>
                                    <Chip
                                        label="Popular"
                                        size="small"
                                        style={{ height: '22px', fontSize: '0.65rem', backgroundColor: 'var(--color-text-primary)', color: 'var(--color-bg-base)', border: '0' }}
                                    />
                                </div>
                            )}

                            <div>
                                <h2 className='text-xl font-semibold mb-2 text-[--color-text-primary]'>{p.name}</h2>
                                <p className='text-[--color-text-secondary] text-sm mb-6'>{p.description}</p>
                                <div className='flex items-end gap-1 mb-4'>
                                    <span className='text-4xl font-bold text-[--color-text-primary]'>{p.price}</span>
                                    <span className='text-sm text-[--color-text-secondary] mb-1'>/one-time</span>
                                </div>

                                <div className='flex items-center gap-2 mb-8'>
                                    <Coins size={16} className='text-[--color-accent-amber]' />
                                    <span className='font-semibold text-sm text-[--color-text-primary]'>{p.credits} Credits</span>
                                </div>

                                <ul className='space-y-3.5 mb-10'>
                                    {p.features.map((f) => (
                                        <li
                                            key={f}
                                            className='flex items-center gap-2.5 text-sm text-[--color-text-secondary]'
                                        >
                                            <Check size={15} className='text-[--color-accent-green] shrink-0' />
                                            <span>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Button
                                variant={p.popular ? "contained" : "outlined"}
                                disabled={loading !== null}
                                onClick={() => handleBuy(p.key)}
                                style={{ width: '100%', height: '42px', borderRadius: '10px', fontWeight: 600 }}
                            >
                                {loading === p.key ? "Redirecting..." : p.button}
                            </Button>
                        </Card>
                    </Motion.div>
                ))}
            </div>
        </div>
    )
}

export default Pricing
