const PACKAGES = [
  // Beach — 3 days
  {
    id: "beach-3-500-1000",
    name: "Sunset Shore Mystery",
    tripType: "beach",
    days: 3,
    pricePerPerson: 850,
    budgetTier: "500-1000",
    destination: "Cancún, Mexico",
    hints: ["Warm turquoise waters", "All-inclusive resort vibes"]
  },
  {
    id: "beach-3-1000-1500",
    name: "Coastal Hideaway Mystery",
    tripType: "beach",
    days: 3,
    pricePerPerson: 1250,
    budgetTier: "1000-1500",
    destination: "Tulum, Mexico",
    hints: ["Powder-soft sand", "Mayan ruins nearby"]
  },
  {
    id: "beach-3-1500-2000",
    name: "Azure Bay Mystery",
    tripType: "beach",
    days: 3,
    pricePerPerson: 1750,
    budgetTier: "1500-2000",
    destination: "Maui, Hawaii",
    hints: ["Volcanic beaches", "Sunset luaus"]
  },
  {
    id: "beach-3-2000-plus",
    name: "Luxury Shore Mystery",
    tripType: "beach",
    days: 3,
    pricePerPerson: 2300,
    budgetTier: "2000+",
    destination: "Seychelles",
    hints: ["Private coves", "Five-star beachfront"]
  },

  // Beach — 5 days
  {
    id: "beach-5-500-1000",
    name: "Budget Beach Mystery",
    tripType: "beach",
    days: 5,
    pricePerPerson: 900,
    budgetTier: "500-1000",
    destination: "Varadero, Cuba",
    hints: ["Caribbean warmth", "Relaxed all-inclusive stay"]
  },
  {
    id: "beach-5-1000-1500",
    name: "Golden Coast Mystery",
    tripType: "beach",
    days: 5,
    pricePerPerson: 1350,
    budgetTier: "1000-1500",
    destination: "Algarve, Portugal",
    hints: ["Dramatic cliffs", "Fresh seafood markets"]
  },
  {
    id: "beach-5-1500-2000",
    name: "Coastal Mystery Escape",
    tripType: "beach",
    days: 5,
    pricePerPerson: 1750,
    budgetTier: "1500-2000",
    destination: "Bali, Indonesia",
    hints: ["Tropical beaches", "Island temples"]
  },
  {
    id: "beach-5-2000-plus",
    name: "Paradise Unknown",
    tripType: "beach",
    days: 5,
    pricePerPerson: 2200,
    budgetTier: "2000+",
    destination: "Maldives",
    hints: ["Overwater bungalows", "Crystal-clear lagoons"]
  },

  // Beach — 7 days
  {
    id: "beach-7-500-1000",
    name: "Weeklong Beach Mystery",
    tripType: "beach",
    days: 7,
    pricePerPerson: 950,
    budgetTier: "500-1000",
    destination: "Punta Cana, Dominican Republic",
    hints: ["Palm-lined shores", "Snorkeling day trips"]
  },
  {
    id: "beach-7-1000-1500",
    name: "Island Hopper Mystery",
    tripType: "beach",
    days: 7,
    pricePerPerson: 1400,
    budgetTier: "1000-1500",
    destination: "Phuket, Thailand",
    hints: ["Limestone cliffs", "Night markets"]
  },
  {
    id: "beach-7-1500-2000",
    name: "Island Explorer Mystery",
    tripType: "beach",
    days: 7,
    pricePerPerson: 1900,
    budgetTier: "1500-2000",
    destination: "Santorini, Greece",
    hints: ["White-washed villages", "Aegean sunsets"]
  },
  {
    id: "beach-7-2000-plus",
    name: "Elite Beach Mystery",
    tripType: "beach",
    days: 7,
    pricePerPerson: 2600,
    budgetTier: "2000+",
    destination: "Bora Bora, French Polynesia",
    hints: ["Lagoon villas", "World-class diving"]
  },

  // City — 3 days
  {
    id: "city-3-500-1000",
    name: "Urban Discovery Mystery",
    tripType: "city",
    days: 3,
    pricePerPerson: 750,
    budgetTier: "500-1000",
    destination: "Montreal, Canada",
    hints: ["Historic neighborhoods", "World-class dining"]
  },
  {
    id: "city-3-1000-1500",
    name: "Weekend City Mystery",
    tripType: "city",
    days: 3,
    pricePerPerson: 1200,
    budgetTier: "1000-1500",
    destination: "Lisbon, Portugal",
    hints: ["Hilltop viewpoints", "Fado music nights"]
  },
  {
    id: "city-3-1500-2000",
    name: "Capital Weekend Mystery",
    tripType: "city",
    days: 3,
    pricePerPerson: 1700,
    budgetTier: "1500-2000",
    destination: "Copenhagen, Denmark",
    hints: ["Canal-side cafés", "Design museums"]
  },
  {
    id: "city-3-2000-plus",
    name: "Premium City Mystery",
    tripType: "city",
    days: 3,
    pricePerPerson: 2500,
    budgetTier: "2000+",
    destination: "New York City, USA",
    hints: ["Broadway shows", "Iconic skyline views"]
  },

  // City — 5 days
  {
    id: "city-5-500-1000",
    name: "Budget City Break Mystery",
    tripType: "city",
    days: 5,
    pricePerPerson: 800,
    budgetTier: "500-1000",
    destination: "Budapest, Hungary",
    hints: ["Thermal baths", "Danube river cruises"]
  },
  {
    id: "city-5-1000-1500",
    name: "Old Town Mystery",
    tripType: "city",
    days: 5,
    pricePerPerson: 1300,
    budgetTier: "1000-1500",
    destination: "Barcelona, Spain",
    hints: ["Gaudí architecture", "Tapas alleys"]
  },
  {
    id: "city-5-1500-2000",
    name: "Metropolitan Surprise",
    tripType: "city",
    days: 5,
    pricePerPerson: 1800,
    budgetTier: "1500-2000",
    destination: "Prague, Czech Republic",
    hints: ["Gothic architecture", "Cobblestone streets"]
  },
  {
    id: "city-5-2000-plus",
    name: "Grand City Mystery",
    tripType: "city",
    days: 5,
    pricePerPerson: 2300,
    budgetTier: "2000+",
    destination: "Paris, France",
    hints: ["Museum passes included", "Seine-side dining"]
  },

  // City — 7 days
  {
    id: "city-7-500-1000",
    name: "Extended City Mystery",
    tripType: "city",
    days: 7,
    pricePerPerson: 900,
    budgetTier: "500-1000",
    destination: "Mexico City, Mexico",
    hints: ["Street food tours", "Ancient Aztec sites"]
  },
  {
    id: "city-7-1000-1500",
    name: "Cultural Capital Mystery",
    tripType: "city",
    days: 7,
    pricePerPerson: 1400,
    budgetTier: "1000-1500",
    destination: "Vienna, Austria",
    hints: ["Classical concerts", "Imperial palaces"]
  },
  {
    id: "city-7-1500-2000",
    name: "Historic City Mystery",
    tripType: "city",
    days: 7,
    pricePerPerson: 1850,
    budgetTier: "1500-2000",
    destination: "Rome, Italy",
    hints: ["Ancient ruins", "Trattoria dining"]
  },
  {
    id: "city-7-2000-plus",
    name: "Capital of Culture Mystery",
    tripType: "city",
    days: 7,
    pricePerPerson: 2400,
    budgetTier: "2000+",
    destination: "Tokyo, Japan",
    hints: ["Neon skylines", "Ancient shrines"]
  },

  // Nature — 3 days
  {
    id: "nature-3-500-1000",
    name: "Trailhead Mystery",
    tripType: "nature",
    days: 3,
    pricePerPerson: 700,
    budgetTier: "500-1000",
    destination: "Jasper, Canada",
    hints: ["Alpine lakes", "Wildlife spotting"]
  },
  {
    id: "nature-3-1000-1500",
    name: "Wilderness Whispers",
    tripType: "nature",
    days: 3,
    pricePerPerson: 1200,
    budgetTier: "1000-1500",
    destination: "Banff, Canada",
    hints: ["Mountain peaks", "Glacial lakes"]
  },
  {
    id: "nature-3-1500-2000",
    name: "Summit Mystery",
    tripType: "nature",
    days: 3,
    pricePerPerson: 1650,
    budgetTier: "1500-2000",
    destination: "Swiss Alps, Switzerland",
    hints: ["Cable car rides", "Alpine meadows"]
  },
  {
    id: "nature-3-2000-plus",
    name: "Premium Wilderness Mystery",
    tripType: "nature",
    days: 3,
    pricePerPerson: 2100,
    budgetTier: "2000+",
    destination: "Yellowstone, USA",
    hints: ["Geysers and hot springs", "Guided wildlife tours"]
  },

  // Nature — 5 days
  {
    id: "nature-5-500-1000",
    name: "Backcountry Mystery",
    tripType: "nature",
    days: 5,
    pricePerPerson: 850,
    budgetTier: "500-1000",
    destination: "Lake Louise, Canada",
    hints: ["Turquoise lakes", "Scenic hiking trails"]
  },
  {
    id: "nature-5-1000-1500",
    name: "Rainforest Mystery",
    tripType: "nature",
    days: 5,
    pricePerPerson: 1250,
    budgetTier: "1000-1500",
    destination: "Costa Rica",
    hints: ["Cloud forests", "Zip-line adventures"]
  },
  {
    id: "nature-5-1500-2000",
    name: "Trailblazer Mystery",
    tripType: "nature",
    days: 5,
    pricePerPerson: 1650,
    budgetTier: "1500-2000",
    destination: "Patagonia, Chile",
    hints: ["Dramatic fjords", "Pristine hiking trails"]
  },
  {
    id: "nature-5-2000-plus",
    name: "Epic Outdoors Mystery",
    tripType: "nature",
    days: 5,
    pricePerPerson: 2250,
    budgetTier: "2000+",
    destination: "New Zealand South Island",
    hints: ["Milford Sound", "Lord of the Rings landscapes"]
  },

  // Nature — 7 days
  {
    id: "nature-7-500-1000",
    name: "Forest Retreat Mystery",
    tripType: "nature",
    days: 7,
    pricePerPerson: 950,
    budgetTier: "500-1000",
    destination: "Vancouver Island, Canada",
    hints: ["Old-growth forests", "Pacific coastline"]
  },
  {
    id: "nature-7-1000-1500",
    name: "Nordic Nature Mystery",
    tripType: "nature",
    days: 7,
    pricePerPerson: 1350,
    budgetTier: "1000-1500",
    destination: "Iceland",
    hints: ["Waterfalls and glaciers", "Northern lights potential"]
  },
  {
    id: "nature-7-1500-2000",
    name: "National Park Mystery",
    tripType: "nature",
    days: 7,
    pricePerPerson: 1800,
    budgetTier: "1500-2000",
    destination: "Zion & Bryce, USA",
    hints: ["Red rock canyons", "Slot canyon hikes"]
  },
  {
    id: "nature-7-2000-plus",
    name: "Ultimate Wilderness Mystery",
    tripType: "nature",
    days: 7,
    pricePerPerson: 2500,
    budgetTier: "2000+",
    destination: "Antarctic Peninsula Expedition",
    hints: ["Penguin colonies", "Iceberg cruises"]
  }
];

function parseBudgetRange(budgetValue) {
  if (budgetValue === "2000+") {
    return { min: 2000, max: Infinity };
  }
  const [min, max] = budgetValue.split("-").map(Number);
  return { min, max };
}

function priceInBudget(pricePerPerson, budgetValue) {
  const { min, max } = parseBudgetRange(budgetValue);
  return pricePerPerson >= min && pricePerPerson <= max;
}

function filterPackages(prefs, relaxDays) {
  const days = relaxDays ? null : Number(prefs.days);

  return PACKAGES.filter((pkg) => {
    if (pkg.tripType !== prefs.tripType) return false;
    if (days !== null && pkg.days !== days) return false;
    if (!priceInBudget(pkg.pricePerPerson, prefs.budget)) return false;
    return true;
  });
}

function getMatchingPackages(prefs) {
  let matches = filterPackages(prefs, false);

  if (matches.length < 3) {
    const relaxed = filterPackages(prefs, true);
    const seen = new Set(matches.map((p) => p.id));
    for (const pkg of relaxed) {
      if (!seen.has(pkg.id)) {
        matches.push(pkg);
        seen.add(pkg.id);
      }
    }
  }

  return matches.slice(0, 4);
}

function getPackageById(id) {
  return PACKAGES.find((pkg) => pkg.id === id) || null;
}

function formatBudgetLabel(budgetValue) {
  const labels = {
    "500-1000": "$500 – $1,000",
    "1000-1500": "$1,000 – $1,500",
    "1500-2000": "$1,500 – $2,000",
    "2000+": "$2,000+"
  };
  return labels[budgetValue] || budgetValue;
}

function formatTripType(type) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function formatPrice(amount) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0
  }).format(amount);
}
