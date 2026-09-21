import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { X, Send, Home, MapPin, Star, ChevronRight } from 'lucide-react';
import { Link } from 'wouter';
import { KankoonMascot } from './KankoonMascot';
import { propertiesData } from '@/lib/data';

type Message = { role: 'ai' | 'user'; text: string; cards?: typeof propertiesData };

/* ── Rule-based AI response engine ── */
function getAIResponse(input: string): Message {
  const q = input.trim().toLowerCase();

  if (/اقترح|عقار|مناسب|ابحث|دلني|وجدلي/.test(q)) {
    const picks = propertiesData.filter(p => p.available).slice(0, 3);
    return {
      role: 'ai',
      text: 'بناءً على ما يبحث عنه معظم عملائنا، إليك أبرز عقاراتنا المتاحة الآن:',
      cards: picks,
    };
  }

  if (/دمشق/.test(q)) {
    const picks = propertiesData.filter(p => p.location.includes('دمشق') && p.available);
    return {
      role: 'ai',
      text: `وجدت ${picks.length} عقار متاح في دمشق:`,
      cards: picks.slice(0, 3),
    };
  }

  if (/ساحل|لاذقية|طرطوس|بحر/.test(q)) {
    const picks = propertiesData.filter(p =>
      (p.location.includes('اللاذقية') || p.location.includes('طرطوس') || p.location.includes('الساحل'))
      && p.available
    );
    return {
      role: 'ai',
      text: 'عقارات الساحل السوري الجميل:',
      cards: picks.slice(0, 3),
    };
  }

  if (/شاليه|مزرعة|طبيعة|جبل|خضراء/.test(q)) {
    const picks = propertiesData.filter(p => p.category === 'chalets' && p.available);
    return {
      role: 'ai',
      text: 'أجمل الشاليهات والمزارع المتاحة:',
      cards: picks.slice(0, 3),
    };
  }

  if (/فندق|جناح|فخم|فاخر/.test(q)) {
    const picks = propertiesData.filter(p => p.category === 'hotels' && p.available);
    return {
      role: 'ai',
      text: 'الغرف الفندقية الفاخرة المتاحة:',
      cards: picks.slice(0, 3),
    };
  }

  if (/رخيص|أقل|اقتصادي|ميزانية/.test(q)) {
    const picks = [...propertiesData]
      .filter(p => p.available)
      .sort((a, b) => parseInt(a.priceUsd) - parseInt(b.priceUsd))
      .slice(0, 3);
    return {
      role: 'ai',
      text: 'أفضل العقارات بأقل الأسعار:',
      cards: picks,
    };
  }

  if (/أحسن|أفضل|مميز|تقييم/.test(q)) {
    const picks = [...propertiesData]
      .filter(p => p.available)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);
    return {
      role: 'ai',
      text: 'العقارات الأعلى تقييماً من عملائنا:',
      cards: picks,
    };
  }

  if (/مسبح|pool/.test(q)) {
    const picks = propertiesData.filter(p => p.amenities.pool && p.available);
    return {
      role: 'ai',
      text: 'عقارات تحتوي على مسبح خاص:',
      cards: picks.slice(0, 3),
    };
  }

  if (/سجّل|تسجيل|حساب|كيف أسجل/.test(q)) {
    return {
      role: 'ai',
      text: 'التسجيل سهل جداً! اضغط على "دخول" في الشريط العلوي ثم اختر "إنشاء حساب". ستمر بـ 4 خطوات بسيطة: نوع الحساب ← المعلومات الشخصية ← التحقق من الهوية ← تأكيد الحساب. كل شيء آمن ومشفر.',
    };
  }

  if (/فلتر|بحث|كيف أبحث/.test(q)) {
    return {
      role: 'ai',
      text: 'يمكنك البحث بعدة طرق:\n• الفلاتر الجانبية في صفحة كل قسم (المدينة، السعر، عدد الغرف)\n• شريط البحث في الصفحة الرئيسية\n• تصفح العقارات حسب القسم (بيوت / شاليهات / فنادق)',
    };
  }

  if (/منطقة|مدينة|أين|أفضل مكان/.test(q)) {
    return {
      role: 'ai',
      text: '🏙️ دمشق: تشكيلة واسعة من الشقق والفلل\n🏖️ الساحل (لاذقية/طرطوس): أجمل الشاليهات البحرية\n⛰️ الجبال (بلودان/صلنفة): كوخ وشاليهات طبيعية\n🌿 الريف (حماة/حمص): مزارع ومساحات خضراء',
    };
  }

  if (/مالك|أضف عقار|أسجل عقار/.test(q)) {
    return {
      role: 'ai',
      text: 'لإضافة عقارك بكل سهولة:\n1. سجّل حساباً كـ "مالك عقار"\n2. أضف تفاصيل العقار والصور\n3. احصل على شارة التوثيق\n4. ابدأ باستقبال الحجوزات مباشرة!',
    };
  }

  // Default
  return {
    role: 'ai',
    text: 'أنا هنا لمساعدتك في العثور على العقار المثالي! يمكنني مساعدتك في:\n• البحث عن عقار حسب المنطقة أو الميزانية\n• مقارنة العقارات المتاحة\n• شرح كيفية التسجيل والحجز',
  };
}

/* ── Mini property card inside chat ── */
function ChatPropertyCard({ p }: { p: (typeof propertiesData)[0] }) {
  return (
    <Link href={`/property/${p.id}`}>
      <div className="flex items-center gap-2.5 bg-background/60 border border-border/60 rounded-xl p-2 mt-1 hover:border-primary/60 transition-colors cursor-pointer group">
        <img
          src={p.image}
          alt={p.title}
          className="w-12 h-12 rounded-lg object-cover shrink-0 group-hover:scale-105 transition-transform"
        />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-foreground truncate">{p.title}</p>
          <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
            <MapPin size={9} /> {p.location}
          </p>
          <p className="text-[10px] text-primary font-bold mt-0.5 flex items-center gap-1">
            <Star size={9} className="fill-primary" /> {p.rating} · ${p.priceUsd}/ليلة
          </p>
        </div>
        <ChevronRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
      </div>
    </Link>
  );
}

/* ══════════════════════════════════════════════════════════════
   Main AIAssistant component
══════════════════════════════════════════════════════════════ */
export function AIAssistant() {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: t('ai.greet') },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (overrideText?: string) => {
    const text = (overrideText ?? inputMsg).trim();
    if (!text) return;

    setMessages(prev => [...prev, { role: 'user', text }]);
    setInputMsg('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getAIResponse(text);
      setIsTyping(false);
      setMessages(prev => [...prev, response]);
    }, 900);
  };

  const quickActions = [
    { label: t('ai.suggest'),      text: 'اقترح لي عقاراً مناسباً' },
    { label: t('ai.help_filter'),  text: 'كيف أبحث بالفلاتر' },
    { label: t('ai.how_register'), text: 'كيف أسجل حساباً' },
    { label: t('ai.best_areas'),   text: 'ما هي أفضل المناطق' },
  ];

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start" dir="rtl">
      {/* ── Chat Panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-modal="false"
            aria-label={t('ai.title')}
            onKeyDown={e => e.key === 'Escape' && setIsOpen(false)}
            initial={{ opacity: 0, y: 24, scale: 0.88, originX: 0, originY: 1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.88 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="mb-4 w-[340px] rounded-2xl overflow-hidden flex flex-col shadow-luxury border border-primary/25"
            style={{
              background: 'rgba(26,17,9,0.88)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-primary/20"
                 style={{ background: 'linear-gradient(135deg, #2d1f13, #1a1109)' }}>
              <div className="flex items-center gap-3">
                {/* Mini mascot in header */}
                <div className="w-9 h-9 rounded-full border border-primary/40 flex items-center justify-center overflow-hidden"
                     style={{ background: 'radial-gradient(circle at 35% 30%, #3d2010, #0f0a06)' }}>
                  <KankoonMascot size={34} isOpen={isOpen} />
                </div>
                <div>
                  <p className="font-display font-bold text-sm text-primary">{t('ai.title')}</p>
                  <p className="text-[10px] text-green-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
                    متاح الآن
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="إغلاق المحادثة"
                className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground"
              >
                <X size={15} />
              </button>
            </div>

            {/* Messages */}
            <div
              role="log"
              aria-live="polite"
              className="h-[320px] overflow-y-auto p-4 flex flex-col gap-3 scrollbar-thin"
            >
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-start' : 'items-end'}`}>
                  <div
                    className={`max-w-[88%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                      msg.role === 'ai'
                        ? 'text-foreground rounded-tr-sm'
                        : 'text-primary-foreground rounded-tl-sm'
                    }`}
                    style={
                      msg.role === 'ai'
                        ? { background: 'rgba(60,38,20,0.7)', border: '1px solid rgba(201,151,74,0.15)' }
                        : { background: 'linear-gradient(135deg, #c9974a, #8a5c20)' }
                    }
                  >
                    {msg.text}
                  </div>

                  {/* Property cards attached to message */}
                  {msg.cards && msg.cards.length > 0 && (
                    <div className="w-full mt-1 flex flex-col gap-1.5">
                      {msg.cards.map(p => (
                        <ChatPropertyCard key={p.id} p={p} />
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-end gap-1 px-3.5 py-2.5 rounded-2xl rounded-tr-sm w-fit"
                     style={{ background: 'rgba(60,38,20,0.7)', border: '1px solid rgba(201,151,74,0.15)' }}>
                  {[0, 1, 2].map(i => (
                    <motion.span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-primary"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.18 }}
                    />
                  ))}
                </div>
              )}

              {/* Quick actions — only after first greeting */}
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {quickActions.map((a, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(a.text)}
                      className="text-xs px-3 py-1.5 rounded-full border border-primary/30 text-primary hover:bg-primary/15 transition-colors"
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-primary/15 flex items-center gap-2"
                 style={{ background: 'rgba(15,10,6,0.6)' }}>
              <label htmlFor="ai-assistant-input" className="sr-only">{t('ai.placeholder')}</label>
              <input
                id="ai-assistant-input"
                type="text"
                placeholder={t('ai.placeholder')}
                value={inputMsg}
                onChange={e => setInputMsg(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                className="flex-1 rounded-full px-4 py-2 text-sm focus:outline-none text-foreground placeholder:text-muted-foreground"
                style={{ background: 'rgba(45,31,19,0.7)', border: '1px solid rgba(201,151,74,0.2)' }}
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSend()}
                aria-label="إرسال الرسالة"
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all"
                style={{ background: 'linear-gradient(135deg, #c9974a, #8a5c20)' }}
              >
                <Send size={15} className={`text-white ${language === 'ar' ? 'rotate-180' : ''}`} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Mascot Button ── */}
      <div className="relative">
        {/* Tooltip */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ delay: 2.5, duration: 0.4 }}
              className="absolute right-[calc(100%+12px)] top-1/2 -translate-y-1/2 whitespace-nowrap text-xs font-bold text-foreground rounded-xl px-3 py-2 shadow-luxury pointer-events-none"
              style={{
                background: 'rgba(45,31,19,0.9)',
                border: '1px solid rgba(201,151,74,0.3)',
                backdropFilter: 'blur(12px)',
              }}
            >
              مرحباً! كيف أساعدك؟
              {/* Arrow */}
              <span
                className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0"
                style={{
                  borderTop: '5px solid transparent',
                  borderBottom: '5px solid transparent',
                  borderLeft: '6px solid rgba(45,31,19,0.9)',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Outer glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ scale: [1, 1.35, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            border: '2px solid rgba(201,151,74,0.6)',
            borderRadius: '50%',
          }}
        />

        {/* Second pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ scale: [1, 1.6, 1], opacity: [0.2, 0, 0.2] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
          style={{
            border: '1px solid rgba(201,151,74,0.35)',
            borderRadius: '50%',
          }}
        />

        {/* Main button */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setIsOpen(o => !o)}
          aria-label={isOpen ? 'إغلاق المساعد الذكي' : 'فتح المساعد الذكي'}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          className="relative w-[76px] h-[76px] rounded-full flex items-center justify-center"
          style={{
            background: 'radial-gradient(circle at 35% 30%, #3d2010, #0f0a06)',
            border: '2px solid rgba(201,151,74,0.5)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 24px rgba(201,151,74,0.2)',
          }}
          data-testid="button-ai-assistant"
        >
          <KankoonMascot size={64} isOpen={isOpen} />

          {/* Open/close indicator dot */}
          <span
            className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full border border-background"
            style={{ background: isOpen ? '#ef4444' : '#22c55e' }}
          />
        </motion.button>
      </div>
    </div>
  );
}
