/**
 * Every string on the marketing page lives here so copy can be edited without
 * touching layout. Organisations, people and metrics below are placeholder
 * content for the site build — swap them for real material before launch.
 */

export const site = {
  name: "Allow AI Africa",
  shortName: "AAA",
  tagline: "Applied AI, built in Africa",
  email: "hello@allowai.africa",
  phone: "+254 20 000 0000",
  offices: [
    { city: "Nairobi", country: "Kenya" },
    { city: "Lagos", country: "Nigeria" },
  ],
  socials: [
    { label: "X", handle: "@allowaiafrica", href: "https://x.com" },
    { label: "LinkedIn", handle: "Allow AI Africa", href: "https://linkedin.com" },
    { label: "YouTube", handle: "Allow AI Africa", href: "https://youtube.com" },
  ],
} as const;

export const nav = [
  { label: "Solutions", href: "#solutions" },
  { label: "Technology", href: "#technology" },
  { label: "Programs", href: "#programs" },
  { label: "Impact", href: "#impact" },
  { label: "Company", href: "#company" },
  { label: "Case Studies", href: "#case-studies" },
  { label: "FAQ", href: "#faq" },
] as const;

export const megaMenu = [
  {
    group: "Platform",
    items: [
      { label: "Ubuntu Model Studio", note: "MLaaS", href: "#solutions" },
      { label: "Data Commons", note: "DaaS", href: "#solutions" },
      { label: "Bespoke AI", note: "Custom builds", href: "#solutions" },
      { label: "Enterprise AI", note: "Production ML", href: "#solutions" },
    ],
  },
  {
    group: "Company",
    items: [
      { label: "Our Technology", note: "How it works", href: "#technology" },
      { label: "Programs", note: "Talent & studio", href: "#programs" },
      { label: "Leadership", note: "Who we are", href: "#company" },
      { label: "Case Studies", note: "Proof of work", href: "#case-studies" },
    ],
  },
  {
    group: "Resources",
    items: [
      { label: "Impact Report", note: "Numbers", href: "#impact" },
      { label: "Partner Network", note: "Ecosystem", href: "#voices" },
      { label: "FAQ", note: "Answers", href: "#faq" },
      { label: "Contact", note: "Talk to us", href: "#contact" },
    ],
  },
] as const;

export const hero = {
  caption: "Intelligence for dynamic economies",
  eyebrow: "Researchers. Engineers. Linguists. Builders.",
  headline: ["Applied AI, built in Africa,", "for the next billion people"],
  sub: "An African engineering company with a passion for solving problems that actually matter.",
  cta: { label: "Get Started", href: "#contact" },
} as const;

export const about = {
  eyebrow: "About",
  index: "0.1",
  title: "Founded in 2019 to close the distance between African data and African decisions.",
  body: "We are an independent, self-funded engineering company working across 18 markets. Our teams sit inside banks, telcos, ministries and agritech operators — building models on the data they already hold, in the languages their customers actually speak.",
  mission: {
    label: "Our mission",
    text: "Make world-class artificial intelligence ordinary infrastructure on this continent — owned locally, governed locally, and useful on day one.",
  },
  pillars: [
    { label: "Independent", note: "Self-funded since day one" },
    { label: "Local", note: "Teams in 6 African cities" },
    { label: "Applied", note: "Shipped, not published" },
  ],
} as const;

export const solutions = [
  {
    index: "001",
    title: "Ubuntu Model Studio",
    summary:
      "Fine-tune, evaluate and deploy models on African language and market data without leaving your own cloud.",
    seed: 11,
  },
  {
    index: "002",
    title: "Data Commons",
    summary:
      "Consented, sovereign data infrastructure that lets institutions pool signal without surrendering control.",
    seed: 27,
  },
  {
    index: "003",
    title: "Bespoke AI",
    summary:
      "Custom systems engineered around your operating reality — patchy connectivity, thin labels, hard deadlines.",
    seed: 43,
  },
  {
    index: "004",
    title: "Enterprise AI",
    summary:
      "Production machine learning for banks, telcos, logistics operators and agritech at national scale.",
    seed: 61,
  },
] as const;

export const technology = {
  eyebrow: "Technology",
  headline: ["Leading-edge engineering", "for African deployment realities"],
  items: [
    {
      title: "Data and Infrastructure",
      body: "Ingestion, lineage and governance built for institutions that cannot move data off-shore. Everything runs in-region, with consent and audit trails attached to every record.",
      seed: 7,
    },
    {
      title: "Scalable Architecture",
      body: "A Kubernetes-native platform that degrades gracefully — designed for intermittent bandwidth, on-prem constraints and multi-region failover across the continent.",
      seed: 19,
    },
    {
      title: "Adaptive Machine Learning",
      body: "Models that retrain against drifting local conditions: seasonal markets, currency shocks and fast-moving fraud patterns that static models miss within weeks.",
      seed: 33,
    },
    {
      title: "Language and Voice",
      body: "Speech and text systems for Swahili, Yoruba, Amharic, Hausa, isiZulu and more — because a system nobody can talk to is a system nobody uses.",
      seed: 51,
    },
  ],
} as const;

export const programs = {
  eyebrow: "Programs",
  headline: ["Capacity is the product.", "We build people too."],
  intro:
    "Software alone does not move a continent. Alongside the platform we run three long-horizon programs that put ownership in local hands.",
  cta: { label: "Get Started", href: "#contact" },
  cards: [
    {
      index: "01",
      title: "Talent Fellowship",
      body: "A twelve-month paid residency for engineers and researchers, embedded on live client deployments from week three. Graduates stay in-market.",
    },
    {
      index: "02",
      title: "Startup Studio",
      body: "We co-build with founders solving unglamorous problems — logistics routing, clinic triage, smallholder credit — providing models, infrastructure and first customers.",
    },
    {
      index: "03",
      title: "Public Sector AI",
      body: "Advisory and delivery for ministries and regulators: procurement standards, model assurance and systems that survive a change of government.",
    },
  ],
} as const;

export const impact = {
  eyebrow: "Impact",
  headline: ["The numbers we are", "held accountable to"],
  stats: [
    { value: 18, suffix: "", label: "Markets with active deployments" },
    { value: 12400, suffix: "+", label: "Engineers trained through our programs" },
    { value: 96, suffix: "%", label: "Production uptime across managed models" },
    { value: 41, suffix: "%", label: "Median cost reduction after year one" },
    { value: 6, suffix: "", label: "African cities with permanent teams" },
    { value: 27, suffix: "", label: "Languages supported in speech and text" },
  ],
} as const;

export const leadership = {
  eyebrow: "Company",
  headline: ["About our company", "and leadership team"],
  body: "Founded in 2019. Self-funded. Working with Fortune Global 500 operators and national institutions across 18 African markets — with every model trained, hosted and governed in-region.",
  people: [
    {
      role: "Chair & Co-Founder",
      name: "Amara Okonkwo",
      note: "Twenty years in telecoms infrastructure across West Africa.",
      seed: 5,
    },
    {
      role: "CEO & Co-Founder",
      name: "Dr. Thabo Mensah",
      note: "Machine learning researcher; previously led applied ML at a pan-African bank.",
      seed: 23,
    },
  ],
} as const;

export const voices = {
  eyebrow: "Partners",
  headline: ["We build enterprise AI", "for African institutions"],
  testimonials: [
    {
      quote:
        "Allow AI Africa rebuilt our fraud stack on data we already held. False positives fell by a third in the first quarter, and every model runs inside our own region — which is what finally got it past our regulator.",
      name: "Ngozi Adeyemi",
      role: "Chief Risk Officer, Sahara Bank",
    },
    {
      quote:
        "The Swahili voice work is the part nobody else would take on. Our support volume dropped because customers could finally self-serve in the language they think in.",
      name: "Joseph Kimani",
      role: "Head of Digital, Kilimanjaro Telecom",
    },
    {
      quote:
        "They embedded four engineers with our team for six months and left us able to run it ourselves. That handover was the whole point, and they actually delivered it.",
      name: "Fatou Diallo",
      role: "Director of Operations, Nile Agritech",
    },
  ],
  partners: [
    "Sahara Bank",
    "Kilimanjaro Telecom",
    "Zambezi Energy",
    "Atlas Logistics",
    "Baobab Health",
    "Nile Agritech",
  ],
} as const;

export const caseStudies = {
  eyebrow: "Case Studies",
  headline: ["Success stories:", "applied AI in African markets"],
  cards: [
    {
      title: "Yield forecasting for a pan-African agritech",
      excerpt:
        "Satellite and ground data fused into a per-plot forecast that survives an irregular rainy season.",
      readTime: "4 min read",
      date: "2025-11-04",
      seed: 3,
    },
    {
      title: "Fraud detection for a tier-one retail bank",
      excerpt:
        "A real-time scoring layer cut false positives by 34% without adding a single review analyst.",
      readTime: "6 min read",
      date: "2025-09-18",
      seed: 17,
    },
    {
      title: "Swahili voice banking for a regional telco",
      excerpt:
        "Speech recognition tuned on 900 hours of in-market audio, deployed to 11 million subscribers.",
      readTime: "5 min read",
      date: "2025-07-29",
      seed: 29,
    },
    {
      title: "Grid load optimisation for a national utility",
      excerpt:
        "Demand forecasting that reduced unplanned shedding events across three regional networks.",
      readTime: "7 min read",
      date: "2025-05-12",
      seed: 47,
    },
  ],
} as const;

export const faq = {
  categories: [
    {
      label: "General",
      questions: [
        {
          q: "What is Allow AI Africa?",
          a: "We are an African applied-AI engineering company. We build and operate machine learning systems for institutions on the continent — banks, telcos, utilities, agritech operators and government — with all data and models kept in-region.",
        },
        {
          q: "What makes your approach different?",
          a: "We deploy inside your infrastructure rather than selling access to ours, we train on data that reflects local conditions, and every engagement includes a handover plan so your own team can run the system when we leave.",
        },
        {
          q: "Which countries do you operate in?",
          a: "We have permanent teams in six African cities and active deployments across 18 markets. Engagements outside those markets are taken case by case.",
        },
      ],
    },
    {
      label: "Model Studio",
      questions: [
        {
          q: "Can we fine-tune models on our own data?",
          a: "Yes. Ubuntu Model Studio runs inside your cloud account or on-premise cluster. Your data never leaves your boundary, and you keep the resulting weights.",
        },
        {
          q: "Which African languages are supported?",
          a: "Twenty-seven languages across speech and text today, including Swahili, Yoruba, Amharic, Hausa and isiZulu. We add languages on client demand, usually within one quarter.",
        },
      ],
    },
    {
      label: "Data Commons",
      questions: [
        {
          q: "How is data sovereignty handled?",
          a: "Every record carries consent metadata and an audit trail. Data is stored in-region under the jurisdiction of the contributing institution, and pooling happens through federated computation rather than transfer.",
        },
        {
          q: "Who owns the data we contribute?",
          a: "You do, at every stage. Contribution grants a scoped, revocable compute right — not a transfer of ownership — and withdrawal removes your contribution from future training runs.",
        },
      ],
    },
    {
      label: "Enterprise",
      questions: [
        {
          q: "What does an engagement look like?",
          a: "A four-week diagnostic, then a scoped build with fortnightly production checkpoints. Most first deployments reach production inside five months.",
        },
        {
          q: "Do you support existing ML stacks?",
          a: "Yes. We work with whatever you already run — SageMaker, Vertex, on-premise Kubernetes — and integrate rather than replace wherever that is the cheaper path.",
        },
      ],
    },
    {
      label: "Programs",
      questions: [
        {
          q: "How do I apply to the Talent Fellowship?",
          a: "Applications open twice a year. The fellowship is paid, twelve months long, and fellows are placed on live client deployments from week three.",
        },
        {
          q: "Does the Startup Studio take equity?",
          a: "We take a small equity position in exchange for models, infrastructure credits and introductions to first customers. Terms are published up front and identical for every cohort.",
        },
      ],
    },
  ],
} as const;

export const contact = {
  headline: ["Ready to put AI to work", "in your market?"],
  intro:
    "Tell us what you are trying to change. We will come back with an honest read on whether machine learning is the right tool for it.",
  quickContact: "Quick contact with us!",
} as const;

export const footerLinks = [
  { label: "Solutions", href: "#solutions" },
  { label: "Technology", href: "#technology" },
  { label: "Programs", href: "#programs" },
  { label: "Impact", href: "#impact" },
  { label: "Company", href: "#company" },
  { label: "Case Studies", href: "#case-studies" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
] as const;
