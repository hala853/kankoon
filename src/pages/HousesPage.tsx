import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { propertiesData, Property } from '@/lib/data';
import { assetUrl } from '@/lib/utils';
import { PropertyCard } from '@/components/PropertyCard';
import { Reveal } from '@/components/Reveal';
import { Filter, SlidersHorizontal, MapPin, Search } from 'lucide-react';
import { useSearch } from 'wouter';

export default function HousesPage() {
  const { t, language } = useLanguage();
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
    // Simulate API load
    setIsLoading(true);
    const timer = setTimeout(() => {
      setProperties(propertiesData.filter(p => p.category === 'houses'));
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredProperties = useMemo(() => {
    let result = [...properties];

    // Filter by text search from URL query param
    if (textSearch) {
      result = result.filter(p => p.title.includes(textSearch) || p.location.includes(textSearch));
    }

    // Filter by city
    if (city !== 'all') {
      result = result.filter(p => p.location.includes(city));
    }

    // Filter by price
    if (priceRange < 100) {
      result = result.filter(p => parseInt(p.priceUsd) <= priceRange);
    }

    // Filter by beds
    if (beds !== 'all') {
      const minBeds = parseInt(beds);
      result = result.filter(p => p.beds >= minBeds);
    }

    // Filter by availability
    if (showAvailableOnly) {
      result = result.filter(p => p.available);
    }

    // Sort
    switch (sortBy) {
      case 'low_price':
        result.sort((a, b) => parseInt(a.priceUsd) - parseInt(b.priceUsd));
        break;
      case 'high_price':
        result.sort((a, b) => parseInt(b.priceUsd) - parseInt(a.priceUsd));
        break;
      case 'top_rated':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        // Keep original order, but prioritize featured tag
        result.sort((a, b) => (b.tag ? 1 : 0) - (a.tag ? 1 : 0));
        break;
    }

    return result;
  }, [properties, city, priceRange, beds, showAvailableOnly, sortBy, textSearch]);

  return (
    <div className="w-full pt-20">
      {/* Category Hero */}
      <section className="relative h-[30vh] min-h-[250px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <img 
            src={assetUrl("/properties/modern-apartment.png")} 
            alt="Houses Category" 
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.src = assetUrl('/hero-landscape.jpeg'); }}
          />
        </div>
        <div className="container mx-auto px-4 relative z-20 text-center">
          <Reveal>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              بيوت وشقق فندقية
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              تصفح مجموعة واسعة من الشقق الفاخرة والبيوت الراقية في أفضل المواقع للإيجار أو البيع.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters (Desktop) / Toggleable (Mobile) */}
          <div className="lg:w-1/4">
            <div className="lg:hidden flex items-center justify-between mb-4">
              <span className="font-bold text-foreground">
                {filteredProperties.length} نتيجة
              </span>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg font-medium text-foreground"
              >
                <Filter size={18} />
                <span>الفلاتر</span>
              </button>
            </div>

            <div className={`glass-strong p-6 rounded-2xl border border-border sticky top-28 ${showFilters ? 'block mb-6' : 'hidden lg:block'}`}>
              <div className="flex items-center gap-2 mb-6 text-foreground font-display font-bold text-xl border-b border-border/50 pb-4">
                <SlidersHorizontal size={20} className="text-primary" />
                <span>بحث متقدم</span>
              </div>

              {/* City Filter */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-foreground mb-3">{t('filter.city')}</label>
                <div className="relative">
                  <MapPin size={16} className="absolute top-1/2 -translate-y-1/2 right-3 text-muted-foreground" />
                  <select 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg pl-3 pr-10 py-2.5 text-sm focus:outline-none focus:border-primary appearance-none text-foreground"
                  >
                    <option value="all">{t('filter.all')}</option>
                    <option value="دمشق">دمشق</option>
                    <option value="اللاذقية">اللاذقية</option>
                    <option value="طرطوس">طرطوس</option>
                  </select>
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-foreground mb-3 flex justify-between">
                  <span>{t('filter.price')}</span>
                  <span dir="ltr">${priceRange}</span>
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  step="5"
                  value={priceRange}
                  onChange={(e) => setPriceRange(parseInt(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1" dir="ltr">
                  <span>$0</span>
                  <span>$100+</span>
                </div>
              </div>

              {/* Beds Filter */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-foreground mb-3">{t('general.beds')}</label>
                <div className="flex flex-wrap gap-2">
                  {['all', '1', '2', '3', '4'].map(val => (
                    <button
                      key={val}
                      onClick={() => setBeds(val)}
                      className={`w-10 h-10 rounded-lg border flex items-center justify-center font-medium transition-colors ${
                        beds === val 
                          ? 'bg-primary text-primary-foreground border-primary' 
                          : 'bg-background text-foreground border-border hover:border-primary/50'
                      }`}
                    >
                      {val === 'all' ? t('filter.all') : val === '4' ? '+4' : val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Checkboxes */}
              <div className="mb-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={showAvailableOnly}
                    onChange={(e) => setShowAvailableOnly(e.target.checked)}
                    className="w-5 h-5 rounded border-border text-primary focus:ring-primary accent-primary"
                  />
                  <span className="text-sm font-medium text-foreground">{t('filter.available_only')}</span>
                </label>
              </div>

            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Sort Bar */}
            <div className="hidden lg:flex items-center justify-between mb-6 bg-card p-4 rounded-xl border border-border">
              <span className="font-bold text-foreground">
                إظهار {filteredProperties.length} نتيجة
              </span>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">{t('filter.sort')}:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-none font-bold text-foreground focus:outline-none cursor-pointer"
                >
                  <option value="featured">{t('filter.sort.featured')}</option>
                  <option value="low_price">{t('filter.sort.low_price')}</option>
                  <option value="high_price">{t('filter.sort.high_price')}</option>
                  <option value="top_rated">{t('filter.sort.top_rated')}</option>
                </select>
              </div>
            </div>

            {/* Properties Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-card rounded-2xl overflow-hidden border border-border h-[400px] animate-pulse">
                    <div className="w-full h-[200px] bg-secondary"></div>
                    <div className="p-5">
                      <div className="w-3/4 h-6 bg-secondary rounded mb-4"></div>
                      <div className="w-1/2 h-4 bg-secondary rounded mb-6"></div>
                      <div className="grid grid-cols-3 gap-2 mb-6">
                        <div className="h-10 bg-secondary rounded"></div>
                        <div className="h-10 bg-secondary rounded"></div>
                        <div className="h-10 bg-secondary rounded"></div>
                      </div>
                      <div className="w-full h-10 bg-secondary rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProperties.length > 0 ? (
              <AnimatePresence mode="popLayout">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {filteredProperties.map((property, idx) => (
                    <PropertyCard key={property.id} property={property} index={idx} />
                  ))}
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center text-muted-foreground mb-6">
                  <Search size={40} />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">لا توجد نتائج مطابقة</h3>
                <p className="text-muted-foreground max-w-md">
                  جرب تغيير فلاتر البحث أو البحث في مدينة أخرى للحصول على نتائج أكثر.
                </p>
                <button 
                  onClick={() => {
                    setCity('all'); setPriceRange(100); setBeds('all'); setShowAvailableOnly(false);
                  }}
                  className="mt-6 px-6 py-2 bg-primary/10 text-primary font-bold rounded-lg hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  مسح الفلاتر
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
