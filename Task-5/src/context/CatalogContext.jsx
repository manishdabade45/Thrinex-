import React, { createContext, useState, useEffect } from 'react';

export const CatalogContext = createContext();

const INITIAL_PRODUCTS = [
  {
    id: "1",
    name: "LuxeCraft ErgoPro Chair",
    description: "Engineered for maximum comfort and a premium aesthetic, the ErgoPro features responsive lumbar support, breathable Italian mesh, and multi-directional armrests. Crafted with a polished aluminum framework, it merges ergonomic science with state-of-the-art workspace design.",
    price: 749.00,
    category: "Furniture",
    stock: 12,
    rating: 4.9,
    reviewsCount: 38,
    image: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80"
    ],
    specs: {
      "Material": "Polished aluminum framework, high-tensile Italian mesh",
      "Max Capacity": "300 lbs / 136 kg",
      "Adjustability": "4D armrests, lumbar depth, seat tilt and depth",
      "Warranty": "5 Years"
    },
    reviews: [
      { id: 1, user: "Marcus V.", rating: 5, comment: "Absolutely phenomenal chair. The lumbar support conforms perfectly. My posture and lower back thank me every day.", date: "2026-06-25" },
      { id: 2, user: "Elena K.", rating: 4, comment: "Extremely well built. Setting it up took about 20 minutes. It feels highly premium, though the armrests are slightly firm.", date: "2026-07-01" }
    ]
  },
  {
    id: "2",
    name: "Kinesis Artisan Mechanical Keyboard",
    description: "A compact hot-swappable mechanical keyboard designed for typists and creators. Featuring a solid walnut wood wrist rest, custom lubed linear switches, and thick double-shot PBT keycaps. Built for acoustic comfort and beautiful desk aesthetics.",
    price: 229.00,
    category: "Tech",
    stock: 8,
    rating: 4.8,
    reviewsCount: 22,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80"
    ],
    specs: {
      "Switches": "Pre-lubed Gateron Yellow (Linear)",
      "Case": "CNC Anodized Aluminum with Walnut bezel",
      "Layout": "75% ANSI layout (84 keys)",
      "Connectivity": "Detachable USB-C, Bluetooth 5.1"
    },
    reviews: [
      { id: 1, user: "Daniel T.", rating: 5, comment: "The keystrokes sound like soft raindrops. Incredible build quality. The walnut bezel matches my desk setup perfectly.", date: "2026-06-12" },
      { id: 2, user: "Aiko M.", rating: 5, comment: "No pinging, stabilizer rattle is virtually nonexistent. Worth every single penny.", date: "2026-06-20" }
    ]
  },
  {
    id: "3",
    name: "Nordic Felt Desk Pad",
    description: "Elevate your workspace with a desk mat crafted from 100% ethically sourced Merino wool felt. Provides a soft tactile surface for typing, protects your desk, and features an integrated vegan cork backing for superior anti-slip performance.",
    price: 49.00,
    category: "Workspace",
    stock: 25,
    rating: 4.7,
    reviewsCount: 45,
    image: "https://images.unsplash.com/photo-1632292224971-0d45778bd364?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1632292224971-0d45778bd364?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&w=800&q=80"
    ],
    specs: {
      "Material": "100% Merino Wool Felt, Natural Cork base",
      "Dimensions": "900mm x 400mm x 4mm",
      "Maintenance": "Lint-roll or spot-clean with wool detergent",
      "Origin": "Designed in Denmark"
    },
    reviews: [
      { id: 1, user: "Sophia L.", rating: 5, comment: "It makes my desk feel so cozy. Mouse tracks perfectly and the gray tone is very sophisticated.", date: "2026-05-18" },
      { id: 2, user: "Liam P.", rating: 4, comment: "Lovely material, it did shed just a tiny bit in the first week but it is solid now. Keeps my hands warm.", date: "2026-06-03" }
    ]
  },
  {
    id: "4",
    name: "Ascent Smart Charging Lamp",
    description: "A dual-zone LED light that adjusts dynamically to your ambient workspace light. Base features an integrated Qi wireless fast charger (15W) and an additional USB-A/C hub. Styled in solid steel and brushed brass fittings.",
    price: 159.00,
    category: "Workspace",
    stock: 15,
    rating: 4.6,
    reviewsCount: 16,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?auto=format&fit=crop&w=800&q=80"
    ],
    specs: {
      "Illumination": "2700K - 6500K color range, max 800 Lumens",
      "Wireless Output": "15W Fast Charge (Qi-compatible)",
      "Ports": "1x USB-C (Power Delivery), 1x USB-A",
      "Power consumption": "12W lamp + charger output"
    },
    reviews: [
      { id: 1, user: "Jonathan D.", rating: 4, comment: "Love the auto-dimming function. The brass accent matches my wood setup nicely.", date: "2026-07-02" }
    ]
  },
  {
    id: "5",
    name: "Vanguard Leather Briefcase",
    description: "A professional companion made to stand the test of time. Crafted from vegetable-tanned full grain Horween leather. Hand-stitched with durable waxed thread, featuring premium YKK zippers, brass hardware, and dedicated laptop cushioning.",
    price: 329.00,
    category: "Lifestyle",
    stock: 5,
    rating: 4.9,
    reviewsCount: 14,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80"
    ],
    specs: {
      "Leather Type": "Vegetable-tanned Full-Grain Horween Leather",
      "Laptop Pocket": "Fits up to 16\" Macbook Pro",
      "Hardware": "Solid Sand-casted Brass fittings",
      "Strap": "Detachable leather shoulder strap with padded support"
    },
    reviews: [
      { id: 1, user: "Clara G.", rating: 5, comment: "The smell of the leather out of the box was heaven. Stitching is immaculate. Already getting compliments at the office.", date: "2026-07-03" }
    ]
  },
  {
    id: "6",
    name: "Aether ANC Studio Headphones",
    description: "Immerse yourself in pure acoustics. The Aether headphones feature custom-developed 40mm beryllium drivers, active hybrid noise cancellation, and luxury memory foam earcups wrapped in soft lambskin. Up to 40 hours of audio bliss per charge.",
    price: 299.00,
    category: "Tech",
    stock: 10,
    rating: 4.8,
    reviewsCount: 30,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80"
    ],
    specs: {
      "Driver unit": "40mm Beryllium Dynamic drivers",
      "Battery Life": "Up to 40 hours (ANC on), USB-C fast charge",
      "ANC Depth": "Hybrid feedforward/feedback (up to 38dB reduction)",
      "Codec Support": "LDAC, AAC, aptX Adaptive, SBC"
    },
    reviews: [
      { id: 1, user: "Oliver S.", rating: 5, comment: "Soundstage is unbelievably wide for a closed-back headphone. ANC cuts out hums effortlessly. A dream for long flights.", date: "2026-06-29" },
      { id: 2, user: "Isabella N.", rating: 4, comment: "Sound is sublime, but clamping force was a little tight initially. Softened up after a couple of days.", date: "2026-07-04" }
    ]
  }
];

export const CatalogProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('luxecraft_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error loading products from localStorage", e);
      }
    }
    return INITIAL_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem('luxecraft_products', JSON.stringify(products));
  }, [products]);

  // CRUD Operations
  const addProduct = (productData) => {
    const newProduct = {
      ...productData,
      id: String(Date.now()), // unique id based on timestamp
      price: parseFloat(productData.price) || 0,
      stock: parseInt(productData.stock) || 0,
      rating: productData.rating ? parseFloat(productData.rating) : 5.0,
      reviewsCount: productData.reviewsCount ? parseInt(productData.reviewsCount) : 0,
      reviews: productData.reviews || [],
      images: productData.images || [productData.image],
      specs: productData.specs || {}
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id, updatedData) => {
    setProducts((prev) =>
      prev.map((prod) => (prod.id === id ? { ...prod, ...updatedData } : prod))
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((prod) => prod.id !== id));
  };

  const addReview = (productId, review) => {
    const newReview = {
      id: Date.now(),
      user: review.user || "Anonymous",
      rating: parseInt(review.rating) || 5,
      comment: review.comment || "",
      date: new Date().toISOString().split('T')[0]
    };

    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === productId) {
          const updatedReviews = [newReview, ...(prod.reviews || [])];
          const newAvgRating = parseFloat(
            (updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1)
          );
          return {
            ...prod,
            reviews: updatedReviews,
            rating: newAvgRating,
            reviewsCount: updatedReviews.length
          };
        }
        return prod;
      })
    );
  };

  return (
    <CatalogContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, addReview }}>
      {children}
    </CatalogContext.Provider>
  );
};
