// ============================================================================
// 2026 DAIHAN Scientific Instruments Official Master Catalog Database
// Sourced directly from: "2026 DAIHAN Instruments.pdf" & "상품상세 카달록"
// ============================================================================
const DAIHAN_CATALOG = [
  // 1. Autoclaves & Steam Sterilizers (p.299~304)
  {
    id: "DH-STE-AM47",
    modelNo: "Ergonomic Autoclave “STE-AM47”",
    catNo: "DH.WAC01047",
    name: "Medical-Use Top-Loading Vertical Autoclave, 47 Lit.",
    category: "autoclaves",
    categoryName: "Autoclaves & Sterilizers",
    catalogPage: "Page 300",
    application: ["bio", "medical", "pharma"],
    applicationName: "Medical & Bio-Hazard Sterilization (Class B)",
    is2026New: true,
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&auto=format&fit=crop&q=80",
    description: "7-inch Full Touch Screen TFT LCD with Built-in Powerful Vacuum Pump & Dot-type Data Recorder. Features Pre-Vacuum → Heating & Pressurizing → Sterilization → Post-Vacuum Drying cycle with Electronic Door Lock & CE/PED Medical Certification.",
    specs: {
      capacity: "47 Liters",
      chamberDimensions: "Ø320 × H585 mm (SUS304)",
      tempRange: "105℃ to 135℃ (Sterilization Range)",
      pressureRange: "Up to 2.4 kgf/cm² (0.24 MPa)",
      controller: "7\" Full Touch Screen TFT LCD Controller",
      vacuumPump: "Built-in High Efficiency Vacuum Pump for Complete Air Removal",
      recorder: "Built-in Dot-type Micro Data Recorder Included",
      safetyDevices: "Electronic Door Interlock, Over-Pressure Safety Valve, Low-Water Level Cut-off, Leakage Breaker",
      certification: "CE, PED & Medical Device Directive Certified, PL Insurance"
    },
    voltageOptions: [
      { id: "V230", label: "230V, 50/60Hz, 1-Phase 3.2kW (Global Standard)", default: true },
      { id: "V120", label: "120V, 60Hz, 1-Phase (Special North America Line)", default: false }
    ],
    plugOptions: [
      { id: "PLUG-C", label: "Type C (Euro Industrial 16A)", image: "🔌 Type C" },
      { id: "PLUG-G", label: "Type G (UK 13A Fused)", image: "🔌 Type G" },
      { id: "PLUG-B", label: "Type B (US NEMA 6-20P)", image: "🔌 Type B" }
    ],
    compatibleAccessories: [
      { id: "ACC-STE-BSK47", name: "Standard Stainless Wire Basket (Ø300×H250mm)", partNo: "DH.WAC11047", priceUsd: 85 },
      { id: "ACC-STE-PPR", name: "Replacement Dot-Matrix Printer Paper (10 rolls)", partNo: "DH.WAC30005", priceUsd: 40 },
      { id: "ACC-DEOD-01", name: "Autoclaving Deodorant Capsules (100 pcs)", partNo: "DH.WAC50001", priceUsd: 55 }
    ],
    listPriceUsd: 5400,
    agentPriceUsd: 3350,
    leadTime: "3-4 Weeks (Ex-Works)",
    cbm: "0.55 CBM",
    grossWeight: "98 kg"
  },
  {
    id: "DH-LAC-5080",
    modelNo: "MaXterile™ 80",
    catNo: "DH.WAC05080",
    name: "High-Pressure Steam Autoclave, 80 Lit.",
    category: "autoclaves",
    categoryName: "Autoclaves & Sterilizers",
    catalogPage: "Page 302",
    application: ["bio", "pharma"],
    applicationName: "General Lab Media Prep & Bio-Waste",
    is2026New: false,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop&q=80",
    description: "Standard Vertical Steam Sterilizer with Digital Fuzzy PID Controller, Jog-Shuttle dial, Over-pressure release valve and 2 wire baskets.",
    specs: {
      capacity: "80 Liters",
      chamberDimensions: "Ø400 × H650 mm (SUS304)",
      tempRange: "110℃ to 132℃",
      pressureRange: "Up to 2.0 kgf/cm²",
      basketsIncluded: "2 Stainless Steel Wire Mesh Baskets",
      controller: "Digital Fuzzy PID with Jog-Dial & LCD",
      certification: "CE Certified, PL Insurance"
    },
    voltageOptions: [
      { id: "V230", label: "230V, 50/60Hz, 4.0kW (Standard)", default: true },
      { id: "V120", label: "120V, 60Hz", default: false }
    ],
    plugOptions: [
      { id: "PLUG-C", label: "Type C Industrial", image: "🔌 Type C" },
      { id: "PLUG-G", label: "Type G (UK)", image: "🔌 Type G" },
      { id: "PLUG-B", label: "Type B (US)", image: "🔌 Type B" }
    ],
    compatibleAccessories: [
      { id: "ACC-AC-BSK80", name: "Extra Stainless Steel Wire Basket (Ø380×H290mm)", partNo: "DH.WAC11080", priceUsd: 95 },
      { id: "ACC-AC-SOLID", name: "Solid Bottom Waste Container Bucket", partNo: "DH.WAC21080", priceUsd: 130 }
    ],
    listPriceUsd: 4800,
    agentPriceUsd: 2950,
    leadTime: "3 Weeks",
    cbm: "0.68 CBM",
    grossWeight: "115 kg"
  },

  // 2. Magnetic Stirrers (p.309~312 & Magnatic stirrers_DH.pdf)
  {
    id: "DH-MS-20D",
    modelNo: "Digital Magnetic Stirrer “MS-20D”",
    catNo: "DH.WMS03020",
    name: "180×180mm Ceramic-Coated Plate Digital Magnetic Stirrer, Max 20L",
    category: "stirring",
    categoryName: "Stirring & Shaking",
    catalogPage: "Page 310",
    application: ["chemical", "pharma", "bio"],
    applicationName: "Chemical Synthesis & High-Stability Titration",
    is2026New: true,
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&auto=format&fit=crop&q=80",
    description: "Brushless DC Motor(BLDC) for Permanent Life, Patented Jog-Shuttle Control with Back-light LCD, Smooth Start & Stop Mechanism, Max 1,500 RPM with 3-Year Warranty & PL Insurance.",
    specs: {
      stirringCapacity: "Max. 20 Liters (H2O)",
      speedRange: "80 to 1,500 RPM (Digital Feedback Control)",
      plateSize: "180 × 180 mm (Solid Ceramic Coated, Chemical/Acid Resistant)",
      motor: "Brushless DC Motor (BLDC) - Extremely Quiet & Long Life",
      controller: "Patented Jog-Shuttle Feedback Control with LCD Backlight",
      timer: "99 hr 59 min with Continuous Run Mode",
      dimensions: "206 × 307 × 99 mm (Net Weight 2.8 kg)",
      warranty: "3-Year Official Manufacturer Warranty"
    },
    voltageOptions: [
      { id: "V230", label: "230V, 50/60Hz, Free-Voltage SMPS DC Adaptor", default: true },
      { id: "V120", label: "120V, 60Hz, Free-Voltage SMPS DC Adaptor", default: false }
    ],
    plugOptions: [
      { id: "PLUG-C", label: "Type C (Euro / Korea)", image: "🔌 Type C" },
      { id: "PLUG-G", label: "Type G (UK 3-pin)", image: "🔌 Type G" },
      { id: "PLUG-B", label: "Type B (US 3-pin)", image: "🔌 Type B" },
      { id: "PLUG-I", label: "Type I (Australia / China)", image: "🔌 Type I" }
    ],
    compatibleAccessories: [
      { id: "ACC-RD200", name: "Stainless Steel Holding Rod (Ø12.7×L400mm) “RD200”", partNo: "DH.WMS01002", priceUsd: 28 },
      { id: "ACC-CL200", name: "Holder / Clamp / Clip for Temp Probe “CL200”", partNo: "DH.WMS01003", priceUsd: 32 },
      { id: "ACC-BAR-30", name: "Octagonal PTFE Magnetic Stir Bar (30mm, 5 pcs)", partNo: "DH.BAR03005", priceUsd: 22 }
    ],
    listPriceUsd: 480,
    agentPriceUsd: 295,
    leadTime: "In Stock (1 Week)",
    cbm: "0.03 CBM",
    grossWeight: "3.5 kg"
  },
  {
    id: "DH-MSH-020",
    modelNo: "SMHS-6",
    catNo: "DH.WMH03020",
    name: "Digital Multi-Hotplate Stirrer, 6-Places",
    category: "stirring",
    categoryName: "Stirring & Shaking",
    catalogPage: "Page 312",
    application: ["chemical", "pharma"],
    applicationName: "Simultaneous Multi-Sample Synthesis",
    is2026New: true,
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80",
    description: "6-Position Independent or Synchronized Speed & Heating Control up to 350℃ & 1,500 RPM, Ceramic Coated Tops.",
    specs: {
      capacity: "6 × Up to 2L Flasks",
      tempRange: "Max 350℃ (±0.5℃ by External Probe)",
      speedRange: "80 to 1,500 RPM",
      plateSize: "6 × (120 × 120 mm)",
      dimensions: "510 × 410 × 150 mm",
      safety: "Hot-Top Warning Indicator (>50℃)"
    },
    voltageOptions: [
      { id: "V230", label: "230V, 50/60Hz (Standard)", default: true },
      { id: "V120", label: "120V, 60Hz", default: false }
    ],
    plugOptions: [
      { id: "PLUG-C", label: "Type C (Euro)", image: "🔌 Type C" },
      { id: "PLUG-G", label: "Type G (UK)", image: "🔌 Type G" },
      { id: "PLUG-B", label: "Type B (US)", image: "🔌 Type B" }
    ],
    compatibleAccessories: [
      { id: "ACC-PT100-6", name: "PT100 External Temp Probe Set for SMHS-6", partNo: "DH.WMS02006", priceUsd: 220 },
      { id: "ACC-BAR-SET", name: "PTFE Magnetic Bar Set (6 pcs)", partNo: "DH.WMS50300", priceUsd: 35 }
    ],
    listPriceUsd: 1890,
    agentPriceUsd: 1180,
    leadTime: "1-2 Weeks",
    cbm: "0.12 CBM",
    grossWeight: "16 kg"
  },

  // 3. Heating & Drying Ovens (p.213~225)
  {
    id: "DH-FON-050",
    modelNo: "ThermoStable™ FON-50",
    catNo: "DH.WON05050",
    name: "Forced-Air Precision Drying Oven, 50 Lit.",
    category: "heating",
    categoryName: "Heating & Drying",
    catalogPage: "Page 218",
    application: ["bio", "chemical", "pharma"],
    applicationName: "General Drying, Baking & Conditioning",
    is2026New: true,
    image: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=600&auto=format&fit=crop&q=80",
    description: "Standard Forced-Air Drying Oven with Precise Fuzzy Digital Controller, Jog-Dial Switch, up to 250℃, ±1.0℃ Accuracy at 100℃ with 2 Stainless Wire Shelves.",
    specs: {
      capacity: "50 Liters",
      tempRange: "Ambient +5℃ to 250℃",
      tempAccuracy: "±1.0℃ at 100℃",
      heatingTime: "15 min to 100℃ / 35 min to 250℃",
      chamberDimensions: "370 × 350 × 420 mm",
      overallDimensions: "530 × 585 × 735 mm",
      shelvesIncluded: "2 Stainless Wire Shelves (Load 16kg/shelf)",
      controller: "Digital Fuzzy Controller with Jog-Dial & Back-light LCD"
    },
    voltageOptions: [
      { id: "V230", label: "230V, 50/60Hz, 1.4kW (Global Standard)", default: true },
      { id: "V120", label: "120V, 60Hz, 1.4kW (North America)", default: false }
    ],
    plugOptions: [
      { id: "PLUG-C", label: "Type C (Euro / Schuko)", image: "🔌 Type C" },
      { id: "PLUG-G", label: "Type G (UK)", image: "🔌 Type G" },
      { id: "PLUG-B", label: "Type B (US 3-pin)", image: "🔌 Type B" }
    ],
    compatibleAccessories: [
      { id: "ACC-FON-SH01", name: "Wire Shelf, Stainless Steel (370x350mm)", partNo: "DH.WON11050", priceUsd: 45 },
      { id: "ACC-FON-SH02", name: "Perforated Shelf, Stainless Steel", partNo: "DH.WON21050", priceUsd: 65 }
    ],
    listPriceUsd: 1250,
    agentPriceUsd: 780,
    leadTime: "2 Weeks",
    cbm: "0.38 CBM",
    grossWeight: "52 kg"
  },

  // 4. Incubators (p.183~203)
  {
    id: "DH-INC-105",
    modelNo: "ThermoStable™ IN-105",
    catNo: "DH.WIN01105",
    name: "General Purpose Gravity-Air Incubator, 105 Lit.",
    category: "incubators",
    categoryName: "Incubators & Growth Chambers",
    catalogPage: "Page 190",
    application: ["bio", "pharma"],
    applicationName: "Cell Culture, Microbiology & Incubation",
    is2026New: true,
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&auto=format&fit=crop&q=80",
    description: "Natural Gravity Air Convection Incubator with Double Door Structure (Inner Tempered Glass Door), Digital Fuzzy Controller up to 70℃.",
    specs: {
      capacity: "105 Liters",
      tempRange: "Ambient +5℃ to 70℃ (±0.2℃ at 37℃)",
      innerDoor: "Tempered Glass Inner Door for Sample Observation without Heat Loss",
      chamberDimensions: "485 × 405 × 535 mm",
      controller: "Digital Fuzzy Controller with Jog-Dial",
      shelvesIncluded: "2 Stainless Steel Wire Shelves"
    },
    voltageOptions: [
      { id: "V230", label: "230V, 50/60Hz, 300W", default: true },
      { id: "V120", label: "120V, 60Hz, 300W", default: false }
    ],
    plugOptions: [
      { id: "PLUG-C", label: "Type C (Euro)", image: "🔌 Type C" },
      { id: "PLUG-G", label: "Type G (UK)", image: "🔌 Type G" },
      { id: "PLUG-B", label: "Type B (US)", image: "🔌 Type B" }
    ],
    compatibleAccessories: [
      { id: "ACC-INC-SH105", name: "Extra Stainless Wire Shelf for IN-105", partNo: "DH.WIN11105", priceUsd: 55 }
    ],
    listPriceUsd: 1480,
    agentPriceUsd: 920,
    leadTime: "2 Weeks",
    cbm: "0.45 CBM",
    grossWeight: "65 kg"
  },

  // 5. Water Baths & Circulators (p.47~55)
  {
    id: "DH-WCB-11",
    modelNo: "WiseCircu™ WCB-11",
    catNo: "DH.WCB01011",
    name: "Basic 100℃ Digital Water Bath, 11 Lit.",
    category: "baths",
    categoryName: "Baths & Circulators",
    catalogPage: "Page 48",
    application: ["bio", "chemical"],
    applicationName: "Sample Warming, Reagent Thawing & Enzyme Reaction",
    is2026New: false,
    image: "https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=600&auto=format&fit=crop&q=80",
    description: "Stainless-Steel 304 Seamless Bath Tank with Included Stainless Dome Lid, Digital Fuzzy PID Controller up to 100℃ with 0.1℃ Resolution.",
    specs: {
      bathCapacity: "11 Liters",
      tempRange: "Ambient +5℃ to 100℃ (±0.1℃ at 37℃)",
      bathOpening: "302 × 240 × Depth 150 mm",
      heater: "1.0 kW Stainless Incoloy Heater",
      lidIncluded: "Stainless-Steel Dome Lid Included (Prevents Condensation Drop)",
      timer: "99 hr 59 min (Delay Time / Operation Time Dual Mode)"
    },
    voltageOptions: [
      { id: "V230", label: "230V, 50/60Hz, 1.0kW", default: true },
      { id: "V120", label: "120V, 60Hz, 1.0kW", default: false }
    ],
    plugOptions: [
      { id: "PLUG-C", label: "Type C (Euro)", image: "🔌 Type C" },
      { id: "PLUG-G", label: "Type G (UK)", image: "🔌 Type G" },
      { id: "PLUG-B", label: "Type B (US)", image: "🔌 Type B" }
    ],
    compatibleAccessories: [
      { id: "ACC-BTH111", name: "Test Tube Rack for 11L Bath (Ø17mm, 36 holes)", partNo: "DH.WCB20111", priceUsd: 65 },
      { id: "ACC-BFC111", name: "Concentric Ring Cover Set for 11L Bath", partNo: "DH.WCB30111", priceUsd: 110 }
    ],
    listPriceUsd: 790,
    agentPriceUsd: 490,
    leadTime: "1 Week",
    cbm: "0.10 CBM",
    grossWeight: "10 kg"
  },

  // 6. Centrifuges (p.92)
  {
    id: "DH-CEF-500",
    modelNo: "High-Volume Centrifuge “CEF-500”",
    catNo: "DH.WCE00500",
    name: "General Purpose Swing-Out Centrifuge, Max 4,000 RPM (500ml × 4)",
    category: "centrifuges",
    categoryName: "Centrifuges & Separation",
    catalogPage: "Page 92",
    application: ["bio", "medical", "pharma"],
    applicationName: "Clinical Blood Separation & Immunology",
    is2026New: true,
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&auto=format&fit=crop&q=80",
    description: "Microcomputer Controlled Variable-Conversion Motor with Real-time RPM/RCF conversion, Touch Panel & Automatic Imbalance Sensor.",
    specs: {
      maxSpeed: "4,000 RPM (3,200 ×g)",
      rotorCapacity: "500ml × 4 Buckets or 8 × 96-well Microplates",
      speedAccuracy: "±50 RPM",
      display: "Digital LCD Display (Real-time RPM/RCF Conversion)",
      safety: "Electronic Lid Lock, Imbalance Cut-off, Over-speed Protection"
    },
    voltageOptions: [
      { id: "V230", label: "230V, 50/60Hz, 800W", default: true },
      { id: "V120", label: "120V, 60Hz", default: false }
    ],
    plugOptions: [
      { id: "PLUG-C", label: "Type C (Euro)", image: "🔌 Type C" },
      { id: "PLUG-G", label: "Type G (UK)", image: "🔌 Type G" },
      { id: "PLUG-B", label: "Type B (US)", image: "🔌 Type B" }
    ],
    compatibleAccessories: [
      { id: "ACC-RTR-4X500", name: "4-Place Swing-Out Rotor Body (without buckets)", partNo: "DH.WCE10500", priceUsd: 780 },
      { id: "ACC-BKT-500", name: "500ml Round Buckets (Set of 4 pcs)", partNo: "DH.WCE20500", priceUsd: 490 }
    ],
    listPriceUsd: 3600,
    agentPriceUsd: 2250,
    leadTime: "2-3 Weeks",
    cbm: "0.28 CBM",
    grossWeight: "42 kg"
  },

  // 7. Balances & Scales (p.13~46)
  {
    id: "DH-WBA-220",
    modelNo: "Analytical Balance “WBA-220”",
    catNo: "DH.WBA00220",
    name: "0.1mg Precision Analytical Laboratory Balance, 220g",
    category: "balances",
    categoryName: "Balances & Weighing",
    catalogPage: "Page 16",
    application: ["chemical", "pharma", "bio"],
    applicationName: "Micro-Weighing & Analytical Sample Prep",
    is2026New: true,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80",
    description: "High-precision Electromagnetic Force Compensation Sensor with Internal Auto-Calibration & Glass Draft Shield.",
    specs: {
      maxCapacity: "220 g",
      readability: "0.0001 g (0.1 mg)",
      panSize: "Ø80 mm Stainless Steel Pan",
      calibration: "Internal Automated Motorized Weight Calibration",
      interface: "RS232C Bi-directional Interface for PC/Printer",
      draftShield: "3-Door Glass Draft Shield (190 × 155 × 230 mm)"
    },
    voltageOptions: [
      { id: "V230", label: "100~240V Free-Voltage AC/DC Power Adaptor", default: true }
    ],
    plugOptions: [
      { id: "PLUG-C", label: "Universal Multi-Plug Adaptor Included", image: "🔌 Universal" }
    ],
    compatibleAccessories: [
      { id: "ACC-BAL-PRN", name: "Thermal Data Printer with RS232C Cable", partNo: "DH.WBA90001", priceUsd: 380 },
      { id: "ACC-CAL-WT", name: "E2 Class 200g Calibration Certificate Weight", partNo: "DH.WBA90200", priceUsd: 140 }
    ],
    listPriceUsd: 1950,
    agentPriceUsd: 1220,
    leadTime: "In Stock (1 Week)",
    cbm: "0.08 CBM",
    grossWeight: "8.5 kg"
  },

  // 8. Freezers & Cryogenics (p.98~99)
  {
    id: "DH-DUF-650",
    modelNo: "ThermoStable™ ULT-500",
    catNo: "DH.WUF00500",
    name: "Ultra-Low Temperature Freezer (-86℃), 500 Lit.",
    category: "freezers",
    categoryName: "Freezers & Cryogenics",
    catalogPage: "Page 98",
    application: ["bio", "medical"],
    applicationName: "Biological Specimen & Vaccine Long-term Storage",
    is2026New: false,
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&auto=format&fit=crop&q=80",
    description: "Natural Hydrocarbon Refrigerants (R290/R170) Dual Cascade Compressor System, VIP Plus Vacuum Insulation Panels with -86℃ Fast Pull-Down.",
    specs: {
      capacity: "500 Liters (Up to 360 Standard Cryo Boxes)",
      tempRange: "-60℃ to -86℃ (Ambient 30℃)",
      compressor: "Dual Hermetic Heavy-duty Compressors",
      innerDoors: "4 Independent Stainless Insulated Inner Doors",
      safety: "High/Low Temp Alarm, Power Failure Alarm, Door Ajar Alarm, Filter Clean Alert"
    },
    voltageOptions: [
      { id: "V230", label: "230V, 50/60Hz, 1.4kW (Standard)", default: true },
      { id: "V120", label: "120V, 60Hz, 20A Dedicated Line", default: false }
    ],
    plugOptions: [
      { id: "PLUG-C", label: "Type C (Euro 16A)", image: "🔌 Type C" },
      { id: "PLUG-G", label: "Type G (UK 13A)", image: "🔌 Type G" },
      { id: "PLUG-B", label: "Type B (US NEMA 5-20P)", image: "🔌 Type B" }
    ],
    compatibleAccessories: [
      { id: "ACC-ULT-RCK", name: "Side-Access Stainless Freezer Rack for 2-inch Boxes", partNo: "DH.URF05001", priceUsd: 110 },
      { id: "ACC-ULT-CO2", name: "Emergency Liquid CO2 Backup Injection System", partNo: "DH.URF08001", priceUsd: 1250 }
    ],
    listPriceUsd: 8900,
    agentPriceUsd: 5600,
    leadTime: "3-4 Weeks",
    cbm: "1.45 CBM",
    grossWeight: "280 kg"
  }
];

// User Case 1: Pre-approved Authorized Agents Database
const SAMPLE_AGENTS = [
  {
    userType: "AUTHORIZED_AGENT",
    agentId: "agent@euro-sci.com",
    password: "demo",
    companyName: "Euro Scientific Instruments GmbH",
    country: "Germany",
    city: "Frankfurt",
    role: "Exclusive Regional Distributor",
    discountRate: "00",
    tier: "Gold Certified Partner",
    pastQuotes: [
      {
        rfqNo: "RFQ-20260815-4421",
        date: "2026-08-15",
        status: "Quote Sent",
        totalItems: 3,
        items: [
          { modelNo: "Digital Magnetic Stirrer “MS-20D”", voltage: "230V, 50/60Hz", plug: "Type C", qty: 4, accessories: ["ACC-RD200", "ACC-BAR-30"] },
          { modelNo: "ThermoStable™ FON-50", voltage: "230V, 50/60Hz", plug: "Type C", qty: 2, accessories: ["ACC-FON-SH01"] }
        ]
      },
      {
        rfqNo: "RFQ-20260710-1102",
        date: "2026-07-10",
        status: "Completed",
        totalItems: 1,
        items: [
          { modelNo: "Ergonomic Autoclave “STE-AM47”", voltage: "230V, 50/60Hz", plug: "Type C Industrial 16A", qty: 1, accessories: ["ACC-STE-BSK47", "ACC-STE-PPR"] }
        ]
      }
    ]
  },
  {
    userType: "AUTHORIZED_AGENT",
    agentId: "agent@asia-bio.sg",
    password: "demo",
    companyName: "Asia-Pacific Bio Instruments Pte Ltd",
    country: "Singapore",
    city: "Singapore",
    role: "Exclusive ASEAN Distributor",
    discountRate: "00",
    tier: "Platinum Certified Partner",
    pastQuotes: [
      {
        rfqNo: "RFQ-20260910-5511",
        date: "2026-09-10",
        status: "Completed",
        totalItems: 2,
        items: [
          { modelNo: "ThermoStable™ IN-105", voltage: "230V, 50/60Hz", plug: "Type G", qty: 3, accessories: ["ACC-INC-SH105"] },
          { modelNo: "WiseCircu™ WCB-11", voltage: "230V, 50/60Hz", plug: "Type G", qty: 2, accessories: ["ACC-BTH111"] }
        ]
      }
    ]
  },
  {
    userType: "AUTHORIZED_AGENT",
    agentId: "agent@us-labsupply.com",
    password: "demo",
    companyName: "Americas Lab Supply LLC",
    country: "United States",
    city: "Chicago",
    role: "North America Master Distributor",
    discountRate: "00",
    tier: "Diamond Certified Partner",
    pastQuotes: [
      {
        rfqNo: "RFQ-20260905-9921",
        date: "2026-09-05",
        status: "Quote Sent",
        totalItems: 4,
        items: [
          { modelNo: "Ergonomic Autoclave “STE-AM47”", voltage: "120V, 60Hz", plug: "Type B", qty: 2, accessories: ["ACC-STE-BSK47"] },
          { modelNo: "ThermoStable™ ULT-500", voltage: "120V, 60Hz", plug: "Type B", qty: 1, accessories: ["ACC-ULT-RCK"] }
        ]
      }
    ]
  }
];

// User Case 2: Potential Customers (Not registered as Agent / Researchers / End-Users)
const SAMPLE_BUYERS = [
  {
    userType: "POTENTIAL_BUYER",
    buyerId: "dr.schmidt@harvard-bio.edu",
    password: "demo",
    companyName: "Harvard Biomedical Research Institute",
    country: "United States",
    city: "Boston",
    role: "Principal Investigator / Researcher",
    tier: "Potential Global End-User (Price Masked)",
    pastQuotes: [
      {
        rfqNo: "RFQ-20260901-7712",
        date: "2026-09-01",
        status: "Routing to US Partner",
        totalItems: 1,
        items: [
          { modelNo: "Ergonomic Autoclave “STE-AM47”", voltage: "120V, 60Hz", plug: "Type B", qty: 1, accessories: ["ACC-STE-BSK47"] }
        ]
      }
    ]
  }
];

// List of Global Countries for Dropdown Routing
const GLOBAL_COUNTRIES = [
  "United States", "Germany", "United Kingdom", "France", "Italy", "Spain", "Netherlands",
  "Japan", "China", "Singapore", "Australia", "Canada", "India", "Brazil", "Mexico",
  "United Arab Emirates", "Saudi Arabia", "Turkey", "Vietnam", "Indonesia", "Thailand",
  "South Korea", "Malaysia", "Poland", "Sweden", "Switzerland", "South Africa", "Chile"
];
