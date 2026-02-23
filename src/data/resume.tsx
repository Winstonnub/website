import { Icons } from "@/components/icons";
import { HomeIcon, NotebookIcon, CpuIcon, AppWindowIcon, Share2Icon, GlobeIcon } from "lucide-react";
import {
  SiPython, SiHtml5, SiJavascript, SiReact, SiNextdotjs, SiPostgresql, SiPytorch,
  SiTensorflow, SiKeras, SiScikitlearn, SiPandas, SiNumpy, SiPlotly,
  SiGit, SiGithub, SiJira, SiLinux, SiDocker, SiAmazon, SiVercel, SiClerk,
  SiPrisma, SiGooglecolab, SiGoogleappsscript, SiC
} from "react-icons/si";
import { FaJava } from "react-icons/fa";

export const DATA = {
  name: "Winston Liang",
  initials: "WL",
  url: "https://github.com/Winstonnub",
  location: "Toronto, CA",
  locationLink: "https://www.google.com/maps/place/toronto",
  description:
    "Machine Learning Developer | AI Systems | Full-Stack Engineering",
  summary:
    "I am a undergraduate sophomore at the University of Toronto. I do two specialists programs. I am a big sleeper. I lived in Robarts library in my first year.",
  avatarUrl: "/me.png",
  skills: [
    { name: "Python", icon: SiPython },
    { name: "Java", icon: FaJava },
    { name: "C", icon: SiC },
    { name: "HTML/CSS", icon: SiHtml5 },
    { name: "JavaScript", icon: SiJavascript },
    { name: "React.js", icon: SiReact },
    { name: "Next.js", icon: SiNextdotjs },
    { name: "SQL", icon: SiPostgresql },
    { name: "Assembly (MIPS)", icon: CpuIcon },
    { name: "PyTorch", icon: SiPytorch },
    { name: "TensorFlow", icon: SiTensorflow },
    { name: "Keras", icon: SiKeras },
    { name: "YOLOv5", icon: GlobeIcon },
    { name: "Scikit-learn", icon: SiScikitlearn },
    { name: "Pandas", icon: SiPandas },
    { name: "Numpy", icon: SiNumpy },
    { name: "Plotly", icon: SiPlotly },
    { name: "Tkinter", icon: AppWindowIcon },
    { name: "NetworkX", icon: Share2Icon },
    { name: "Panolens.js", icon: GlobeIcon },
    { name: "Git", icon: SiGit },
    { name: "GitHub", icon: SiGithub },
    { name: "Jira", icon: SiJira },
    { name: "Linux", icon: SiLinux },
    { name: "Docker", icon: SiDocker },
    { name: "AWS", icon: SiAmazon },
    { name: "Vercel", icon: SiVercel },
    { name: "NeonDB", icon: SiPostgresql },
    { name: "Clerk", icon: SiClerk },
    { name: "Prisma", icon: SiPrisma },
    { name: "Google Colab", icon: SiGooglecolab },
    { name: "Google AppScript", icon: SiGoogleappsscript },
  ],
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/blog", icon: NotebookIcon, label: "Blog" },
  ],
  contact: {
    email: "cywinston.liang@mail.utoronto.ca",
    tel: "",
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
        name: "Send Email",
        url: "mailto:cywinston.liang@mail.utoronto.ca",
        icon: Icons.email,
        navbar: true,
      },
    },
  },

  work: [
    {
      company: "National University of Singapore",
      href: "https://nus.edu.sg",
      badges: [],
      location: "Singapore",
      title: "AI Researcher (Incoming)",
      logoUrl: "/nus.png",
      start: "May 2026",
      end: "Incoming",
      description:
        "reinforcement learning for decentralized multi-agent pathfinding 🌟🤖",
    },
    {
      company: "Hong Kong Digital Policy Office",
      href: "#",
      badges: [],
      location: "Cyberport, Hong Kong SAR",
      title: "Summer Intern",
      logoUrl: "/hksar.png",
      start: "Jul 2025",
      end: "Aug 2025",
      description:
        "Designed and evaluated a scalable LLM deployment for government office use, laying groundwork with Ollama and Open WebUI and presenting a feasibility study to technical and non-technical stakeholders. Conducted research on LLM context engineering and deployment strategies, including quantization, model distillation, hallucination mitigation, and RAG to reduce legal, compliance, and policy risks in security-sensitive applications. Collaborated with internal teams to gather system requirements and produced a comprehensive deployment proposal covering architecture, operational constraints, and security considerations. Developed a Python automation script for scraping public vulnerabilities and generating security alerts, reducing manual compilation time from hours to minutes and enabling timely dissemination to 70+ government bureaus and departments.",
    },
  ],
  education: [
    {
      school: "University of Toronto",
      href: "https://utoronto.ca",
      degree: "Bachelor of Science, Double Specialist in Computer Science and Data Science",
      logoUrl: "/uoft.png",
      start: "Sept 2024",
      end: "Present",
      description: "Hong Kong Scholar, Dean’s List Scholar. cGPA: 3.95/4.0",
    },
  ],
  projects: [
    {
      title: "SceneClarity (University of Toronto Machine Intelligence Student Team)",
      href: "https://www.utmist.ca/",
      dates: "Sept 2025 – Present",
      active: true,
      description:
        "Developed a modular ML evaluation pipeline to assess autonomous-vehicle perception robustness under adverse conditions. Performed exploratory data analysis (EDA) to identify data quality issues, distribution shifts, and failure modes. Applied transfer learning using ResNet-18 and ResNet-50 on the WeatherNet dataset, experimenting with fine-tuning depth, regularization, and evaluation metrics. Collaborated in an Agile workflow using Jira and GitHub for pull requests, design discussions, and weekly standups.",
      technologies: [
        "PyTorch",
        "TensorFlow",
        "Google Colab",
      ],
      links: [],
      image: "sceneclarity.png",
      video: "",
    },
    {
      title: "Scoliosis AI (In Dev)",
      href: "https://scoliosis-ai.vercel.app/",
      dates: "Dec 2025",
      active: true,
      description:
        "Built an end-to-end full-stack AI web application for scoliosis detection from spinal X-ray images. Implemented a secure image upload pipeline using AWS S3 presigned URLs, storing metadata and detection results in PostgreSQL (NeonDB) via Prisma ORM. Containerized and deployed a FastAPI + YOLO inference service using Docker on AWS EC2 for authenticated server-to-server inference.",
      technologies: [
        "Next.js",
        "PostgreSQL",
        "AWS",
        "Clerk",
        "Prisma",
        "NeonDB",
        "PyTorch",
        "YOLOv5",
      ],
      links: [],
      image: "",
      video: "/ScoliosisAI_quickdemo.mov",
    },
    {
      title: "TripBuddy Application",
      href: "https://github.com/Winstonnub/CSC207_Project",
      dates: "Nov 2025",
      active: true,
      description:
        "Built a Java desktop trip-planning application using SOLID principles and Clean Architecture. Authored 4,000+ lines of production Java code, leading REST API integration and core accommodation features. Collaborated in a 6-person team, participating in design reviews, GitHub code reviews, and iterative planning.",
      technologies: [
        "Java (Swing, REST API)",
      ],
      links: [],
      image: "/tripbuddy.png",
      video: "",
    },
    {
      title: "Virtual Tour Website",
      href: "https://winstonnub.github.io/hoiping_vt/Virtual%20Tour%20Website/index.html",
      dates: "2023",
      active: true,
      description:
        "Developed a virtual tour website for Hoi Ping Chamber of Commerce Secondary School using panolens.js. Integrated panoramic photos taken with Insta360 cameras. Responsible for full-stack development and framework integration under the supervision of the school's IT Panel Head.",
      technologies: [
        "panolens.js",
        "HTML/CSS",
        "JavaScript"
      ],
      links: [
        {
          type: "Website",
          href: "https://winstonnub.github.io/hoiping_vt/Virtual%20Tour%20Website/index.html",
          icon: <GlobeIcon className="size-3" />,
        },
      ],
      image: "",
      video: "/hoipingvtour.mov",
    },
  ],
  hackathons: [],
  honors: {
    scholarships: [
      {
        title: "Dato Tong, Luis Charitable Foundation Limited Scholarship - Hong Kong Scholar",
        year: "University",
        description: "Awarded as part of the Hong Kong Scholarship program.",
      },
      {
        title: "International Merit Award",
        year: "University",
        description: "University of Toronto — Awarded for academic merit.",
      },
      {
        title: "Dean’s List Scholar",
        year: "University",
        description: "University of Toronto — Maintained a 4.0/4.0 academic year distinction.",
      },
      {
        title: "The Regents Participation Award",
        year: "University",
        description: "Victoria College — Recognized for significant contribution to university student life.",
      },
      {
        title: "Kwan Nang Chong Scholarship (Student of the Year)",
        year: "High School",
        description: "Hoi Ping Chamber of Commerce Secondary School - Role model student of Cohort.",
      },
      {
        title: "Ho Kien Bong Scholarship",
        year: "High School",
        description: "Hoi Ping Chamber of Commerce Secondary School — Overall 1st in Cohort.",
      },
      {
        title: "Wong Chung On Scholarship",
        year: "High School",
        description: "Hoi Ping Chamber of Commerce Secondary School — Overall 1st in Cohort.",
      },
      {
        title: "Hoi Ping Chamber of Commerce Hong Kong Scholarship",
        year: "High School",
        description: "Awarded for outstanding academic performance.",
      },
      {
        title: "World-renowned University Admission Scholarship",
        year: "High School",
        description: "Awarded for admission to a top-tier global university.",
      },
      {
        title: "First in Class Subjects (more than 15 scholarships in 6 years)",
        year: "High School",
        description: "Ranked 1st in Computer Studies, English Language, Liberal Studies, History, Economics, and Geography.",
      },
    ],
    awards: [
      {
        title: "Gold Award - Individual Writing / Debating",
        year: "World Scholars Cup (Yale University, US)",
        description: "Achieved Gold medals in Individual Writing and Debating categories.",
      },
      {
        title: "Ranked 11th - Individual Writing",
        year: "World Scholars Cup (UCL, UK)",
        description: "Competed globally and ranked 11th in Individual Writing.",
      },
      {
        title: "Ranked 3rd - Individual and Team Writing",
        year: "World Scholars Cup (Hong Kong SAR)",
        description: "Achieved 3rd place in both Individual and Team Writing categories.",
      },
      {
        title: "Silver Award - The Greater Bay Area STEM Excellence Award 2023 (HKSAR)",
        year: "STEM / Robotics",
        description: "The only one-man team that won in the same bracket.",
      },
      {
        title: "Second Prize - Race to the Line",
        year: "STEM / Robotics",
        description: "Micro:bit UK Model Rocket Car Competition.",
      },
      {
        title: "Champion - Hong Kong Secondary School Debating Competition Term 1",
        year: "Debating / Public Speaking",
        description: "2021-2022 Season.",
      },
      {
        title: "1st Runner-up - Hong Kong Secondary School Debating Competition Grand Final",
        year: "Debating / Public Speaking",
        description: "2021-2022 Season.",
      },
      {
        title: "1st Runner-up - Hong Kong Secondary School Debating Competition Term 1",
        year: "Debating / Public Speaking",
        description: "2022-2023 Season.",
      },
      {
        title: "2nd Place - Speech Festival Public Speaking Solo",
        year: "Debating / Public Speaking",
        description: "2021-2022 Season.",
      },
      {
        title: "3rd Place - Speech Festival Solo Verse Speaking",
        year: "Debating / Public Speaking",
        description: "2020-2021 Season.",
      },
      {
        title: "District Semi-Finalist - The HKFYG English Public Speaking Contest",
        year: "Debating / Public Speaking",
        description: "2021-2022 Season.",
      },
      {
        title: "Merit - Speech Festival Public Speaking Solo",
        year: "Debating / Public Speaking",
        description: "2022-2023 Season.",
      },
    ],
  },
  awards: [],
  certifications: [
    {
      name: "Microsoft Certified: Azure AI Fundamentals",
      issuer: "Microsoft",
      date: "Jan 2021",
      logoUrl: "/microsoft.png",
    },
    {
      name: "Advanced Learning Algorithms",
      issuer: "DeepLearning.AI",
      date: "Aug 2025",
      logoUrl: "/deeplearningai.png",
    },
    {
      name: "Supervised Machine Learning: Regression and Classification",
      issuer: "DeepLearning.AI",
      date: "Aug 2025",
      logoUrl: "/deeplearningai.png",
    },
    {
      name: "Developing Front-End Apps with React",
      issuer: "IBM",
      date: "",
      logoUrl: "/ibm.png",
    },
    {
      name: "Getting Started with Git and GitHub",
      issuer: "IBM",
      date: "",
      logoUrl: "/ibm.png",
    },
    {
      name: "Introduction to HTML, CSS, & JavaScript",
      issuer: "IBM",
      date: "",
      logoUrl: "/ibm.png",
    },
    {
      name: "Introduction to Cloud Computing",
      issuer: "IBM",
      date: "",
      logoUrl: "/ibm.png",
    },
    {
      name: "Introduction to Software Engineering",
      issuer: "IBM",
      date: "",
      logoUrl: "/ibm.png",
    },
    {
      name: "Introduction to Cybersecurity",
      issuer: "Cisco",
      date: "Jan 2021",
      logoUrl: "/cisco.png",
    },
  ],
  leadership: [
    {
      company: "University of Toronto Machine Intelligence Student Team (UTMIST)",
      href: "https://www.utmist.ca/",
      badges: [],
      location: "Toronto, Ontario, Canada",
      title: "Machine Learning Developer",
      logoUrl: "/utmist.png",
      start: "Oct 2025",
      end: "Present",
      description:
        "Working on a modular ML pipeline for SceneClarity to assess and score the reliability of autonomous vehicle perception systems under challenging conditions. Performed Exploratory Data Analysis (EDA) on EDD100k and WeatherNet datasets, facilitating decisions on dataset preparation. Using PyTorch to train ResNet-18 under WeatherNet dataset with a standard train-val-test split. Evaluated model performance on validation and testing set with torchmetrics.",
    },
    {
      company: "University of Toronto Machine Intelligence Student Team (UTMIST)",
      href: "https://www.utmist.ca/",
      badges: [],
      location: "Toronto, Ontario, Canada",
      title: "AI Open Source Developer",
      logoUrl: "/utmist.png",
      start: "Nov 2024",
      end: "Sep 2025",
      description:
        "Contribution to the implementation of Keras and NVDA (NonVisual Desktop Access) add-on for accurate image labelling, aspiring to aid visually impaired users for a user-friendly browsing experience. Worked majorly on finding suitable datasets, performance testing and data cleaning.",
    },
    {
      company: "University of Toronto Hong Kong Students Association",
      href: "#",
      badges: [],
      location: "Toronto, Ontario, Canada",
      title: "Director of Events",
      logoUrl: "/uthksa.png",
      start: "May 2025",
      end: "Present",
      description:
        "Leading a team of 6 to brainstorm events that bring people on campus together. Led orientation day with 140+ participants and coordinated 40+ helpers, creating memorable experiences for first years.",
    },
    {
      company: "University of Toronto Hong Kong Students Association",
      href: "#",
      badges: [],
      location: "On-site",
      title: "Event Executive",
      logoUrl: "/uthksa.png",
      start: "Oct 2024",
      end: "May 2025",
      description:
        "Organized events with more than 100+ total participants. Promoted Hong Kong culture and collaborated with different clubs to host events for a diverse cultural experience.",
    },
    {
      company: "Hoi Ping Chamber of Commerce Secondary School",
      href: "#",
      badges: [],
      location: "Hong Kong",
      title: "Captain (Speech and Debating Club)",
      logoUrl: "/hoiping.png",
      start: "Sep 2021",
      end: "Jul 2023",
      description:
        "Team captain in 2022-2023. Coordinated and distributed work for the team. Led the team to win 1st Runner-up in the Hong Kong Secondary School Debating Competition. Awarded Gold Award at Yale University for Debating in the World Scholars Cup.",
    },
    {
      company: "Hoi Ping Chamber of Commerce Secondary School",
      href: "#",
      badges: [],
      location: "Hong Kong",
      title: "Chairperson (Multi-Media Production Team)",
      logoUrl: "/hoiping.png",
      start: "Sep 2021",
      end: "Jul 2022",
      description:
        "Nominated as Outstanding Chairperson. Led a team of ~60 students for school service. Coordinated work distribution for team members. Focused on photographing school activities and capturing key moments.",
    },
    {
      company: "Hoi Ping Chamber of Commerce Secondary School",
      href: "#",
      badges: [],
      location: "Hong Kong",
      title: "Chairperson (IT & STEM Club)",
      logoUrl: "/hoiping.png",
      start: "2022",
      end: "2023",
      description:
        "Organized workshops and promoted IT and computer knowledge on social media.",
    },
    {
      company: "Various Clubs (HPCSS)",
      href: "#",
      badges: [],
      location: "Hong Kong",
      title: "Committee Member",
      logoUrl: "/hoiping.png",
      start: "2020",
      end: "2023",
      description:
        "Served as committee member for Physics Club, Social Service Group, Mathematics Club, and Kan House.",
    },
  ],
} as const;
