import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { LogIn, UserPlus, Home, User, Key, CheckCircle, Upload, Camera, ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { KankoonLogo } from '@/components/KankoonLogo';

export default function AuthPage() {
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();
  const isRtl = language === 'ar';
  
  const [view, setView] = useState<'entry' | 'login' | 'register'>('entry');
  const [regStep, setRegStep] = useState(1);
  const [accountType, setAccountType] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocation('/');
  };

  const nextStep = () => setRegStep(p => Math.min(p + 1, 4));
  const prevStep = () => setRegStep(p => Math.max(p - 1, 1));

  // --- Login Form Component ---
  const LoginForm = () => (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="w-full max-w-md mx-auto">
      <div className="text-center mb-10">
        <KankoonLogo size={48} className="justify-center mb-6" />
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">{t('auth.login_title')}</h1>
        <p className="text-muted-foreground">{t('auth.login_sub')}</p>
      </div>
      
      <form onSubmit={handleLoginSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-foreground mb-2">{t('auth.email')}</label>
          <input type="email" required className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors" dir="ltr" />
        </div>
        <div>
          <label className="block text-sm font-bold text-foreground mb-2">{t('auth.password')}</label>
          <input type="password" required className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors" dir="ltr" />
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded border-border text-primary focus:ring-primary accent-primary" />
            <span className="text-muted-foreground">{t('auth.remember')}</span>
          </label>
          <a href="#" className="text-primary font-bold hover:underline">{t('auth.forgot')}</a>
        </div>
        
        <button type="submit" className="w-full py-4 bg-primary text-primary-foreground font-bold text-lg rounded-xl hover:brightness-110 shadow-gold transition-all mt-4">
          {t('header.login')}
        </button>
      </form>
      
      <div className="mt-8 text-center text-sm text-muted-foreground border-t border-border pt-6">
        ليس لديك حساب؟ <button onClick={() => setView('register')} className="text-primary font-bold hover:underline">إنشاء حساب جديد</button>
      </div>
      <button onClick={() => setView('entry')} className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-foreground">العودة للبداية</button>
    </motion.div>
  );

  // --- Registration Wizard ---
  const RegisterWizard = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full max-w-2xl mx-auto">
      {/* Progress */}
      {regStep < 4 && (
        <div className="mb-10">
          <div className="flex justify-between relative z-10">
            {[1, 2, 3].map(step => (
              <div key={step} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                step === regStep ? 'bg-primary text-primary-foreground shadow-gold' : 
                step < regStep ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'
              }`}>
                {step < regStep ? <CheckCircle size={16} /> : step}
              </div>
            ))}
          </div>
          <div className="h-1 bg-secondary -mt-5 relative z-0 rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-500" style={{ width: `${((regStep - 1) / 2) * 100}%` }}></div>
          </div>
          <div className="flex justify-between mt-3 text-xs font-bold text-muted-foreground px-1">
            <span>نوع الحساب</span><span>المعلومات الشخصية</span><span>التحقق</span>
          </div>
        </div>
      )}

      {/* Step 1 */}
      {regStep === 1 && (
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-display font-bold text-foreground mb-2">اختر نوع الحساب</h2>
            <p className="text-muted-foreground">لتخصيص تجربتك على منصة كنكون</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: 'owner', icon: Home, title: 'مالك عقار', desc: 'أنشر عقارك واستقبل الحجوزات' },
              { id: 'buyer', icon: User, title: 'مشتري', desc: 'ابحث عن عقار وشرائه' },
              { id: 'renter', icon: Key, title: 'مستأجر', desc: 'اعثر على إقامتك المثالية' }
            ].map(type => (
              <button 
                key={type.id}
                onClick={() => setAccountType(type.id)}
                className={`p-6 rounded-2xl border-2 text-right transition-all flex flex-col items-center justify-center text-center gap-3 relative ${
                  accountType === type.id ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/40'
                }`}
              >
                {accountType === type.id && (
                  <div className="absolute top-3 right-3 text-primary"><CheckCircle size={20} /></div>
                )}
                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${accountType === type.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-primary'}`}>
                  <type.icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg">{type.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{type.desc}</p>
                </div>
              </button>
            ))}
          </div>
          
          <button 
            onClick={nextStep} 
            disabled={!accountType}
            className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            التالي
          </button>
        </div>
      )}

      {/* Step 2 */}
      {regStep === 2 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-display font-bold text-foreground mb-6">المعلومات الشخصية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">الاسم الكامل</label>
              <input type="text" className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">رقم الهوية الوطنية</label>
              <input type="text" className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">رقم الهاتف</label>
              <input type="tel" className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground" dir="ltr" placeholder="+963" />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">البريد الإلكتروني</label>
              <input type="email" className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground" dir="ltr" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-foreground mb-2">كلمة المرور</label>
              <input type="password" className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground" dir="ltr" />
            </div>
          </div>
          
          <div className="flex gap-4 pt-4">
            <button onClick={prevStep} className="px-6 py-4 bg-secondary text-foreground font-bold rounded-xl hover:bg-border transition-colors">
              السابق
            </button>
            <button onClick={nextStep} className="flex-1 py-4 bg-primary text-primary-foreground font-bold rounded-xl">
              التالي
            </button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {regStep === 3 && (
        <div className="space-y-6">
          <div className="mb-6">
            <h2 className="text-2xl font-display font-bold text-foreground mb-2">التحقق من الهوية</h2>
            <p className="text-muted-foreground">لضمان بيئة آمنة لجميع المستخدمين، يرجى رفع المستندات التالية</p>
          </div>
          
          <div className="space-y-4">
            {[
              { id: 'front', title: 'وجه الهوية الوطنية', icon: Upload },
              { id: 'back', title: 'خلف الهوية الوطنية', icon: Upload },
              { id: 'selfie', title: 'صورة شخصية (سيلفي)', icon: Camera }
            ].map(doc => (
              <div key={doc.id} className="border-2 border-dashed border-border rounded-2xl p-6 flex flex-col items-center justify-center bg-secondary/30 hover:bg-secondary/50 hover:border-primary/50 transition-colors cursor-pointer group">
                <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center text-muted-foreground group-hover:text-primary mb-3 shadow-sm">
                  <doc.icon size={20} />
                </div>
                <span className="font-bold text-foreground">{doc.title}</span>
                <span className="text-xs text-muted-foreground mt-1">انقر للرفع أو اسحب الصورة هنا</span>
              </div>
            ))}
          </div>
          
          <div className="flex gap-4 pt-4">
            <button onClick={prevStep} className="px-6 py-4 bg-secondary text-foreground font-bold rounded-xl hover:bg-border transition-colors">
              السابق
            </button>
            <button onClick={nextStep} className="flex-1 py-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-gold">
              إنشاء الحساب
            </button>
          </div>
        </div>
      )}

      {/* Step 4 - Success */}
      {regStep === 4 && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-6 py-10">
          <div className="relative w-32 h-32 mx-auto">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
            <div className="relative w-full h-full bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-gold">
              <CheckCircle size={64} />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">مرحباً بك في كنكون!</h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              تم إنشاء حسابك بنجاح. يمكنك الآن الاستمتاع بجميع مميزات المنصة والبدء في استكشاف العقارات الفاخرة.
            </p>
          </div>
          <button onClick={() => setLocation('/')} className="px-10 py-4 bg-primary text-primary-foreground font-bold text-lg rounded-xl shadow-gold hover:scale-105 transition-all mt-8">
            ابدأ الاستكشاف
          </button>
        </motion.div>
      )}

      {regStep < 4 && (
        <div className="mt-8 text-center text-sm">
          <button onClick={() => setView('entry')} className="text-muted-foreground hover:text-foreground">إلغاء والعودة للبداية</button>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-background px-4">
      <AnimatePresence mode="wait">
        
        {view === 'entry' && (
          <motion.div key="entry" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-4xl">
            <div className="text-center mb-12">
              <KankoonLogo size={56} className="justify-center mb-6" />
              <h1 className="text-4xl font-display font-bold text-foreground mb-4">أهلاً بك في منصة كنكون</h1>
              <p className="text-xl text-muted-foreground">يرجى اختيار طريقة الدخول للمنصة</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div 
                onClick={() => setView('login')}
                className="bg-card border border-border p-8 rounded-3xl flex flex-col items-center text-center cursor-pointer hover:border-primary hover:shadow-gold transition-all group"
              >
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors mb-6">
                  <LogIn size={32} />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">تسجيل الدخول</h2>
                <p className="text-muted-foreground mb-6">لديك حساب مسبقاً؟ قم بتسجيل الدخول للوصول لحجوزاتك</p>
                <div className="mt-auto text-primary font-bold flex items-center gap-2">
                  دخول {isRtl ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                </div>
              </div>
              
              <div 
                onClick={() => { setView('register'); setRegStep(1); }}
                className="bg-primary p-8 rounded-3xl flex flex-col items-center text-center cursor-pointer hover:brightness-110 shadow-luxury transition-all group"
              >
                <div className="w-20 h-20 rounded-full bg-primary-foreground/20 flex items-center justify-center text-primary-foreground mb-6">
                  <UserPlus size={32} />
                </div>
                <h2 className="text-2xl font-bold text-primary-foreground mb-2">إنشاء حساب</h2>
                <p className="text-primary-foreground/80 mb-6">انضم إلينا كمالك أو مستأجر واستمتع بجميع المزايا</p>
                <div className="mt-auto text-primary-foreground font-bold flex items-center gap-2">
                  تسجيل {isRtl ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {view === 'login' && <LoginForm key="login" />}
        {view === 'register' && <RegisterWizard key="register" />}
        
      </AnimatePresence>
    </div>
  );
}
