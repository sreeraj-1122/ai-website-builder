import React, { useState } from 'react'
import { motion as Motion } from "motion/react"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Sparkles, ArrowRight, Coins, LayoutDashboard, LogOut } from "lucide-react"
import axios from 'axios'

import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

import ThemeToggle from './ThemeToggle'
import { setUserData } from '../redux/userSlice'
import { serverUrl } from '../App'

function Navbar({ onLoginClick, position = "fixed" }) {
    const { userData } = useSelector(state => state.user)
    const [anchorEl, setAnchorEl] = useState(null)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogOut = async () => {
        try {
            await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
            dispatch(setUserData(null))
            setAnchorEl(null)
            navigate("/")
        } catch (error) {
            console.log(error)
        }
    }

    const headerClass = position === "fixed" ? "fixed top-0 left-0 right-0 z-50" : "sticky top-0 z-50"

    return (
        <Motion.header
            initial={{ y: -56, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className={headerClass}
        >
            <div className='glass border-x-0 border-t-0 border-b border-[--color-border-subtle] bg-[--color-bg-base]/80 backdrop-blur-md'>
                <div className='max-w-7xl mx-auto px-5 sm:px-6 h-14 flex justify-between items-center'>
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
                        <Button
                            variant="text"
                            className='hidden md:inline-flex'
                            onClick={() => navigate("/pricing")}
                            style={{ fontSize: '0.85rem', fontWeight: 500 }}
                        >
                            Pricing
                        </Button>

                        <ThemeToggle />

                        {!userData ? (
                            <Button
                                variant="contained"
                                onClick={onLoginClick}
                                style={{ borderRadius: '10px', padding: '6px 16px', fontWeight: 600 }}
                                endIcon={<ArrowRight size={14} />}
                            >
                                Get Started
                            </Button>
                        ) : (
                            <div className='flex items-center gap-3'>
                                {/* Credits Badge */}
                                <div
                                    className='hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[--color-bg-elevated] border border-[--color-border-subtle] text-xs cursor-pointer hover:bg-[--color-bg-hover] transition'
                                    onClick={() => navigate("/pricing")}
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
                                        <MenuItem className='sm:hidden' onClick={() => { navigate("/pricing"); setAnchorEl(null); }}>
                                            <Coins size={15} className='text-[--color-accent-amber] mr-2.5' /> {userData.credits} Credits
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
    )
}

export default Navbar
