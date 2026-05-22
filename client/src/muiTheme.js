import { createTheme } from '@mui/material/styles';

export const muiTheme = createTheme({
  typography: {
    fontFamily: 'var(--font-sans)',
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true, // Disable ripple for a more modern, clean feel
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          fontFamily: 'var(--font-sans)',
          textTransform: 'none',
          borderRadius: '10px',
          fontWeight: 500,
          fontSize: '0.875rem',
          padding: '8px 16px',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          backgroundColor: 'var(--color-accent-blue)',
          color: 'var(--color-bg-base)',
          border: '1px solid transparent',
          '&:hover': {
            backgroundColor: 'var(--color-accent-blue-hover)',
          },
          '&:disabled': {
            backgroundColor: 'var(--color-bg-elevated)',
            color: 'var(--color-text-muted)',
            borderColor: 'var(--color-border-subtle)',
          },
        },
        outlined: {
          borderColor: 'var(--color-border-subtle)',
          color: 'var(--color-text-primary)',
          backgroundColor: 'transparent',
          borderWidth: '1px',
          '&:hover': {
            borderColor: 'var(--color-border-strong)',
            backgroundColor: 'var(--color-bg-hover)',
            borderWidth: '1px',
          },
          '&:disabled': {
            borderColor: 'var(--color-border-subtle)',
            color: 'var(--color-text-muted)',
          },
        },
        text: {
          color: 'var(--color-text-secondary)',
          '&:hover': {
            color: 'var(--color-text-primary)',
            backgroundColor: 'var(--color-bg-hover)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: '16px',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.03)',
          backgroundImage: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        root: {
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(8px)',
          },
        },
        paper: {
          backgroundColor: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: '16px',
          boxShadow: 'var(--premium-shadow)',
          backgroundImage: 'none',
          padding: '8px',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          backgroundImage: 'none',
          marginTop: '6px',
        },
        list: {
          padding: '4px',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          color: 'var(--color-text-primary)',
          borderRadius: '8px',
          padding: '6px 12px',
          fontFamily: 'var(--font-sans)',
          transition: 'all 0.15s ease',
          '&:hover': {
            backgroundColor: 'var(--color-bg-hover)',
          },
          '&.Mui-selected': {
            backgroundColor: 'var(--color-bg-hover)',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: 'var(--color-bg-hover)',
            },
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'var(--color-text-primary)',
          color: 'var(--color-bg-base)',
          fontSize: '0.75rem',
          fontFamily: 'var(--font-sans)',
          borderRadius: '6px',
          padding: '6px 10px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        },
        arrow: {
          color: 'var(--color-text-primary)',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: '40px',
        },
        indicator: {
          backgroundColor: 'var(--color-text-primary)',
          height: '2px',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: '0.875rem',
          fontWeight: 500,
          fontFamily: 'var(--font-sans)',
          color: 'var(--color-text-secondary)',
          minHeight: '40px',
          padding: '6px 12px',
          transition: 'all 0.2s ease',
          '&.Mui-selected': {
            color: 'var(--color-text-primary)',
          },
          '&:hover': {
            color: 'var(--color-text-primary)',
            opacity: 0.8,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
            fontFamily: 'var(--font-sans)',
            backgroundColor: 'transparent',
            transition: 'all 0.2s ease',
            '& fieldset': {
              borderColor: 'var(--color-border-subtle)',
              transition: 'all 0.2s ease',
            },
            '&:hover fieldset': {
              borderColor: 'var(--color-border-strong)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'var(--color-text-primary)',
              borderWidth: '1px',
            },
            '& input': {
              color: 'var(--color-text-primary)',
              fontSize: '0.875rem',
              padding: '10px 14px',
            },
            '& textarea': {
              color: 'var(--color-text-primary)',
              fontSize: '0.875rem',
            },
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: 'var(--color-bg-surface)',
          backgroundImage: 'none',
          borderLeft: '1px solid var(--color-border-subtle)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          fontSize: '0.75rem',
          fontFamily: 'var(--font-sans)',
          fontWeight: 500,
          backgroundColor: 'var(--color-bg-elevated)',
          color: 'var(--color-text-secondary)',
          border: '1px solid var(--color-border-subtle)',
          height: '24px',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'var(--color-bg-hover)',
            color: 'var(--color-text-primary)',
          },
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: 'var(--color-bg-elevated)',
          borderRadius: '8px',
        },
      },
    },
  },
});
