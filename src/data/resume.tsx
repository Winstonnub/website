import { Icons } from "@/components/icons";
import { GlobeIcon, PresentationIcon } from "lucide-react";

export const DATA = {
  name: "Winston Liang",
  initials: "WL",
  url: "https://winstonl.vercel.app",
  location: "Toronto, Canada",
  locationLink: "https://www.google.com/maps/place/toronto",
  role: "Software Engineering Intern @ Shopify",
  secondaryRole: "AI Research Intern @ NUS",
  tagline:
    "I teach robots to get out of each other's way, and build the internal tools Shopify's sales team runs on.",
  summary:
    "I'm a third-year Computer Science and Data Science student at the University of Toronto. This term I'm a software engineering intern at Shopify in Toronto, and I do reinforcement learning research with the Multi-Agent Robotic Motion Lab at NUS. Before that I spent a summer at Hong Kong's Digital Policy Office, where I replaced a two-hour manual security report with a script that finishes in under a minute.",
  avatarUrl: "/me-512.png",

  // Rendered inside the reading-view shell (/classic and /blog), so the
  // section anchors point at /classic rather than the cinematic root.
  navbar: [
    { href: "/classic", label: "Home" },
    { href: "/classic#work", label: "Work" },
    { href: "/classic#projects", label: "Projects" },
    { href: "/classic#playground", label: "Playground" },
    { href: "/blog", label: "Writing" },
  ],

  contact: {
    email: "cywinston.liang@mail.utoronto.ca",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/Winstonnub",
        icon: Icons.github,
        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/winston-liang",
        icon: Icons.linkedin,
        navbar: true,
      },
      email: {
        name: "Email",
        url: "mailto:cywinston.liang@mail.utoronto.ca",
        icon: Icons.email,
        navbar: true,
      },
    },
  },

  work: [
    {
      company: "Shopify",
      href: "https://www.shopify.com/",
      location: "Toronto, ON",
      title: "Software Engineering Intern",
      logoUrl: "/shopify.png",
      start: "Sept 2026",
      end: "Present",
      current: true,
      summary:
        "Building the data models and internal tools Shopify's sales organization runs on, helping reps prioritize the merchants most likely to buy.",
      highlights: [
        "Improved the average precision of the merchant-ranking ML model by 90% across 800k training records, adding signals of merchant interest in Shopify's funding products.",
        "Shipped a new field through two production data models, giving sales reporting a call, email, and review breakdown across 320K+ tasks and unblocking a dashboard migration off a legacy data source.",
      ],
      stack: ["Python", "SQL", "dbt-style data models", "ML ranking"],
    },
    {
      company: "National University of Singapore",
      href: "https://nus.edu.sg",
      location: "Singapore · Remote",
      title: "AI Research Intern",
      team: "Multi-Agent Robotic Motion Laboratory",
      logoUrl: "/nus.png",
      start: "May 2026",
      end: "Present",
      current: true,
      summary:
        "Researching how classical motion planning and reinforcement learning combine so agents can navigate shared space without colliding.",
      highlights: [
        "Trained a residual RL policy that layers real-time corrections on top of a multi-agent planner — 99.8% success rate, autonomous deadlock resolution, and 27% lower agent makespan.",
        "Built a model that solved a benchmark map every standard grid-based planner failed on (0% solve rate across 64 test cases), delivering 100% success at 2.2x the speed and 10x fewer collisions than the industry-standard collision-avoidance method.",
        "Diagnosed three distinct reward-hacking exploits in a multi-agent PPO pipeline — episode-prolonging reward farming, goal re-entry cycling, and a non-potential-based shaping loophole — then redesigned the reward function while preserving training stability.",
      ],
      stack: ["JAX", "PyTorch", "PPO", "Multi-agent RL"],
    },
    {
      company: "Hong Kong Digital Policy Office",
      href: "https://www.digitalpolicy.gov.hk/en/",
      location: "Cyberport, Hong Kong SAR",
      title: "Software Engineering Intern",
      logoUrl: "/hksar.png",
      start: "Jul 2025",
      end: "Aug 2025",
      current: false,
      summary:
        "Automated vulnerability intelligence for the HKSAR government and prototyped on-premise LLM inference for sensitive internal data.",
      highlights: [
        "Cut vulnerability intelligence reporting from 2+ hours to under 1 minute (99.9% faster) with a Python scraping and alerting pipeline, distributing high-risk alerts to 70+ government bureaus and departments.",
        "Built a local inference prototype with Ollama and Open WebUI reaching ~10 tokens/sec and 5 concurrent users on Apple M3 silicon, letting staff search internal documents without sending anything to external clouds.",
        "Evaluated quantisation, distillation, and retrieval pipelines to run 3B–32B parameter models on constrained hardware for a 10+ user internal pilot.",
      ],
      stack: ["Python", "Ollama", "RAG", "Open WebUI"],
    },
  ],

  otherExperience: [
    {
      company: "Citi",
      title: "Early Identification Program",
      logoUrl: "/citibank.png",
      location: "Remote, US",
      start: "Mar 2026",
      end: "Apr 2026",
      summary: "Selected as 1 of 163 students across North America.",
    },
  ],

  education: [
    {
      school: "University of Toronto",
      href: "https://utoronto.ca",
      degree: "BSc, Computer Science & Data Science",
      focus: "Focus in Quantitative Finance",
      logoUrl: "/uoft.png",
      start: "Sept 2024",
      end: "June 2028",
      description: "cGPA 3.9/4.0 · Hong Kong Scholar · Dean's List Scholar",
    },
  ],

  projects: [
    {
      title: "Scoliosis AI",
      subtitle: "Medical imaging, end to end",
      href: "https://drive.google.com/file/d/1ndeHhmtw1LvfQQ5FweZ0YRtNAyuYEtST/view",
      dates: "Dec 2025 — Present",
      featured: true,
      active: true,
      description:
        "Full-stack AI web app that detects scoliosis from spinal X-rays with a YOLOv8 model trained on ~1,500 labelled medical images, at 96% precision.",
      highlights: [
        "Containerized FastAPI + YOLOv8 inference on AWS EC2 — ~0.24s end-to-end per X-ray, authenticated.",
        "S3 presigned URLs for direct browser upload, PostgreSQL via Prisma for scan metadata.",
      ],
      technologies: ["Next.js", "PyTorch", "YOLOv8", "FastAPI", "AWS", "Prisma", "PostgreSQL"],
      links: [
        {
          type: "Demo",
          href: "https://drive.google.com/file/d/1ndeHhmtw1LvfQQ5FweZ0YRtNAyuYEtST/view",
          icon: <GlobeIcon className="size-3" />,
        },
      ],
      image: "/scoliosis-demo-poster.jpg",
      video: "/scoliosis-demo.mp4",
    },
    {
      title: "Drift",
      subtitle: "AI microlearning platform",
      href: "",
      dates: "Jun 2026",
      featured: true,
      active: true,
      description:
        "Full-stack platform that turns any topic into a personalized learning track with LLM-generated syllabi, lessons, and feedback-driven progression.",
      highlights: [
        "Moved slow LLM and email workflows out of HTTP requests with Spring Kafka — retry handling and dead-letter queues across 4 core topics.",
        "Production-style infra: Dockerized AWS EC2, Caddy HTTPS reverse proxy, GitHub Actions CI, SonarCloud, and a 200-request authenticated JMeter run at 0 errors / 858.8ms p95.",
      ],
      technologies: ["Next.js", "Spring Boot", "Kafka", "MongoDB", "Docker", "AWS EC2", "Anthropic API"],
      links: [],
      image: "/driftlanding.png",
      video: "",
    },
    {
      title: "Order Matching Engine",
      subtitle: "Multi-process exchange simulation",
      href: "",
      dates: "Apr 2026",
      featured: true,
      active: false,
      description:
        "High-performance multi-process order matching system in C, using bi-directional UNIX pipes and I/O multiplexing for concurrent IPC between a virtual exchange and independent trader processes.",
      highlights: [
        "Synchronized data-streaming architecture processes live orders and broadcasts trade acknowledgments with 0.1ms round-trip latency — no shared memory.",
      ],
      technologies: ["C", "UNIX IPC", "Linux", "Systems"],
      links: [],
      image: "",
      video: "",
    },
    {
      title: "Blackjack-RL",
      subtitle: "Play against a learned policy",
      href: "https://github.com/Winstonnub/blackjackRL",
      dates: "Apr 2026",
      featured: true,
      active: false,
      description:
        "Five RL algorithms behind a real-time training dashboard with configurable hyperparameters — play blackjack against the models and sharpen your probability intuition.",
      highlights: [
        "Benchmarked convergence across 1M-episode runs; learned policies beat hand-coded basic strategy by 12% in house-edge reduction within a constrained action space.",
      ],
      technologies: ["FastAPI", "React", "Gymnasium", "Vercel"],
      links: [
        {
          type: "GitHub",
          href: "https://github.com/Winstonnub/blackjackRL",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/blackjack_rl.png",
      video: "",
    },
    {
      title: "SceneClarity",
      subtitle: "UTMIST · AV perception reliability",
      href: "https://docs.google.com/presentation/d/1x_80BSDE4UM1IlOj89HWDSG_WDCK1oOI3XijBLQBlyk/edit",
      dates: "Sept 2025 — May 2026",
      featured: false,
      active: false,
      description:
        "Modular ML evaluation pipeline that scores how reliably autonomous-vehicle perception holds up in adverse weather. Transfer learning with ResNet-18/50 on WeatherNet (18,039 images) reached 89.48% accuracy and 0.897 macro-F1.",
      highlights: [],
      technologies: ["PyTorch", "TensorFlow", "Jira", "Google Colab"],
      links: [
        {
          type: "Slides",
          href: "https://docs.google.com/presentation/d/1x_80BSDE4UM1IlOj89HWDSG_WDCK1oOI3XijBLQBlyk/edit",
          icon: <PresentationIcon className="size-3" />,
        },
      ],
      image: "/sceneclarity.jpg",
      video: "",
    },
    {
      title: "UofT Course LLM",
      subtitle: "RAG academic advising",
      href: "",
      dates: "Apr 2026",
      featured: false,
      active: false,
      description:
        "RAG advising system over verified course and policy data — text-embedding-3-small for semantic embeddings, ChromaDB for vector search, GPT-4o-mini for grounded generation. A backtracking constraint solver returns ranked, conflict-free 3–5 course timetables in ~6–16ms median.",
      highlights: [],
      technologies: ["Next.js", "ChromaDB", "FastAPI", "SQLite"],
      links: [],
      image: "",
      video: "",
    },
    {
      title: "TripBuddy",
      subtitle: "Clean architecture in Java",
      href: "https://github.com/Winstonnub/CSC207_Project",
      dates: "Nov 2025",
      featured: false,
      active: false,
      description:
        "Java desktop trip planner built on SOLID principles and Clean Architecture. Authored 4,000+ lines of production Java across a 6-person team, leading REST API integration and the accommodation features.",
      highlights: [],
      technologies: ["Java", "Swing", "REST APIs"],
      links: [
        {
          type: "GitHub",
          href: "https://github.com/Winstonnub/CSC207_Project",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/tripbuddy.png",
      video: "",
    },
    {
      title: "Virtual Tour",
      subtitle: "Hoi Ping Chamber of Commerce Secondary School",
      href: "https://winstonnub.github.io/hoiping_vt/Virtual%20Tour%20Website/index.html",
      dates: "2023",
      featured: false,
      active: false,
      description:
        "Panoramic virtual tour of the school campus built with panolens.js, stitched from Insta360 captures. Full-stack build under the school's IT Panel Head.",
      highlights: [],
      technologies: ["panolens.js", "JavaScript", "HTML/CSS"],
      links: [
        {
          type: "Website",
          href: "https://winstonnub.github.io/hoiping_vt/Virtual%20Tour%20Website/index.html",
          icon: <GlobeIcon className="size-3" />,
        },
      ],
      image: "/virtual-tour-poster.jpg",
      video: "/virtual-tour.mp4",
    },
  ],

  skills: [
    {
      category: "Languages",
      items: ["Python", "Java", "C", "TypeScript", "JavaScript", "SQL", "Bash", "Assembly (MIPS)"],
    },
    {
      category: "ML & Research",
      items: ["PyTorch", "JAX", "TensorFlow", "Keras", "PPO / RL", "Gymnasium", "YOLOv8", "scikit-learn", "NumPy", "Pandas"],
    },
    {
      category: "Backend & Infra",
      items: ["Spring Boot", "FastAPI", "Kafka", "Docker", "AWS (EC2 · S3)", "PostgreSQL", "MongoDB", "GitHub Actions", "Caddy", "Linux"],
    },
    {
      category: "Product & Frontend",
      items: ["React", "Next.js", "Tailwind CSS", "Prisma", "Vercel", "Clerk", "Git", "Jira"],
    },
  ],

  honors: {
    // Shown in full — scholarships are the part people actually scan for.
    scholarships: [
      {
        title: "University of Toronto International Merit Award",
        level: "University",
        description: "Awarded for academic merit on admission.",
      },
      {
        title: "Dato Tong, Luis Charitable Foundation Limited Scholarship",
        level: "University",
        description: "Selected as 1 of 4 Hong Kong Scholars.",
      },
      {
        title: "Dean's List Scholar",
        level: "University",
        description: "University of Toronto — 4.0/4.0 academic year distinction.",
      },
      {
        title: "The Regents Participation Award",
        level: "University",
        description:
          "Victoria College — for a significant contribution to university student life.",
      },
      {
        title: "Kwan Nang Chong Scholarship — Student of the Year",
        level: "High School",
        description:
          "Hoi Ping Chamber of Commerce Secondary School — role model student of the cohort.",
      },
      {
        title: "Ho Kien Bong Scholarship",
        level: "High School",
        description: "Overall 1st in cohort.",
      },
      {
        title: "Wong Chung On Scholarship",
        level: "High School",
        description: "Overall 1st in cohort.",
      },
      {
        title: "Hoi Ping Chamber of Commerce Hong Kong Scholarship",
        level: "High School",
        description: "Awarded for outstanding academic performance.",
      },
      {
        title: "World-renowned University Admission Scholarship",
        level: "High School",
        description: "Awarded for admission to a top-tier global university.",
      },
      {
        title: "First in Class — 15+ subject scholarships over 6 years",
        level: "High School",
        description:
          "Ranked 1st in Computer Studies, English Language, Liberal Studies, History, Economics, and Geography.",
      },
    ],

    // Grouped and collapsed, so the page stays scannable.
    awards: [
      {
        category: "Coding & hackathons",
        items: [
          {
            title: "Global Second Prize — CodeQuest International Hackathon",
            year: "2021 & 2022",
            description: "Back-to-back global placements.",
          },
          {
            title: "Gold Award — International Coding Elite Challenge",
            year: "2021 & 2022",
            description: "Hong Kong, Macau and Taiwan region.",
          },
          {
            title: "Top Coder — International Coding Elite Challenge",
            year: "2022",
            description: "Kowloon District, Secondary Division.",
          },
        ],
      },
      {
        category: "STEM & robotics",
        items: [
          {
            title: "Silver Award — Greater Bay Area STEM Excellence Award",
            year: "2023",
            description:
              "HKSAR — the only one-person team to win in the bracket.",
          },
          {
            title: "Second Prize — Race to the Line",
            year: "2022",
            description: "Micro:bit UK model rocket car competition.",
          },
        ],
      },
      {
        category: "World Scholar's Cup",
        items: [
          {
            title: "Tournament of Champions — Yale University",
            year: "2023",
            description:
              "Gold in Writing, Debating, and the Science & Technology Challenge. Silver in Team Debate and Team Writing. Champion Scholar (Silver).",
          },
          {
            title: "Global Round — University College London",
            year: "2023",
            description:
              "Gold in Writing (11th), Debating, Team Debate (14th), Team Writing (17th) and Team Bowl (25th). Champion Team Gold (22nd). Silver in Social Studies.",
          },
          {
            title: "Hong Kong Round",
            year: "2023",
            description:
              "Gold in Writing and Team Writing (3rd in Hong Kong). Overall Champion Silver. Silver in Debating, Team Bowl, and the Art & Music Challenge.",
          },
        ],
      },
      {
        category: "Debating & public speaking",
        items: [
          {
            title:
              "Champion — Hong Kong Secondary School Debating Competition, Term 1",
            year: "2021–22",
            description: "Led the school team as captain.",
          },
          {
            title:
              "1st Runner-up — Hong Kong Secondary School Debating Competition, Grand Final",
            year: "2021–22",
            description: "Territory-wide final.",
          },
          {
            title:
              "1st Runner-up — Hong Kong Secondary School Debating Competition, Term 1",
            year: "2022–23",
            description: "Second consecutive season on the podium.",
          },
          {
            title: "2nd Place — Speech Festival, Public Speaking Solo",
            year: "2021–22",
            description: "Hong Kong Schools Speech Festival.",
          },
          {
            title: "3rd Place — Speech Festival, Solo Verse Speaking",
            year: "2020–21",
            description: "Hong Kong Schools Speech Festival.",
          },
          {
            title: "Merit — Speech Festival, Public Speaking Solo",
            year: "2022–23",
            description: "Hong Kong Schools Speech Festival.",
          },
          {
            title:
              "District Semi-Finalist — HKFYG English Public Speaking Contest",
            year: "2021–22",
            description: "Hong Kong Federation of Youth Groups.",
          },
        ],
      },
      {
        category: "Media & production",
        items: [
          {
            title:
              "Merit Award — Lions Club Eyes Health Short Video Production Competition",
            year: "2022",
            description: "獅子會「獅瞳傳愛」視頻短片創作大賽.",
          },
        ],
      },
    ],
  },

  certifications: [
    { name: "Machine Learning Specialization", issuer: "DeepLearning.AI", date: "Aug 2025", logoUrl: "/deeplearningai.png" },
    { name: "Azure AI Fundamentals", issuer: "Microsoft", date: "Jan 2021", logoUrl: "/microsoft.png" },
    { name: "Introduction to Cloud Computing", issuer: "IBM", date: "", logoUrl: "/ibm.png" },
    { name: "Introduction to Software Engineering", issuer: "IBM", date: "", logoUrl: "/ibm.png" },
    { name: "Introduction to Cybersecurity", issuer: "Cisco", date: "Jan 2021", logoUrl: "/cisco.png" },
  ],

  leadership: [
    {
      company: "UTMIST",
      fullName: "UofT Machine Intelligence Student Team",
      href: "https://utmist.ca/eigenai",
      location: "Toronto, ON",
      title: "VP Logistics",
      logoUrl: "/utmist.png",
      start: "Sept 2026",
      end: "Present",
      current: true,
      image: "/eigenai.jpg",
      imageAlt: "Speaking on stage at EigenAI, UTMIST's flagship AI conference",
      description:
        "Running logistics for UTMIST, including EigenAI — the team's flagship AI conference. Sold 400+ tickets and brought on sponsors including Stripe.",
      highlights: [
        "Sold 400+ tickets across the two-day programme.",
        "Secured sponsors including Stripe.",
      ],
    },
    {
      company: "UTMIST",
      fullName: "UofT Machine Intelligence Student Team",
      href: "https://www.utmist.ca/",
      location: "Toronto, ON",
      title: "Machine Learning Developer",
      logoUrl: "/utmist.png",
      start: "Oct 2025",
      end: "May 2026",
      description:
        "Built a modular ML pipeline for SceneClarity scoring autonomous-vehicle perception reliability. Ran EDA on EDD100k and WeatherNet, trained ResNet-18/50 in PyTorch, and evaluated with torchmetrics.",
    },
    {
      company: "UTMIST",
      fullName: "UofT Machine Intelligence Student Team",
      href: "https://www.utmist.ca/",
      location: "Toronto, ON",
      title: "AI Open Source Developer",
      logoUrl: "/utmist.png",
      start: "Nov 2024",
      end: "Sep 2025",
      description:
        "Contributed to a Keras + NVDA screen-reader add-on for accurate image labelling, aimed at a friendlier browsing experience for visually impaired users. Focused on dataset sourcing, performance testing, and data cleaning.",
    },
    {
      company: "UT Hong Kong Students Association",
      fullName: "University of Toronto Hong Kong Students Association",
      href: "https://www.instagram.com/uthksa/",
      location: "Toronto, ON",
      title: "Director of Events",
      logoUrl: "/uthksa.png",
      start: "May 2025",
      end: "May 2026",
      description:
        "Led a team of 6 planning events that bring people on campus together, including orientation day with 140+ participants and 40+ coordinated helpers.",
    },
    {
      company: "UT Hong Kong Students Association",
      fullName: "University of Toronto Hong Kong Students Association",
      href: "https://www.instagram.com/uthksa/",
      location: "Toronto, ON",
      title: "Event Executive",
      logoUrl: "/uthksa.png",
      start: "Oct 2024",
      end: "May 2025",
      description:
        "Organized events reaching 100+ total participants, promoting Hong Kong culture in collaboration with other campus clubs.",
    },
    {
      company: "Hoi Ping Chamber of Commerce Secondary School",
      fullName: "Hoi Ping Chamber of Commerce Secondary School",
      href: "",
      location: "Hong Kong SAR",
      title: "Student Developer",
      logoUrl: "/hoiping.png",
      start: "Sep 2021",
      end: "Aug 2023",
      description:
        "Built the school's panolens.js virtual tour, a visitor-registration system on Google Apps Script, and a point-of-sale system in C for the HKDSE public examination.",
    },
    {
      company: "Hoi Ping Chamber of Commerce Secondary School",
      fullName: "Hoi Ping Chamber of Commerce Secondary School",
      href: "",
      location: "Hong Kong SAR",
      title: "Captain, Speech & Debating Club",
      logoUrl: "/hoiping.png",
      start: "Sep 2021",
      end: "Jul 2023",
      description:
        "Captain in 2022–23. Coordinated the team to 1st Runner-up in the Hong Kong Secondary School Debating Competition, and earned Gold for Debating at Yale and UCL in the World Scholar's Cup.",
    },
    {
      company: "Hoi Ping Chamber of Commerce Secondary School",
      fullName: "Hoi Ping Chamber of Commerce Secondary School",
      href: "",
      location: "Hong Kong SAR",
      title: "Chairperson, Multi-Media Production Team",
      logoUrl: "/hoiping.png",
      start: "Sep 2018",
      end: "Jul 2023",
      description:
        "Nominated Outstanding Chairperson. Led ~60 students documenting school activities and coordinating production work.",
    },
    {
      company: "Hoi Ping Chamber of Commerce Secondary School",
      fullName: "Hoi Ping Chamber of Commerce Secondary School",
      href: "",
      location: "Hong Kong SAR",
      title: "Chairperson, IT & STEM Club",
      logoUrl: "/hoiping.png",
      start: "2018",
      end: "2023",
      description:
        "Chairperson in 2022–23. Ran workshops and published computing explainers on the club's social channels.",
    },
  ],
} as const;
