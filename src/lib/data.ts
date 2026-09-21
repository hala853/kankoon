import { assetUrl } from './utils';
export type Property = {
  id: string;
  title: string;
  location: string;
  image: string;
  gallery?: string[];
  priceSyp: string;
  priceUsd: string;
  rating: number;
  reviews: number;
  verified: boolean;
  beds: number;
  baths: number;
  area: number;
  category: "houses" | "chalets" | "hotels";
  type?: string;
  description?: string;
  amenities: {
    electricity: boolean;
    water: boolean;
    internet: boolean;
    parking: boolean;
    pool?: boolean;
    ac?: boolean;
  };
  available: boolean;
  tag?: string;
  owner?: {
    name: string;
    photo: string;
    verified: boolean;
    responseRate: string;
    phone?: string;
    whatsapp?: string;
  };
  reviewsList?: {
    name: string;
    photo: string;
    rating: number;
    comment: string;
    date: string;
  }[];
  lat?: number;
  lng?: number;
};

export const propertiesData: Property[] = [
  {
    id: "villa-yasmeen",
    title: "فيلا الياسمين الحديثة",
    location: "المزة، دمشق",
    image: assetUrl("/properties/modern-villa.png"),
    gallery: [
      assetUrl("/properties/modern-villa.png"),
      assetUrl("/properties/luxury-living-room.png"),
      assetUrl("/properties/luxury-bedroom.png"),
      assetUrl("/properties/modern-apartment.png")
    ],
    priceSyp: "٣٩٩٬٠٠٠",
    priceUsd: "20",
    rating: 4.9,
    reviews: 128,
    verified: true,
    beds: 5,
    baths: 4,
    area: 420,
    category: "houses",
    type: "فيلا",
    description: "فيلا فاخرة حديثة في قلب المزة مع إطلالة رائعة على المدينة وتصميم داخلي عصري.",
    amenities: { electricity: true, water: true, internet: true, parking: true, ac: true },
    available: true,
    tag: "مميّز",
    owner: {
      name: "كرم شاهين",
      photo: assetUrl("/ai-assistant.png"),
      verified: true,
      responseRate: "98%",
      phone: "+963911000001",
      whatsapp: "+963911000001"
    },
    reviewsList: [
      {
        name: "ليان الأحمد",
        photo: assetUrl("/ai-assistant.png"),
        rating: 5,
        comment: "تجربة رائعة! الفيلا نظيفة وفاخرة.",
        date: "2025-06-15"
      },
      {
        name: "سامر ديب",
        photo: assetUrl("/ai-assistant.png"),
        rating: 5,
        comment: "أفضل إقامة في دمشق.",
        date: "2025-05-20"
      }
    ]
  },
  {
    id: "apartment-sham",
    title: "شقة الشام الأنيقة",
    location: "أبو رمانة، دمشق",
    image: assetUrl("/properties/luxury-living-room.png"),
    gallery: [
      assetUrl("/properties/luxury-living-room.png"),
      assetUrl("/properties/luxury-bedroom.png"),
      assetUrl("/properties/modern-apartment.png")
    ],
    priceSyp: "١٨٠٬٠٠٠",
    priceUsd: "9",
    rating: 4.8,
    reviews: 94,
    verified: true,
    beds: 3,
    baths: 2,
    area: 165,
    category: "houses",
    type: "شقة",
    amenities: { electricity: true, water: true, internet: true, parking: false },
    available: true,
    owner: {
      name: "رهف منصور",
      photo: assetUrl("/ai-assistant.png"),
      verified: true,
      responseRate: "95%"
    },
    reviewsList: [
      {
        name: "كرم شاهين",
        photo: assetUrl("/ai-assistant.png"),
        rating: 5,
        comment: "شقة أنيقة جداً.",
        date: "2025-06-01"
      }
    ]
  },
  {
    id: "bedroom-suite",
    title: "جناح النخيل الفاخر",
    location: "المالكي، دمشق",
    image: assetUrl("/properties/luxury-bedroom.png"),
    gallery: [
      assetUrl("/properties/luxury-bedroom.png"),
      assetUrl("/properties/luxury-living-room.png")
    ],
    priceSyp: "٢٢٠٬٠٠٠",
    priceUsd: "11",
    rating: 4.7,
    reviews: 63,
    verified: true,
    beds: 2,
    baths: 2,
    area: 120,
    category: "houses",
    type: "جناح",
    amenities: { electricity: true, water: true, internet: true, parking: true },
    available: true,
    owner: {
      name: "ليان الأحمد",
      photo: assetUrl("/ai-assistant.png"),
      verified: true,
      responseRate: "90%"
    }
  },
  {
    id: "apartment-tower",
    title: "شقة برج المدينة",
    location: "كفرسوسة، دمشق",
    image: assetUrl("/properties/modern-apartment.png"),
    gallery: [
      assetUrl("/properties/modern-apartment.png"),
      assetUrl("/properties/luxury-living-room.png")
    ],
    priceSyp: "١٩٠٬٠٠٠",
    priceUsd: "10",
    rating: 4.6,
    reviews: 51,
    verified: true,
    beds: 3,
    baths: 2,
    area: 140,
    category: "houses",
    type: "شقة",
    amenities: { electricity: true, water: true, internet: true, parking: true },
    available: false,
    owner: {
      name: "سامر ديب",
      photo: assetUrl("/ai-assistant.png"),
      verified: true,
      responseRate: "88%"
    }
  },
  {
    id: "chalet-pool",
    title: "شاليه المزار بمسبح خاص",
    location: "بلودان، ريف دمشق",
    image: assetUrl("/properties/chalet-pool.png"),
    gallery: [
      assetUrl("/properties/chalet-pool.png"),
      assetUrl("/properties/mountain-cabin.png"),
      assetUrl("/properties/farm-house.png")
    ],
    priceSyp: "٥١٠٬٠٠٠",
    priceUsd: "26",
    rating: 5.0,
    reviews: 87,
    verified: true,
    beds: 4,
    baths: 3,
    area: 380,
    category: "chalets",
    type: "شاليه",
    amenities: { electricity: true, water: true, internet: true, parking: true, pool: true },
    available: true,
    tag: "الأعلى تقييماً",
    owner: {
      name: "كرم شاهين",
      photo: assetUrl("/ai-assistant.png"),
      verified: true,
      responseRate: "97%"
    },
    reviewsList: [
      {
        name: "رهف منصور",
        photo: assetUrl("/ai-assistant.png"),
        rating: 5,
        comment: "شاليه خيالي بالمسبح!",
        date: "2025-07-01"
      }
    ]
  },
  {
    id: "sea-chalet",
    title: "شاليه إطلالة البحر",
    location: "اللاذقية، الساحل",
    image: assetUrl("/properties/sea-chalet.png"),
    gallery: [
      assetUrl("/properties/sea-chalet.png"),
      assetUrl("/properties/hotel-pool.png")
    ],
    priceSyp: "٤٦٠٬٠٠٠",
    priceUsd: "23",
    rating: 4.9,
    reviews: 72,
    verified: true,
    beds: 3,
    baths: 2,
    area: 240,
    category: "chalets",
    type: "شاليه",
    amenities: { electricity: true, water: true, internet: true, parking: true },
    available: true,
    owner: {
      name: "ليان الأحمد",
      photo: assetUrl("/ai-assistant.png"),
      verified: true,
      responseRate: "93%"
    }
  },
  {
    id: "farm-estate",
    title: "مزرعة الزيتون الخضراء",
    location: "ريف حماة",
    image: assetUrl("/properties/farm-house.png"),
    gallery: [
      assetUrl("/properties/farm-house.png"),
      assetUrl("/properties/mountain-cabin.png")
    ],
    priceSyp: "٣٤٠٬٠٠٠",
    priceUsd: "17",
    rating: 4.8,
    reviews: 44,
    verified: true,
    beds: 4,
    baths: 3,
    area: 900,
    category: "chalets",
    type: "مزرعة",
    amenities: { electricity: true, water: true, internet: false, parking: true },
    available: true,
    owner: {
      name: "سامر ديب",
      photo: assetUrl("/ai-assistant.png"),
      verified: true,
      responseRate: "85%"
    }
  },
  {
    id: "mountain-cabin",
    title: "كوخ الجبل الدافئ",
    location: "صلنفة، اللاذقية",
    image: assetUrl("/properties/mountain-cabin.png"),
    gallery: [
      assetUrl("/properties/mountain-cabin.png"),
      assetUrl("/properties/farm-house.png")
    ],
    priceSyp: "٢٩٠٬٠٠٠",
    priceUsd: "15",
    rating: 4.7,
    reviews: 38,
    verified: true,
    beds: 2,
    baths: 1,
    area: 110,
    category: "chalets",
    type: "كوخ",
    amenities: { electricity: true, water: true, internet: true, parking: true },
    available: true,
    owner: {
      name: "رهف منصور",
      photo: assetUrl("/ai-assistant.png"),
      verified: true,
      responseRate: "91%"
    }
  },
  {
    id: "hotel-suite",
    title: "جناح فندق الكريستال",
    location: "وسط دمشق",
    image: assetUrl("/properties/hotel-room.png"),
    gallery: [
      assetUrl("/properties/hotel-room.png"),
      assetUrl("/properties/luxury-bedroom.png"),
      assetUrl("/properties/luxury-living-room.png")
    ],
    priceSyp: "٦٥٠٬٠٠٠",
    priceUsd: "33",
    rating: 4.9,
    reviews: 210,
    verified: true,
    beds: 1,
    baths: 1,
    area: 65,
    category: "hotels",
    type: "جناح فندقي",
    amenities: { electricity: true, water: true, internet: true, parking: true, ac: true },
    available: true,
    tag: "خمس نجوم",
    owner: {
      name: "كرم شاهين",
      photo: assetUrl("/ai-assistant.png"),
      verified: true,
      responseRate: "99%"
    },
    reviewsList: [
      {
        name: "ليان الأحمد",
        photo: assetUrl("/ai-assistant.png"),
        rating: 5,
        comment: "فندق عالمي المستوى!",
        date: "2025-06-20"
      }
    ]
  },
  {
    id: "hotel-resort",
    title: "منتجع الواحة الفاخر",
    location: "طرطوس، الساحل",
    image: assetUrl("/properties/hotel-pool.png"),
    gallery: [
      assetUrl("/properties/hotel-pool.png"),
      assetUrl("/properties/hotel-room.png"),
      assetUrl("/properties/chalet-pool.png")
    ],
    priceSyp: "٧٥٠٬٠٠٠",
    priceUsd: "38",
    rating: 5.0,
    reviews: 156,
    verified: true,
    beds: 1,
    baths: 1,
    area: 80,
    category: "hotels",
    type: "منتجع",
    amenities: { electricity: true, water: true, internet: true, parking: true, pool: true, ac: true },
    available: true,
    tag: "منتجع",
    owner: {
      name: "سامر ديب",
      photo: assetUrl("/ai-assistant.png"),
      verified: true,
      responseRate: "98%"
    }
  }
];

export const citiesData = [
  { name: "دمشق", count: 1240, image: assetUrl("/cities/damascus.png") },
  { name: "الساحل", count: 860, image: assetUrl("/cities/coastal.png") },
  { name: "الجبال", count: 540, image: assetUrl("/cities/mountain-town.png") },
  { name: "الريف", count: 720, image: assetUrl("/cities/countryside.png") }
];

export const statsData = [
  { value: 12000, suffix: "+", label: "عقار موثّق" },
  { value: 48000, suffix: "+", label: "حجز ناجح" },
  { value: 30, suffix: "+", label: "مدينة ومنطقة" },
  { value: 98, suffix: "%", label: "رضا العملاء" }
];
