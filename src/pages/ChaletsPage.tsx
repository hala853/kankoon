import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { propertiesData, Property } from '@/lib/data';
import { assetUrl } from '@/lib/utils';
import { PropertyCard } from '@/components/PropertyCard';
import { Reveal } from '@/components/Reveal';
import { Filter, SlidersHorizontal, MapPin, Search } from 'lucide-react';
import { useSearch } from 'wouter';

export default function ChaletsPage() {
  const { t } = useLanguage();
  const rawSearch = useSearch();
  const searchParams = new URLSearchParams(rawSearch);
  const initialQ = searchParams.get('q') || '';

  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [city, setCity] = useState('all');
  const [priceRange, setPriceRange] = useState(100);
  const [beds, setBeds] = useState('all');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [textSearch, setTextSearch] = useState(initialQ);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setProperties(propertiesData.filter(p => p.category === 'chalets'));
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredProperties = useMemo(() => {
    let result = [...properties];
    if (textSearch) result = result.filter(p => p.title.includes(textSearch) || p.location.includes(textSearch));
    if (city !== 'all') result = result.filter(p => p.location.includes(city));
    if (priceRange < 100) result = result.filter(p => parseInt(p.priceUsd) <= priceRange);
    if (beds !== 'all') result = result.filter(p => p.beds >= parseInt(beds));
    if (showAvailableOnly) result = result.filter(p => p.available);

    switch (sortBy) {
      case 'low_price': result.sort((a, b) => parseInt(a.priceUsd) - parseInt(b.priceUsd)); break;
      case 'high_price': result.sort((a, b) => parseInt(b.priceUsd) - parseInt(a.priceUsd)); break;
      case 'top_rated': result.sort((a, b) => b.rating - a.rating); break;
      case 'featured': default: result.sort((a, b) => (b.tag ? 1 : 0) - (a.tag ? 1 : 0)); break;
    }
    return result;
  }, [properties, city, priceRange, beds, showAvailableOnly, sortBy, textSearch]);

  return (
    <div className="w-full pt-20">
      <section className="relative h-[30vh] min-h-[250px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/50 z-10" />
          <img src={assetUrl("/properties/chalet-pool.png")} alt="Chalets Category" className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-4 relative z-20 text-center">
          <Reveal>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">شاليهات ومزارع</h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">أفضل الأماكن لقضاء عطلة مميزة مع العائلة والأصدقاء في الطبيعة.</p>
          </Reveal>
        </div>
      </section>
      
      {/* Rest is identical to HousesPage structure - keeping it DRY for this mock but full implementation */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <div className="lg:hidden flex items-center justify-between mb-4">
              <span className="font-bold text-foreground">{filteredProperties.length} نتيجة</span>
              <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg font-medium">
                <Filter size={18} /><span>الفلاتر</span>
              </button>
            </div>
            <div className={`glass-strong p-6 rounded-2xl border border-border sticky top-28 ${showFilters ? 'block mb-6' : 'hidden lg:block'}`}>
              <div className="flex items-center gap-2 mb-6 text-foreground font-display font-bold text-xl border-b border-border/50 pb-4">
                <SlidersHorizontal size={20} className="text-primary" /><span>بحث متقدم</span>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-bold text-foreground mb-3">{t('filter.city')}</label>
                <div className="relative">
                  <MapPin size={16} className="absolute top-1/2 -translate-y-1/2 right-3 text-muted-foreground" />
                  <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full bg-background border border-border rounded-lg pl-3 pr-10 py-2.5 text-sm focus:outline-none focus:border-primary appearance-none">
                    <option value="all">{t('filter.all')}</option>
                    <option value="اللاذقية">اللاذقية</option>
                    <option value="طرطوس">طرطوس</option>
                    <option value="ريف دمشق">ريف دمشق</option>
                    <option value="حماة">حماة</option>
                  </select>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-bold text-foreground mb-3 flex justify-between">
                  <span>{t('filter.price')}</span><span dir="ltr">${priceRange}</span>
                </label>
                <input type="range" min="0" max="100" step="5" value={priceRange} onChange={(e) => setPriceRange(parseInt(e.target.value))} className="w-full accent-primary" />
              </div>
              <div className="mb-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={showAvailableOnly} onChange={(e) => setShowAvailableOnly(e.target.checked)} className="w-5 h-5 rounded border-border text-primary focus:ring-primary accent-primary" />
                  <span className="text-sm font-medium text-foreground">{t('filter.available_only')}</span>
                </label>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="hidden lg:flex items-center justify-between mb-6 bg-card p-4 rounded-xl border border-border">
              <span className="font-bold text-foreground">إظهار {filteredProperties.length} نتيجة</span>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">{t('filter.sort')}:</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent border-none font-bold text-foreground focus:outline-none cursor-pointer">
                  <option value="featured">{t('filter.sort.featured')}</option>
                  <option value="low_price">{t('filter.sort.low_price')}</option>
                  <option value="high_price">{t('filter.sort.high_price')}</option>
                  <option value="top_rated">{t('filter.sort.top_rated')}</option>
                </select>
              </div>
            </div>
            {isLoading ? (
               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                 {[1,2,3,4].map(i => <div key={i} className="h-[400px] bg-card rounded-2xl animate-pulse border border-border"></div>)}
               </div>
            ) : filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProperties.map((property, idx) => <PropertyCard key={property.id} property={property} index={idx} />)}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Search size={40} className="text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold mb-2">لا توجد نتائج</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}