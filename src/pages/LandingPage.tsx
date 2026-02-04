import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { LogIn, UserPlus } from 'lucide-react'

export function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Full-screen hero background */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-course.jpg"
          alt="Golf course"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        {/* Logo block */}
        <div className="text-center space-y-4 animate-landing-fade-in mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 text-white text-4xl font-bold shadow-2xl font-heading animate-landing-glow">
            SG
          </div>
          <h1 className="text-5xl font-bold text-white drop-shadow-xl font-heading tracking-tight">
            ShaBBa Golf
          </h1>
          <p className="text-white/70 text-lg font-medium drop-shadow max-w-xs mx-auto">
            Wednesday Night League
          </p>
        </div>

        {/* CTA buttons */}
        <div className="w-full max-w-xs space-y-3 animate-landing-slide-up">
          <Button
            onClick={() => navigate('/login')}
            className="w-full h-12 gap-2 bg-fairway hover:bg-fairway-dark text-white text-base font-semibold shadow-lg"
          >
            <LogIn className="h-5 w-5" />
            Sign In
          </Button>
          <Button
            onClick={() => navigate('/register')}
            variant="outline"
            className="w-full h-12 gap-2 bg-white/10 hover:bg-white/20 text-white border-white/30 text-base font-semibold backdrop-blur-sm"
          >
            <UserPlus className="h-5 w-5" />
            Create Account
          </Button>
        </div>

        {/* Footer tagline */}
        <p className="absolute bottom-8 text-white/40 text-xs font-medium tracking-widest uppercase">
          Vibes
        </p>
      </div>
    </div>
  )
}
