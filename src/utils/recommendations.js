// Mock restaurant data
const RESTAURANTS = [
  {
    name: "Warung Mie Pedas Juara",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800",
    rating: 4.6,
    description: "Makanan berkuah, pedas sedang, cocok untuk makan malam.",
    distance: "2.8 km",
    category: "Mie & Noodles",
    priceRange: "Rp 20.000 - 50.000",
    ambiance: "Casual & Ramai"
  },
  {
    name: "Bebek Goreng Crispy Pak Slamet",
    image: "https://images.unsplash.com/photo-1604908815852-8158682bda77?w=800",
    rating: 4.8,
    description: "Makanan kering, gurih, dengan nasi putih hangat.",
    distance: "1.5 km",
    category: "Makanan Lokal",
    priceRange: "Rp 30.000 - 70.000",
    ambiance: "Tenang & Nyaman"
  },
  {
    name: "Sushi Rama",
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800",
    rating: 4.7,
    description: "Fresh sushi, cocok untuk makan siang atau malam.",
    distance: "3.2 km",
    category: "Makanan Internasional",
    priceRange: "Rp 50.000 - 150.000",
    ambiance: "Modern & Tenang"
  },
  {
    name: "Nasi Goreng Kambing Bang Toyib",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800",
    rating: 4.5,
    description: "Nasi goreng pedas dengan daging kambing empuk.",
    distance: "0.8 km",
    category: "Makanan Lokal",
    priceRange: "Rp 25.000 - 60.000",
    ambiance: "Ramai & Meriah"
  },
  {
    name: "Pasta & Pizza Corner",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800",
    rating: 4.4,
    description: "Pasta creamy dan pizza panggang oven.",
    distance: "4.1 km",
    category: "Makanan Internasional",
    priceRange: "Rp 40.000 - 100.000",
    ambiance: "Cozy & Romantis"
  },
  {
    name: "Ayam Geprek Sambal Matah",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800",
    rating: 4.7,
    description: "Ayam crispy dengan sambal matah pedas manis.",
    distance: "1.2 km",
    category: "Makanan Lokal",
    priceRange: "Rp 25.000 - 45.000",
    ambiance: "Casual & Ramai"
  },
  {
    name: "Bakso Beranak Malang",
    image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800",
    rating: 4.6,
    description: "Bakso jumbo isi bakso kecil dengan kuah gurih.",
    distance: "2.1 km",
    category: "Makanan Lokal",
    priceRange: "Rp 20.000 - 40.000",
    ambiance: "Ramai & Meriah"
  },
  {
    name: "Kafe Kopi & Roti Bakar",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
    rating: 4.5,
    description: "Kopi specialty dengan roti bakar topping premium.",
    distance: "3.5 km",
    category: "Cafe & Snack",
    priceRange: "Rp 30.000 - 60.000",
    ambiance: "Tenang & Nyaman"
  },
  {
    name: "Seafood Bakar Jimbaran",
    image: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=800",
    rating: 4.8,
    description: "Seafood segar dibakar dengan bumbu khas Bali.",
    distance: "4.5 km",
    category: "Seafood",
    priceRange: "Rp 80.000 - 200.000",
    ambiance: "Ramai & Meriah"
  }
];

export const generateRecommendations = () => {
  const shuffled = [...RESTAURANTS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
};

