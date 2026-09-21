import React, { useState } from 'react';
import { useRoute, Link, useLocation } from 'wouter';
import { propertiesData } from '@/lib/data';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Heart, Share2, MapPin, Star, Bed, Bath, Maximize, Home as HomeIcon, Zap, Droplet, Wifi, Car, Waves, Wind, BadgeCheck, MessageCircle, Phone } from 'lucide-react';
import { KankoonLogo } from '@/components/KankoonLogo';

export default function PropertyDetailPage() {
  const [, params] = useRoute('/property/:id');
  const [, setLocation] = useLocation();
  const { t, language } = useLanguage();
  
  const property = propertiesData.find(p => p.id === params?.id);
  
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  if (!property) {
    return <div className="min-h-screen pt-32 text-center font-bold text-2xl text-foreground">العقار غير موجود</div>;
  }

  const gallery = property.gallery || [property.image];
  const isRtl = language === 'ar';

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % gallery.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  return (
    <div className="w-full pt-20 pb-24 bg-background">
      {/* Breadcrumb & Back */}
      <div className="container mx-auto px-4 py-4">
        <button 
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-medium"
        >
          {isRtl ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          <span>العودة للنتائج</span>
        </button>
      </div>

      {/* Hero Gallery */}
      <div className="container mx-auto px-4 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[40vh] md:h-[60vh] rounded-3xl overflow-hidden relative group">
          {/* Main Image */}
          <div className="md:col-span-3 relative h-full cursor-pointer" onClick={() => setShowLightbox(true)}>
            <img 
              src={gallery[0]} 
              alt={property.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
          </div>
          
          {/* Thumbnails (Desktop only) */}
          <div className="hidden md:flex flex-col gap-4 h-full">
            {gallery.slice(1, 3).map((img, idx) => (
              <div key={idx} className="relative h-1/2 overflow-hidden cursor-pointer" onClick={() => setShowLightbox(true)}>
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                {idx === 1 && gallery.length > 3 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">+{gallery.length - 3} عرض الكل</span>
                  </div>
                )}
              </div>
            ))}
            {gallery.length < 2 && (
              <div className="h-full bg-secondary flex items-center justify-center rounded-xl border border-border">
                 <KankoonLogo size={40} className="opacity-20" />
              </div>
            )}
          </div>

          {/* Floating Actions */}
          <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none">
            <div className="pointer-events-auto flex gap-3">
              <button 
                onClick={(e) => { e.stopPropagation(); setIsFavorite(!isFavorite); }}
                className="w-12 h-12 rounded-full glass flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              >
                <Heart size={22} className={isFavorite ? "fill-primary text-primary" : "text-white"} />
              </button>
              <button className="w-12 h-12 rounded-full glass flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <Share2 size={22} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-10">
            {/* Title & Basics */}
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                {property.tag && <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">{property.tag}</span>}
                <span className="px-3 py-1 bg-secondary text-foreground text-xs font-bold rounded-full">{property.type}</span>
                {property.verified && <span className="px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 text-xs font-bold rounded-full flex items-center gap-1"><BadgeCheck size={12}/> موثّق</span>}
              </div>
              <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4 leading-tight">{property.title}</h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-primary" />
                  <span className="text-lg">{property.location}</span>
                </div>
                <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-border"></div>
                <div className="flex items-center gap-2">
                  <Star size={18} className="fill-primary text-primary" />
                  <span className="font-bold text-foreground" dir="ltr">{property.rating}</span>
                  <span>({property.reviews} تقييم)</span>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Bed, label: t('general.beds'), val: property.beds },
                { icon: Bath, label: t('general.baths'), val: property.baths },
                { icon: Maximize, label: t('general.area'), val: `${property.area} ${t('general.area')}` },
                { icon: HomeIcon, label: t('filter.type'), val: property.type }
              ].map((stat, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                  <stat.icon size={24} className="text-primary mb-2" />
                  <span className="font-bold text-foreground mb-1">{stat.val}</span>
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </div>

            <hr className="border-border" />

            {/* Description */}
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-4">عن العقار</h2>
              <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-line">
                {property.description || "لا يوجد وصف إضافي لهذا العقار. يمكنك التواصل مع المالك لمزيد من التفاصيل."}
              </p>
            </div>

            <hr className="border-border" />

            {/* Amenities */}
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-6">{t('details.amenities')}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                {[
                  { key: 'electricity', icon: Zap, label: t('details.electricity') },
                  { key: 'water', icon: Droplet, label: t('details.water') },
                  { key: 'internet', icon: Wifi, label: t('details.internet') },
                  { key: 'parking', icon: Car, label: t('details.parking') },
                  { key: 'pool', icon: Waves, label: t('details.pool') },
                  { key: 'ac', icon: Wind, label: t('details.ac') }
                ].map((amenity, i) => {
                  const has = (property.amenities as any)[amenity.key];
                  if (has === undefined) return null;
                  return (
                    <div key={i} className={`flex items-center gap-3 ${has ? 'text-foreground' : 'text-muted-foreground/40 line-through'}`}>
                      <amenity.icon size={22} className={has ? 'text-primary' : ''} />
                      <span className="font-medium">{amenity.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <hr className="border-border" />

            {/* Reviews */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-display font-bold text-foreground">{t('details.reviews')}</h2>
                <button className="text-primary font-bold hover:underline">{t('details.add_review')}</button>
              </div>

              {property.reviewsList && property.reviewsList.length > 0 ? (
                <div className="space-y-6">
                  {property.reviewsList.map((review, i) => (
                    <div key={i} className="bg-card p-6 rounded-2xl border border-border">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <img src={review.photo} alt={review.name} className="w-12 h-12 rounded-full object-cover bg-secondary" />
                          <div>
                            <div className="font-bold text-foreground">{review.name}</div>
                            <div className="text-xs text-muted-foreground">{review.date}</div>
                          </div>
                        </div>
                        <div className="flex text-primary">
                          {[1,2,3,4,5].map(star => <Star key={star} size={14} className={star <= review.rating ? "fill-primary" : ""} />)}
                        </div>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-secondary/30 p-8 rounded-2xl text-center">
                  <p className="text-muted-foreground">لا توجد تقييمات حتى الآن. كن أول من يقيّم!</p>
                </div>
              )}
            </div>

          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              
              {/* Price Card */}
              <div className="bg-card border border-border rounded-3xl p-6 shadow-luxury">
                <div className="mb-6 pb-6 border-b border-border text-center">
                  <div className="text-3xl font-display font-bold text-primary mb-1">
                    {property.priceSyp} <span className="text-sm text-muted-foreground">ل.س</span>
                  </div>
                  <div className="text-muted-foreground font-medium" dir="ltr">${property.priceUsd} / {t('general.night')}</div>
                </div>
                
                <button className="w-full py-4 bg-primary text-primary-foreground font-bold text-lg rounded-xl hover:brightness-110 shadow-gold transition-all mb-4">
                  {t('general.book_now')}
                </button>
                <div className="text-center text-sm text-muted-foreground">
                  {t('details.no_commission')}
                </div>
              </div>

              {/* Owner Card */}
              {property.owner && (
                <div className="bg-card border border-border rounded-3xl p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <img src={property.owner.photo} alt={property.owner.name} className="w-16 h-16 rounded-full object-cover border-2 border-primary/20" />
                    <div>
                      <div className="font-bold text-lg text-foreground flex items-center gap-1">
                        {property.owner.name}
                        {property.owner.verified && <BadgeCheck size={18} className="text-primary" />}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t('details.response_rate')}: {property.owner.responseRate}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button className="w-full py-3 bg-secondary text-foreground font-bold rounded-xl hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-2">
                      <MessageCircle size={18} />
                      <span>{t('details.chat')}</span>
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="py-3 bg-transparent border border-border text-foreground font-bold rounded-xl hover:bg-secondary transition-all flex items-center justify-center gap-2">
                        <Phone size={18} />
                        <span>{t('details.call')}</span>
                      </button>
                      <button className="py-3 bg-transparent border border-green-500/30 text-green-600 font-bold rounded-xl hover:bg-green-500/10 transition-all flex items-center justify-center gap-2">
                        <MessageCircle size={18} />
                        <span>{t('details.whatsapp')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Map Placeholder */}
              <div className="bg-card border border-border rounded-3xl overflow-hidden h-[200px] relative flex flex-col items-center justify-center">
                <div className="absolute inset-0 bg-secondary/50 pattern-grid-lg text-border/40 pointer-events-none"></div>
                <MapPin size={40} className="text-primary mb-3 relative z-10" />
                <span className="font-bold text-foreground relative z-10">{property.location}</span>
                <span className="text-sm text-muted-foreground mt-1 relative z-10">الموقع التقريبي للمنطقة</span>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {showLightbox && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex flex-col"
          >
            <div className="p-4 flex justify-end">
              <button onClick={() => setShowLightbox(false)} className="text-white p-2 hover:bg-white/10 rounded-full transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center relative px-4 pb-10">
              <button onClick={prevImage} className="absolute left-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors">
                <ChevronLeft size={24} />
              </button>
              
              <img 
                key={activeImageIndex}
                src={gallery[activeImageIndex]} 
                alt="Gallery" 
                className="max-h-full max-w-full object-contain"
              />
              
              <button onClick={nextImage} className="absolute right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors">
                <ChevronRight size={24} />
              </button>
            </div>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center text-white/50 text-sm font-bold" dir="ltr">
              {activeImageIndex + 1} / {gallery.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
