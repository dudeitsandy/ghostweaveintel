// ─── BRANDS ──────────────────────────────────────────────────────────────────
export const brands = [
  { id: 'b1', name: 'Broken Coast', category: 'Premium Flower', province: 'BC', rep: 'r1', skus: 14, activeStores: 22, status: 'active', logoInitials: 'BC', color: '#3B6D11', revenue30d: 84200, units30d: 3210, revenuePrev: 75100, rank: 1 },
  { id: 'b2', name: 'Tantalus Labs', category: 'Sun-grown Flower', province: 'BC', rep: 'r2', skus: 11, activeStores: 19, status: 'active', logoInitials: 'TL', color: '#185FA5', revenue30d: 71100, units30d: 2700, revenuePrev: 68000, rank: 2 },
  { id: 'b3', name: 'Whistler Cannabis', category: 'Organic / Vapes', province: 'BC', rep: 'r1', skus: 9, activeStores: 15, status: 'active', logoInitials: 'WC', color: '#0F6E56', revenue30d: 58400, units30d: 2220, revenuePrev: 61000, rank: 3 },
  { id: 'b4', name: 'General Admission', category: 'Value Flower', province: 'ON', rep: 'r3', skus: 8, activeStores: 18, status: 'active', logoInitials: 'GA', color: '#854F0B', revenue30d: 45900, units30d: 1750, revenuePrev: 42000, rank: 4 },
  { id: 'b5', name: 'Riff Natural Cannabis', category: 'Pre-rolls', province: 'ON', rep: 'r2', skus: 7, activeStores: 12, status: 'active', logoInitials: 'RN', color: '#533AB7', revenue30d: 33400, units30d: 1270, revenuePrev: 35000, rank: 5 },
  { id: 'b6', name: 'Vivo Cannabis', category: 'Concentrates', province: 'ON', rep: 'r3', skus: 6, activeStores: 8, status: 'watch', logoInitials: 'VC', color: '#993556', revenue30d: 21000, units30d: 800, revenuePrev: 26000, rank: 6 },
];

// ─── STORES ───────────────────────────────────────────────────────────────────
export const stores = [
  { id: 's1', name: 'Sessions Cannabis Robson', chain: 'Sessions', city: 'Vancouver', region: 'Metro Van', address: '1033 Robson St', postalCode: 'V6E 1B1', rep: 'r1', brands: ['b1','b2','b3','b4'], skusInStock: 14, lastVisit: '2025-03-14', status: 'active', revenue30d: 28400, units30d: 940, tier: 'A' },
  { id: 's2', name: 'Spiritleaf Kitsilano', chain: 'Spiritleaf', city: 'Vancouver', region: 'Metro Van', address: '2205 W 4th Ave', postalCode: 'V6K 1N9', rep: 'r1', brands: ['b1','b2','b4','b5','b6'], skusInStock: 12, lastVisit: '2025-03-12', status: 'active', revenue30d: 24100, units30d: 800, tier: 'A' },
  { id: 's3', name: 'Nova Cannabis Broadway', chain: 'Nova', city: 'Vancouver', region: 'Metro Van', address: '590 W Broadway', postalCode: 'V5Z 1E9', rep: 'r2', brands: ['b1','b2','b3','b5'], skusInStock: 9, lastVisit: '2025-03-10', status: 'active', revenue30d: 19800, units30d: 660, tier: 'B' },
  { id: 's4', name: 'Fire & Flower Yaletown', chain: 'Fire & Flower', city: 'Vancouver', region: 'Metro Van', address: '1177 Pacific Blvd', postalCode: 'V6Z 2P5', rep: 'r2', brands: ['b3','b4','b6'], skusInStock: 6, lastVisit: '2025-02-28', status: 'watch', revenue30d: 12200, units30d: 410, tier: 'B' },
  { id: 's5', name: 'Canna Cabana Victoria', chain: 'Canna Cabana', city: 'Victoria', region: 'Vancouver Island', address: '3 Fan Tan Alley', postalCode: 'V8W 3G6', rep: 'r1', brands: ['b1','b2','b3','b4','b5','b6'], skusInStock: 18, lastVisit: '2025-03-15', status: 'active', revenue30d: 31000, units30d: 1040, tier: 'A' },
  { id: 's6', name: 'Muse Cannabis Nanaimo', chain: 'Muse', city: 'Nanaimo', region: 'Vancouver Island', address: '6731 N Island Hwy', postalCode: 'V9V 1K7', rep: 'r3', brands: ['b1','b4','b5'], skusInStock: 4, lastVisit: '2025-03-01', status: 'watch', revenue30d: 8800, units30d: 290, tier: 'C' },
  { id: 's7', name: 'Tokyo Smoke Gastown', chain: 'Tokyo Smoke', city: 'Vancouver', region: 'Metro Van', address: '334 Water St', postalCode: 'V6B 1B6', rep: 'r2', brands: ['b1','b2','b3'], skusInStock: 11, lastVisit: '2025-03-13', status: 'active', revenue30d: 22500, units30d: 750, tier: 'A' },
  { id: 's8', name: 'Burb Cannabis Burnaby', chain: 'Burb', city: 'Burnaby', region: 'Metro Van', address: '4567 Kingsway', postalCode: 'V5H 2A7', rep: 'r3', brands: ['b2','b3','b4','b5'], skusInStock: 8, lastVisit: '2025-03-09', status: 'active', revenue30d: 16400, units30d: 545, tier: 'B' },
];

// ─── REPS ─────────────────────────────────────────────────────────────────────
export const reps = [
  { id: 'r1', name: 'Scott Mackinnon', initials: 'SM', territory: 'Metro Van / Island', stores: ['s1','s2','s5'], brands: ['b1','b3'], revenue30d: 83500, units30d: 2840, visits30d: 18, samplesOut: 32 },
  { id: 'r2', name: 'Jess Tran', initials: 'JT', territory: 'Metro Van East', stores: ['s3','s4','s7'], brands: ['b2','b5'], revenue30d: 56500, units30d: 1820, visits30d: 14, samplesOut: 21 },
  { id: 'r3', name: 'Mike Holloway', initials: 'MH', territory: 'Burnaby / Island', stores: ['s6','s8'], brands: ['b4','b6'], revenue30d: 46200, units30d: 1835, visits30d: 11, samplesOut: 15 },
];

// ─── SKUS ─────────────────────────────────────────────────────────────────────
export const skus = [
  { id: 'sku1', brand: 'b1', name: 'Kali Mist 3.5g', category: 'Flower', price: 32.00, unitsWk: 342, trend: 18, stores: 22, xrCode: 'XR-BC-4821' },
  { id: 'sku2', brand: 'b2', name: 'Starburst OG Pre-roll 3pk', category: 'Pre-roll', price: 28.00, unitsWk: 290, trend: 9, stores: 19, xrCode: 'XR-TL-0093' },
  { id: 'sku3', brand: 'b3', name: 'Mountain Mango Vape 0.5g', category: 'Vape', price: 55.00, unitsWk: 214, trend: 0, stores: 15, xrCode: 'XR-WC-1177' },
  { id: 'sku4', brand: 'b1', name: 'Nootka Sound 7g', category: 'Flower', price: 58.00, unitsWk: 198, trend: 6, stores: 18, xrCode: 'XR-BC-4822' },
  { id: 'sku5', brand: 'b4', name: 'Blue Dream 7g', category: 'Flower', price: 44.00, unitsWk: 180, trend: 4, stores: 18, xrCode: 'XR-GA-3340' },
  { id: 'sku6', brand: 'b2', name: 'Timewarp Sungrown 3.5g', category: 'Flower', price: 36.00, unitsWk: 155, trend: -5, stores: 14, xrCode: 'XR-TL-0094' },
  { id: 'sku7', brand: 'b5', name: 'Sour Tangie Pre-roll 1g', category: 'Pre-roll', price: 12.00, unitsWk: 140, trend: -2, stores: 12, xrCode: 'XR-RN-2201' },
  { id: 'sku8', brand: 'b6', name: 'Pink Kush Live Resin 1g', category: 'Concentrate', price: 80.00, unitsWk: 44, trend: -22, stores: 8, xrCode: 'XR-VI-9902' },
  { id: 'sku9', brand: 'b5', name: 'CBD Citrus Gummies 10pk', category: 'Edible', price: 28.00, unitsWk: 3, trend: -41, stores: 4, xrCode: 'XR-RN-2202' },
];

// ─── SAMPLES ──────────────────────────────────────────────────────────────────
export const samples = [
  { id: 'smp1', sku: 'sku1', brand: 'b1', store: 's1', rep: 'r1', xrCode: 'XR-BC-4821', dateOut: '2025-03-12', value: 42, status: 'reordered', notes: 'Budtender loved it' },
  { id: 'smp2', sku: 'sku2', brand: 'b2', store: 's2', rep: 'r1', xrCode: 'XR-TL-0093', dateOut: '2025-03-10', value: 28, status: 'pending', notes: '' },
  { id: 'smp3', sku: 'sku3', brand: 'b3', store: 's3', rep: 'r2', xrCode: 'XR-WC-1177', dateOut: '2025-03-08', value: 55, status: 'pending', notes: 'Follow up next visit' },
  { id: 'smp4', sku: 'sku5', brand: 'b4', store: 's4', rep: 'r2', xrCode: 'XR-GA-3340', dateOut: '2025-02-28', value: 65, status: 'expired', notes: '' },
  { id: 'smp5', sku: 'sku8', brand: 'b6', store: 's5', rep: 'r1', xrCode: 'XR-VI-9902', dateOut: '2025-02-22', value: 80, status: 'reordered', notes: '' },
  { id: 'smp6', sku: 'sku9', brand: 'b5', store: 's6', rep: 'r3', xrCode: 'XR-RN-2202', dateOut: '2025-02-18', value: 35, status: 'not_converted', notes: 'Manager not interested in edibles' },
  { id: 'smp7', sku: 'sku4', brand: 'b1', store: 's7', rep: 'r2', xrCode: 'XR-BC-4822', dateOut: '2025-03-14', value: 58, status: 'pending', notes: '' },
  { id: 'smp8', sku: 'sku6', brand: 'b2', store: 's8', rep: 'r3', xrCode: 'XR-TL-0094', dateOut: '2025-03-05', value: 36, status: 'reordered', notes: '' },
];

// ─── REVENUE TIME SERIES (last 8 weeks) ───────────────────────────────────────
export const weeklyRevenue = [
  { week: 'Jan 27', total: 42100, bc: 18200, tl: 12100, wc: 9100, others: 2700 },
  { week: 'Feb 3',  total: 45800, bc: 19800, tl: 12900, wc: 9800, others: 3300 },
  { week: 'Feb 10', total: 44200, bc: 19100, tl: 12500, wc: 9400, others: 3200 },
  { week: 'Feb 17', total: 47600, bc: 20600, tl: 13400, wc: 10100, others: 3500 },
  { week: 'Feb 24', total: 51200, bc: 22100, tl: 14100, wc: 10900, others: 4100 },
  { week: 'Mar 3',  total: 53800, bc: 23400, tl: 14800, wc: 11200, others: 4400 },
  { week: 'Mar 10', total: 55100, bc: 23900, tl: 15200, wc: 11400, others: 4600 },
  { week: 'Mar 17', total: 57900, bc: 25100, tl: 15900, wc: 11800, others: 5100 },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
export const getBrand = id => brands.find(b => b.id === id);
export const getStore = id => stores.find(s => s.id === id);
export const getRep   = id => reps.find(r => r.id === id);
export const getSku   = id => skus.find(s => s.id === id);
