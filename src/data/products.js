// =======================================================================
// DIRECTGROW AYURVEDIC WELLNESS PRODUCT CATALOGUE
// 24 Authentic Formulations across 5 Core Categories
// =======================================================================

export const CATEGORIES = [
  "All Products",
  "Immunity Care",
  "Digestive Care",
  "Joint Care",
  "Skin & Hair Care",
  "Daily Wellness"
];

export const CATEGORY_INFO = {
  "Immunity Care": {
    name: "Immunity Care",
    tagline: "Vitamins, Classical Rasayanas & Daily Immunity",
    desc: "Targeted botanical supplements for cellular vitality, natural defense, and overall wellness."
  },
  "Digestive Care": {
    name: "Digestive Care",
    tagline: "Gut Health, Gentle Detox & Optimal Digestion",
    desc: "Herbal formulations designed to soothe and strengthen your digestive fire (Agni)."
  },
  "Joint Care": {
    name: "Joint Care",
    tagline: "Flexibility, Cartilage Support & Soothing Therapy",
    desc: "Time-tested medicated oils and herbal capsules for pain relief and free mobility."
  },
  "Skin & Hair Care": {
    name: "Skin & Hair Care",
    tagline: "Kashmiri Saffron, Pure Aloe & Root Nourishment",
    desc: "Classical Ayurvedic elixirs for glowing, clear skin and thick, strong hair."
  },
  "Daily Wellness": {
    name: "Daily Wellness",
    tagline: "Holistic Daily Balance, Mental Clarity & Home Living",
    desc: "Ancient daily essentials for a balanced body, calm mind, and harmonious living."
  }
};

export const INITIAL_PRODUCTS = [
  // =======================================================================
  // 1. FIRST 8 PRODUCTS (EXACT MATCH TO REFERENCE GRID SCREENSHOT)
  // =======================================================================
  {
    id: "prod-immunity-syrup",
    name: "Immunity Booster Syrup",
    category: "Immunity Care",
    slug: "immunity-booster-syrup",
    price: 399,
    mrp: 499,
    rating: 4.8,
    reviewsCount: 312,
    isQualifying: false,
    isFeatured: true,
    inStock: true,
    stock: 140,
    bv: 25,
    image: "/images/products/prod-immunity-syrup.png",
    shortDesc: "Helps to build strong immunity and overall wellness.",
    description: "Formulated with pure Giloy, Tulsi, Amla, and Ashwagandha to fortify your body's natural defense against seasonal ailments while enhancing daily stamina.",
    herbs: ["Giloy", "Tulsi", "Amalaki", "Ashwagandha", "Mulethi"],
    benefits: [
      "Strengthens natural white blood cell defense mechanisms",
      "Combats seasonal fatigue and revitalizes daily vitality",
      "Rich in natural Vitamin C and bio-available antioxidants",
      "Gentle and safe for daily family wellness"
    ],
    dosage: "10-15ml twice daily with lukewarm water after meals.",
    certification: "AYUSH Certified GMP Standard • 100% Natural Formulation"
  },
  {
    id: "prod-digestive-powder",
    name: "Digestive Herbal Powder",
    category: "Digestive Care",
    slug: "digestive-herbal-powder",
    price: 349,
    mrp: 450,
    rating: 4.7,
    reviewsCount: 228,
    isQualifying: false,
    isFeatured: true,
    inStock: true,
    stock: 95,
    bv: 20,
    image: "/images/products/prod-digestive-powder.png",
    shortDesc: "Supports healthy digestion and gut health.",
    description: "A classical Ayurvedic churnam crafted from roasted Ajwain, Saunf, Jeera, and Hing to stimulate digestive enzymes, alleviate bloating, and restore gut equilibrium.",
    herbs: ["Saunf", "Ajwain", "Jeera", "Shuddha Hing", "Rock Salt"],
    benefits: [
      "Stimulates gastric enzymes for smooth, effortless digestion",
      "Quick relief from gas, post-meal bloating, and heaviness",
      "Balances Pitta and Vata doshas in the digestive tract",
      "Zero artificial preservatives or synthetic flavoring"
    ],
    dosage: "1 teaspoon (3-5g) with warm water after lunch and dinner.",
    certification: "AYUSH Ministry Standard • 100% Herbal Churna"
  },
  {
    id: "prod-joint-capsule",
    name: "Joint Relief Capsule",
    category: "Joint Care",
    slug: "joint-relief-capsule",
    price: 599,
    mrp: 799,
    rating: 4.9,
    reviewsCount: 420,
    isQualifying: false,
    isFeatured: true,
    inStock: true,
    stock: 110,
    bv: 40,
    image: "/images/products/prod-joint-capsule.png",
    shortDesc: "Provides natural support for joint flexibility and mobility.",
    description: "Fortified with standardized Shallaki (Boswellia), Shuddha Guggulu, and Nirgundi, this formulation reduces stiffness and supports joint cartilage lubrication for effortless movement.",
    herbs: ["Shallaki (Boswellia serrata)", "Shuddha Guggulu", "Nirgundi", "Rasna"],
    benefits: [
      "Supports healthy synovial fluid and cartilage maintenance",
      "Reduces stiffness in knees, shoulders, and lower back",
      "Non-habit forming botanical relief with zero gastric irritation",
      "Promotes sustained long-term joint comfort and flexibility"
    ],
    dosage: "1 capsule twice daily with warm milk or water after meals.",
    certification: "Lab Tested for Purity • AYUSH Approved"
  },
  {
    id: "prod-hair-oil",
    name: "Hair Care Oil",
    category: "Skin & Hair Care",
    slug: "hair-care-oil",
    price: 449,
    mrp: 599,
    rating: 4.85,
    reviewsCount: 380,
    isQualifying: false,
    isFeatured: true,
    inStock: true,
    stock: 80,
    bv: 30,
    image: "/images/products/prod-hair-oil.png",
    shortDesc: "Nourishes hair, strengthens roots and promotes healthy growth.",
    description: "Crafted using the ancient Kshirpak method with fresh Bhringraj, Hibiscus petals, Amla, and virgin coconut oil. Deeply penetrates hair follicles to combat breakage and induce restful sleep.",
    herbs: ["Bhringraj", "Japa (Hibiscus)", "Amla", "Brahmi", "Methi"],
    benefits: [
      "Strengthens hair roots from within and controls daily hair fall",
      "Deeply hydrates scalp to naturally prevent flakiness and dandruff",
      "Slows premature greying with cooling Pitta-pacifying herbs",
      "Soothing scalp massage promotes deep, restful sleep"
    ],
    dosage: "Gently massage into scalp 2-3 times a week, leave on for at least 1 hour or overnight.",
    certification: "100% Pure Cold-Pressed • Free from Mineral Oil and Silicones"
  },
  {
    id: "prod-wellness-tablet",
    name: "Daily Wellness Tablet",
    category: "Daily Wellness",
    slug: "daily-wellness-tablet",
    price: 499,
    mrp: 699,
    rating: 4.8,
    reviewsCount: 290,
    isQualifying: false,
    isFeatured: true,
    inStock: true,
    stock: 125,
    bv: 35,
    image: "/images/products/prod-wellness-tablet.png",
    shortDesc: "A complete daily supplement for overall health.",
    description: "An Ayurvedic multi-nutrient formulation combining organic Moringa, Spirulina, Amla, and Wheatgrass to supply essential micronutrients, vitamins, and minerals for daily vigor.",
    herbs: ["Moringa", "Spirulina", "Amalaki", "Wheatgrass", "Giloy"],
    benefits: [
      "Natural plant-based vitamins and trace minerals for everyday stamina",
      "Fills nutritional gaps and boosts red blood cell oxygenation",
      "Enhances metabolic efficiency and supports natural detoxification",
      "100% vegan, clean-label formulation"
    ],
    dosage: "1-2 tablets daily in the morning with a glass of water.",
    certification: "ISO & GMP Certified • 100% Vegetarian"
  },
  {
    id: "prod-aloe-gel",
    name: "Aloe Vera Gel",
    category: "Skin & Hair Care",
    slug: "pure-aloe-vera-gel",
    price: 299,
    mrp: 399,
    rating: 4.75,
    reviewsCount: 520,
    isQualifying: false,
    isFeatured: true,
    inStock: true,
    stock: 160,
    bv: 18,
    image: "/images/products/prod-aloe-gel.png",
    shortDesc: "Soothes, hydrates and keeps your skin healthy and glowing.",
    description: "Extracted from inner leaf fillet of organically grown Aloe Barbadensis, enriched with Vitamin E and green tea. Provides instant calming hydration for sun-exposed skin, blemishes, and dry scalp.",
    herbs: ["Organic Aloe Vera Inner Leaf (99%)", "Natural Vitamin E", "Green Tea Extract"],
    benefits: [
      "Instantly soothes sun irritation, razor burns, and minor abrasions",
      "Non-greasy, fast-absorbing hydration for all skin types",
      "Locks in moisture and leaves skin supple and luminous",
      "Multi-purpose: suitable for face, body, and hair conditioning"
    ],
    dosage: "Apply liberally on cleansed face or body as often as needed.",
    certification: "Paraben Free • 100% Pure Botanical Gel"
  },
  {
    id: "prod-chyawanprash",
    name: "Chyawanprash",
    category: "Immunity Care",
    slug: "classical-gold-chyawanprash",
    price: 799,
    mrp: 999,
    rating: 4.95,
    reviewsCount: 640,
    isQualifying: false,
    isFeatured: true,
    inStock: true,
    stock: 100,
    bv: 50,
    image: "/images/products/prod-chyawanprash.png",
    shortDesc: "A classical Ayurvedic formulation for strength and immunity.",
    description: "Prepared as per authentic Charaka Samhita guidelines with fresh forest Amla, wild honey, desi cow ghee, and 45+ rejuvenative herbs. Builds Ojas (vital essence), protects respiratory pathways, and enhances stamina.",
    herbs: ["Forest Amla (Amalaki)", "Kesar (Saffron)", "Pippali", "Shatavari", "Bala"],
    benefits: [
      "Recharges Ojas (vital defense force) and bodily resilience",
      "Protects lung capacity and clears upper respiratory congestion",
      "Enhances memory, cognitive focus, and cellular longevity",
      "Preserved naturally with pure honey and A2 cow ghee"
    ],
    dosage: "1 rounded tablespoon (12g) twice daily followed by warm milk.",
    certification: "Classical Shastriya Avaleha • AYUSH Premium Mark"
  },
  {
    id: "prod-pain-oil",
    name: "Pain Relief Oil",
    category: "Joint Care",
    slug: "ayurvedic-pain-relief-oil",
    price: 399,
    mrp: 549,
    rating: 4.8,
    reviewsCount: 345,
    isQualifying: false,
    isFeatured: true,
    inStock: true,
    stock: 85,
    bv: 25,
    image: "/images/products/prod-pain-oil.png",
    shortDesc: "Helps to reduce joint and muscle discomfort naturally.",
    description: "An intensive botanical massage oil combining Mahanarayan taila, Gandhapura, Eucalyptus, and Nilgiri. Penetrates deep into muscular tissues to dissolve tension, stiffness, and soreness.",
    herbs: ["Mahanarayan Taila", "Gandhapura (Wintergreen)", "Nilgiri (Eucalyptus)", "Karpura"],
    benefits: [
      "Fast-acting warmth soothes muscle spasms and morning joint stiffness",
      "Enhances blood circulation to affected connective tissues",
      "Ideal for post-workout fatigue, neck stiffness, and lumbar pain",
      "Pleasant herbal aroma without sticky residue"
    ],
    dosage: "Gently massage 5-10ml into affected areas until absorbed, 2-3 times daily.",
    certification: "AYUSH Certified • Traditional Shastriya Formulation"
  },

  // =======================================================================
  // 2. ADDITIONAL PRODUCTS (TOTAL 24: IMMUNITY: 6, DIGESTIVE: 4, JOINT: 4, SKIN: 5, DAILY: 5)
  // =======================================================================

  // IMMUNITY CARE (Products 9, 10, 11, 12 - completing 6 total in Immunity)
  {
    id: "prod-starter-pack",
    name: "Starter Pack (8-Level Qualifying)",
    category: "Immunity Care",
    slug: "ayurvedic-family-wellness-starter-pack",
    price: 2000,
    mrp: 2800,
    rating: 4.95,
    reviewsCount: 780,
    isQualifying: true,
    isFeatured: true,
    inStock: true,
    stock: 120,
    bv: 100,
    image: "/images/home/hero-ayurveda.png",
    shortDesc: "Complete starter pack with Ashwagandha, Chyawanprash, and Triphala. Qualifies 8-level referral commissions instantly.",
    description: "The official DirectGrow distributor qualification pack. Making a single purchase of ₹2,000+ unlocks lifetime earning rights across all 8 upline referral tiers. Includes 4 classical formulations.",
    herbs: ["Ashwagandha", "Amla", "Triphala", "Pancha Tulsi", "Giloy"],
    benefits: [
      "Instantly unlocks 8-level referral commissions (Qualifying First Purchase)",
      "Daily immunity shield and revitalizing adaptogenic stress relief",
      "Digestive detox and gut balance with classical Triphala",
      "100% certified organic Ayurvedic ingredients"
    ],
    dosage: "Follow directions on individual product containers.",
    certification: "AYUSH Ministry Premium GMP Certified • 100% Vegetarian"
  },
  {
    id: "prod-shilajit-gold",
    name: "Shilajit Gold Resin",
    category: "Immunity Care",
    slug: "pure-himalayan-shilajit-gold-resin",
    price: 2199,
    mrp: 3200,
    rating: 4.95,
    reviewsCount: 512,
    isQualifying: true,
    isFeatured: true,
    inStock: true,
    stock: 85,
    bv: 110,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Grade-A Himalayan Shilajit fortified with 24K Gold Bhasma for peak stamina.",
    description: "Harvested above 18,000 ft in the Himalayas, fortified with Swarna Bhasma and 80+ trace ionic minerals with 75% fulvic acid for mitochondrial vitality.",
    herbs: ["Purified Shilajit", "Swarna Bhasma (24K Gold)", "Safed Musli", "Gokshura"],
    benefits: [
      "Qualifying single purchase for distributor activation",
      "Maximizes natural cellular energy, endurance, and physical vitality",
      "Supercharges nutrient absorption via high fulvic acid content",
      "Supports mental clarity and cognitive sharpness"
    ],
    dosage: "Pea-sized resin portion (300-500mg) dissolved in warm water or milk twice daily.",
    certification: "Lab Tested for Heavy Metals & Purity • AYUSH Certified"
  },
  {
    id: "prod-giloy-drops",
    name: "Giloy Immunity Drops",
    category: "Immunity Care",
    slug: "pure-giloy-extract-drops",
    price: 349,
    mrp: 450,
    rating: 4.75,
    reviewsCount: 195,
    isQualifying: false,
    isFeatured: false,
    inStock: true,
    stock: 90,
    bv: 20,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Concentrated aqueous Giloy drops for active immune defense.",
    description: "Pure Amrita (Giloy) extract drops that promote healthy body temperature, improve liver metabolic function, and purify the blood.",
    herbs: ["Tinospora cordifolia (Giloy)", "Tulsi", "Pipali"],
    benefits: [
      "Supports healthy blood platelet count and WBC activity",
      "Cooling antipyretic properties for seasonal fever recovery",
      "Convenient liquid drops easily mixed into drinking water"
    ],
    dosage: "10 drops in 100ml water twice daily.",
    certification: "AYUSH Certified • Chemical Free"
  },
  {
    id: "prod-ashwagandha",
    name: "Ashwagandha KSM-66",
    category: "Immunity Care",
    slug: "ashwagandha-ksm-66-stress-relief",
    price: 899,
    mrp: 1299,
    rating: 4.85,
    reviewsCount: 230,
    isQualifying: false,
    isFeatured: true,
    inStock: true,
    stock: 75,
    bv: 45,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Standardized root extract for stress relief and cortisol balance.",
    description: "Certified organic root extract delivering 5% withanolides. Clinically shown to reduce stress, lower elevated cortisol, and improve sleep quality.",
    herbs: ["Organic KSM-66 Ashwagandha Root Extract"],
    benefits: [
      "Lowers chronic cortisol and enhances stress resilience",
      "Supports sound REM sleep and daytime energy balance",
      "Enhances muscle strength and recovery after exertion"
    ],
    dosage: "1 capsule twice daily with warm milk or water.",
    certification: "Non-GMO Project Verified • AYUSH GMP"
  },

  // DIGESTIVE CARE (Products 13, 14 - completing 4 total in Digestive)
  {
    id: "prod-triphala",
    name: "Triphala Detox & Cleanse",
    category: "Digestive Care",
    slug: "triphala-digestive-cleanse",
    price: 499,
    mrp: 650,
    rating: 4.9,
    reviewsCount: 460,
    isQualifying: false,
    isFeatured: false,
    inStock: true,
    stock: 130,
    bv: 30,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Classical formulation of Haritaki, Bibhitaki, and Amalaki for daily bowel regularity.",
    description: "Pure Triphala powder supporting gentle natural overnight colon cleansing without cramping or creating dependency.",
    herbs: ["Haritaki", "Bibhitaki", "Amalaki"],
    benefits: [
      "Natural colon cleanser promoting daily bowel regularity",
      "Rich in natural antioxidants that tone the digestive tract",
      "Non-habit forming and safe for continuous use"
    ],
    dosage: "1 teaspoon at bedtime with warm water.",
    certification: "AYUSH Certified • Organic Ingredients"
  },
  {
    id: "prod-hingvastak",
    name: "Hingvastak Churna",
    category: "Digestive Care",
    slug: "hingvastak-churna-gas-relief",
    price: 299,
    mrp: 399,
    rating: 4.7,
    reviewsCount: 180,
    isQualifying: false,
    isFeatured: false,
    inStock: true,
    stock: 70,
    bv: 18,
    image: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Traditional spiced digestive stimulant to relieve gas and acidity.",
    description: "A cherished grandmother formulation containing Hing, Ginger, Black Pepper, and Ajwain that pacifies digestive fire.",
    herbs: ["Shuddha Hing", "Sunthi (Ginger)", "Maricha (Black Pepper)", "Pippali"],
    benefits: [
      "Quick relief from abdominal bloating and intestinal gas",
      "Ignites sluggish Agni before heavy meals",
      "Authentic Charaka Samhita proportion"
    ],
    dosage: "Half teaspoon with the first morsel of warm rice and ghee.",
    certification: "AYUSH Approved Standard"
  },

  // JOINT CARE (Products 15, 16 - completing 4 total in Joint)
  {
    id: "prod-mahanarayan-oil",
    name: "Mahanarayan Taila Elixir",
    category: "Joint Care",
    slug: "classical-mahanarayan-taila",
    price: 649,
    mrp: 850,
    rating: 4.9,
    reviewsCount: 390,
    isQualifying: false,
    isFeatured: false,
    inStock: true,
    stock: 65,
    bv: 40,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Time-tested medicated oil processed with 50+ botanicals for chronic stiffness.",
    description: "Prepared through a 7-day decoction process in pure sesame oil and cow milk to pacify deep-seated Vata in bones and tendons.",
    herbs: ["Bilva", "Ashwagandha", "Bala", "Gokshura", "Rasna"],
    benefits: [
      "Penetrates deep into synovial joints to relieve chronic pain",
      "Relaxes stiff muscles and tendon tightness",
      "Essential for geriatric joint wellness and athletic recovery"
    ],
    dosage: "Warm slightly and apply with firm circular strokes over painful joints.",
    certification: "Authentic Shastriya Pharmacopoeia of India"
  },
  {
    id: "prod-shallaki-tablets",
    name: "Shallaki Joint Care Tablet",
    category: "Joint Care",
    slug: "shallaki-boswellia-joint-tablet",
    price: 549,
    mrp: 699,
    rating: 4.8,
    reviewsCount: 210,
    isQualifying: false,
    isFeatured: false,
    inStock: true,
    stock: 90,
    bv: 35,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Standardized Boswellic acid extract for knee cartilage protection.",
    description: "Extracted from natural Boswellia tree resin to control inflammation and preserve knee cartilage integrity.",
    herbs: ["Shallaki Resin Extract (65% Boswellic acids)"],
    benefits: [
      "Blocks pro-inflammatory 5-LOX enzyme naturally",
      "Improves walking distance and knee flexion comfort",
      "Gentle on stomach lining, unlike synthetic NSAIDs"
    ],
    dosage: "1 tablet twice daily after food.",
    certification: "AYUSH Certified • Standardized Botanical"
  },

  // SKIN & HAIR CARE (Products 17, 18, 19 - completing 5 total in Skin & Hair)
  {
    id: "prod-kumkumadi-oil",
    name: "Kumkumadi Tailam Beauty Oil",
    category: "Skin & Hair Care",
    slug: "miraculous-kumkumadi-tailam",
    price: 1499,
    mrp: 1999,
    rating: 4.95,
    reviewsCount: 680,
    isQualifying: false,
    isFeatured: true,
    inStock: true,
    stock: 55,
    bv: 80,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Infused with pure Kashmiri saffron for radiant, spotless, glowing skin.",
    description: "The legendary golden elixir described in Ashtanga Hridaya. Infused with 26 precious herbs, sandalwood, and goat milk to eliminate hyperpigmentation and reveal natural radiance.",
    herbs: ["Kashmiri Saffron (Kumkuma)", "Rakta Chandana", "Manjistha", "Lotus Stamen"],
    benefits: [
      "Brightens skin complexion and fades dark spots and blemishes",
      "Promotes natural cellular turnover and smooth texture",
      "Deeply hydrates and gives skin an authentic Ayurvedic glow"
    ],
    dosage: "3-4 drops pressed into damp face at night before sleep.",
    certification: "100% Pure Saffron • Zero Artificial Fragrance"
  },
  {
    id: "prod-bhringraj-elixir",
    name: "Bhringraj Hair Regrowth Elixir",
    category: "Skin & Hair Care",
    slug: "bhringraj-hair-regrowth-elixir",
    price: 749,
    mrp: 999,
    rating: 4.85,
    reviewsCount: 340,
    isQualifying: false,
    isFeatured: false,
    inStock: true,
    stock: 75,
    bv: 45,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Ancient Kshirpak vidhi formulation to halt hair fall and revitalize dormant follicles.",
    description: "Prepared by boiling fresh hand-picked Bhringraj herb in cow milk and coconut oil until every active phytonutrient is extracted.",
    herbs: ["Bhringraj", "Neem Seed Oil", "Gunja", "Kalonji"],
    benefits: [
      "Activates dormant hair roots to stimulate new hair strands",
      "Controls premature greying and strengthens hair shafts",
      "Restores natural thickness and healthy shine"
    ],
    dosage: "Apply to roots 3 nights a week with gentle circular massage.",
    certification: "Classical Ayurvedic Kshirpak Process"
  },
  {
    id: "prod-neem-facepack",
    name: "Neem Purifying Face Pack",
    category: "Skin & Hair Care",
    slug: "neem-purifying-face-pack",
    price: 399,
    mrp: 499,
    rating: 4.75,
    reviewsCount: 220,
    isQualifying: false,
    isFeatured: false,
    inStock: true,
    stock: 105,
    bv: 25,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Deep clay treatment with wild neem and turmeric to clear blemishes and excess oil.",
    description: "Blended with Multani Mitti, organic neem powder, and wild turmeric to draw out deep-seated impurities, tighten enlarged pores, and balance facial sebum.",
    herbs: ["Organic Neem", "Kasturi Manjal (Turmeric)", "Multani Mitti", "Tea Tree"],
    benefits: [
      "Clears acne-causing bacteria and unclogs oily pores",
      "Evens skin tone and controls midday facial oiliness",
      "Cools irritated skin with a clean botanical finish"
    ],
    dosage: "Mix 1 tbsp with rose water, apply evenly for 15 mins, wash off with cool water.",
    certification: "Chemical & Bleach Free • 100% Herbal"
  },

  // DAILY WELLNESS (Products 20, 21, 22, 23, 24 - completing 5 total in Daily Wellness)
  {
    id: "prod-brahmi-booster",
    name: "Brahmi Mind & Memory Booster",
    category: "Daily Wellness",
    slug: "brahmi-mind-memory-booster",
    price: 599,
    mrp: 799,
    rating: 4.9,
    reviewsCount: 310,
    isQualifying: false,
    isFeatured: false,
    inStock: true,
    stock: 85,
    bv: 35,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Medhya Rasayana for heightened focus, calm nervousness, and sound sleep.",
    description: "Contains pure Bacopa monnieri standardized to 20% bacosides. Enhances synaptic plasticity, short-term memory recall, and calms racing thoughts.",
    herbs: ["Brahmi (Bacopa monnieri)", "Shankhpushpi", "Gotu Kola", "Vacha"],
    benefits: [
      "Enhances memory retention, mental sharpness, and learning capacity",
      "Calms nervous exhaustion and mental burnout",
      "Promotes deep delta-wave nighttime sleep"
    ],
    dosage: "1 capsule morning and night with warm water.",
    certification: "AYUSH Certified • Standardized Plant Extract"
  },
  {
    id: "prod-ghee-dhoop",
    name: "Pure Cow Ghee Vedic Dhoop",
    category: "Daily Wellness",
    slug: "pure-cow-ghee-vedic-dhoop-sticks",
    price: 450,
    mrp: 550,
    rating: 4.85,
    reviewsCount: 410,
    isQualifying: false,
    isFeatured: false,
    inStock: true,
    stock: 140,
    bv: 25,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Traditional Havan herbs blended with A2 Gir cow ghee for indoor air purification.",
    description: "Crafted without charcoal or synthetic bamboo cores. Purifies home atmosphere, repels negative energy, and produces a fragrant temple ambiance.",
    herbs: ["A2 Desi Cow Ghee", "Guggul", "Loban", "Camphor", "Hawanam Herbs"],
    benefits: [
      "100% natural, non-toxic smoke safe for indoor prayer and meditation",
      "Cleanses airborne pathogens and removes stagnant room odors",
      "Calming aroma enhances focus during yoga and spiritual practice"
    ],
    dosage: "Light 1 dhoop stick on a fireproof stand during morning or evening prayers.",
    certification: "Zero Charcoal • 100% Chemical Free"
  },
  {
    id: "prod-copper-bottle",
    name: "Handcrafted Pure Copper Bottle (950ml)",
    category: "Daily Wellness",
    slug: "handcrafted-pure-copper-bottle-950ml",
    price: 1250,
    mrp: 1650,
    rating: 4.95,
    reviewsCount: 520,
    isQualifying: false,
    isFeatured: true,
    inStock: true,
    stock: 45,
    bv: 70,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Tamra Jal vessel that naturally ionizes drinking water with essential copper trace minerals.",
    description: "Hammered by master artisans from 99.7% pure certified copper. Storing water overnight charges it with natural anti-microbial and digestive properties.",
    herbs: ["Pure High-Grade Ayurvedic Copper (99.7%)"],
    benefits: [
      "Imparts natural antimicrobial protection into drinking water",
      "Balances Tridoshas (Vata, Pitta, Kapha) through Tamra Jal therapy",
      "Durable, leak-proof design crafted for lifetime wellness"
    ],
    dosage: "Fill with room temperature water, store overnight for 6-8 hours, drink first thing in the morning.",
    certification: "NABL Lab Tested for 99.7% Copper Purity"
  },
  {
    id: "prod-shatavari-elixir",
    name: "Shatavari Hormonal Balance",
    category: "Daily Wellness",
    slug: "shatavari-hormonal-balance-elixir",
    price: 799,
    mrp: 1050,
    rating: 4.8,
    reviewsCount: 190,
    isQualifying: false,
    isFeatured: false,
    inStock: true,
    stock: 80,
    bv: 40,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Queen of herbs formulation supporting female vitality, mood balance, and rejuvenation.",
    description: "Standardized extract of Asparagus racemosus root. Nourishes female reproductive tissues, stabilizes monthly cycles, and enhances daily vitality.",
    herbs: ["Shatavari (Asparagus racemosus Root Extract)"],
    benefits: [
      "Balances natural estrogen levels and smooths monthly hormonal shifts",
      "Sustains natural vitality, graceful aging, and radiant skin",
      "Adaptogenic action supports maternal wellness"
    ],
    dosage: "1 capsule twice daily with milk or warm water.",
    certification: "AYUSH Certified • 100% Vegetarian Capsule"
  }
];

export const MEMBERSHIP_PACKAGE_DETAILS = {
  id: "prod-membership-activation-package",
  name: "DirectGrow 8-Level Membership Activation Package",
  price: 2000,
  mrp: 3200,
  savings: 1200,
  bv: 100,
  rating: 4.98,
  reviewsCount: 1450,
  isQualifying: true,
  image: "/images/home/hero-ayurveda.png",
  shortDesc: "Mandatory ₹2,000 distributor activation package. Includes 6 classical Ayurvedic formulations worth ₹3,200.",
  description: "Official DirectGrow 8-level distributor activation package. Completing this ₹2,000 package payment activates your membership, awards lifetime distributor earning rights across 8 tiers, generates your unique referral code, and delivers 6 authentic AYUSH certified formulations directly to your doorstep with free shipping.",
  includedProducts: [
    {
      id: "prod-chyawanprash",
      name: "Classical Chyawanprash Formulation",
      quantity: "1 x 500g Jar",
      mrp: 799,
      category: "Immunity Care",
      benefit: "Pure Amla & 40+ rejuvenating herbs for core stamina and seasonal immunity",
      image: "/images/products/prod-chyawanprash.png"
    },
    {
      id: "prod-immunity-syrup",
      name: "Immunity Booster Syrup",
      quantity: "1 x 200ml Bottle",
      mrp: 399,
      category: "Immunity Care",
      benefit: "AYUSH-certified blend of Giloy, Tulsi & Mulethi for respiratory defense",
      image: "/images/products/prod-immunity-syrup.png"
    },
    {
      id: "prod-wellness-tablet",
      name: "Daily Wellness & Vitality Tablets",
      quantity: "1 x 60 Tablets",
      mrp: 499,
      category: "Daily Wellness",
      benefit: "Ashwagandha, Shilajit & Ayurvedic multivitamin for all-day energy",
      image: "/images/products/prod-wellness-tablet.png"
    },
    {
      id: "prod-digestive-powder",
      name: "Digestive Herbal Powder (Churna)",
      quantity: "1 x 100g Pack",
      mrp: 349,
      category: "Digestive Care",
      benefit: "Triphala, Hingvastak & Saunf for gut detox, bloating relief, and healthy metabolism",
      image: "/images/products/prod-digestive-powder.png"
    },
    {
      id: "prod-aloe-gel",
      name: "Pure Organic Aloe Vera Gel",
      quantity: "1 x 150g Tub",
      mrp: 299,
      category: "Skin & Hair Care",
      benefit: "100% cold-pressed natural soothing gel for radiant skin and hair hydration",
      image: "/images/products/prod-aloe-gel.png"
    },
    {
      id: "prod-pain-oil",
      name: "Therapeutic Pain Relief Oil",
      quantity: "1 x 100ml Bottle",
      mrp: 399,
      category: "Joint Care",
      benefit: "Mahanarayan & Gandhapura herbal blend for joint flexibility and muscle recovery",
      image: "/images/products/prod-pain-oil.png"
    }
  ],
  membershipPerks: [
    "Permanent 8-Level Distributor Earning Rights",
    "Generates your unique personal referral code & marketing tools",
    "Eligible for ₹290 8-level commission cascade on all downline qualifying sales",
    "Full access to the Member Hub, live downline visual tree, and wallet withdrawals",
    "6 premium Ayurvedic formulations delivered free to your address"
  ],
  certification: "AYUSH Certified • GMP Laboratory Tested • 100% Vegetarian"
};

// Ensure both .products and .includedProducts point to the same array
MEMBERSHIP_PACKAGE_DETAILS.products = MEMBERSHIP_PACKAGE_DETAILS.includedProducts;


