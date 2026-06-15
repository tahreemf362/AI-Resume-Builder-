import { ResumeData } from "./types";

export const emptyResume: ResumeData = {
  fullName: "",
  targetRole: "",
  contact: {
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    portfolio: ""
  },
  professionalSummary: "",
  careerObjective: "",
  showObjective: false,
  education: [],
  technicalSkills: [],
  softSkills: [],
  experience: [],
  projects: [],
  certifications: [],
  achievements: [],
  languages: [],
  references: ""
};

export const softwareEngineerSample: ResumeData = {
  fullName: "Alex Rivera",
  targetRole: "Full Stack Software Engineer",
  contact: {
    email: "alex.rivera@devmail.com",
    phone: "+1 (555) 019-2834",
    location: "Austin, TX - Open to Remote",
    linkedin: "linkedin.com/in/alexriveradeveloper",
    portfolio: "alexriveradevs.io"
  },
  professionalSummary: "Innovative and highly motivated Full Stack Engineer with over 4 years of hands-on experience designing, building, and deploying secure, high-performance web applications. Expert in React, TypeScript, Node.js, and cloud native architectures. Proven record of optimizing server bottlenecks and slashing service response latencies.",
  careerObjective: "Eager Full Stack Engineer seeking to leverage strong analytical skills, professional boot camp training, and a deep interest of Node.js and AWS cloud infrastructure to solve complex product problems and accelerate team milestones.",
  showObjective: false,
  education: [
    {
      id: "edu_1",
      degree: "Bachelor of Science in Computer Science",
      institution: "University of Texas at Austin",
      location: "Austin, TX",
      graduationDate: "May 2021",
      gpaOrHonors: "GPA: 3.8 / 4.0 - Magna Cum Laude",
      description: "Specialized in Software Engineering and Distributed Databases. Recipient of Dean's Honor Roll."
    }
  ],
  technicalSkills: [
    "TypeScript", "JavaScript", "React", "Node.js", "Express", "Next.js", "AWS", "Docker", "RESTful APIs", "GraphQL", "PostgreSQL", "MongoDB", "Jest", "CI/CD"
  ],
  softSkills: [
    "Collaborative Problem Solving", "Systematic Debugging", "Technical Mentorship", "Agile Methodologies", "Cross-functional Collaboration"
  ],
  experience: [
    {
      id: "exp_1",
      role: "Software Engineer II",
      company: "CloudScale Technologies",
      location: "Austin, TX",
      startDate: "June 2022",
      endDate: "Present",
      description: "• Spearheaded the migration of a legacy monolithic dashboard to micro-frontend React architecture, improving page load speeds by 42%.\n• Designed and engineered high-throughput Node.js microservices handling over 5,000 requests per minute with an average SLA uptime of 99.98%.\n• Automated CI/CD deployment pipelines using GitHub Actions, decreasing release cycle bottlenecks from 4 days to 45 minutes.\n• Mentored 3 junior developers and established code review standards, reducing security vulnerability flags by 30%."
    },
    {
      id: "exp_2",
      role: "Associate Developer",
      company: "Innovate Fintech Corp",
      location: "Dallas, TX",
      startDate: "July 2021",
      endDate: "May 2022",
      description: "• Built robust online payment workflows with React and Redux Toolkit, decreasing client-side check-out dropoff rates by 18%.\n• Optimized database query structures in PostgreSQL, resolving database connection locks and decreasing transaction log sizes by 22%.\n• Conducted robust end-to-end integration testing using Jest, resulting in a 95% code module coverage score."
    }
  ],
  projects: [
    {
      id: "proj_1",
      title: "Real-time Multi-tenant Kanban System",
      technologies: "React, Node.js, WebSockets, Redis, PostgreSQL",
      description: "Engineered a collaborative task workspace allowing 100+ simultaneous users to update task cards concurrently. Used Redis Pub/Sub to maintain state consistency, trimming update replication lag under 80 milliseconds.",
      link: "github.com/alexrivera/kanban-realtime"
    },
    {
      id: "proj_2",
      title: "Self-Healing Server Infrastructure Agent",
      technologies: "Python, Docker, AWS Lambda, Prometheus",
      description: "Created a server-side monitoring daemon daemon that intercepts high-CPU container alerts and automatically scales up instances. Avoided manual incident reaction requests, reducing overnight outage response times by 85%.",
      link: "github.com/alexrivera/self-healing-agent"
    }
  ],
  certifications: [
    {
      id: "cert_1",
      name: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services",
      date: "October 2023"
    },
    {
      id: "cert_2",
      name: "Professional Scrum Master (PSM I)",
      issuer: "Scrum.org",
      date: "February 2022"
    }
  ],
  achievements: [
    "First Place Winner out of 80 teams in Austin Regional Hackathon 2023 with an AI-driven disaster response prototype.",
    "Promoted to Software Engineer II in less than 11 months due to outstanding architecture delivery.",
    "Published whitepaper on 'Reliable WebSockets at Scale' in regional engineering publication."
  ],
  languages: [
    "English (Native)",
    "Spanish (Professional working proficiency)",
    "Japanese (Elementary)"
  ],
  references: "Excellent professional references provided upon request."
};

export const freshmanStudentSample: ResumeData = {
  fullName: "Jordan Lee",
  targetRole: "Junior UI/UX & Web Developer",
  contact: {
    email: "jordan.lee@domain.com",
    phone: "+1 (555) 777-8899",
    location: "Miami, FL",
    linkedin: "linkedin.com/in/jordanleedesign",
    portfolio: "jordanleedesigns.dev"
  },
  professionalSummary: "Eager and detail-oriented Creative Web Developer and Designer. Adept at transforming high-fidelity Figma mockups into reactive React interfaces. Eager to bring standard web standards and clean coding patterns to an innovative creative team.",
  careerObjective: "Motivated Computer Science Senior at Miami Tech College seeking an entry-level Web Developer position to contribute exceptional front-end coding skills, rapid prototyping familiarity, and a relentless focus on screen accessibility compliance to deliver stunning corporate products.",
  showObjective: true,
  education: [
    {
      id: "edu_stud_1",
      degree: "Computer Science Associate Degree",
      institution: "Miami Tech College",
      location: "Miami, FL",
      graduationDate: "Expected Dec 2026",
      gpaOrHonors: "GPA: 3.92 - President's Scholar List",
      description: "Relevant coursework: Interface Systems, Front-End Development, Data Structures, Human-Computer Interaction."
    }
  ],
  technicalSkills: [
    "HTML5", "CSS3", "JavaScript", "React", "Tailwind CSS", "Figma", "Git", "Sass", "Responsive Web Design", "WCAG Accessibility Rules", "SQL"
  ],
  softSkills: [
    "Creative Storytelling", "High Visual Accuracy", "Empathetic Communication", "Active Listening", "Eagerness to Learn"
  ],
  experience: [
    {
      id: "exp_stud_1",
      role: "Web Design Intern",
      company: "Coral Reef Agency",
      location: "Miami, FL",
      startDate: "May 2025",
      endDate: "August 2025",
      description: "• Re-skinned the customer landing pages using Tailwind CSS and React, boosting page readability and mobile conversion rates by 25%.\n• Audited and updated 14 standard client websites to meet WCAG 2.1 AA accessibility guidelines, eliminating design layout inconsistencies.\n• Collaborated with senior marketing team designers to test user feedback patterns, accelerating project prototype sign-offs by 2 days."
    }
  ],
  projects: [
    {
      id: "psj_stud_1",
      title: "EcoTracker: Clean Energy Usage App",
      technologies: "Figma, React, Chart.js",
      description: "Designed a clean, dark-themed utility dashboard mapping home energy metrics. Solved charting re-render bottlenecks, allowing users to inspect month-over-month energy saving progress smoothly.",
      link: "github.com/jordanlee/ecotracker-web"
    }
  ],
  certifications: [
    {
      id: "cert_stud_1",
      name: "Meta Front-End Developer Professional Certificate",
      issuer: "Coursera / Meta",
      date: "March 2025"
    }
  ],
  achievements: [
    "Elected as Public Relations Director for Miami Tech College Computer Club, coordinating technical workshops with 150+ active participants.",
    "Won 'Best Aesthetic Layout Award' in Miami Youth Hackathon with an eco-centric smart recycling mock-up."
  ],
  languages: [
    "English (Bilingual)",
    "German (Conversational)"
  ],
  references: "Academic and professional references can be requested immediately."
};
