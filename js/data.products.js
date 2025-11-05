// Base catalogue officiel (id, name, brand, category, type, price, image, description, benefits, usage)
window.FD_PRODUCTS = [
  // Individuels
  {
    id: "anthelios-spf50",
    name: "Anthelios Fluide Invisible SPF 50+",
    brand: "La Roche-Posay",
    category: "Soin Visage (Protection solaire)",
    type: "sunscreen",
    price: 20,
    image: "assets/images/products/anthelios.jpg",
    shortDesc: "Très haute protection UVA/UVB invisible pour peaux sensibles.",
    longDesc: "Fluide solaire ultra-résistant à l’eau, à la sueur et au sable, sans parfum, enrichi en antioxydants.",
    benefits: [
      "Très haute protection UVA/UVB",
      "Texture fluide invisible",
      "Adapté aux peaux sensibles"
    ],
    usage: [
      "Appliquer le matin en dernière étape de la routine",
      "Renouveler toutes les 2h en cas d’exposition"
    ]
  },
  {
    id: "anua-azelaic-hyaluronic",
    name: "Azelaic Acid 10 + Hyaluronic Acid",
    brand: "Anua",
    category: "Soin Visage (Sérum)",
    type: "serum",
    price: 20,
    image: "assets/images/products/anua-azelaic-hyaluronic.jpg",
    shortDesc: "Sérum azélaïque pour uniformité et hydratation.",
    longDesc: "Cible l’uniformité du teint et l’hydratation grâce à l’azélaïque et l’acide hyaluronique.",
    benefits: ["Uniformité du teint", "Hydratation", "Barrière cutanée soutenue"],
    usage: ["Appliquer 2–3 gouttes sur peau propre", "Utiliser matin ou soir, selon tolérance"]
  },
  {
    id: "anua-niacinamide-txa",
    name: "Niacinamide 10 + TXA",
    brand: "Anua",
    category: "Soin Visage (Sérum)",
    type: "serum",
    price: 20,
    image: "assets/images/products/anua-niacinamide-txa.jpg",
    shortDesc: "Niacinamide + TXA pour pores et taches.",
    longDesc: "Cible hydratation, uniformité, réduction des pores et amélioration de la barrière cutanée.",
    benefits: ["Réduction des pores", "Uniformité du teint", "Renforce la barrière"],
    usage: ["Appliquer 2–3 gouttes sur peau propre", "Utiliser quotidiennement"]
  },
  {
    id: "ordinary-niacinamide-zinc",
    name: "Niacinamide 10% + Zinc 1%",
    brand: "The Ordinary",
    category: "Soin Visage (Sérum)",
    type: "serum",
    price: 15,
    image: "assets/images/products/ordinary-niacinamide-zinc.jpg",
    shortDesc: "Régulation du sébum et imperfections.",
    longDesc: "Formulé pour cibler les imperfections, pores dilatés et excès de brillance.",
    benefits: ["Régule le sébum", "Réduit les imperfections", "Affi­ne les pores"],
    usage: ["Appliquer matin et/ou soir", "Porter un SPF le jour"]
  },
  {
    id: "dralthea-345",
    name: "345 Natural Repair Cream",
    brand: "Dr. Althea Pro Lab",
    category: "Soin Visage (Crème réparatrice)",
    type: "cream",
    price: 30,
    image: "assets/images/products/dralthea-345.jpg",
    shortDesc: "Crème réparatrice apaisante.",
    longDesc: "Apaise, hydrate et renforce la barrière cutanée pour peaux sensibles ou irritées.",
    benefits: ["Apaise les irritations", "Hydrate intensément", "Renforce la barrière"],
    usage: ["Appliquer en dernière étape de la routine", "Utiliser matin et soir"]
  },
  {
    id: "ordinary-glycolic7",
    name: "Glycolic Acid 7% Toning Solution",
    brand: "The Ordinary",
    category: "Soin Visage (Tonique exfoliant)",
    type: "toner",
    price: 30,
    image: "assets/images/products/ordinary-glycolic7.jpg",
    shortDesc: "Exfoliation douce pour éclat.",
    longDesc: "7% d’acide glycolique pour améliorer texture et luminosité, à utiliser le soir.",
    benefits: ["Exfolie en douceur", "Améliore la texture", "Favorise l’éclat"],
    usage: ["Utiliser le soir, 3–4x/semaine", "Éviter avec autres acides le même soir"]
  },

  // Duo numbuz:n
  {
    id: "numbuzn-duo",
    name: "Duo 5+ Pads & Sérum Niacinamide",
    brand: "numbuz:n",
    category: "Soin Visage (Duo)",
    type: "duo",
    price: 70,
    image: "assets/images/packs/numbuzn-duo.jpg",
    shortDesc: "Éclat, uniformité et texture améliorée.",
    longDesc: "Deux produits de la ligne 5+ : pads exfoliants/éclaircissants et sérum niacinamide.",
    benefits: ["Réduit les taches", "Lisse la texture", "Illumine le teint"],
    usage: ["Pads après nettoyage", "Sérum ensuite, puis crème"]
  },

  // Packs
  {
    id: "pack-heartleaf",
    name: "Pack Anua Heartleaf (5 produits)",
    brand: "Anua",
    category: "Pack",
    type: "pack",
    price: 105,
    image: "assets/images/packs/heartleaf-pack.jpg",
    shortDesc: "Apaisement et contrôle des pores.",
    longDesc: "Toner, Cleansing Oil, Daily Lotion, Niacinamide 10% + Zinc 1% Serum (Anua), Quercetinol™ Foam."
  },
  {
    id: "pack-centella",
    name: "Pack SKIN1004 Centella (5 produits)",
    brand: "SKIN1004",
    category: "Pack",
    type: "pack",
    price: 105,
    image: "assets/images/packs/centella-pack.jpg",
    shortDesc: "Réparation à la Centella Asiatica.",
    longDesc: "Light Cleansing Oil, Ampoule Foam, Toning Toner, Ampoule, Soothing Cream."
  },
  {
    id: "pack-rice",
    name: "Pack Anua Rice (4 produits)",
    brand: "Anua",
    category: "Pack",
    type: "pack",
    price: 100,
    image: "assets/images/packs/rice-pack.jpg",
    shortDesc: "Hydratation et glow glass skin.",
    longDesc: "Glow Milky Toner, Intensive Hydrating Serum, Enzyme Powder, Intensive Moisturizing Cream."
  },

  // CeraVe produits (individuels)
  { id: "cerave-hydrating", name: "Hydrating Facial Cleanser", brand: "CeraVe", category: "Soin Visage (Nettoyant)", type: "cleanser", price: 25, image: "assets/images/products/cerave-hydrating.jpg", shortDesc: "Nettoyant hydratant peaux normales à sèches." },
  { id: "cerave-foaming", name: "Foaming Facial Cleanser", brand: "CeraVe", category: "Soin Visage (Nettoyant)", type: "cleanser", price: 25, image: "assets/images/products/cerave-foaming.jpg", shortDesc: "Nettoyant moussant peaux normales à grasses." },
  { id: "cerave-lotion", name: "Moisturising Lotion", brand: "CeraVe", category: "Soin Visage et Corps (Lait)", type: "cream", price: 25, image: "assets/images/products/cerave-moisturising-lotion.jpg", shortDesc: "Lait hydratant visage et corps." },
  { id: "cerave-sa", name: "Renewing SA Cleanser", brand: "CeraVe", category: "Soin Visage (Nettoyant SA)", type: "cleanser", price: 25, image: "assets/images/products/cerave-renewing-sa.jpg", shortDesc: "Nettoyant exfoliant à l’acide salicylique." },
  { id: "cerave-acne", name: "Acne Control Cleanser", brand: "CeraVe", category: "Soin Visage (Nettoyant anti-acné)", type: "cleanser", price: 25, image: "assets/images/products/cerave-acne-control.jpg", shortDesc: "Nettoyant anti-acné, contrôle du sébum." }
];
// NOTE: Previously this file contained a second assignment to window.FD_PRODUCTS
// which overwrote the full product list with a single item. That duplicate has
// been removed so the canonical product array (the large array above) is used.
