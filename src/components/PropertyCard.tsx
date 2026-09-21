import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Property } from '@/lib/data';
import { Heart, MapPin, Star, Bed, Bath, Maximize, BadgeCheck } from 'lucide-react';
import { Link, useLocation } from 'wouter';

interface PropertyCardProps {
  property: Property;
  index?: number;
}

export function PropertyCard({ property, index = 0 }: PropertyCardProps) {
  const { t } = useLanguage();
  const [isFavorite, setIsFavorite] = useState(false);
  const [, setLocation] = useLocation();

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleNavigate = () => {
    setLocation(`/property/${property.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group bg-card rounded-2xl overflow-hidden border border-border shadow-md hover:shadow-gold transition-all duration-300 cursor-pointer flex flex-col h-full"
      onClick={handleNavigate}
      data-testid={`property-card-${property.id}`}
    >
      {/* Image Area */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={property.image} 
          alt={property.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <button 
            onClick={handleFavorite}
            className="p-2 rounded-full glass hover:scale-110 transition-transform z-10"
            data-testid={`button-favorite-${property.id}`}
          >
            <Heart 
              size={20} 
              className={isFavorite ? "fill-primary text-primary" : "text-white"} 
            />
          </button>
          
          <div className="flex flex-col gap-2 items-end">
            {property.tag && (
              <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full shadow-lg">
                {property.tag}
              </span>
            )}
            {!property.available && (
              <span className="px-3 py-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full shadow-lg">
                {t("general.unavailable")}
              </span>
            )}
          </div>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <div>
            <h3 className="text-white font-display font-bold text-lg leading-tight mb-1">
              {property.title}
            </h3>
            <div className="flex items-center text-white/80 text-sm">
              <MapPin size={14} className="ml-1 shrink-0" />
              <span className="truncate">{property.location}</span>
            </div>
          </div>
          <div className="glass px-2 py-1 rounded-lg flex items-center gap-1 shrink-0">
            <Star size={14} className="fill-primary text-primary" />
            <span className="text-white font-bold text-sm">{property.rating}</span>
          </div>
        </div>
      </div>

      {/* Body Area */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            {property.owner?.photo && (
              <img src={property.owner.photo} alt={property.owner.name} className="w-8 h-8 rounded-full object-cover" />
            )}
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground flex items-center gap-1">
                {property.owner?.name}
                {property.owner?.verified && <BadgeCheck size={14} className="text-primary" />}
              </span>
              <span className="text-xs text-muted-foreground">{t("general.verified")}</span>
            </div>
          </div>
          <div className="text-left" dir="ltr">
            <div className="text-primary font-bold text-xl leading-none mb-1">
              {property.priceSyp} <span className="text-xs text-muted-foreground font-normal">ل.س</span>
            </div>
            <div className="text-xs text-muted-foreground">
              ~${property.priceUsd} / {t("general.night")}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-5">
          <div className="flex flex-col items-center justify-center bg-secondary/50 rounded-lg py-2">
            <Bed size={18} className="text-muted-foreground mb-1" />
            <span className="text-xs font-medium text-foreground">{property.beds} {t("general.beds")}</span>
          </div>
          <div className="flex flex-col items-center justify-center bg-secondary/50 rounded-lg py-2">
            <Bath size={18} className="text-muted-foreground mb-1" />
            <span className="text-xs font-medium text-foreground">{property.baths} {t("general.baths")}</span>
          </div>
          <div className="flex flex-col items-center justify-center bg-secondary/50 rounded-lg py-2">
            <Maximize size={18} className="text-muted-foreground mb-1" />
            <span className="text-xs font-medium text-foreground" dir="ltr">{property.area} {t("general.area")}</span>
          </div>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-3">
          <button 
            className="w-full py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:brightness-110 transition-all active:scale-95"
            onClick={(e) => { e.stopPropagation(); handleNavigate(); }}
          >
            {t("general.book_now")}
          </button>
          <button 
            className="w-full py-2.5 bg-transparent border border-primary text-primary font-medium rounded-lg hover:bg-primary/5 transition-all active:scale-95"
            onClick={(e) => { e.stopPropagation(); handleNavigate(); }}
          >
            {t("general.quick_view")}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
