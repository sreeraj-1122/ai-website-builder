import React from 'react'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../firebase'
import axios from "axios"
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'
import { X } from 'lucide-react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'

function LoginModal({ open, onClose }) {
    const dispatch = useDispatch()
    
    const handleGoogleAuth = async () => {
        try {
            const result = await signInWithPopup(auth, provider)
            const { data } = await axios.post(`${serverUrl}/api/auth/google`, {
                name: result.user.displayName,
                email: result.user.email,
                avatar: result.user.photoURL
            }, { withCredentials: true })
            dispatch(setUserData(data))
            onClose()
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                style: {
                    padding: 0,
                    overflow: 'hidden',
                    borderRadius: '16px',
                    backgroundColor: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border-subtle)',
                }
            }}
        >
            <div className='relative px-8 pt-14 pb-10 text-center bg-[--color-bg-surface]'>
                <IconButton
                    onClick={onClose}
                    style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--color-text-secondary)' }}
                >
                    <X size={16} />
                </IconButton>

                <div className='mb-6'>
                    <Chip
                        label="AI-powered website builder"
                        size="small"
                        style={{ height: '24px', fontSize: '0.7rem', backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border-subtle)' }}
                    />
                </div>

                <h2 className='text-2xl font-bold leading-tight mb-8 text-[--color-text-primary] font-display'>
                    Welcome to <span className="text-[--color-text-primary]">GenWeb.ai</span>
                </h2>

                <Button
                    variant="contained"
                    onClick={handleGoogleAuth}
                    style={{
                        width: '100%',
                        height: '46px',
                        backgroundColor: 'var(--color-text-primary)',
                        color: 'var(--color-bg-base)',
                        fontWeight: 600,
                        borderRadius: '10px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                    }}
                    startIcon={<img src="https://www.svgrepo.com/show/303108/google-icon-logo.svg" alt="Google" className='h-4.5 w-4.5' />}
                >
                    Continue with Google
                </Button>

                <div className='flex items-center gap-4 my-8'>
                    <div className='h-px flex-1 bg-[--color-border-subtle]' />
                    <span className='text-[10px] text-[--color-text-muted] tracking-wider uppercase font-semibold'>Secure Authentication</span>
                    <div className='h-px flex-1 bg-[--color-border-subtle]' />
                </div>

                <p className='text-xs text-[--color-text-muted] leading-relaxed'>
                    By continuing, you agree to our{" "}
                    <span className="underline cursor-pointer hover:text-[--color-text-secondary] transition">
                        Terms of Service
                    </span>{" "}
                    and{" "}
                    <span className="underline cursor-pointer hover:text-[--color-text-secondary] transition">
                        Privacy Policy
                    </span>.
                </p>
            </div>
        </Dialog>
    )
}

export default LoginModal
