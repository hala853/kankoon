import React from 'react';
import { KankoonLogo } from './KankoonLogo';
import { useLanguage } from '@/contexts/LanguageContext';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'wouter';

export function SiteFooter() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#150f08] pt-16 pb-8 border-t border-primary/20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none"></div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          <div className="lg:col-span-2">
            <KankoonLogo size={42} className="mb-6" />
            <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-sm">
              {t('footer.desc')}
            </p>
            <div className="flex flex-col gap-3 text-muted-foreground text-sm">
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-primary" />
                <span>دمشق، سوريا - أبو رمانة</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-primary" />
                <span dir="ltr">+963 911 000 000</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-primary" />
                <span>hello@kankoon.sy</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-foreground font-display font-bold mb-5">الأقسام</h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="/houses"><span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">{t('nav.houses')}</span></Link></li>
              <li><Link href="/chalets"><span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">{t('nav.chalets')}</span></Link></li>
              <li><Link href="/hotels"><span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">{t('nav.hotels')}</span></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-foreground font-display font-bold mb-5">المنصة</h4>
            <ul className="flex flex-col gap-3">
              <li><a href="#about" className="text-muted-foreground hover:text-primary transition-colors">من نحن</a></li>
              <li><a href="#how" className="text-muted-foreground hover:text-primary transition-colors">{t('nav.how_it_works')}</a></li>
              <li><a href="#faq" className="text-muted-foreground hover:text-primary transition-colors">الأسئلة الشائعة</a></li>
              <li><span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">الشروط والأحكام</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-foreground font-display font-bold mb-5">للمُلّاك</h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="/auth"><span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">أضف عقارك</span></Link></li>
              <li><span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">دليل المالك</span></li>
              <li><span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">قصص نجاح</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            {t('footer.rights')}
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all">
              <Facebook size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all">
              <Instagram size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all">
              <Twitter size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
