
// Contains shared types and constants for the application.

export interface ItineraryDay {
  day: number;
  location: string;
  activities: string[]; // Changed to array of strings
  hotelRecommendations?: string[]; // Added optional field
  // REMOVED: estimatedDailyCost?: string;
}

export interface Itinerary {
  itinerary: ItineraryDay[];
}

export interface HiddenGemSuggestion {
  hiddenGems: string[];
}

export interface VirtualPostcard {
  caption: string;
}

// List of Nepal districts (alphabetical)
export const nepalDistricts = [
  "Achham", "Arghakhanchi", "Baglung", "Baitadi", "Bajhang", "Bajura", "Banke", "Bara",
  "Bardiya", "Bhaktapur", "Bhojpur", "Chitwan", "Dadeldhura", "Dailekh", "Dang",
  "Darchula", "Dhading", "Dhankuta", "Dhanusha", "Dolakha", "Dolpa", "Doti", "Gorkha",
  "Gulmi", "Humla", "Ilam", "Jajarkot", "Jhapa", "Jumla", "Kailali", "Kalikot",
  "Kanchanpur", "Kapilvastu", "Kaski", "Kathmandu", "Kavrepalanchok", "Khotang",
  "Lalitpur", "Lamjung", "Mahottari", "Makwanpur", "Manang", "Morang", "Mugu",
  "Mustang", "Myagdi", "Nawalparasi East", "Nawalparasi West", "Nuwakot", "Okhaldhunga", "Palpa",
  "Panchthar", "Parbat", "Parsa", "Pyuthan", "Ramechhap", "Rasuwa", "Rautahat",
  "Rolpa", "Rukum East", "Rukum West", "Rupandehi", "Salyan", "Sankhuwasabha", "Saptari",
  "Sarlahi", "Sindhuli", "Sindhupalchok", "Siraha", "Solukhumbu", "Sunsari", "Surkhet",
  "Syangja", "Tanahun", "Taplejung", "Terhathum", "Udayapur",
] as const;

export type DistrictName = typeof nepalDistricts[number];

// Group districts by development region (or provinces if more appropriate)
export const nepalDistrictsByRegion = {
  "East Nepal (Koshi Province)": [
    "Bhojpur", "Dhankuta", "Ilam", "Jhapa", "Khotang", "Morang", "Okhaldhunga",
    "Panchthar", "Sankhuwasabha", "Solukhumbu", "Sunsari", "Taplejung", "Terhathum", "Udayapur"
  ],
  "Central Nepal (Madhesh Province)": [
    "Bara", "Dhanusha", "Mahottari", "Parsa", "Rautahat", "Saptari", "Sarlahi", "Siraha"
  ],
  "Central Nepal (Bagmati Province)": [
    "Bhaktapur", "Chitwan", "Dhading", "Dolakha", "Kathmandu", "Kavrepalanchok", "Lalitpur",
    "Makwanpur", "Nuwakot", "Ramechhap", "Rasuwa", "Sindhuli", "Sindhupalchok"
  ],
  "West Nepal (Gandaki Province)": [
    "Baglung", "Gorkha", "Kaski", "Lamjung", "Manang", "Mustang", "Myagdi", "Nawalparasi East",
    "Parbat", "Syangja", "Tanahun"
  ],
  "West Nepal (Lumbini Province)": [
    "Arghakhanchi", "Banke", "Bardiya", "Dang", "Gulmi", "Kapilvastu", "Nawalparasi West",
    "Palpa", "Pyuthan", "Rolpa", "Rukum East", "Rupandehi"
  ],
  "Mid-West Nepal (Karnali Province)": [
    "Dailekh", "Dolpa", "Humla", "Jajarkot", "Jumla", "Kalikot", "Mugu",
    "Rukum West", "Salyan", "Surkhet"
  ],
  "Far-West Nepal (Sudurpashchim Province)": [
    "Achham", "Baitadi", "Bajhang", "Bajura", "Dadeldhura", "Darchula", "Doti",
    "Kailali", "Kanchanpur"
  ]
} as const;

export type RegionName = keyof typeof nepalDistrictsByRegion;

// Define budget ranges
export const budgetRanges = {
  'budget_under_500': '< $500 USD',
  'budget_500_1000': '$500 - $1000 USD',
  'budget_1000_2000': '$1000 - $2000 USD',
  'budget_2000_3000': '$2000 - $3000 USD',
  'budget_over_3000': '> $3000 USD'
} as const;

export type BudgetRangeKey = keyof typeof budgetRanges;
export type BudgetRangeLabel = typeof budgetRanges[BudgetRangeKey];
