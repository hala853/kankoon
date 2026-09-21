import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { KankoonLogo } from './KankoonLogo';
import { Search, Globe, Moon, Sun, Bell, Menu, X, User } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

const LANGUAGE_OPTIONS: { code: 'ar' | 'en' | 'tr'; label: string; native: string }[] = [
  { code: 'ar', label: 'العربية', native: 'AR' },
  { code: 'en', label: 'English', native: 'EN' },
  { code: 'tr', label: 'Türkçe', native: 'TR' },
];

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [location] = useLocation();
  const langMenuRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLangMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelectLanguage = (code: 'ar' | 'en' | 'tr') => {
    setLanguage(code);
    setLangMenuOpen(false);
  };

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/houses', label: t('nav.houses') },
    { href: '/chalets', label: t('nav.chalets') },
    { href: '/hotels', label: t('nav.hotels') }
  ];

  return (
    <>
      <header 
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          isScrolled || mobileMenuOpen 
            ? 'glass-strong py-3' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/">
              <KankoonLogo size={36} className="cursor-pointer" />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span className={`font-medium cursor-pointer transition-colors hover:text-primary ${
                    location === link.href ? 'text-primary font-bold' : 'text-foreground'
                  }`}>
                    {link.label}
                  </span>
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              <button className="p-2 rounded-full hover:bg-secondary/50 text-foreground transition-colors hidden md:block">
                <Search size={20} />
              </button>
              
              <div className="relative" ref={langMenuRef}>
                <button
                  onClick={() => setLangMenuOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={langMenuOpen}
                  aria-label="Change language"
                  className="p-2 rounded-full hover:bg-secondary/50 text-foreground transition-colors flex items-center gap-1 font-bold text-sm uppercase"
                >
                  <Globe size={18} />
                  <span className="hidden sm:inline">{language}</span>
                </button>

                <AnimatePresence>
                  {langMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      role="menu"
                      aria-label="Available languages"
                      className="absolute end-0 mt-2 w-40 rounded-xl glass-strong border border-border shadow-lg overflow-hidden z-50"
                    >
                      {LANGUAGE_OPTIONS.map((opt) => (
                        <button
                          key={opt.code}
                          role="menuitemradio"
                          aria-checked={language === opt.code}
                          onClick={() => handleSelectLanguage(opt.code)}
                          className={`w-full flex items-center justify-between gap-2 px-4 py-3 text-sm transition-colors ${
                            language === opt.code
                              ? 'bg-primary/15 text-primary font-bold'
                              : 'text-foreground hover:bg-secondary/50'
                          }`}
                        >
                          <span>{opt.label}</span>
                          <span className="text-xs uppercase opacity-70">{opt.native}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-secondary/50 text-foreground transition-colors"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <button className="p-2 rounded-full hover:bg-secondary/50 text-foreground transition-colors relative hidden md:block">
                <Bell size={20} />
                <span className="absolute top-1 right-2 w-2 h-2 bg-primary rounded-full"></span>
              </button>

              <div className="h-6 w-px bg-border mx-1 hidden md:block"></div>

              <Link href="/auth">
                <button className="hidden md:flex items-center gap-2 px-5 py-2 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/20 hover:border-primary rounded-full font-medium transition-all">
                  <User size={18} />
                  <span>{t('header.login')}</span>
                </button>
              </Link>

              {/* Mobile Menu Toggle */}
              <button 
                className="p-2 lg:hidden text-foreground"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background pt-24 px-4 flex flex-col h-[100dvh]"
          >
            <div className="flex flex-col gap-4 flex-grow">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <div 
                    className="p-4 rounded-xl bg-secondary/30 text-foreground font-display text-xl font-bold border border-border"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </div>
                </Link>
              ))}
            </div>
            <div className="py-6 border-t border-border mt-auto">
              <Link href="/auth">
                <button 
                  className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg flex items-center justify-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User size={20} />
                  <span>{t('header.login')}</span>
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
