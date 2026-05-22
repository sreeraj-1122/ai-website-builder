export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  category: string;
  tags: string[];
  author: { name: string; role: string; avatar: string };
  publishedAt: string; // ISO
  readingMinutes: number;
  content: BlogBlock[];
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
};

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "quote"; text: string; author?: string }
  | { type: "list"; items: string[] }
  | { type: "image"; src: string; caption?: string }
  | { type: "callout"; title: string; text: string }
  | { type: "code"; lang: string; code: string };

const u = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=75`;
const av = (seed: string) => `https://i.pravatar.cc/120?u=${seed}`;

const AUTHORS = {
  maya: { name: "Maya Chen", role: "Head of Design, GenWeb.ai", avatar: av("maya") },
  jordan: { name: "Jordan Patel", role: "Founding Engineer", avatar: av("jordan") },
  sofia: { name: "Sofia Romero", role: "Developer Advocate", avatar: av("sofia") },
  alex: { name: "Alex Whitmore", role: "Product Lead", avatar: av("alex") },
};

export const BLOG_CATEGORIES = ["All", "Guides", "Tutorial", "Comparison", "Design", "Engineering"] as const;

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "ai-website-design-trends-2026",
    title: "Top AI website design trends in 2026",
    excerpt: "Generative gradients, motion-first hero sections, and adaptive layouts — what's actually winning attention this year.",
    cover: u("photo-1620712943543-bcc4688e7485"),
    category: "Design",
    tags: ["Design", "Trends", "AI"],
    author: AUTHORS.maya,
    publishedAt: "2026-05-18T09:00:00Z",
    readingMinutes: 7,
    featured: true,
    seoTitle: "Top AI Website Design Trends in 2026 — GenWeb.ai",
    seoDescription: "The biggest AI website design trends of 2026: generative gradients, glass UI, motion-first heroes, and adaptive layouts.",
    content: [
      { type: "p", text: "2026 is the year AI moved from a productivity layer into the design system itself. Websites no longer just use AI to ship faster — they use AI to feel alive. In this piece we break down the visual and interactive patterns shipping across the best new products of the year." },
      { type: "h2", text: "1. Generative gradient meshes" },
      { type: "p", text: "Hard color stops are out. The leading sites of 2026 use soft, animated gradient meshes that breathe behind the hero. Think Stripe's depth, but generated per-visit and tuned to brand." },
      { type: "image", src: u("photo-1604079628040-94301bb21b91"), caption: "Animated mesh gradients have replaced static hero backgrounds." },
      { type: "h2", text: "2. Motion-first hero sections" },
      { type: "p", text: "Every great product page now has motion baked in from the first second. Subtle parallax, scroll-linked reveals, and choreographed entrances are table stakes." },
      { type: "quote", text: "Motion is the new typography. If your hero doesn't move, it doesn't ship.", author: "Maya Chen" },
      { type: "h2", text: "3. Adaptive layouts" },
      { type: "p", text: "Generative AI lets layouts adapt to context — visitor source, device, intent — without designers shipping 14 variants by hand." },
      { type: "list", items: [
        "Hero variants tuned to traffic source",
        "Personalized testimonials by industry",
        "Dynamic pricing emphasis based on plan size",
      ]},
      { type: "callout", title: "Try it yourself", text: "Spin up any of these patterns in GenWeb.ai by starting from the AI Startup Landing template and prompting 'use a generative mesh hero'." },
      { type: "h2", text: "Where this is going" },
      { type: "p", text: "Expect 2027 to push further into real-time personalization and on-device generation. The sites winning right now are the ones treating AI as a design partner — not a content factory." },
    ],
  },
  {
    slug: "how-ai-is-changing-frontend-development",
    title: "How AI is changing frontend development",
    excerpt: "From code completion to full-page generation — a field guide for engineers shipping in the age of AI builders.",
    cover: u("photo-1517077304055-6e89abbf09b0"),
    category: "Engineering",
    tags: ["Engineering", "AI", "Frontend"],
    author: AUTHORS.jordan,
    publishedAt: "2026-05-12T08:00:00Z",
    readingMinutes: 9,
    seoTitle: "How AI is Changing Frontend Development — GenWeb.ai",
    seoDescription: "What's actually different about frontend engineering now that AI generates UI, components, and entire pages.",
    content: [
      { type: "p", text: "Three years ago, the frontend engineer's job was to translate Figma to React. Today, AI does the translation. The job has shifted — and it's a lot more interesting." },
      { type: "h2", text: "The new loop" },
      { type: "p", text: "Modern frontend work looks more like a tight conversation: prompt, preview, refine. Engineers spend less time wiring boilerplate and more time on system design, accessibility, and product polish." },
      { type: "code", lang: "tsx", code: "// Before\nfunction Card({ title }) { return <div className=\"...\">{title}</div> }\n\n// After — prompted, then reviewed\n// 'Make a glass pricing card with a gradient border and CTA'" },
      { type: "h2", text: "What still matters" },
      { type: "list", items: [
        "Information architecture and routing",
        "Accessibility, semantics, and contrast",
        "Performance budgets and Core Web Vitals",
        "Design system tokens and consistency",
      ]},
      { type: "quote", text: "AI gives you a hundred good components. Engineering is choosing the right ten." },
      { type: "h2", text: "Stack of the moment" },
      { type: "p", text: "Most teams we talk to in 2026 ship on React 19 + a meta-framework (TanStack Start, Next, Remix), Tailwind, and shadcn-style primitives. AI plugs in at every level — from generating tokens to authoring routes." },
      { type: "callout", title: "TL;DR", text: "AI doesn't replace frontend engineers. It removes the parts of the job nobody wanted in the first place." },
    ],
  },
  {
    slug: "best-ai-website-builders-compared",
    title: "The 7 best AI website builders in 2026",
    excerpt: "We tested every major AI website builder. Here's how they actually compare on speed, design quality, and code output.",
    cover: u("photo-1551288049-bebda4e38f71"),
    category: "Comparison",
    tags: ["Comparison", "Tools", "AI"],
    author: AUTHORS.sofia,
    publishedAt: "2026-05-06T08:00:00Z",
    readingMinutes: 11,
    featured: true,
    seoTitle: "The 7 Best AI Website Builders in 2026 — Compared",
    seoDescription: "Hands-on comparison of the leading AI website builders of 2026 on design quality, speed, and exported code.",
    content: [
      { type: "p", text: "We rebuilt the same SaaS landing page in seven AI website builders and graded them on five dimensions. Here's what we found." },
      { type: "h2", text: "How we tested" },
      { type: "list", items: [
        "Same prompt, same brief, same brand colors",
        "Time-to-first-draft",
        "Quality of typography and spacing",
        "Code export readability",
        "Iteration speed on feedback",
      ]},
      { type: "h2", text: "The shortlist" },
      { type: "p", text: "Three builders consistently outperformed the rest: GenWeb.ai, Lovable, and V0. The rest produced usable starting points but required more cleanup." },
      { type: "image", src: u("photo-1460925895917-afdab827c52f"), caption: "Side-by-side first drafts from the same prompt." },
      { type: "quote", text: "The winner isn't the one that produces the most code — it's the one that produces the right code." },
    ],
  },
  {
    slug: "lovable-vs-v0-vs-bolt",
    title: "Lovable vs V0 vs Bolt — full comparison",
    excerpt: "A deep-dive comparison across landing pages, dashboards, and ecommerce. Who ships the best site?",
    cover: u("photo-1555066931-4365d14bab8c"),
    category: "Comparison",
    tags: ["Comparison", "Lovable", "V0", "Bolt"],
    author: AUTHORS.alex,
    publishedAt: "2026-04-28T09:00:00Z",
    readingMinutes: 12,
    seoTitle: "Lovable vs V0 vs Bolt — Full 2026 Comparison",
    seoDescription: "Lovable, V0 and Bolt go head to head across landing pages, dashboards and ecommerce. Full comparison and verdict.",
    content: [
      { type: "p", text: "Three of the best AI builders in 2026 — Lovable, V0, and Bolt — all promise the same thing: type a prompt, get a site. We put them through three real projects and graded the output." },
      { type: "h2", text: "Round 1: Landing pages" },
      { type: "p", text: "Lovable produced the most polished first draft. V0 was the fastest. Bolt produced the most editable code." },
      { type: "h2", text: "Round 2: Dashboards" },
      { type: "p", text: "All three handled basic admin layouts well. Lovable led on data viz aesthetics; V0 on component primitives; Bolt on raw code quality." },
      { type: "h2", text: "Round 3: Ecommerce" },
      { type: "p", text: "Ecommerce remains the hardest category. None of the three produced a production-ready storefront in one shot — but Lovable required the fewest iterations." },
      { type: "callout", title: "Verdict", text: "If you care about how the first draft looks, pick Lovable or GenWeb.ai. If you care about how the code reads, Bolt. If you want speed, V0." },
    ],
  },
  {
    slug: "how-to-build-saas-website-using-ai",
    title: "How to build a SaaS website using AI (step-by-step)",
    excerpt: "From a single prompt to a fully shipped marketing site — a complete walkthrough using GenWeb.ai.",
    cover: u("photo-1559028012-481c04fa702d"),
    category: "Tutorial",
    tags: ["Tutorial", "SaaS", "How-to"],
    author: AUTHORS.sofia,
    publishedAt: "2026-04-20T08:00:00Z",
    readingMinutes: 8,
    seoTitle: "How to Build a SaaS Website Using AI — Tutorial",
    seoDescription: "Step-by-step walkthrough of building and shipping a SaaS marketing site using GenWeb.ai.",
    content: [
      { type: "h2", text: "Step 1: Write a specific prompt" },
      { type: "p", text: "The single biggest predictor of output quality is prompt specificity. Name the audience, the tone, and the sections you want." },
      { type: "code", lang: "txt", code: "Modern SaaS landing for an analytics tool aimed at e-commerce ops teams.\nSections: hero, social proof, three feature blocks, integrations, pricing, FAQ.\nTone: confident, technical, friendly." },
      { type: "h2", text: "Step 2: Iterate on the hero first" },
      { type: "p", text: "Get the hero right before touching anything else. It sets the visual tone for the entire site." },
      { type: "h2", text: "Step 3: Add proof and pricing" },
      { type: "p", text: "Drop in logos, testimonials, and a real pricing table. AI can draft copy — your job is to make it true." },
      { type: "h2", text: "Step 4: Ship it" },
      { type: "p", text: "Connect a domain, publish, and start measuring." },
      { type: "callout", title: "Pro tip", text: "Save your favorite prompts as templates. The second site is always faster than the first." },
    ],
  },
  {
    slug: "10-landing-page-tips",
    title: "10 landing page design tips that actually convert",
    excerpt: "Battle-tested tips from teardown after teardown — hero copy, social proof, CTA placement, and more.",
    cover: u("photo-1487014679447-9f8336841d58"),
    category: "Guides",
    tags: ["Landing", "Conversion", "Design"],
    author: AUTHORS.maya,
    publishedAt: "2026-04-14T10:00:00Z",
    readingMinutes: 6,
    seoTitle: "10 Landing Page Design Tips That Convert — GenWeb.ai",
    seoDescription: "Ten battle-tested landing page design tips covering hero copy, social proof, CTA placement, and more.",
    content: [
      { type: "h2", text: "1. Lead with the outcome" },
      { type: "p", text: "Your hero headline should describe what life looks like after the product, not the product itself." },
      { type: "h2", text: "2. Social proof above the fold" },
      { type: "p", text: "Even three logos beat zero. Add the social proof row immediately under the CTA." },
      { type: "h2", text: "3. One CTA, repeated" },
      { type: "p", text: "Pick one primary action and repeat it. Two equally weighted CTAs cut conversion almost in half." },
      { type: "list", items: [
        "Use action verbs ('Start building', not 'Learn more')",
        "Keep CTA copy under 4 words",
        "Visually contrast with background",
      ]},
      { type: "quote", text: "Clarity beats cleverness, every time." },
      { type: "h2", text: "Keep iterating" },
      { type: "p", text: "The best landing pages are the ones rewritten the most. Ship, measure, rewrite." },
    ],
  },
];

export function blogBySlug(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function relatedPosts(slug: string, count = 3) {
  const current = blogBySlug(slug);
  if (!current) return [];
  return BLOG_POSTS
    .filter((p) => p.slug !== slug)
    .sort((a, b) => {
      const aScore = a.category === current.category ? 1 : 0;
      const bScore = b.category === current.category ? 1 : 0;
      return bScore - aScore;
    })
    .slice(0, count);
}
