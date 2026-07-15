import { Product, Review } from "./types";

const IMAGE_MAPPINGS: Record<string, string[]> = {
  "prod-1": ["/1st.jpeg", "/1st back.jpeg"],
  "prod-2": ["/2nd.jpeg", "/2nd back.jpeg"],
  "prod-3": ["/3rd model.jpeg", "/3rd model back.jpeg"],
  "prod-4": ["/4th.jpeg", "/4th back.jpeg"],
  "prod-5": ["/5th.jpeg", "/5th back.jpeg"],
  "prod-6": ["/6th.jpeg", "/6th back.jpeg"],
  "prod-7": ["/7th.jpeg", "/7th back.jpeg"],
  "prod-8": ["/8th.jpeg", "/8th back.jpeg"],
  "prod-9": ["/9th.jpeg", "/9th back.jpeg"],
  "prod-10": ["/10th_v2.jpeg", "/10th_back_v2.jpeg"],
  "prod-11": ["/11th.jpeg", "/11th back.jpeg"],
  "prod-12": ["/12th.jpeg", "/12th back.jpeg"],
  "prod-13": ["/13th.jpeg", "/13th back.jpeg"],
  "prod-14": ["/14th.jpeg", "/14th back.jpeg"],
  "prod-15": ["/15th.jpg", "/15th back.jpg"]
};

export const fallbackProducts: Product[] = [
  {
    id: "prod-1",
    name: "Midnight Blue",
    description: "Make a statement in this embroidered kaftan dress, designed for effortless elegance. Crafted from a lightweight, flowy Premium Tussel Silk fabric, this full-length silhouette features intricate multicolor botanical and bird-inspired embroidery that adds a vibrant artistic touch to the rich blue base. The relaxed kaftan cut is complemented by a round neckline, wide bell sleeves, and detailed embroidery running along the front panel and hemline for a refined finish. The graceful drape offers both comfort and sophistication, making it perfect for festive gatherings.",
    category: "Signature Prints",
    fabric: "Premium Tussel Silk Fabric",
    embroidery: "Intricate multicolor botanical and bird-inspired embroidery.",
    stitching: "Relaxed full-length kaftan cut with a round neckline, wide bell sleeves, and beautifully embroidered front panel and hemline.",
    careInstructions: "Dry clean only or handwash with care.",
    note: "Actual product color may vary slightly due to photographic lighting and screen display settings.",
    sizeChart: "/size-chart.jpg",
    deliveryChargesNote: "Delivery charges are excluded and will be calculated at the time of dispatch according to the package weight and destination.",
    images: IMAGE_MAPPINGS["prod-1"],
    availableSizes: ["S", "M", "L", "XL"],
    prices: {
      PK: 33000,
      AE: 500,
      US: 135,
      GB: 100
    },
    deliveryTime: {
      PK: "3–4 Weeks",
      AE: "4–5 Weeks",
      US: "4–5 Weeks",
      GB: "4–5 Weeks"
    },
    stockStatus: "Pre-order",
    featured: true,
    dupattaAddon: {
      available: true,
      name: "Silk Dupatta",
      description: "2.75 yard Blue base color silk dupatta with contrast scallop finishing.",
      prices: {
        PK: 5000,
        AE: 115,
        US: 30,
        GB: 20
      }
    }
  },
  {
    id: "prod-2",
    name: "Hibiscus",
    description: "Elevate your wardrobe with this elegant rust-toned 2-piece suit, featuring intricate floral and geometric prints inspired by traditional craftsmanship. Designed with a straight-cut silhouette, this outfit offers the perfect blend of sophistication and comfort, making it ideal for your formal occasions.",
    category: "Signature Prints",
    fabric: "Premium Shisha Silk fabric",
    embroidery: "Intricate floral and geometric prints inspired by traditional craftsmanship.",
    stitching: "Elegant straight-cut silhouette with refined tailoring and premium finish.",
    careInstructions: "Dry clean only or handwash with care.",
    note: "Actual product color may vary slightly due to photographic lighting and screen display settings.",
    sizeChart: "/size-chart.jpg",
    deliveryChargesNote: "Delivery charges are excluded and will be calculated at the time of dispatch according to the package weight and destination.",
    images: IMAGE_MAPPINGS["prod-2"],
    availableSizes: ["S", "M", "L", "XL"],
    prices: {
      PK: 35000,
      AE: 500,
      US: 135,
      GB: 100
    },
    deliveryTime: {
      PK: "3-4 Weeks",
      AE: "4-5 Weeks",
      US: "4-5 Weeks",
      GB: "4-5 Weeks"
    },
    stockStatus: "Pre-order",
    featured: true,
    dupattaAddon: {
      available: true,
      name: "Rust Silk Dupatta",
      description: "2.75 yard Rust base color silk dupatta with contrast scallop finishing.",
      prices: {
        PK: 5000,
        AE: 115,
        US: 30,
        GB: 20
      }
    }
  },
  {
    id: "prod-3",
    name: "Daisy",
    description: "Elevate your wardrobe with this graceful ivory kaftan, designed to blend timeless elegance with contemporary sophistication. The kaftan is finished with an intricately embellished V-neckline adorned with fine lace detailing, while the wide sleeves showcase embroidered borders for an effortlessly luxurious touch. Its relaxed, full-length silhouette drapes beautifully, offering both comfort and elegance—perfect for festive gatherings or intimate occasions.",
    category: "Signature Prints",
    fabric: "Premium Tussel Silk Fabric",
    embroidery: "Intricately embellished V-neckline with fine lace detailing and embroidered sleeve borders.",
    stitching: "Relaxed full-length kaftan silhouette with wide sleeves and premium finishing for a graceful drape.",
    careInstructions: "Dry clean only or handwash with care.",
    note: "Actual product color may vary slightly due to photographic lighting and screen display settings.",
    sizeChart: "/size-chart.jpg",
    deliveryChargesNote: "Delivery charges are excluded and will be calculated at the time of dispatch according to the package weight and destination.",
    images: IMAGE_MAPPINGS["prod-3"],
    availableSizes: ["S", "M", "L", "XL"],
    prices: {
      PK: 29500,
      AE: 435,
      US: 120,
      GB: 90
    },
    deliveryTime: {
      PK: "3-4 Weeks",
      AE: "4-5 Weeks",
      US: "4-5 Weeks",
      GB: "4-5 Weeks"
    },
    stockStatus: "Pre-order",
    featured: true,
    dupattaAddon: {
      available: true,
      name: "Organza Dupatta",
      description: "2.75 yard Ivory base color organza dupatta with scallop finishing.",
      prices: {
        PK: 5000,
        AE: 115,
        US: 30,
        GB: 20
      }
    }
  },
  {
    id: "prod-4",
    name: "Jasmine",
    description: "Celebrate timeless craftsmanship with this sophisticated 2-piece ensemble, designed with intricate embroidery and rich handwork embellishment detailing. The soft neutral base is beautifully enhanced with vibrant floral and artistic motifs, making it a perfect choice for festive gatherings and celebrations.",
    category: "Signature Prints",
    fabric: "Premium Shisha Silk Fabric",
    embroidery: "Intricate embroidery with rich handwork embellishment, featuring vibrant floral and artistic motifs.",
    stitching: "Elegant straight-cut 2-piece silhouette with premium finishing, designed for both sophistication and comfort.",
    careInstructions: "Dry clean only or handwash with care.",
    note: "Actual product color may vary slightly due to photographic lighting and screen display settings.",
    sizeChart: "/size-chart.jpg",
    deliveryChargesNote: "Delivery charges are excluded and will be calculated at the time of dispatch according to the package weight and destination.",
    images: IMAGE_MAPPINGS["prod-4"],
    availableSizes: ["S", "M", "L", "XL"],
    prices: {
      PK: 45000,
      AE: 465,
      US: 125,
      GB: 135
    },
    deliveryTime: {
      PK: "3-4 Weeks",
      AE: "4-5 Weeks",
      US: "4-5 Weeks",
      GB: "4-5 Weeks"
    },
    stockStatus: "Pre-order",
    featured: true,
    dupattaAddon: {
      available: true,
      name: "Black Chiffon Dupatta",
      description: "2.75 yard Black chiffon dupatta with Golden Sitara and lace finishing.",
      prices: {
        PK: 7000,
        AE: 130,
        US: 35,
        GB: 25
      }
    }
  },
  {
    id: "prod-5",
    name: "Bloom",
    description: "Make a statement in this 2-piece embroidered kaftan dress, designed for effortless elegance. Crafted from a lightweight, flowy Premium Tussel Silk fabric, this full-length silhouette features intricate multicolor embroidery that adds a vibrant artistic touch to the rich blue base. The relaxed kaftan cut is complemented by a round neckline, wide bell sleeves, and detailed embroidery running along the front panel and hemline for a refined finish.",
    category: "Signature Prints",
    fabric: "Premium Tussel Silk Fabric",
    embroidery: "Intricate multicolor embroidery with artistic detailing across the front panel and hemline.",
    stitching: "Relaxed full-length 2-piece kaftan silhouette with a round neckline, wide bell sleeves, and premium finishing.",
    careInstructions: "Dry clean only or handwash with care.",
    note: "Actual product color may vary slightly due to photographic lighting and screen display settings.",
    sizeChart: "/size-chart.jpg",
    deliveryChargesNote: "Delivery charges are excluded and will be calculated at the time of dispatch according to the package weight and destination.",
    images: IMAGE_MAPPINGS["prod-5"],
    availableSizes: ["S", "M", "L", "XL"],
    prices: {
      PK: 33000,
      AE: 500,
      US: 135,
      GB: 100
    },
    deliveryTime: {
      PK: "3-4 Weeks",
      AE: "4-5 Weeks",
      US: "4-5 Weeks",
      GB: "4-5 Weeks"
    },
    stockStatus: "Pre-order",
    featured: true,
    dupattaAddon: {
      available: true,
      name: "Silk Dupatta",
      description: "2.75 yard Blue base color silk dupatta with scallop finishing.",
      prices: {
        PK: 5000,
        AE: 115,
        US: 30,
        GB: 20
      }
    }
  },
  {
    id: "prod-6",
    name: "Gladiolus",
    description: "Make a statement in this 2-piece Aari embroidered dress. Gracefully elegant and effortlessly refined, this peachy-pink suit is adorned with striking black Aari embroidery-inspired paisley and floral motifs that create a timeless statement. Designed with a relaxed straight silhouette, it offers both comfort and sophistication for semi-formal occasions.",
    category: "Signature Prints",
    fabric: "Premium Korean Silk Fabric",
    embroidery: "Intricate black Aari embroidery-inspired paisley and floral motifs.",
    stitching: "Relaxed straight-cut 2-piece silhouette with premium finishing, designed for elegance and comfort.",
    careInstructions: "Dry clean only or handwash with care.",
    note: "Actual product color may vary slightly due to photographic lighting and screen display settings.",
    sizeChart: "/size-chart.jpg",
    deliveryChargesNote: "Delivery charges are excluded and will be calculated at the time of dispatch according to the package weight and destination.",
    images: IMAGE_MAPPINGS["prod-6"],
    availableSizes: ["S", "M", "L", "XL"],
    prices: {
      PK: 35000,
      AE: 500,
      US: 135,
      GB: 100
    },
    deliveryTime: {
      PK: "3-4 Weeks",
      AE: "4-5 Weeks",
      US: "4-5 Weeks",
      GB: "4-5 Weeks"
    },
    stockStatus: "Pre-order",
    featured: true,
    dupattaAddon: {
      available: true,
      name: "Organza Dupatta",
      description: "2.75 yard base color organza dupatta with black scallop finishing.",
      prices: {
        PK: 5000,
        AE: 115,
        US: 30,
        GB: 20
      }
    }
  },
  {
    id: "prod-7",
    name: "Pink Rose",
    description: "Make a statement in this 2-piece embroidered dress. Elevate your everyday elegance with this beautifully crafted blush pink 2-piece suit, featuring intricate Kashmiri-inspired Aari embroidery in vibrant shades. The straight-cut shirt is adorned with a richly embroidered neckline, statement floral and paisley motifs, and detailed borders.",
    category: "Signature Prints",
    fabric: "Premium Tussel Silk Fabric",
    embroidery: "Intricate Kashmiri-inspired Aari embroidery featuring vibrant floral and paisley motifs with richly embroidered borders.",
    stitching: "Elegant straight-cut 2-piece silhouette with wide embroidered sleeves and premium finishing for a refined look.",
    careInstructions: "Dry clean only or handwash with care.",
    note: "Actual product color may vary slightly due to photographic lighting and screen display settings.",
    sizeChart: "/size-chart.jpg",
    deliveryChargesNote: "Delivery charges are excluded and will be calculated at the time of dispatch according to the package weight and destination.",
    images: IMAGE_MAPPINGS["prod-7"],
    availableSizes: ["S", "M", "L", "XL"],
    prices: {
      PK: 33000,
      AE: 500,
      US: 135,
      GB: 100
    },
    deliveryTime: {
      PK: "3-4 Weeks",
      AE: "4-5 Weeks",
      US: "4-5 Weeks",
      GB: "4-5 Weeks"
    },
    stockStatus: "Pre-order",
    featured: true,
    dupattaAddon: {
      available: true,
      name: "Silk Dupatta",
      description: "2.75 yard Blue base color silk dupatta with scallop finishing.",
      prices: {
        PK: 5000,
        AE: 115,
        US: 30,
        GB: 20
      }
    }
  },
  {
    id: "prod-8",
    name: "Dahlia",
    description: "Refresh your wardrobe with this elegant emerald green two-piece dress, beautifully adorned with all-over botanical floral embroidery in soft pastel hues and handwork finishing. Designed for effortless sophistication, this straight-cut kurta features a delicately embroidered neckline.",
    category: "Signature Prints",
    fabric: "Premium Shisha Silk Fabric",
    embroidery: "All-over botanical floral embroidery in soft pastel hues with intricate handwork finishing.",
    stitching: "Elegant straight-cut 2-piece silhouette with a delicately embroidered neckline and premium finishing.",
    careInstructions: "Dry clean only or handwash with care.",
    note: "Actual product color may vary slightly due to photographic lighting and screen display settings.",
    sizeChart: "/size-chart.jpg",
    deliveryChargesNote: "Delivery charges are excluded and will be calculated at the time of dispatch according to the package weight and destination.",
    images: IMAGE_MAPPINGS["prod-8"],
    availableSizes: ["S", "M", "L", "XL"],
    prices: {
      PK: 33500,
      AE: 450,
      US: 135,
      GB: 90
    },
    deliveryTime: {
      PK: "3-4 Weeks",
      AE: "4-5 Weeks",
      US: "4-5 Weeks",
      GB: "4-5 Weeks"
    },
    stockStatus: "Pre-order",
    featured: true,
    dupattaAddon: {
      available: true,
      name: "Silk Dupatta",
      description: "2.75 yard base color silk dupatta with scallop finishing.",
      prices: {
        PK: 5000,
        AE: 115,
        US: 30,
        GB: 20
      }
    }
  },
  {
    id: "prod-9",
    name: "Lily",
    description: "Elevate your wardrobe with this timeless 2-piece beige embroidered long dress, designed to blend elegance with effortless sophistication. Crafted from premium Shisha Silk fabric in a soft neutral hue, this straight-cut silhouette features delicate floral embroidery throughout, accented with intricate 3D floral appliqués.",
    category: "Signature Prints",
    fabric: "Premium Shisha Silk Fabric",
    embroidery: "Delicate floral embroidery with intricate 3D floral appliqués, complemented by an embroidered neckline and elegant wide sleeves.",
    stitching: "Elegant straight-cut 2-piece silhouette with statement wide sleeves, scalloped hem, and premium finishing.",
    careInstructions: "Dry clean only or handwash with care.",
    note: "Actual product color may vary slightly due to photographic lighting and screen display settings.",
    sizeChart: "/size-chart.jpg",
    deliveryChargesNote: "Delivery charges are excluded and will be calculated at the time of dispatch according to the package weight and destination.",
    images: IMAGE_MAPPINGS["prod-9"],
    availableSizes: ["S", "M", "L", "XL"],
    prices: {
      PK: 30000,
      AE: 450,
      US: 120,
      GB: 80
    },
    deliveryTime: {
      PK: "3-4 Weeks",
      AE: "4-5 Weeks",
      US: "4-5 Weeks",
      GB: "4-5 Weeks"
    },
    stockStatus: "Pre-order",
    featured: true,
    dupattaAddon: {
      available: true,
      name: "Organza Dupatta",
      description: "2.75 yard base color organza dupatta with scallop finishing.",
      prices: {
        PK: 5000,
        AE: 115,
        US: 30,
        GB: 20
      }
    }
  },
  {
    id: "prod-10",
    name: "Sunflower",
    description: "Elevate your look with this 2-piece butter yellow kaftan. The relaxed silhouette features a round neckline with delicate tassel ties, while the statement slit sleeves add a modern, flowy touch. Intricate floral embroidery is thoughtfully placed across the front, sleeves, and hem.",
    category: "Signature Prints",
    fabric: "Premium Tussel Silk Fabric",
    embroidery: "Intricate floral embroidery across the front, sleeves, and hem with elegant handcrafted detailing.",
    stitching: "Relaxed full-length 2-piece kaftan silhouette featuring a round neckline with tassel ties, statement slit sleeves, and premium finishing.",
    careInstructions: "Dry clean only or handwash with care.",
    note: "Actual product color may vary slightly due to photographic lighting and screen display settings.",
    sizeChart: "/size-chart.jpg",
    deliveryChargesNote: "Delivery charges are excluded and will be calculated at the time of dispatch according to the package weight and destination.",
    images: IMAGE_MAPPINGS["prod-10"],
    availableSizes: ["S", "M", "L", "XL"],
    prices: {
      PK: 35000,
      AE: 500,
      US: 135,
      GB: 100
    },
    deliveryTime: {
      PK: "3-4 Weeks",
      AE: "4-5 Weeks",
      US: "4-5 Weeks",
      GB: "4-5 Weeks"
    },
    stockStatus: "Pre-order",
    featured: true,
    dupattaAddon: {
      available: true,
      name: "Organza Dupatta",
      description: "2.75 yard base color organza dupatta with scallop finishing.",
      prices: {
        PK: 5000,
        AE: 115,
        US: 30,
        GB: 20
      }
    }
  },
  {
    id: "prod-11",
    name: "Moonlight",
    description: "Refresh your wardrobe with this elegant black 2-piece kaftan, beautifully adorned with ivory embroidery. Designed for effortless sophistication, this kaftan features a delicate stonework neckline and embellished shirt outline that enhances its graceful appeal.",
    category: "Signature Prints",
    fabric: "Premium Tussel Silk Fabric",
    embroidery: "Elegant ivory embroidery with delicate stonework detailing on the neckline and shirt outline.",
    stitching: "Relaxed full-length 2-piece kaftan silhouette paired with straight trousers and finished with premium tailoring for a graceful drape.",
    careInstructions: "Dry clean only or handwash with care.",
    note: "Actual product color may vary slightly due to photographic lighting and screen display settings.",
    sizeChart: "/size-chart.jpg",
    deliveryChargesNote: "Delivery charges are excluded and will be calculated at the time of dispatch according to the package weight and destination.",
    images: IMAGE_MAPPINGS["prod-11"],
    availableSizes: ["S", "M", "L", "XL"],
    prices: {
      PK: 34500,
      AE: 450,
      US: 135,
      GB: 90
    },
    deliveryTime: {
      PK: "3-4 Weeks",
      AE: "4-5 Weeks",
      US: "4-5 Weeks",
      GB: "4-5 Weeks"
    },
    stockStatus: "Pre-order",
    featured: true,
    dupattaAddon: {
      available: true,
      name: "Fine Silk Dupatta",
      description: "2.75 yard black base color fine silk dupatta with scallop finishing.",
      prices: {
        PK: 5000,
        AE: 115,
        US: 30,
        GB: 20
      }
    }
  },
  {
    id: "prod-12",
    name: "Iris",
    description: "Elevate your look with this elegant 2-piece sky blue dress, crafted from premium Shisha Silk fabric. The straight-cut silhouette is enhanced with beautifully embroidered front panels, delicately embroidered sleeves, and an ornate hem border.",
    category: "Signature Prints",
    fabric: "Premium Shisha Silk Fabric",
    embroidery: "Beautifully embroidered front panels, delicate sleeve embroidery, and an ornate embroidered hem border.",
    stitching: "Elegant straight-cut 2-piece silhouette with premium finishing for a graceful and sophisticated look.",
    careInstructions: "Dry clean only or handwash with care.",
    note: "Actual product color may vary slightly due to photographic lighting and screen display settings.",
    sizeChart: "/size-chart.jpg",
    deliveryChargesNote: "Delivery charges are excluded and will be calculated at the time of dispatch according to the package weight and destination.",
    images: IMAGE_MAPPINGS["prod-12"],
    availableSizes: ["S", "M", "L", "XL"],
    prices: {
      PK: 33500,
      AE: 450,
      US: 135,
      GB: 90
    },
    deliveryTime: {
      PK: "3-4 Weeks",
      AE: "4-5 Weeks",
      US: "4-5 Weeks",
      GB: "4-5 Weeks"
    },
    stockStatus: "Pre-order",
    featured: true,
    dupattaAddon: {
      available: true,
      name: "Green Silk Dupatta",
      description: "2.75 yard green silk dupatta in a contrast color with scallop finishing.",
      prices: {
        PK: 3000,
        AE: 115,
        US: 30,
        GB: 20
      }
    }
  },
  {
    id: "prod-13",
    name: "Orchid",
    description: "Exude effortless elegance in this luxurious 2-piece pink kaftan, beautifully adorned with intricate embroidery. Crafted from premium Tussah Silk fabric, the soft material offers a graceful drape and is paired with straight trousers.",
    category: "Signature Prints",
    fabric: "Premium Tussah Silk Fabric",
    embroidery: "Intricate embroidery with elegant handcrafted detailing.",
    stitching: "Relaxed full-length 2-piece kaftan silhouette paired with straight trousers and premium finishing for a graceful drape.",
    careInstructions: "Dry clean only or handwash with care.",
    note: "Actual product color may vary slightly due to photographic lighting and screen display settings.",
    sizeChart: "/size-chart.jpg",
    deliveryChargesNote: "Delivery charges are excluded and will be calculated at the time of dispatch according to the package weight and destination.",
    images: IMAGE_MAPPINGS["prod-13"],
    availableSizes: ["S", "M", "L", "XL"],
    prices: {
      PK: 33500,
      AE: 450,
      US: 135,
      GB: 90
    },
    deliveryTime: {
      PK: "3-4 Weeks",
      AE: "4-5 Weeks",
      US: "4-5 Weeks",
      GB: "4-5 Weeks"
    },
    stockStatus: "Pre-order",
    featured: true,
    dupattaAddon: {
      available: true,
      name: "Fine Silk Dupatta",
      description: "2.75 yard black base color fine silk dupatta with scallop finishing.",
      prices: {
        PK: 5000,
        AE: 115,
        US: 30,
        GB: 20
      }
    }
  },
  {
    id: "prod-14",
    name: "Pine",
    description: "Refresh your wardrobe with this elegant emerald green 2-piece kaftan, beautifully adorned with all-over embroidery in soft pastel hues. Designed for effortless sophistication, this kaftan features a delicately embroidered neckline that enhances its graceful appeal.",
    category: "Signature Prints",
    fabric: "Premium Shisha Silk Fabric",
    embroidery: "All-over embroidery in soft pastel hues with a delicately embroidered neckline and elegant handcrafted detailing.",
    stitching: "Relaxed full-length 2-piece kaftan silhouette paired with straight trousers and finished with premium tailoring for a graceful drape.",
    careInstructions: "Dry clean only or handwash with care.",
    note: "Actual product color may vary slightly due to photographic lighting and screen display settings.",
    sizeChart: "/size-chart.jpg",
    deliveryChargesNote: "Delivery charges are excluded and will be calculated at the time of dispatch according to the package weight and destination.",
    images: IMAGE_MAPPINGS["prod-14"],
    availableSizes: ["S", "M", "L", "XL"],
    prices: {
      PK: 33500,
      AE: 450,
      US: 135,
      GB: 90
    },
    deliveryTime: {
      PK: "3-4 Weeks",
      AE: "4-5 Weeks",
      US: "4-5 Weeks",
      GB: "4-5 Weeks"
    },
    stockStatus: "Pre-order",
    featured: true,
    dupattaAddon: {
      available: true,
      name: "Organza Dupatta",
      description: "2.75 yard base color organza dupatta with scallop finishing.",
      prices: {
        PK: 5000,
        AE: 115,
        US: 30,
        GB: 20
      }
    }
  },
  {
    id: "prod-15",
    name: "Mint",
    description: "Exude effortless elegance in this luxurious 2-piece mint green kaftan, beautifully adorned with intricate floral and paisley embroidery. Crafted from premium Tussel Silk fabric, the soft material offers a graceful drape and is paired with straight trousers.",
    category: "Signature Prints",
    fabric: "Premium Tussel Silk Fabric",
    embroidery: "Intricate floral and paisley embroidery with elegant handcrafted detailing.",
    stitching: "Relaxed full-length 2-piece kaftan silhouette paired with straight trousers and premium finishing for a graceful drape.",
    careInstructions: "Dry clean only or handwash with care.",
    note: "Actual product color may vary slightly due to photographic lighting and screen display settings.",
    sizeChart: "/size-chart.jpg",
    deliveryChargesNote: "Delivery charges are excluded and will be calculated at the time of dispatch according to the package weight and destination.",
    images: IMAGE_MAPPINGS["prod-15"],
    availableSizes: ["S", "M", "L", "XL"],
    prices: {
      PK: 32500,
      AE: 450,
      US: 135,
      GB: 90
    },
    deliveryTime: {
      PK: "3-4 Weeks",
      AE: "4-5 Weeks",
      US: "4-5 Weeks",
      GB: "4-5 Weeks"
    },
    stockStatus: "Pre-order",
    featured: true,
    dupattaAddon: {
      available: true,
      name: "Fine Silk Dupatta",
      description: "2.75 yard black base color fine silk dupatta with scallop finishing.",
      prices: {
        PK: 5000,
        AE: 115,
        US: 30,
        GB: 20
      }
    }
  }
];

export const fallbackReviews: Review[] = [
  {
    id: "rev-1",
    productName: "Midnight Blue",
    customerName: "Amina K.",
    city: "London",
    rating: 5,
    comment: "Absolutely gorgeous handiwork! The silk on Midnight Blue is so soft, and the tilla embroidery was flawless. Truly bespoke luxury.",
    date: "2026-07-12T12:00:00.000Z"
  },
  {
    id: "rev-2",
    productName: "Daisy",
    customerName: "Zara M.",
    city: "Chicago",
    rating: 5,
    comment: "Order arrived in Chicago in exactly 5 weeks. Handstitching was precise to my custom measurements. Will definitely order again!",
    date: "2026-07-10T12:00:00.000Z"
  },
  {
    id: "rev-3",
    productName: "Hibiscus",
    customerName: "Sana A.",
    city: "Multan",
    rating: 4,
    comment: "The custom sizing fits like a glove. I specified some alteration requests for sleeve length and they followed them perfectly.",
    date: "2026-07-08T12:00:00.000Z"
  }
];
