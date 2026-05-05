import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

export const LandingHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('#home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const navItems = [
    { label: 'Trang chủ', href: '#home' },
    { label: 'Tính năng', href: '#features' },
    { label: 'Về chúng tôi', href: '#about' },
    { label: 'Blog', href: '#blog' },
  ];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(href);
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { threshold: 0.6 }
    );

    navItems.forEach((item) => {
      const el = document.querySelector(item.href);
      if (el) sectionObserver.observe(el);
    });

    const homeObserver = new IntersectionObserver(
      ([entry]) => {
        setScrolled(!entry.isIntersecting);
      },
      { threshold: 0.9 }
    );

    const homeEl = document.querySelector('#home');
    if (homeEl) homeObserver.observe(homeEl);

    return () => {
      sectionObserver.disconnect();
      homeObserver.disconnect();
    };
  }, []);

  return (
    <>
      <header className={cn(
        "fixed top-0 left-0 w-full z-[1000] transition-all duration-300",
        // Bỏ backdrop-blur và màu nền, giữ trong suốt hoàn toàn, chỉ thêm border dưới khi scroll
        scrolled ? "bg-transparent border-b border-slate-200 dark:border-white/10 shadow-sm dark:shadow-lg" : "bg-transparent"
      )}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 dark:bg-indigo-500 rounded-xl flex items-center justify-center font-black text-xl text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-colors">
              M
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white hidden sm:block transition-colors">MindRevol</span>
          </div>

          {/* Center Navigation (Desktop) */}
          <nav className="hidden lg:flex items-center gap-10 h-full">
            {navItems.map((item) => (
              <a 
                key={item.href}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className={cn(
                  "relative h-full flex items-center text-[15px] font-bold transition-colors",
                  activeSection === item.href 
                    ? "text-indigo-600 dark:text-indigo-400" 
                    : "text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
                )}
              >
                {item.label}
                {activeSection === item.href && (
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-indigo-600 dark:bg-indigo-500 rounded-t-full shadow-[0_0_10px_rgba(99,102,241,0.8)] transition-colors" />
                )}
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4 lg:gap-6">
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/10 rounded-full transition-all"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            
            <Link 
              to="/login" 
              className="hidden md:flex items-center justify-center px-6 py-2.5 bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:hover:bg-zinc-200 dark:text-black rounded-xl font-bold text-sm transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] dark:shadow-[0_4px_14px_0_rgba(255,255,255,0.1)]"
            >
              Mở Ứng Dụng
            </Link>

            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 bg-slate-100 border border-slate-200 dark:text-zinc-400 dark:hover:text-white dark:bg-white/5 dark:border-white/10 rounded-xl transition-all active:scale-95"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* ================= SIDEBAR MOBILE ================= */}
      {/* Overlay nền tối mờ */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/60 z-[1001] transition-opacity duration-300 lg:hidden",
          isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Tab Menu */}
      <div 
        className={cn(
          "fixed top-0 right-0 h-[100dvh] w-[280px] bg-white dark:bg-[#09090b] border-l border-slate-200 dark:border-white/10 shadow-2xl z-[1002] transform transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] lg:hidden flex flex-col",
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-white/5">
          <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">Menu</span>
          <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-slate-500 hover:text-slate-900 bg-slate-100 dark:text-zinc-400 dark:hover:text-white dark:bg-white/5 rounded-full transition-all active:scale-95">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-2 p-6 flex-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => scrollToSection(e, item.href)}
              className={cn(
                "px-4 py-4 rounded-xl text-[1.1rem] font-bold transition-all",
                activeSection === item.href 
                  ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/5 border border-transparent"
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-200 dark:border-white/5">
          <Link 
            to="/login" 
            onClick={() => setIsSidebarOpen(false)}
            className="flex items-center justify-center w-full py-4 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-400 text-white rounded-xl font-bold text-[1.05rem] transition-all shadow-[0_8px_20px_rgba(79,70,229,0.3)] dark:shadow-[0_8px_20px_rgba(99,102,241,0.4)]"
          >
            Mở Ứng Dụng Ngay
          </Link>
        </div>
      </div>
    </>
  );
};