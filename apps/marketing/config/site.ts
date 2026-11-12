/**
 * Everything brand- or launch-specific lives here. Values marked
 * PLACEHOLDER must be replaced before launch (see README "Placeholders").
 */

export type IconName =
  | "utensils"
  | "coffee"
  | "cloud-kitchen"
  | "croissant"
  | "zap"
  | "wine"
  | "hotel"
  | "receipt"
  | "layout-grid"
  | "chef-hat"
  | "package"
  | "book-open"
  | "bar-chart"
  | "users"
  | "heart"
  | "shopping-bag"
  | "credit-card"
  | "calculator"
  | "bike"
  | "gift"
  | "wifi-off"
  | "cloud"
  | "sparkles"
  | "indian-rupee"
  | "headset"
  | "plug";

export const site = {
  name: "YatriDesk",
  tagline: "Restaurant POS & operations, made simple",
  description:
    "YatriDesk is a cloud restaurant POS for India: fast GST billing, KOT, kitchen display, inventory, menu and reports for restaurants, cafes, cloud kitchens, bakeries and hotels. Works offline.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://yatridesk.cloud",
  locale: "en_IN",

  /** Mirrors the CSS tokens, for places CSS can't reach (OG image, manifest). */
  colors: {
    ink: "#14161A",
    cream: "#FBF6EE",
    brand: "#B23A0A",
    saffron: "#EA580C",
    herb: "#2F7D4F",
  },

  contact: {
    phoneDisplay: "+91 79762 38444",
    phoneHref: "tel:+917976238444",
    whatsappNumber: "917976238444",
    whatsappMessage: "Hi YatriDesk, I'd like a demo for my restaurant.",
    email: "nikhilsharma6321@gmail.com",
    address: "Jaipur, Rajasthan, India",
    hours: "Mon–Sat, 9am–9pm IST",
  },

  // PLACEHOLDER: social profiles.
  social: [
    { label: "Instagram", href: "https://instagram.com/", icon: "instagram" },
    { label: "LinkedIn", href: "https://linkedin.com/", icon: "linkedin" },
    { label: "YouTube", href: "https://youtube.com/", icon: "youtube" },
    { label: "X (Twitter)", href: "https://x.com/", icon: "x" },
  ],

  /**
   * Product app login. On yatridesk.cloud the product app serves /login on the
   * same domain; set NEXT_PUBLIC_APP_URL only when it lives elsewhere (e.g.
   * http://localhost:3000 when running this site on its own in development).
   * Always rendered as a plain <a>: it belongs to another zone.
   */
  loginUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/login`,

  /** PLACEHOLDER: video for "Watch 2-min tour" (YouTube embed URL). Empty = "coming soon" panel. */
  tourVideoUrl: "",

  nav: {
    main: [
      { key: "nav.features", href: "/#features" },
      { key: "nav.solutions", href: "/#solutions" },
      { key: "nav.pricing", href: "/pricing" },
    ],
    // PLACEHOLDER: resources aren't written yet.
    resources: [
      { label: "Blog", description: "Ideas to run a tighter kitchen", href: "#" },
      { label: "Help centre", description: "Guides and how-tos", href: "#" },
      { label: "GST billing guide", description: "Invoices, HSN and returns", href: "#" },
    ],
  },

  footer: {
    product: [
      { label: "Billing & POS", href: "/#features" },
      { label: "Kitchen display", href: "/#tour" },
      { label: "Inventory", href: "/#tour" },
      { label: "Reports", href: "/#tour" },
      { label: "Pricing", href: "/pricing" },
    ],
    company: [
      { label: "Why YatriDesk", href: "/#why" },
      { label: "Integrations roadmap", href: "/#integrations" },
      { label: "Book a demo", href: "/contact" },
      { label: "Contact", href: "/contact" },
    ],
    resources: [
      { label: "Blog", href: "#" },
      { label: "Help centre", href: "#" },
      { label: "GST billing guide", href: "#" },
      { label: "FAQ", href: "/#faq" },
    ],
    legal: [
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms of service", href: "/terms" },
    ],
  },

  businessTypes: [
    { id: "restaurant", label: "Restaurants", icon: "utensils" },
    { id: "cafe", label: "Cafes", icon: "coffee" },
    { id: "cloud-kitchen", label: "Cloud Kitchens", icon: "cloud-kitchen" },
    { id: "bakery", label: "Bakeries", icon: "croissant" },
    { id: "qsr", label: "QSR", icon: "zap" },
    { id: "bar", label: "Bars & Pubs", icon: "wine" },
    { id: "hotel", label: "Hotels", icon: "hotel" },
  ] as const satisfies readonly { id: string; label: string; icon: IconName }[],

  // PLACEHOLDER: illustrative figures until real numbers exist.
  stats: {
    placeholder: true,
    items: [
      { value: 500, suffix: "+", label: "outlets billing daily" },
      { value: 12, suffix: " lakh+", label: "bills generated" },
      { value: 40, suffix: "+", label: "cities across India" },
      { value: 35, suffix: "%", label: "faster billing at peak hours" },
    ],
  },

  // PLACEHOLDER: sample quotes only. Replace with real, permissioned customers.
  testimonials: {
    placeholder: true,
    items: [
      {
        quote:
          "Our Friday rush used to mean handwritten KOTs and arguments at the pass. Now the kitchen screen just tells everyone what's next.",
        name: "Sample Owner",
        role: "South Indian restaurant · 60 covers",
        initials: "SO",
      },
      {
        quote:
          "I check yesterday's sales and low-stock items on my phone before I even reach the cafe. That alone saves me an hour.",
        name: "Sample Founder",
        role: "Specialty cafe · 2 outlets",
        initials: "SF",
      },
      {
        quote:
          "Recipe costing showed us two dishes that were losing money. We re-priced them in a week.",
        name: "Sample Partner",
        role: "Cloud kitchen · 3 brands",
        initials: "SP",
      },
    ],
  },

  // PLACEHOLDER: prices. Yearly = 10 × monthly (2 months free).
  pricing: {
    placeholder: true,
    currency: "INR",
    yearlyMonthsCharged: 10,
    tiers: [
      {
        id: "starter",
        name: "Starter",
        blurb: "For a single counter or small cafe getting off paper.",
        monthly: 799,
        unit: "per outlet / month",
        popular: false,
        cta: "Start free trial",
        features: [
          "Billing & POS with GST invoices",
          "KOT printing",
          "Menu with variants & add-ons",
          "UPI, card & cash payments",
          "Daily sales reports",
          "1 billing device",
        ],
      },
      {
        id: "growth",
        name: "Growth",
        blurb: "For busy restaurants that want the kitchen and stock in sync.",
        monthly: 1499,
        unit: "per outlet / month",
        popular: true,
        cta: "Start free trial",
        features: [
          "Everything in Starter",
          "Table & order management",
          "Kitchen Display System",
          "Inventory, recipe costing & wastage",
          "Staff roles & permissions",
          "Customer database & loyalty",
          "Unlimited billing devices",
        ],
      },
      {
        id: "multi",
        name: "Multi-outlet",
        blurb: "For chains and franchises that need one view of every outlet.",
        monthly: 2999,
        unit: "per outlet / month",
        popular: false,
        cta: "Talk to sales",
        features: [
          "Everything in Growth",
          "Central menu & price control",
          "Outlet-wise and consolidated reports",
          "Central kitchen & stock transfers",
          "Custom roles across outlets",
          "Priority onboarding & support",
        ],
      },
    ],
    /** Rows for the /pricing comparison table: [feature, starter, growth, multi]. */
    compare: [
      ["GST-ready billing & invoices", true, true, true],
      ["KOT printing", true, true, true],
      ["UPI, card & cash", true, true, true],
      ["Works offline", true, true, true],
      ["Menu variants, add-ons & combos", true, true, true],
      ["Timed menus (breakfast, happy hour)", false, true, true],
      ["Table & order management", false, true, true],
      ["Kitchen Display System", false, true, true],
      ["Inventory & recipe costing", false, true, true],
      ["Wastage tracking", false, true, true],
      ["Staff roles & permissions", "Basic", true, true],
      ["Customer database & loyalty", false, true, true],
      ["Billing devices", "1", "Unlimited", "Unlimited"],
      ["Central menu control", false, false, true],
      ["Consolidated multi-outlet reports", false, false, true],
      ["Onboarding", "Self-serve", "Guided", "Priority"],
    ] as [string, boolean | string, boolean | string, boolean | string][],
  },

  faq: [
    {
      q: "How long does it take to set up?",
      a: "Most outlets are billing the same day. Share your menu (a photo, PDF or spreadsheet works) and we set it up with you on a call. Larger menus and multi-outlet setups usually take one to two days.",
    },
    {
      q: "Do I need to buy special hardware?",
      a: "No. YatriDesk runs on the Windows PC, Android tablet or phone you already have, and works with standard thermal printers and cash drawers. There's no hardware lock-in.",
    },
    {
      q: "What happens if the internet goes down?",
      a: "Billing and KOTs keep working offline. Orders are saved on the device and sync automatically as soon as you're back online, so no bill is lost.",
    },
    {
      q: "Are the invoices GST-compliant?",
      a: "Yes. Invoices show your GSTIN, HSN/SAC codes and CGST/SGST or IGST split, and reports are organised to make GST filing easier for you or your CA.",
    },
    {
      q: "Is my data safe?",
      a: "Your data is encrypted in transit and backed up regularly. Staff only see what their role allows, and every sensitive action (discounts, deletions, refunds) is logged.",
    },
    {
      q: "What kind of support do you offer?",
      a: "Support is available on WhatsApp, phone and email during business hours, in English and Hindi. Growth and Multi-outlet plans get guided onboarding.",
    },
    {
      q: "I already use another billing software. Can I switch?",
      a: "Yes. Export your menu and customer list as a spreadsheet and we'll import it for you. You can run both side by side for a few days before switching over.",
    },
    {
      q: "Is there a free trial?",
      a: "Yes, every plan starts with a free trial with all features unlocked. No card is needed to start, and you can book a demo first if you'd like a walkthrough.",
    },
  ],

  integrations: [
    { title: "Online ordering", body: "Take orders from your own website and QR menus straight into the POS.", icon: "shopping-bag" },
    { title: "Payments", body: "Card machines and UPI QR reconciliation, matched to every bill.", icon: "credit-card" },
    { title: "Accounting", body: "Push daily sales, GST and expenses to your accounting software.", icon: "calculator" },
    { title: "Delivery platforms", body: "Accept aggregator orders without retyping them at the counter.", icon: "bike" },
    { title: "Loyalty & marketing", body: "Send offers by SMS or WhatsApp to the guests who come back most.", icon: "gift" },
  ] as const satisfies readonly { title: string; body: string; icon: IconName }[],
} as const;

export type BusinessTypeId = (typeof site.businessTypes)[number]["id"];
export type PricingTier = (typeof site.pricing.tiers)[number];

export const whatsappHref = `https://wa.me/${site.contact.whatsappNumber}?text=${encodeURIComponent(
  site.contact.whatsappMessage,
)}`;
