"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Check, Star } from "lucide-react";
import { clsx } from "clsx";
import { ThemeToggle } from "@/components/ThemeToggle";

const features = [
  "Effortlessly spider and map targets to uncover hidden security flaws",
  "Deliver high-quality, validated findings in hours, not weeks.",
  "Generate professional, enterprise-grade security reports automatically.",
];

const inputBase =
  "w-full px-4 py-3 rounded-xl text-sm border bg-white dark:bg-[#111111] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none transition-colors";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signup" | "login">("signup");

  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });

  const [loginLoading, setLoginLoading] = useState(false);
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  }

  function handleLoginChange(e: React.ChangeEvent<HTMLInputElement>) {
    setLoginForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setLoginErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  }

  function switchMode(next: "signup" | "login") {
    setMode(next);
    setErrors({});
    setLoginErrors({});
  }

  function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.firstName.trim()) errs.firstName = "First name is required";
    if (!form.lastName.trim()) errs.lastName = "Last name is required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Enter a valid email address";
    if (!form.password.trim()) errs.password = "Password is required";
    if (!agreed) errs.agreed = "You must accept the terms";
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    setTimeout(() => router.push("/dashboard"), 900);
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!loginForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.email))
      errs.email = "Enter a valid email address";
    if (loginForm.password.length < 5)
      errs.password = "Password must be more than 4 characters";
    if (Object.keys(errs).length > 0) { setLoginErrors(errs); return; }
    setLoginLoading(true);
    setTimeout(() => router.push("/dashboard"), 900);
  }

  return (
    <div className="min-h-screen lg:h-screen max-w-[1600px] mx-auto flex items-center justify-between px-4 sm:px-8 lg:px-16 bg-[#0F0F0F] relative overflow-x-hidden lg:overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 login-bg-gradient" />
        <div className="absolute rounded-full w-[1500px] h-[1450px] -bottom-[900px] -right-[650px] bg-[#D4A017] blur-[60px] opacity-90" />
        <div className="absolute rounded-full w-[1500px] h-[1450px] -bottom-[950px] -right-[700px] bg-[#C43520] blur-[60px] opacity-90" />
        <div className="absolute rounded-full w-[1500px] h-[1450px] -bottom-[1000px] -right-[750px] circle-red-black blur-[60px]" />
      </div>

      <div className="absolute top-5 left-5 z-20 flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-teal flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-white/80" />
        </div>
        <span className="text-base font-bold tracking-tight text-white">aps</span>
      </div>

      <div className="absolute top-5 right-5 z-20">
        <ThemeToggle />
      </div>

      <div className="hidden lg:flex flex-col justify-center relative z-10">
        <div className="space-y-8">
          <h1 className="text-4xl xl:text-5xl font-normal text-white leading-tight tracking-tight">
            Expert level Cybersecurity
            <br />
            in <span className="text-teal">hours</span> not weeks.
          </h1>

          <div className="space-y-3">
            <p className="text-xl font-medium text-gray-200">What&apos;s included</p>
            <ul className="space-y-3">
              {features.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-teal/20 border border-teal/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={11} className="text-teal" strokeWidth={3} />
                  </div>
                  <span className="text-md font-normal text-gray-300 leading-relaxed">{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Star size={14} className="text-green-400 fill-green-400" />
              <span className="text-sm font-normal text-white">Trustpilot</span>
            </div>
            <p className="text-xl font-normal text-gray-300">
              <span className="font-normal text-white">Rated 4.5/5.0</span>{" "}
              <span className="text-gray-400">(100k+ reviews)</span>
            </p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-auto flex flex-col justify-center items-center relative z-10 py-16 lg:py-0">
        <div className="lg:hidden w-full max-w-[420px] mb-3">
          <h2 className="text-xl font-normal text-white leading-snug">
            Expert level security in <span className="text-teal">hours</span> not weeks.
          </h2>
        </div>

        <div className={clsx("w-full max-w-[420px] lg:w-[520px] lg:max-w-[520px] flex-shrink-0 bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-2xl px-6 sm:px-8", mode === "login" ? "py-6 sm:py-7" : "py-7 sm:py-9")}>
          {mode === "login" ? (
            <>
              <h2 className="text-2xl font-normal tracking-tight text-center text-gray-900 dark:text-white mb-1">Log in</h2>
              <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-5">
                Don&apos;t have an account?{" "}
                <button onClick={() => switchMode("signup")} className="text-teal hover:underline font-medium cursor-pointer">
                  Sign up
                </button>
              </p>

              <form onSubmit={handleLogin} className="space-y-3" noValidate>
                <div>
                  <input
                    name="email"
                    type="email"
                    placeholder="Email address"
                    value={loginForm.email}
                    onChange={handleLoginChange}
                    autoFocus
                    className={clsx(inputBase, loginErrors.email ? "border-red-400" : "border-gray-200 dark:border-white/10 focus:border-teal")}
                  />
                  {loginErrors.email && <p className="text-xs text-red-400 mt-1 px-1">{loginErrors.email}</p>}
                </div>

                <div>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={loginForm.password}
                      onChange={handleLoginChange}
                      className={clsx(inputBase, "pr-11", loginErrors.password ? "border-red-400" : "border-gray-200 dark:border-white/10 focus:border-teal")}
                    />
                    <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {loginErrors.password && <p className="text-xs text-red-400 mt-1 px-1">{loginErrors.password}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-3 rounded-xl bg-teal hover:bg-teal-hover text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loginLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Logging in...
                    </>
                  ) : "Log in"}
                </button>
              </form>

              <div className="grid grid-cols-3 gap-3 mt-4">
                <SocialButton onClick={() => router.push("/dashboard")} className="bg-black hover:bg-gray-900 text-white" label="Apple">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" />
                  </svg>
                </SocialButton>
                <SocialButton onClick={() => router.push("/dashboard")} className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700" label="Google">
                  <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                </SocialButton>
                <SocialButton onClick={() => router.push("/dashboard")} className="bg-[#1877F2] hover:bg-[#166fe5] text-white" label="Meta">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </SocialButton>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-normal tracking-tight text-center text-gray-900 dark:text-white mb-1">Sign up</h2>
              <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-6">
                Already have an account?{" "}
                <button onClick={() => switchMode("login")} className="text-teal hover:underline font-medium cursor-pointer">
                  Log in
                </button>
              </p>

              <form onSubmit={handleSignUp} className="space-y-3.5" noValidate>
                <div>
                  <input
                    name="firstName"
                    type="text"
                    placeholder="First name*"
                    value={form.firstName}
                    onChange={handleChange}
                    className={clsx(inputBase, errors.firstName ? "border-red-400" : "border-gray-200 dark:border-white/10 focus:border-teal")}
                  />
                  {errors.firstName && <p className="text-xs text-red-400 mt-1 px-1">{errors.firstName}</p>}
                </div>

                <div>
                  <input
                    name="lastName"
                    type="text"
                    placeholder="Last name*"
                    value={form.lastName}
                    onChange={handleChange}
                    className={clsx(inputBase, errors.lastName ? "border-red-400" : "border-gray-200 dark:border-white/10 focus:border-teal")}
                  />
                  {errors.lastName && <p className="text-xs text-red-400 mt-1 px-1">{errors.lastName}</p>}
                </div>

                <div>
                  <input
                    name="email"
                    type="email"
                    placeholder="Email address*"
                    value={form.email}
                    onChange={handleChange}
                    className={clsx(inputBase, errors.email ? "border-red-400" : "border-gray-200 dark:border-white/10 focus:border-teal")}
                  />
                  {errors.email && <p className="text-xs text-red-400 mt-1 px-1">{errors.email}</p>}
                </div>

                <div>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password (8+ characters)*"
                      value={form.password}
                      onChange={handleChange}
                      className={clsx(inputBase, "pr-11", errors.password ? "border-red-400" : "border-gray-200 dark:border-white/10 focus:border-teal")}
                    />
                    <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-400 mt-1 px-1">{errors.password}</p>}
                </div>

                <label className="flex items-start gap-3 cursor-pointer group pt-0.5">
                  <div className="mt-0.5 shrink-0">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => { setAgreed(e.target.checked); setErrors((prev) => ({ ...prev, agreed: "" })); }}
                      className="sr-only"
                    />
                    <div className={clsx("w-4 h-4 rounded border-2 flex items-center justify-center transition-colors", agreed ? "bg-teal border-teal" : errors.agreed ? "border-red-400" : "border-gray-300 dark:border-white/20 group-hover:border-teal")}>
                      {agreed && <Check size={10} className="text-white" strokeWidth={3} />}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 leading-snug">
                    I agree to Aps&apos;s{" "}
                    <span className="text-blue-500 underline cursor-pointer hover:text-blue-600">Terms &amp; Conditions</span>{" "}
                    and acknowledge the{" "}
                    <span className="text-blue-500 underline cursor-pointer hover:text-blue-600">Privacy Policy</span>
                  </span>
                </label>
                {errors.agreed && <p className="text-xs text-red-400 px-1">{errors.agreed}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-teal hover:bg-teal-hover text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating account...
                    </>
                  ) : "Create account"}
                </button>
              </form>

              <div className="grid grid-cols-3 gap-3 mt-5">
                <SocialButton onClick={() => router.push("/dashboard")} className="bg-black hover:bg-gray-900 text-white" label="Apple">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" />
                  </svg>
                </SocialButton>
                <SocialButton onClick={() => router.push("/dashboard")} className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700" label="Google">
                  <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                </SocialButton>
                <SocialButton onClick={() => router.push("/dashboard")} className="bg-[#1877F2] hover:bg-[#166fe5] text-white" label="Meta">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </SocialButton>
              </div>
            </>
          )}
        </div>

        <div className="lg:hidden w-full max-w-[420px] mt-8 pb-10 space-y-6">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">What&apos;s included</p>
            <ul className="space-y-3">
              {features.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-teal/20 border border-teal/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={11} className="text-teal" strokeWidth={3} />
                  </div>
                  <span className="text-sm text-gray-300 leading-relaxed">{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-white/10">
            <Star size={14} className="text-green-400 fill-green-400 shrink-0" />
            <p className="text-sm text-gray-300">
              <span className="font-medium text-white">Rated 4.5/5.0</span>{" "}
              <span className="text-gray-500">· Trustpilot (100k+ reviews)</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialButton({ children, onClick, className, label }: { children: React.ReactNode; onClick: () => void; className: string; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Sign in with ${label}`}
      className={clsx("flex items-center justify-center py-2.5 rounded-xl transition-colors cursor-pointer", className)}
    >
      {children}
    </button>
  );
}
