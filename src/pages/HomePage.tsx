import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { propertiesData, citiesData, statsData, Property } from '@/lib/data';
import { assetUrl } from '@/lib/utils';
import { PropertyCard } from '@/components/PropertyCard';
import { Reveal } from '@/components/Reveal';
import { Link, useLocation } from 'wouter';
import { Search, MapPin, Home, Building2, Tent, Shield, Camera, Calendar, CreditCard, Clock, Star, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function HomePage() {
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'all' | 'houses' | 'chalets' | 'hotels'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('houses');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const featuredProperties = propertiesData
    .filter(p => activeTab === 'all' || p.category === activeTab)
    .slice(0, 6);

  const handleSearch = () => {
    setLocation(`/${searchType}?q=${searchQuery}`);
  };

  const features = [
    { icon: Shield, title: "توثيق المُلّاك", desc: "جميع المُلّاك موثقون لدينا لضمان تجربة آمنة" },
    { icon: Camera, title: "صور احترافية", desc: "صور واقعية واحترافية لكل زاوية في العقار" },
    { icon: Calendar, title: "تقويم حجز فوري", desc: "تأكيد الحجز فوراً بدون انتظار موافقة" },
    { icon: CreditCard, title: "دفع محمي", desc: "بوابات دفع آمنة ومشفرة بالكامل" },
    { icon: Clock, title: "دعم 24h", desc: "فريق دعم مخصص على مدار الساعة" },
    { icon: Star, title: "تجربة فاخرة", desc: "عقارات مختارة بعناية لتناسب ذوقك الرفيع" }
  ];

  const faqs = [
    { q: "كيف أضمن أن العقار مطابق للصور؟", a: "نقوم بزيارة وتصوير نسبة كبيرة من العقارات المميزة بأنفسنا، كما نفرض سياسة صارمة على المُلّاك بتحديث الصور بشكل دوري. في حال وجود اختلاف جوهري، نضمن لك استرداد أموالك." },
    { q: "هل يوجد عمولة مخفية؟", a: "لا، كنكون منصة شفافة تماماً. السعر الذي تراه هو السعر النهائي الذي تدفعه. لا نأخذ عمولات من المستأجر." },
    { q: "كيف يمكنني الدفع؟", a: "ندعم الدفع الإلكتروني عبر البنوك المحلية، بالإضافة إلى خيارات الدفع عند الوصول لبعض العقارات الموثوقة." },
    { q: "ماذا لو أردت إلغاء الحجز؟", a: "تختلف سياسة الإلغاء من عقار لآخر، ولكن بشكل عام نوفر سياسات مرنة تتيح لك الإلغاء واسترداد المبلغ بالكامل قبل موعد الحجز بـ 48 ساعة." },
    { q: "كيف يمكنني إضافة عقاري؟", a: "يمكنك إنشاء حساب كمالك بسهولة من صفحة التسجيل، ثم اتباع خطوات إضافة العقار ورفع الصور وإثبات الملكية." }
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background z-10" />
          <img 
            src={assetUrl("/hero-landscape.jpeg")} 
            alt="Hero Background" 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.classList.add('bg-muted');
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-20 flex flex-col items-center mt-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl"
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6">
              {t('hero.title1')} <span className="text-gradient-gold">{t('hero.title_gold')}</span><br/>
              {t('hero.title2')}
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <button 
                onClick={() => document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:brightness-110 hover:scale-105 transition-all shadow-gold text-lg"
              >
                {t('hero.explore')}
              </button>
              <Link href="/auth">
                <button className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-primary-foreground transition-all text-lg">
                  {t('hero.add_property')}
                </button>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="glass-strong p-4 rounded-2xl md:rounded-full flex flex-col md:flex-row items-center gap-3 w-full max-w-3xl mx-auto shadow-luxury">
              <div className="flex-1 flex items-center gap-3 w-full px-4 border-b md:border-b-0 md:border-l border-border/50 pb-3 md:pb-0 h-12">
                <MapPin className="text-primary shrink-0" size={20} />
                <input 
                  type="text" 
                  placeholder={language === 'ar' ? 'أين تريد الذهاب؟' : 'Where to?'} 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none focus:outline-none text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="flex-1 flex items-center w-full px-4 border-b md:border-b-0 md:border-l border-border/50 pb-3 md:pb-0 h-12">
                <select 
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-full bg-transparent border-none focus:outline-none text-foreground appearance-none cursor-pointer"
                >
                  <option value="houses" className="bg-card text-foreground">{t('nav.houses')}</option>
                  <option value="chalets" className="bg-card text-foreground">{t('nav.chalets')}</option>
                  <option value="hotels" className="bg-card text-foreground">{t('nav.hotels')}</option>
                </select>
              </div>
              <button 
                onClick={handleSearch}
                className="w-full md:w-auto px-8 py-3 bg-primary text-primary-foreground rounded-xl md:rounded-full font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                <Search size={18} />
                <span>{language === 'ar' ? 'بحث' : 'Search'}</span>
              </button>
            </div>
          </motion.div>

          {/* Floating Trust Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="absolute top-32 right-10 hidden lg:flex items-center gap-3 glass px-5 py-3 rounded-full shadow-lg animate-float"
          >
            <div className="flex -space-x-2 space-x-reverse">
              {[1, 2, 3].map(i => (
                <img key={i} src={assetUrl("/ai-assistant.png")} className="w-8 h-8 rounded-full border-2 border-background object-cover bg-secondary" alt="User" />
              ))}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1 text-primary">
                <Star size={14} className="fill-primary" />
                <span className="font-bold text-sm" dir="ltr">4.9 / 5</span>
              </div>
              <span className="text-xs text-muted-foreground">من +12 ألف تقييم</span>
            </div>
          </motion.div>

          {/* Floating Categories */}
          <div className="absolute -bottom-16 left-0 right-0 hidden md:flex justify-center gap-6 z-30">
            {[
              { id: 'houses', icon: Home, label: t('nav.houses'), delay: 0.2 },
              { id: 'chalets', icon: Tent, label: t('nav.chalets'), delay: 0.4 },
              { id: 'hotels', icon: Building2, label: t('nav.hotels'), delay: 0.6 }
            ].map((cat) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: cat.delay, duration: 0.5 }}
                className={`animate-float flex flex-col items-center gap-3 bg-card border border-border p-6 rounded-2xl shadow-luxury w-48 cursor-pointer hover:border-primary transition-colors group`}
                style={{ animationDelay: `${cat.delay}s` }}
                onClick={() => setLocation(`/${cat.id}`)}
              >
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors text-primary">
                  <cat.icon size={28} />
                </div>
                <span className="font-bold text-foreground font-display">{cat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section id="about" className="py-24 md:py-32 bg-background relative z-10">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <Reveal width="100%">
              <div className="relative">
                <div className="absolute -inset-4 border-2 border-primary/20 rounded-3xl transform rotate-3"></div>
                <img 
                  src={assetUrl("/properties/modern-villa.png")} 
                  alt="Modern Villa" 
                  className="relative rounded-3xl w-full max-w-md mx-auto object-cover shadow-2xl aspect-[4/5]"
                />
                <div className="absolute -bottom-8 -right-8 glass-strong p-6 rounded-2xl shadow-xl max-w-[200px] hidden md:block">
                  <div className="text-4xl font-display font-bold text-primary mb-2" dir="ltr">0 %</div>
                  <div className="text-sm font-bold text-foreground">عمولة إضافية</div>
                  <div className="text-xs text-muted-foreground mt-1">احجز مباشرة من المالك</div>
                </div>
              </div>
            </Reveal>

            <div className="flex-1">
              <Reveal delay={0.2}>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6 leading-tight">
                  منصّة ذكية تجمع بين المالك والمستأجر <span className="text-primary">مباشرة</span>
                </h2>
                <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
                  نحن في كنكون نؤمن بأن البحث عن العقار المناسب يجب أن يكون تجربة ممتعة، خالية من التعقيدات والعمولات الخفية. نقدم لك منصة فاخرة تربطك بالمُلّاك الموثوقين.
                </p>

                <div className="flex flex-col gap-6">
                  {[
                    { title: "بدون وسطاء", desc: "تواصل مباشر مع مالك العقار بدون أي رسوم أو عمولات خفية." },
                    { title: "أسعار شفافة", desc: "السعر الذي تراه هو السعر النهائي الذي تدفعه." },
                    { title: "حجز آمن", desc: "نضمن حقوق الطرفين من خلال توثيق العقارات والمُلّاك." }
                  ].map((pillar, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="mt-1 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <CheckCircle size={16} className="text-primary" />
                      </div>
                      <div>
                        <h4 className="text-foreground font-bold text-lg mb-1">{pillar.title}</h4>
                        <p className="text-muted-foreground text-sm">{pillar.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary/30 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsData.map((stat, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="flex flex-col items-center text-center">
                  <div className="text-4xl md:text-5xl font-display font-bold text-primary mb-2 flex items-center" dir="ltr">
                    <span>{stat.suffix}</span>
                    <span>{stat.value.toLocaleString()}</span>
                  </div>
                  <div className="text-foreground font-medium">{stat.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">لماذا كنكون؟</h2>
              <p className="text-muted-foreground text-lg">معايير فندقية خمس نجوم لتجربة بحث وحجز لا تُنسى</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors shadow-sm hover:shadow-md group">
                  <div className="w-14 h-14 rounded-xl bg-secondary text-primary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <feature.icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Cities Section */}
      <section className="py-24 bg-secondary/10">
        <div className="container mx-auto px-4 md:px-8">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">وجهات مميزة</h2>
                <p className="text-muted-foreground text-lg">استكشف العقارات في أجمل المناطق السورية</p>
              </div>
              <button className="text-primary font-bold hover:underline self-start md:self-auto">عرض كل المدن</button>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {citiesData.map((city, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer">
                  <img 
                    src={city.image} 
                    alt={city.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => { e.currentTarget.src = assetUrl('/hero-landscape.jpeg'); }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-2xl font-display font-bold text-white mb-1">{city.name}</h3>
                    <p className="text-white/80 text-sm">{city.count} عقار</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section id="featured" className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">عقارات مختارة</h2>
              <p className="text-muted-foreground text-lg mb-8">أفضل العروض التي نوصي بها لإقامتك القادمة</p>
              
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  { id: 'all', label: 'الكل' },
                  { id: 'houses', label: 'بيوت وشقق' },
                  { id: 'chalets', label: 'شاليهات ومزارع' },
                  { id: 'hotels', label: 'غرف فندقية' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-6 py-2 rounded-full font-medium transition-all ${
                      activeTab === tab.id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary text-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {featuredProperties.map((property, idx) => (
                <PropertyCard key={property.id} property={property} index={idx} />
              ))}
            </motion.div>
          </AnimatePresence>
          
          <div className="mt-12 text-center">
            <Link href={`/${activeTab === 'all' ? 'houses' : activeTab}`}>
              <button className="px-8 py-3 bg-transparent border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-primary-foreground transition-all">
                عرض المزيد
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 bg-card border-y border-border overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-20">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">كيف تعمل المنصة</h2>
              <p className="text-muted-foreground text-lg">ثلاث خطوات بسيطة تفصلك عن إقامتك المثالية</p>
            </div>
          </Reveal>

          <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-24 right-24 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2 z-0"></div>
            
            {[
              { icon: Search, title: "ابحث", desc: "تصفح آلاف العقارات واستخدم الفلاتر الذكية" },
              { icon: CheckCircle, title: "احجز", desc: "تواصل مع المالك مباشرة وقم بتأكيد حجزك" },
              { icon: Star, title: "استمتع", desc: "عش تجربة إقامة فاخرة وشاركنا تقييمك" }
            ].map((step, i) => (
              <Reveal key={i} delay={i * 0.2} className="w-full max-w-xs z-10">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-background border-4 border-primary flex items-center justify-center mb-6 shadow-gold relative">
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      {i + 1}
                    </div>
                    <step.icon size={32} className="text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Owner CTA */}
      <section id="owner" className="py-24 bg-[#1a1109] relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
          <img src={assetUrl("/properties/luxury-living-room.png")} alt="Bg" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1109] via-[#1a1109]/90 to-[#1a1109]/80 z-10"></div>
        
        <div className="container mx-auto px-4 relative z-20">
          <Reveal>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-[#f2e8da] mb-6 leading-tight">
                هل تملك عقاراً؟ <br/>
                <span className="text-[#c9974a]">انضم إلى نخبة المُلّاك في كنكون</span>
              </h2>
              <p className="text-[#8a7060] text-xl mb-10">
                استفد من منصتنا الذكية لعرض عقارك لآلاف الباحثين يومياً، أدر حجوزاتك بسهولة، وضاعف أرباحك بدون دفع عمولات.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/auth">
                  <button className="px-8 py-4 bg-[#c9974a] text-[#1a1109] font-bold rounded-xl hover:brightness-110 transition-all text-lg shadow-[0_10px_40px_rgba(201,151,74,0.3)]">
                    أضف عقارك الآن مجاناً
                  </button>
                </Link>
                <button className="px-8 py-4 bg-transparent border-2 border-[#8a7060] text-[#f2e8da] font-bold rounded-xl hover:bg-[#8a7060]/20 transition-all text-lg">
                  تعرف على المزايا
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">الأسئلة الشائعة</h2>
              <p className="text-muted-foreground text-lg">كل ما تحتاج معرفته عن كنكون</p>
            </div>
          </Reveal>

          <div className="flex flex-col gap-4">
            {faqs.map((faq, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div 
                  className={`border ${openFaq === i ? 'border-primary' : 'border-border'} bg-card rounded-2xl overflow-hidden transition-all`}
                >
                  <button 
                    className="w-full px-6 py-5 flex items-center justify-between text-right"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="font-bold text-lg text-foreground">{faq.q}</span>
                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${openFaq === i ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'}`}>
                      {openFaq === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-6 pb-5 text-muted-foreground leading-relaxed"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
