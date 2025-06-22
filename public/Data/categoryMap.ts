

// src/data/categoryMap.ts

/**
 * The 15 top–level buckets you asked for.
 */
export const UNIFIED_CATEGORIES = [
  "Electronics",
  "Toys & Games",
  "Home Decor",
  "Clothing",
  "Books",
  "Beauty & Wellness",
  "Food & Gourmet",
  "Travel Accessories",
  "Fitness & Health",
  "Office & Stationery",
  "DIY & Crafts",
  "Pet Gifts",
  "Music & Instruments",
  "Equipments",
  "Accessories"
] as const

/**
 * Each rule tests the raw category string (case-insensitive)
 * and returns the bucket it belongs to.
 */
const mappingRules: { pattern: RegExp; bucket: typeof UNIFIED_CATEGORIES[number] }[] = [
  // video games & consoles, board games, toys
  { pattern: /(PlayStation|Xbox|Nintendo|Games|Toys|Puzzle|Video Game|Tricycles|Baby Gifts|Kids' Play|Toy Vehicle|Baby Strollers|Slot Cars|Gift Cards|Kids' Party|Baby|Toy Figures)/i, bucket: "Toys & Games" },

  // routers, smart home, cameras, cell-phones, audio/video hardware, etc.
  { pattern: /(Smart Home|WiFi|Networking|Camera|Video|TV|Cell Phones|Audio|Electronic|Computer|GPS|Projector|Monitor|Security|Lights|Legacy Systems|Electrical|Tablet|Heating)/i, bucket: "Electronics" },

  // furniture, lighting, wall art, cushions, décor, storage
  { pattern: /(Home|Furniture|Décor|Lighting|Ceiling Fans|Storage|Wall Art|Rugs|Bedding|Cushion|Light Bulbs|Kitchen|Party Decorations|Party Supplies)/i, bucket: "Home Decor" },

  // earrings, bracelets, necklaces, rings, watches
  { pattern: /(Jewelry|Watch|Bracelet|Necklace|Earring|Ring|Wearable Te|Men's Accessories|Boys' Accessories|Personalized|Engraved|Custom|Girls' Accessories|Rain Umbrellas|Accessories|Messenger Bags|Laptop Bags)/i, bucket: "Accessories" },

  // clothes, shoes, apparel, uniforms, handbags
  { pattern: /(Clothing|Apparel|Shoes|Boots|Uniforms|Handbags|Kids' Dress)/i, bucket: "Clothing" },

  // novels, textbooks, magazines
  { pattern: /(Book|Magazine|Stationery)/i, bucket: "Books" },


  // skincare, makeup, hair, wellness, spa
  { pattern: /(Beauty|Makeup|Skincare|Hair|Wellness|Spa|Oral Care|Personal Care|Health|Vision Products|Perfumes|Professional Medical|Baby Care|Skin Care|Professional Dental Supplies|Foot, Hand|Lab & Scientific Products|Bath|Pregnancy)/i, bucket: "Beauty & Wellness" },

  // gourmet, snack, candy, coffee, tea, wine
  { pattern: /(Food|Gourmet|Snack|Candy|Coffee|Tea|Wine|Chocolate)/i, bucket: "Food & Gourmet" },

  // luggage, travel accessories, bags
  { pattern: /(Travel|Luggage|Duffel|Tote|Backpack|Suitcase)/i, bucket: "Travel Accessories" },

  // yoga mats, weights, sports, outdoor recreation, nutrition
  { pattern: /(Fitness|Exercise|Yoga|Gym|Sport|Outdoor|Nutrition)/i, bucket: "Fitness & Health" },

  // office electronics, paper goods, pens, planners
  { pattern: /(Office|Stationery|Printer|Pen|Paper|Planner)/i, bucket: "Office & Stationery" },

  // craft, DIY, fabric, paint, beads, knitting, art supplies
  { pattern: /(Craft|DIY|Fabric|Paint|Beading|Knitting|Sewing|Art Supplies|Cutting Tools|Needlework|Printmaking Supplies|Gift Wrapping Supplies)/i, bucket: "DIY & Crafts" },

  // pet supplies: dog, cat, fish, bird, aquarium
  { pattern: /(Pet|Dog|Cat|Fish|Bird|Aquatic|Animal|Reptiles|Horse)/i, bucket: "Pet Gifts" },

  // musical instruments, headphones, microphones
  { pattern: /(Music|Instrument|Guitar|Piano|Drum|Headphones|Microphone)/i, bucket: "Music & Instruments" },

  { pattern: /(Household|Industrial|Automotive|& Crafts|Vacuum Cleaners|Hardware|Building Supplies|Heavy Duty|Abrasive|Packaging|Fasteners|Filtration|Pumps|Power|Toilet Training Products|Power Tools|Household Supplies|Test, Measure|Retail Store|Material Handling|Commercial Door Products|Car Care|Janitorial|Hydraulics|Ironing Products|Oils & Fluids)/i, bucket: "Equipments" },



]

/**
 * Map any raw category string into one of the 15 buckets above.
 * Falls back to Electronics if nothing matches.
 */
export function mapCategory(raw: string): typeof UNIFIED_CATEGORIES[number] | string {
  for (const { pattern, bucket } of mappingRules) {
    if (pattern.test(raw)) return bucket
  }
  return raw // ⬅️ If no rule matches, keep the original category
}