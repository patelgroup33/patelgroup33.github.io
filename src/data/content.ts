// Single source of truth — all content pulled from Dev Patel's 2026 resume.

export const IDENTITY = {
  name: "DEV PATEL",
  first: "DEV",
  last: "PATEL",
  location: "Morgantown, PA",
  email: "patelgroup33@yahoo.com",
  altEmail: "patelgroup33@gmail.com",
  github: "patelgroup33",
  githubUrl: "https://github.com/patelgroup33",
  resume: "/Dev_Patel_Resume.pdf",
  roles: ["AI ENGINEER", "SOFTWARE ENGINEER"],
};

export const BOOT_MODULES = [
  { label: "Loading Experience", detail: "CNH Industrial · Morgan Corporation" },
  { label: "Loading Projects", detail: "Matching Engine · Backtesting Framework" },
  { label: "Loading AI Models", detail: "Claude · GPT · Gemini" },
  { label: "Loading Software", detail: "Systems · Applications · Automation" },
  { label: "Loading Engineering", detail: "Embedded C/C++ · CI/CD · MATLAB" },
];

export const ENGINEER = {
  title: "THE ENGINEER",
  education: {
    school: "Saint Joseph's University",
    faculty: "College of Arts and Sciences",
    degree: "B.S. Computer Science",
    detail: "Philadelphia, PA · Expected May 2028",
    gpa: "3.83 / 4.0",
    honors: ["Presidential Scholarship", "Honors Program", "Dean's List ×4"],
  },
  skills: {
    Languages: ["C", "C++", "Python", "Java", "C#", "JavaScript", "MATLAB", "Bash", "SQL", "JSON"],
    "Full-Stack & Cloud": [
      "React", "Node.js", "Express", "Django", "HTML / CSS", "Bootstrap",
      "REST APIs", "Docker", "Kubernetes", "OpenShift", "Microservices",
      "Serverless", "Cloud Native", "NoSQL", "DevOps",
    ],
    Platforms: [
      "Git", "GitHub", "GitLab", "SVN", "CMake", "GoogleTest", "Google Benchmark",
      "Polyspace", "JFrog", "Polarion", "Jira", "CAN Tooling", "PC/HIL Sim",
      "UiPath", "JD Edwards", "Microsoft 365",
    ],
    Concepts: [
      "Data Structures & Algorithms", "OOP", "Embedded Systems", "CI/CD",
      "Agile / Scrum", "Version Control & Migration", "Testing & Validation",
      "Application Security", "Performance Optimization", "Debugging",
    ],
    "AI Models": ["Claude", "GPT", "Gemini"],
  },
  certifications: [
    {
      title: "IBM Full Stack Software Developer",
      issuer: "IBM · Coursera",
      date: "Jan 2023",
      courses: "12-course Professional Certificate",
      detail:
        "Cloud-native application development end to end — front-end (HTML/CSS/JS, React), back-end (Node.js, Express, Python, Django), containers & orchestration (Docker, Kubernetes, OpenShift), microservices, serverless and a deployed SaaS capstone.",
      credentialUrl:
        "https://coursera.org/verify/professional-cert/LKAP6T9FXTWS",
      skills: [
        "React", "Node.js", "Django", "Docker", "Kubernetes",
        "Microservices", "Serverless", "Cloud Native",
      ],
    },
  ],
  coursework: [
    "Data Structures", "Design & Analysis of Algorithms", "Computer Architecture",
    "Principles of Programming Languages", "Software Engineering",
    "Discrete Structures", "Penetration Testing", "Calculus I–II",
  ],
};

export const PROJECTS = [
  {
    index: "01",
    title: "Limit Order Book & Matching Engine",
    kind: "Systems / C++",
    year: "Summer 2026",
    url: "https://github.com/patelgroup33/limit-order-book",
    stack: ["C++", "CMake", "GoogleTest", "Google Benchmark", "GitHub Actions"],
    lines: [
      "Production-inspired matching engine with price–time (FIFO) priority — limit & market orders, partial fills, cancellation, modification.",
      "Zero-allocation hot path via intrusive linked lists + object pool; direct-indexed price ladder taking add/cancel from O(log P) to O(1) — a ~2.2× per-fill latency win.",
      "Strongly-typed domain (Price / Quantity / OrderId) turning argument-swap bugs into compile errors at zero runtime cost.",
      "Validated with 54 GoogleTest suites + microbenchmarks; Linux/macOS CI; dependency-free web visualizer on GitHub Pages.",
    ],
    metric: { value: "2.2×", label: "latency reduction" },
  },
  {
    index: "02",
    title: "Event-Driven Backtesting Engine",
    kind: "Quant / Simulation",
    year: "Summer 2026",
    url: "https://github.com/patelgroup33/limit-order-book/tree/main/libs/backtest",
    stack: ["C++", "CMake", "GoogleTest", "Google Benchmark"],
    lines: [
      "Modular framework replaying historical market data through pluggable strategies with zero look-ahead bias — same code path in test and live.",
      "Realistic fills modelling slippage, commission, partial fills and latency; tracks positions, cash and realized / unrealized PnL with average-cost accounting.",
      "Performance analytics — Sharpe, Sortino, max drawdown, CAGR, profit factor — gated through a risk manager with exposure limits and a daily-loss kill-switch.",
      "Benchmarked 10M-bar backtests at ~50–70M bars/sec (O(N)); 100+ unit tests; browser visualizer for price, trades and equity curve.",
    ],
    metric: { value: "70M", label: "bars / second" },
  },
];

export const EXPERIENCE = [
  {
    company: "CNH Industrial",
    role: "Embedded Software Engineer Intern",
    location: "New Holland, PA",
    period: "May 2026 — Aug 2026",
    tag: "EMBEDDED",
    points: [
      "Shipped embedded C/C++ for the PV25 release across the cotton-harvester product line — features for the onboard control systems.",
      "Led the company-wide SVN → GitLab migration: repositories, CI/CD pipelines, tooling and docs adopted across international sites.",
      "Built & validated control components in MATLAB and C on a PC-based hardware simulator with CAN bus tooling before deployment.",
      "Collaborated daily across Belgium, Brazil, Italy, India and the U.S. — Agile ceremonies, peer review, Polyspace static analysis.",
      "Managed requirements and traceability in Polarion with JFrog + GitLab CI/CD under ISO-compliant processes. Linux / Ubuntu. Claude · GPT · Gemini in daily work.",
    ],
  },
  {
    company: "Morgan Corporation",
    role: "Information Technology Intern",
    location: "Morgantown, PA",
    period: "Aug 2023 — Mar 2024",
    tag: "AUTOMATION",
    points: [
      "Automated repetitive business processes with UiPath robots + C# integration, collapsing multi-step manual workflows.",
      "Developed and debugged JD Edwards EnterpriseOne pages inside the company's ERP system.",
      "Planned the JD Edwards redesign and ERP implementation using Microsoft Excel.",
      "Responded to security incidents, ran technical support and provisioned access for employee onboarding.",
    ],
  },
];

export const METRICS = [
  { value: 2, suffix: "+", label: "Years Experience" },
  { value: 30, suffix: "+", label: "Technologies" },
  { value: 1, suffix: "", label: "Pro Certification" },
  { value: 5, suffix: "", label: "Applications Built" },
  { value: 4, suffix: "", label: "Dean's List Terms" },
  { value: 154, suffix: "+", label: "Automated Tests" },
];

export const PIPELINE = [
  { step: "IDEA", note: "Signal from noise" },
  { step: "RESEARCH", note: "Constraints & prior art" },
  { step: "ARCHITECTURE", note: "Types, boundaries, data flow" },
  { step: "ENGINEERING", note: "Zero-allocation hot paths" },
  { step: "AUTOMATION", note: "CI/CD, tests, pipelines" },
  { step: "DEPLOYMENT", note: "Ship, measure, verify" },
  { step: "OPTIMIZATION", note: "Profile, tune, repeat" },
];
