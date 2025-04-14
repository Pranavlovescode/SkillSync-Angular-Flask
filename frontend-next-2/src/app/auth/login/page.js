"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { authService } from "@/services/authService"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Github, Mail, LockKeyhole } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await authService.login(email, password)
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        router.push("/home")
      }, 2000)
    } catch (err) {
      setError(err.message || "Failed to login. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F0F1A] relative px-4 py-10">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full opacity-10 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-radial from-violet-800/10 to-transparent"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 rounded-2xl blur-xl opacity-50 transform -rotate-6"></div>

        <Card className="w-full rounded-xl border border-white/10 shadow-2xl bg-black/60 backdrop-blur-xl">
          <CardHeader className="pb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-600/20">
              <LockKeyhole className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl text-center font-bold bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <p className="text-sm text-zinc-400 text-center mt-1">Login to your account</p>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-300">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pl-10 bg-zinc-900/60 border-zinc-800 text-white focus-visible:ring-violet-600 focus-visible:ring-offset-0 focus-visible:border-violet-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-300">
                  Password
                </Label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 h-4 w-4" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 bg-zinc-900/60 border-zinc-800 text-white focus-visible:ring-violet-600 focus-visible:ring-offset-0 focus-visible:border-violet-600"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    className="data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600"
                  />
                  <label htmlFor="remember" className="text-zinc-300 text-sm">
                    Remember me
                  </label>
                </div>
                <Link href="#" className="text-violet-400 hover:text-violet-300 transition-colors">
                  Forgot password?
                </Link>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm animate-pulse">
                  Login successful! Redirecting...
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col gap-5 pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium shadow-lg shadow-violet-600/20 transition-all duration-300"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Logging in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>

              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-800"></div>
                </div>
                <div className="relative px-4 bg-black/60 text-xs text-zinc-500 uppercase tracking-widest">
                  or continue with
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="bg-transparent border-zinc-800 hover:bg-zinc-800/50 text-white">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </Button>
                <Button variant="outline" className="bg-transparent border-zinc-800 hover:bg-zinc-800/50 text-white">
                  <Github className="w-5 h-5 mr-2" />
                  GitHub
                </Button>
              </div>

              <p className="text-center text-sm text-zinc-400">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="text-violet-400 hover:text-violet-300 transition-colors font-medium">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
