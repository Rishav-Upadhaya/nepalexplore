// Currently empty, can be populated with shared types as needed.
// For example, types for ItineraryDay or District.

export interface ItineraryDay {
  day: number;
  location: string;
  activities: string;
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

// List of Nepal districts
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
