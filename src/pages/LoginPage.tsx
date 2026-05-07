import React, { useState } from 'react';
import { ShieldCheck, Building2, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { User } from '../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [taxId, setTaxId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onLogin({ taxId, name: 'TSMC 工程師 - 陳大明' });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-lg p-10 card-dark mx-auto"
    >
      <div className="mb-10 text-center">
        <div className="relative w-20 h-20 bg-brand-primary/10 flex items-center justify-center mb-6 mx-auto border border-brand-primary/20 rounded-2xl shadow-inner">
          <ShieldCheck className="text-brand-primary" size={40} />
        </div>
        <h1 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">大綜電腦 <span className="text-brand-secondary">報修系統</span></h1>
        <p className="text-slate-500 text-[11px] font-bold tracking-[0.1em] uppercase opacity-70">GrandTech Enterprise Support Gateway</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs uppercase tracking-widest text-slate-600 mb-3 font-bold">企業統一編號</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Building2 size={20} />
            </div>
            <input
              required
              type="text"
              placeholder="請輸入公司統編"
              value={taxId}
              onChange={(e) => setTaxId(e.target.value)}
              className="input-dark pl-12 h-16 rounded-xl border-slate-200 focus:ring-brand-primary/10"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-slate-600 mb-3 font-bold">密碼</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Lock size={20} />
            </div>
            <input
              required
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-dark pl-12 h-16 rounded-xl border-slate-200 focus:ring-brand-primary/10"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary h-16 mt-6 flex items-center justify-center gap-3 rounded-xl shadow-xl shadow-brand-primary/20 hover:shadow-brand-primary/40 text-base"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <span className="tracking-widest font-black text-lg">登入</span>
              <ArrowRight size={22} />
            </>
          )}
        </button>
      </form>
      
      <div className="mt-12 text-center">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-relaxed">
          GrandTech Systems Integrated Network<br/>
          大綜電腦系統股份有限公司 版權所有
        </p>
      </div>
    </motion.div>
  );
}
