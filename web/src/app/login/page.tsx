'use client';

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { TrendingUp, LogIn, Sparkles, Play } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  const handleDemoMode = () => {
    // Store demo user in localStorage
    localStorage.setItem('demo-user', JSON.stringify({
      name: 'Demo Trader',
      email: 'demo@trade-on.game',
      image: null,
    }));
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-trade-dark flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-trade-accent/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-trade-green/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(88,166,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(88,166,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Login Card */}
      <div className="relative z-10 max-w-md w-full mx-4">
        <div className="bg-trade-card/80 backdrop-blur-xl border border-trade-border rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-trade-accent via-purple-500 to-trade-green rounded-2xl 
              flex items-center justify-center shadow-2xl shadow-trade-accent/30 mb-6 relative">
              <TrendingUp className="w-10 h-10 text-white" />
              <Sparkles className="w-5 h-5 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Trade-<span className="bg-gradient-to-r from-trade-accent to-purple-500 bg-clip-text text-transparent">On</span>
            </h1>
            <p className="text-gray-400">Cryptocurrency Trading Simulator</p>
          </div>

          {/* Welcome Message */}
          <div className="bg-trade-dark/50 rounded-xl p-4 mb-8 border border-trade-border/50">
            <p className="text-sm text-gray-300 text-center leading-relaxed">
              Welcome to the ultimate crypto trading experience. Sign in to start your journey from 
              <span className="text-trade-green font-semibold"> $1,000,000</span> to legendary trader status.
            </p>
          </div>

          {/* Demo Mode Button - Primary action for now */}
          <button
            onClick={handleDemoMode}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 mb-4
              bg-gradient-to-r from-trade-accent to-purple-500 hover:from-trade-accent/90 hover:to-purple-500/90
              text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl
              hover:scale-[1.02] active:scale-[0.98]"
          >
            <Play className="w-5 h-5" />
            <span>Play Now (Demo Mode)</span>
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-trade-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-trade-card text-gray-500">or sign in with</span>
            </div>
          </div>

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-white hover:bg-gray-100 
              text-gray-800 font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl
              hover:scale-[1.02] active:scale-[0.98]"
          >
            {/* Google Icon */}
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continue with Google</span>
            <LogIn className="w-5 h-5" />
          </button>

          {/* Terms */}
          <p className="text-xs text-gray-500 text-center mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-6">
          A simulation game • No real money involved
        </p>
      </div>
    </div>
  );
}
