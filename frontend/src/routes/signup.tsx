import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button, TextField, Divider } from "@mui/material";
import { useState } from "react";
import { toast } from "sonner";
import { AuthShell, GoogleButton } from "./login";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create account — GenWeb.ai" }, { name: "description", content: "Create your GenWeb.ai account and start building." }] }),
  component: Signup,
});

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  return (
    <AuthShell title="Create your account" subtitle="Free forever. No credit card required.">
      <form onSubmit={(e) => { e.preventDefault(); toast.success("Account created"); navigate({ to: "/dashboard" }); }} className="space-y-3">
        <GoogleButton />
        {/* <Divider sx={{ my: 1, fontSize: 12 }}>OR</Divider>
        <TextField fullWidth label="Name" value={name} onChange={(e) => setName(e.target.value)} required size="small" />
        <TextField fullWidth label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required size="small" />
        <TextField fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required size="small" helperText="Min. 8 characters" />
        <Button type="submit" variant="contained" fullWidth size="large" sx={{ background: "linear-gradient(135deg,#6366f1,#a855f7)", mt: 1 }}>
          Create account
        </Button> */}
      </form>
      <p className="text-sm text-center text-muted-foreground mt-6">
        Already have one? <Link to="/login" className="text-foreground hover:underline">Sign in</Link>
      </p>
    </AuthShell>
  );
}
