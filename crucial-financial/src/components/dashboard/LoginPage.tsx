'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BarChart3, Eye, EyeOff, ArrowLeft, CheckCircle2, Loader2, TrendingUp, DollarSign, PieChart } from 'lucide-react'

type AuthMode = 'login' | 'signup' | 'forgot' | 'forgot-sent'

interface LoginPageProps {
  onLogin: (email: string, password: string) => Promise<{ error?: string }>
  onSignUp: (email: string, password: string) => Promise<{ error?: string }>
  onResetPassword: (email: string) => Promise<{ error?: string }>
}

export function LoginPage({ onLogin, onSignUp, onResetPassword }: LoginPageProps) {
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function resetForm() {
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setError(null)
    setShowPassword(false)
    setShowConfirm(false)
  }

  function goTo(m: AuthMode) {
    resetForm()
    setMode(m)
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const result = await onLogin(email, password)
    setLoading(false)
    if (result.error) {
      setError(translateError(result.error))
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.')
      return
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }
    setLoading(true)
    const result = await onSignUp(email, password)
    setLoading(false)
    if (result.error) {
      setError(translateError(result.error))
    } else {
      goTo('forgot-sent')
    }
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const result = await onResetPassword(email)
    setLoading(false)
    if (result.error) {
      setError(translateError(result.error))
    } else {
      setMode('forgot-sent')
    }
  }

  function translateError(msg: string): string {
    if (msg.includes('Invalid login credentials')) return 'E-mail ou senha incorretos.'
    if (msg.includes('Email not confirmed')) return 'Confirme seu e-mail antes de entrar.'
    if (msg.includes('User already registered')) return 'Este e-mail já está cadastrado.'
    if (msg.includes('Password should be')) return 'A senha deve ter no mínimo 6 caracteres.'
    if (msg.includes('rate limit')) return 'Muitas tentativas. Aguarde alguns minutos.'
    return msg
  }

  const passwordStrength = (p: string) => {
    if (p.length === 0) return null
    if (p.length < 6) return { label: 'Fraca', color: '#EF4444', width: '25%' }
    if (p.length < 8 || !/[0-9]/.test(p)) return { label: 'Razoável', color: '#F97316', width: '50%' }
    if (!/[A-Z]/.test(p) || !/[^a-zA-Z0-9]/.test(p)) return { label: 'Boa', color: '#EAB308', width: '75%' }
    return { label: 'Forte', color: '#22C55E', width: '100%' }
  }

  const strength = mode === 'signup' ? passwordStrength(password) : null

  return (
    <div className="min-h-screen flex">
      {/* Lado esquerdo — decorativo (escondido em mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] flex-col items-center justify-center p-12 border-r border-[#2D3E57] relative overflow-hidden">
        {/* Efeito de fundo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#22C55E]/5 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#A855F7]/5 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[#3B82F6]/5 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-sm text-center">
          {/* Logo grande */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="h-14 w-14 rounded-2xl bg-[#22C55E] flex items-center justify-center shadow-lg shadow-[#22C55E]/20">
              <BarChart3 className="h-8 w-8 text-[#0F172A]" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold text-[#E2E8F0] tracking-tight">Crucial</h1>
              <p className="text-sm text-[#475569]">Financial Dashboard</p>
            </div>
          </div>

          {/* Feature cards */}
          <div className="space-y-3 text-left">
            {[
              { icon: TrendingUp, color: '#22C55E', bg: '#22C55E10', title: 'Controle Total', desc: '3 vertentes: Geral, Serviço e Infoproduto' },
              { icon: PieChart, color: '#A855F7', bg: '#A855F710', title: 'Gráficos Inteligentes', desc: 'Distribuição de lucro por fonte em tempo real' },
              { icon: DollarSign, color: '#F97316', bg: '#F9731610', title: 'Margens Precisas', desc: 'MG Bruta, Líquida e pós Pró-Labore' },
            ].map(({ icon: Icon, color, bg, title, desc }) => (
              <div key={title} className="flex items-start gap-3 rounded-xl border border-[#2D3E57] bg-[#1E293B]/60 p-4">
                <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: bg }}>
                  <Icon className="h-4 w-4" style={{ color }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#E2E8F0]">{title}</p>
                  <p className="text-xs text-[#475569] mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-[#334155] mt-8">
            Sistema de controle financeiro corporativo para agências e infoprodutores
          </p>
        </div>
      </div>

      {/* Lado direito — formulário */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">

          {/* Logo mobile */}
          <div className="flex lg:hidden items-center justify-center gap-2.5 mb-8">
            <div className="h-9 w-9 rounded-xl bg-[#22C55E] flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-[#0F172A]" />
            </div>
            <span className="text-xl font-bold text-[#E2E8F0]">Crucial</span>
          </div>

          {/* ─── MODO: LOGIN ─── */}
          {mode === 'login' && (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#E2E8F0]">Bem-vindo de volta</h2>
                <p className="text-sm text-[#475569] mt-1">Entre na sua conta para continuar</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email-login">E-mail</Label>
                  <Input
                    id="email-login"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    autoFocus
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password-login">Senha</Label>
                    <button
                      type="button"
                      className="text-xs text-[#22C55E] hover:text-[#16A34A] transition-colors"
                      onClick={() => goTo('forgot')}
                    >
                      Esqueceu a senha?
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password-login"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#94A3B8] transition-colors"
                      onClick={() => setShowPassword((v) => !v)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && <ErrorBox message={error} />}

                <Button type="submit" className="w-full h-10" disabled={loading}>
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Entrando...</> : 'Entrar'}
                </Button>
              </form>

              <p className="text-center text-sm text-[#475569] mt-6">
                Não tem conta?{' '}
                <button
                  className="text-[#22C55E] hover:text-[#16A34A] font-medium transition-colors"
                  onClick={() => goTo('signup')}
                >
                  Criar conta grátis
                </button>
              </p>
            </>
          )}

          {/* ─── MODO: CADASTRO ─── */}
          {mode === 'signup' && (
            <>
              <button
                className="flex items-center gap-1.5 text-xs text-[#475569] hover:text-[#94A3B8] mb-6 transition-colors"
                onClick={() => goTo('login')}
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Voltar para o login
              </button>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#E2E8F0]">Criar sua conta</h2>
                <p className="text-sm text-[#475569] mt-1">Preencha os dados abaixo para começar</p>
              </div>

              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email-signup">E-mail</Label>
                  <Input
                    id="email-signup"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    autoFocus
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password-signup">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password-signup"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mínimo 6 caracteres"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#94A3B8] transition-colors"
                      onClick={() => setShowPassword((v) => !v)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {strength && (
                    <div className="space-y-1">
                      <div className="h-1 w-full rounded-full bg-[#1E293B] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{ width: strength.width, backgroundColor: strength.color }}
                        />
                      </div>
                      <p className="text-[10px]" style={{ color: strength.color }}>
                        Força da senha: {strength.label}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirm-password">Confirmar senha</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Repita a senha"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                      className={`pr-10 ${confirmPassword && confirmPassword !== password ? 'border-[#EF4444]/50 focus:ring-[#EF4444]' : ''}`}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#94A3B8] transition-colors"
                      onClick={() => setShowConfirm((v) => !v)}
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {confirmPassword && confirmPassword !== password && (
                    <p className="text-[10px] text-[#EF4444]">As senhas não coincidem</p>
                  )}
                </div>

                {error && <ErrorBox message={error} />}

                <Button type="submit" className="w-full h-10" disabled={loading}>
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Criando conta...</> : 'Criar conta'}
                </Button>
              </form>

              <p className="text-center text-sm text-[#475569] mt-6">
                Já tem conta?{' '}
                <button
                  className="text-[#22C55E] hover:text-[#16A34A] font-medium transition-colors"
                  onClick={() => goTo('login')}
                >
                  Entrar
                </button>
              </p>
            </>
          )}

          {/* ─── MODO: ESQUECI A SENHA ─── */}
          {mode === 'forgot' && (
            <>
              <button
                className="flex items-center gap-1.5 text-xs text-[#475569] hover:text-[#94A3B8] mb-6 transition-colors"
                onClick={() => goTo('login')}
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Voltar para o login
              </button>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#E2E8F0]">Recuperar senha</h2>
                <p className="text-sm text-[#475569] mt-1">
                  Digite seu e-mail e enviaremos um link de recuperação
                </p>
              </div>

              <form onSubmit={handleForgot} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email-forgot">E-mail cadastrado</Label>
                  <Input
                    id="email-forgot"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                {error && <ErrorBox message={error} />}

                <Button type="submit" className="w-full h-10" disabled={loading}>
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Enviando...</> : 'Enviar link de recuperação'}
                </Button>
              </form>
            </>
          )}

          {/* ─── MODO: CONFIRMAÇÃO ENVIADA ─── */}
          {mode === 'forgot-sent' && (
            <div className="text-center">
              <div className="flex justify-center mb-5">
                <div className="h-16 w-16 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-[#22C55E]" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-[#E2E8F0] mb-2">
                {mode === 'forgot-sent' && email ? 'E-mail enviado!' : 'Verifique seu e-mail!'}
              </h2>
              <p className="text-sm text-[#475569] mb-1">
                Enviamos um link para
              </p>
              <p className="text-sm font-medium text-[#E2E8F0] mb-6">{email}</p>
              <p className="text-xs text-[#334155] mb-8">
                Verifique sua caixa de entrada e a pasta de spam. O link expira em 1 hora.
              </p>
              <Button variant="secondary" className="w-full" onClick={() => goTo('login')}>
                Voltar para o login
              </Button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-[#EF4444]/30 bg-[#EF4444]/8 px-3 py-2.5">
      <span className="text-[#EF4444] text-sm mt-px">⚠</span>
      <p className="text-xs text-[#EF4444] leading-relaxed">{message}</p>
    </div>
  )
}
