import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button, TextField, Divider } from "@mui/material";
import { Logo } from "@/components/navbar";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/lib/firebase";
import { api } from "@/lib/api";
import { useUser } from "@/lib/user-store";
export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Lumen" }, { name: "description", content: "Sign in to your Lumen account." }] }),
  component: Login,
});

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  return <AuthShell title="Welcome back" subtitle="Sign in to continue building.">
    <form onSubmit={(e) => { e.preventDefault(); toast.success("Signed in"); navigate({ to: "/dashboard" }); }} className="space-y-3">
      <GoogleButton />
      <Divider sx={{ my: 1, fontSize: 12 }}>OR</Divider>
      <TextField fullWidth label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required size="small" />
      <TextField fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required size="small" />
      <Button type="submit" variant="contained" fullWidth size="large" sx={{ background: "linear-gradient(135deg,#6366f1,#a855f7)", mt: 1 }}>
        Sign in
      </Button>
    </form>
    <p className="text-sm text-center text-muted-foreground mt-6">
      No account? <Link to="/signup" className="text-foreground hover:underline">Create one</Link>
    </p>
  </AuthShell>;
}

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="relative hidden lg:block overflow-hidden border-r">
        <div className="absolute inset-0 bg-hero" />
        <div className="absolute inset-0 grid-bg" />
        <div className="relative h-full flex flex-col justify-between p-12">
          <Link to="/"><Logo /></Link>
          <div>
            <h2 className="text-4xl font-bold tracking-tight leading-tight">Design at the <span className="text-gradient">speed of thought.</span></h2>
            <p className="mt-4 text-muted-foreground max-w-md">Lumen turns prompts into beautiful, production-ready websites — with live preview and editable code.</p>
          </div>
          <div className="text-xs text-muted-foreground">© Lumen Labs</div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex justify-between items-center p-6 lg:hidden">
          <Link to="/"><Logo /></Link>
          <ThemeToggle />
        </div>
        <div className="hidden lg:flex justify-end p-6"><ThemeToggle /></div>
        <div className="flex-1 grid place-items-center p-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-sm">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <p className="mt-2 text-muted-foreground">{subtitle}</p>
            <div className="mt-8">{children}</div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export function GoogleButton() {
  const navigate = useNavigate();
  const setUser = useUser((state) => state.setUser);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const { data } = await api.post(`/api/auth/google`, {
        name: result.user.displayName,
        email: result.user.email,
        avatar: result.user.photoURL,
      });
      if (data && data._id) {
        setUser(data);
        toast.success("Signed in with Google");
        navigate({ to: "/dashboard" });
      } else {
        toast.error("Failed to sign in");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during sign in");
    }
  };

  return (
    <Button
      fullWidth
      variant="outlined"
      onClick={handleGoogleLogin}
      startIcon={
        <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
      }
    >
      Continue with Google
    </Button>
  );
}
