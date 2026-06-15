export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
}

export interface EducationEntry {
  id: string;
  degree: string;
  institution: string;
  location: string;
  graduationDate: string;
  gpaOrHonors?: string;
  description?: string;
}

export interface WorkExperienceEntry {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string; // e.g. "Present" or "Dec 2024"
  description: string; // Bullet points or single block
}

export interface ProjectEntry {
  id: string;
  title: string;
  technologies: string; // e.g. "React, Node.js, AWS"
  description: string;
  link?: string;
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface ResumeData {
  fullName: string;
  targetRole: string;
  contact: ContactInfo;
  professionalSummary: string;
  careerObjective: string;
  showObjective: boolean;
  education: EducationEntry[];
  technicalSkills: string[];
  softSkills: string[];
  experience: WorkExperienceEntry[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
  achievements: string[];
  languages: string[];
  references: string;
}

export interface ATSAnalysisResult {
  atsScore: number;
  praiseList: string[];
  missingKeywords: string[];
  actionableSuggestions: string[];
  formattingCritique: string[];
}

export interface CoachMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export type TemplateType = "executive" | "modern" | "tech" | "editorial";
