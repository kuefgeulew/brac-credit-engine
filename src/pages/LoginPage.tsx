import type { FormEvent } from 'react'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    navigate('/dashboard')
  }

  return (
    <div className="page-enter relative flex min-h-screen min-h-[100dvh] flex-col overflow-hidden">
      {/* Diagonal gradient background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, #003D7A 0%, #0052A5 50%, #1B6CC8 100%)',
        }}
        aria-hidden
      />

      {/* Decorative circles (5% white) */}
      <div
        className="pointer-events-none absolute -left-32 -top-32 size-[28rem] rounded-full bg-white/[0.05]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 top-1/4 size-[22rem] rounded-full bg-white/[0.05]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-40 left-1/4 size-[32rem] rounded-full bg-white/[0.05]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-12 -right-16 size-[18rem] rounded-full bg-white/[0.05]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-8 size-[20rem] -translate-x-1/2 rounded-full bg-white/[0.05]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-20 bottom-1/3 size-[24rem] rounded-full bg-white/[0.05]"
        aria-hidden
      />

      <div className="relative z-10 flex min-h-0 w-full flex-1 flex-col items-center justify-center px-4 py-8 md:py-10">
        <div className="w-full max-w-[440px] rounded-2xl border-t-[3px] border-t-[#0052A5] bg-card-white p-12 shadow-[0_25px_50px_rgba(0,0,0,0.25)]">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2.5">
              <div
                className="size-2.5 shrink-0 rounded-[2px] bg-[#0052A5]"
                aria-hidden
              />
              <div className="text-[28px] leading-tight">
                <span className="font-bold text-primary">BRAC</span>
                <span className="font-normal text-text-primary"> Bank</span>
              </div>
            </div>
            <p className="mt-2 text-[13px] text-text-secondary">
              Credit Analysis Portal
            </p>
          </div>

          <div className="my-8 h-px w-full bg-border" aria-hidden />

          <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
            <div className="relative">
              <input
                id="login-email"
                name="email"
                type="text"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                className="peer h-12 w-full rounded-lg border border-border bg-transparent px-3 pb-2 pt-5 text-sm text-text-primary outline-none transition-shadow placeholder:text-transparent focus:border-transparent focus:ring-2 focus:ring-primary"
              />
              <label
                htmlFor="login-email"
                className="pointer-events-none absolute left-3 top-1/2 z-10 origin-[0] -translate-y-1/2 text-sm text-text-secondary transition-all duration-200 peer-focus:top-3 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-primary peer-[&:not(:placeholder-shown)]:top-3 peer-[&:not(:placeholder-shown)]:translate-y-0 peer-[&:not(:placeholder-shown)]:text-xs"
              >
                Email
              </label>
            </div>

            <div className="group relative">
              <input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
                className="peer h-12 w-full rounded-lg border border-border bg-transparent pb-2 pl-3 pr-11 pt-5 text-sm text-text-primary outline-none transition-shadow placeholder:text-transparent focus:border-transparent focus:ring-2 focus:ring-primary"
              />
              <label
                htmlFor="login-password"
                className="pointer-events-none absolute left-3 top-1/2 z-10 origin-[0] -translate-y-1/2 text-sm text-text-secondary transition-all duration-200 peer-focus:top-3 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-primary group-focus-within:top-3 group-focus-within:translate-y-0 group-focus-within:text-xs group-focus-within:text-primary peer-[&:not(:placeholder-shown)]:top-3 peer-[&:not(:placeholder-shown)]:translate-y-0 peer-[&:not(:placeholder-shown)]:text-xs"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="size-[18px]" strokeWidth={2} />
                ) : (
                  <Eye className="size-[18px]" strokeWidth={2} />
                )}
              </button>
            </div>

            <button
              type="submit"
              className="mt-1 flex h-12 w-full items-center justify-center rounded-lg bg-primary text-sm font-bold text-card-white transition-colors hover:bg-primary-dark"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
