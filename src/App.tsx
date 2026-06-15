import React, { useState, useEffect, useRef } from "react";
import { 
  Briefcase, 
  GraduationCap, 
  Sparkles, 
  Printer, 
  Send, 
  RotateCcw, 
  CheckCircle, 
  Trash2, 
  Plus, 
  AlertTriangle, 
  Award, 
  Layers, 
  Check, 
  MessageSquare, 
  ExternalLink, 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Globe, 
  Cpu, 
  User, 
  HelpCircle,
  FileText,
  BadgeAlert,
  Sliders,
  ChevronRight,
  ChevronDown
} from "lucide-react";
import { ResumeData, ATSAnalysisResult, CoachMessage, TemplateType, WorkExperienceEntry, ProjectEntry, EducationEntry, CertificationEntry } from "./types";
import { softwareEngineerSample, freshmanStudentSample, emptyResume } from "./sampleData";

export default function App() {
  // Application State
  const [resume, setResume] = useState<ResumeData>(softwareEngineerSample);
  const [activeTab, setActiveTab] = useState<"edit" | "analyze" | "chat">("edit");
  const [activeSection, setActiveSection] = useState<string>("header");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>("modern");
  
  // Custom states for interactive additions
  const [newSkillText, setNewSkillText] = useState("");
  const [newSoftSkillText, setNewSoftSkillText] = useState("");
  const [newLanguageText, setNewLanguageText] = useState("");
  const [newAchievementText, setNewAchievementText] = useState("");
  
  // ATS Analyzer state
  const [jobDescription, setJobDescription] = useState<string>(
    "We are seeking a senior-leaning Full Stack Software Engineer to join our growing engineering hub. You should be highly proficient in React, TypeScript, and Node.js. Experience optimizing distributed databases (like PostgreSQL) and orchestrating CI/CD deployment pipelines on AWS is a major advantage. Our team values developers who can spearhead legacy migrations, design high-throughput APIs, write robust tests, and mentor junior colleagues."
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ATSAnalysisResult | null>({
    atsScore: 78,
    praiseList: [
      "Excellent logical layout utilizing clean bullet formations.",
      "Clear chronological progression with strong visual hierarchy.",
      "Exceptional use of standard technical terminology matching full-stack industry norms (TypeScript, Node.js)."
    ],
    missingKeywords: ["Distributed Databases", "Agile Methodologies", "AWS Lambda", "Prometheus Integration"],
    actionableSuggestions: [
      "Infuse a strong metric quantification into your second experience bullet at Innovate Fintech Corp.",
      "Expand on how you integrated AWS services under the technologies section.",
      "Specify your role in legacy migrations inside your primary objective or executive summary."
    ],
    formattingCritique: [
      "Perfect single-page density achieved under standard print margins.",
      "No suspicious tables or complex layouts found which could disrupt automated key-value parsing layers."
    ]
  });
  
  // AI Career Coach state
  const [chatMessages, setChatMessages] = useState<CoachMessage[]>([
    {
      id: "wel_1",
      role: "assistant",
      content: "Hello! I am your AI Career Coach and Recruiter Consultant. I have analyzed your resume structure and the current job description. Ask me anything! We can run a simulated mock interview, brainstorm bullet points with concrete metrics, or address gaps in your engineering profile.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  
  // Bullets Refiner state
  const [refiningTarget, setRefiningTarget] = useState<{
    type: "experience" | "project";
    itemId: string;
    originalText: string;
    note: string;
  } | null>(null);
  const [refinedResultText, setRefinedResultText] = useState("");
  const [isRefining, setIsRefining] = useState(false);
  const [refineFeedback, setRefineFeedback] = useState("");

  // Quick preset skills to help user add skills fast
  const popularTechSkills = [
    "TypeScript", "React", "Next.js", "Node.js", "Express", "Python", "Go", "AWS", "Docker", "Kubernetes", "GraphQL", "PostgreSQL", "Firebase", "Tailwind CSS", "Git"
  ];
  const popularSoftSkills = [
    "Collaborative Leadership", "System Design", "Agile Methodologies", "Technical Writing", "Rapid Prototyping", "User Empathy"
  ];

  // Scroll to chat feedback
  const chatBottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Load a demo profile quickly
  function loadProfile(profile: "senior" | "student" | "empty") {
    if (profile === "senior") {
      setResume(softwareEngineerSample);
    } else if (profile === "student") {
      setResume(freshmanStudentSample);
    } else {
      setResume(emptyResume);
    }
  }

  // Handle generic resume state updates
  const updateContact = (field: keyof typeof resume.contact, value: string) => {
    setResume(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value
      }
    }));
  };

  const handleAddField = <T extends {}>(listName: "education" | "experience" | "projects" | "certifications", initialObj: T) => {
    setResume(prev => ({
      ...prev,
      [listName]: [...(prev[listName] as T[]), { ...initialObj, id: `${listName}_${Date.now()}` }]
    }));
  };

  const handleUpdateField = (
    listName: "education" | "experience" | "projects" | "certifications",
    id: string,
    field: string,
    value: any
  ) => {
    setResume(prev => ({
      ...prev,
      [listName]: (prev[listName] as any[]).map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleRemoveField = (listName: "education" | "experience" | "projects" | "certifications", id: string) => {
    setResume(prev => ({
      ...prev,
      [listName]: (prev[listName] as any[]).filter(item => item.id !== id)
    }));
  };

  // Add tag skills
  const addTechSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !resume.technicalSkills.includes(trimmed)) {
      setResume(prev => ({
        ...prev,
        technicalSkills: [...prev.technicalSkills, trimmed]
      }));
    }
    setNewSkillText("");
  };

  const removeTechSkill = (skill: string) => {
    setResume(prev => ({
      ...prev,
      technicalSkills: prev.technicalSkills.filter(s => s !== skill)
    }));
  };

  const addSoftSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !resume.softSkills.includes(trimmed)) {
      setResume(prev => ({
        ...prev,
        softSkills: [...prev.softSkills, trimmed]
      }));
    }
    setNewSoftSkillText("");
  };

  const removeSoftSkill = (skill: string) => {
    setResume(prev => ({
      ...prev,
      softSkills: prev.softSkills.filter(s => s !== skill)
    }));
  };

  // Extra arrays helpers
  const handleAddLanguage = () => {
    const val = newLanguageText.trim();
    if (val) {
      setResume(prev => ({ ...prev, languages: [...prev.languages, val] }));
      setNewLanguageText("");
    }
  };

  const handleRemoveLanguage = (idx: number) => {
    setResume(prev => ({ ...prev, languages: prev.languages.filter((_, i) => i !== idx) }));
  };

  const handleAddAchievement = () => {
    const val = newAchievementText.trim();
    if (val) {
      setResume(prev => ({ ...prev, achievements: [...prev.achievements, val] }));
      setNewAchievementText("");
    }
  };

  const handleRemoveAchievement = (idx: number) => {
    setResume(prev => ({ ...prev, achievements: prev.achievements.filter((_, i) => i !== idx) }));
  };

  // AI Helper: Auto-Generate Objective or Professional Summary block
  const handleAiAutoGenerateSummary = async (type: "summary" | "objective") => {
    setIsRefining(true);
    setRefineFeedback("Analyzing skills and compiling professional summary with Gemini...");
    try {
      const response = await fetch("/api/resume/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: resume.fullName,
          targetRole: resume.targetRole,
          skills: resume.technicalSkills,
          experience: resume.experience,
          projects: resume.projects,
          type
        })
      });
      const data = await response.json();
      if (data.summary) {
        if (type === "summary") {
          setResume(prev => ({ ...prev, professionalSummary: data.summary }));
        } else {
          setResume(prev => ({ ...prev, careerObjective: data.summary, showObjective: true }));
        }
        setRefineFeedback("Generated successfully!");
      } else if (data.error) {
        setRefineFeedback(`Error: ${data.error}`);
      }
    } catch (e) {
      console.error(e);
      setRefineFeedback("Server connection failed or invalid API secret configuration.");
    } finally {
      setIsRefining(false);
      setTimeout(() => setRefineFeedback(""), 4000);
    }
  };

  // AI Refine Target Dialog (Experiences and projects)
  const openBulletRefiner = (type: "experience" | "project", itemId: string, currentText: string) => {
    setRefiningTarget({
      type,
      itemId,
      originalText: currentText,
      note: ""
    });
    setRefinedResultText("");
    setRefineFeedback("");
  };

  const triggerAiRefinement = async () => {
    if (!refiningTarget) return;
    setIsRefining(true);
    setRefinedResultText("");
    setRefineFeedback("Recruiting algorithm is polishing grammar and placing key action verbs...");
    try {
      const response = await fetch("/api/resume/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          textToImprove: refiningTarget.originalText,
          context: refiningTarget.note || "Focus on measurable project scale, system optimization, and technical ownership.",
          targetRole: resume.targetRole
        })
      });
      const data = await response.json();
      if (data.improvedText) {
        setRefinedResultText(data.improvedText);
        setRefineFeedback("Polished text generated successfully! Review below.");
      } else {
        setRefineFeedback(data.error || "Failed to parse rewritten text.");
      }
    } catch (err) {
      console.error(err);
      setRefineFeedback("Connection failed. Check Server logs or verify your GEMINI_API_KEY.");
    } finally {
      setIsRefining(false);
    }
  };

  const applyRefinement = () => {
    if (!refiningTarget || !refinedResultText) return;
    const { type, itemId } = refiningTarget;
    if (type === "experience") {
      handleUpdateField("experience", itemId, "description", refinedResultText);
    } else {
      handleUpdateField("projects", itemId, "description", refinedResultText);
    }
    setRefiningTarget(null);
    setRefinedResultText("");
  };

  // ATS Compliancy Scanner trigger
  const runAtsAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/resume/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeData: resume,
          jobDescription: jobDescription
        })
      });
      const data = await response.json();
      if (data && typeof data.atsScore === "number") {
        setAnalysisResult(data);
      } else {
        alert("Received unexpected layout analysis from backend. Ensure your job description text is comprehensive.");
      }
    } catch (e) {
      console.error(e);
      alert("ATS endpoint failed connection. Make sure node server is active and verified.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Career Coach Chat action
  const sendChatMessage = async () => {
    const trimmed = chatInput.trim();
    if (!trimmed) return;
    
    const userMsg: CoachMessage = {
      id: `chat_${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/coach/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg],
          resumeData: resume,
          jobDescription: jobDescription
        })
      });
      const data = await response.json();
      if (data.message) {
        setChatMessages(prev => [...prev, {
          id: `chat_${Date.now()}_reply`,
          role: "assistant",
          content: data.message,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        setChatMessages(prev => [...prev, {
          id: `chat_${Date.now()}_err`,
          role: "assistant",
          content: "I encountered a processing delay. Let's try rephrasing your question or check if your API configuration is active.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    } catch (e) {
      console.error(e);
      setChatMessages(prev => [...prev, {
        id: `chat_${Date.now()}_err`,
        role: "assistant",
        content: "Network response error. Please double-check your terminal build logs and retry shortly.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800">
      
      {/* Header Bar */}
      <header id="header-bar" className="bg-white border-b border-slate-200 py-3.5 px-6 sticky top-0 z-40 no-print shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-2.5">
            <div className="bg-teal-600 text-white p-2 rounded-lg shadow-sm">
              <Briefcase className="w-5.5 h-5.5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                ATS Resume Architect & Coach
              </h1>
              <p className="text-xs text-slate-500">
                Highly optimized parsing templates with live AI diagnostics & career guidance
              </p>
            </div>
          </div>

          {/* Quick preset switchers */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest mr-1">Load Demo:</span>
            <button
              id="load-senior"
              onClick={() => loadProfile("senior")}
              className={`text-xs px-3 py-1.5 rounded-md font-medium border transition-all ${
                resume.fullName === "Alex Rivera" 
                  ? "bg-teal-50 border-teal-200 text-teal-700 font-semibold shadow-xs" 
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              💻 Software Engineer (4 Yrs)
            </button>
            <button
              id="load-student"
              onClick={() => loadProfile("student")}
              className={`text-xs px-3 py-1.5 rounded-md font-medium border transition-all ${
                resume.fullName === "Jordan Lee" 
                  ? "bg-teal-50 border-teal-200 text-teal-700 font-semibold shadow-xs" 
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              🎓 Freshman Student
            </button>
            <button
              id="load-empty"
              onClick={() => loadProfile("empty")}
              className="text-xs px-2.5 py-1.5 rounded-md font-medium border border-red-200 bg-white text-red-600 hover:bg-red-50 transition-all flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Clear Form
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
        
        {/* Left Column: Form Controls & AI Coaching Tabs */}
        <div id="editor-column" className="w-full lg:w-[45%] flex flex-col gap-5 no-print">
          
          {/* Workspace Tab Buttons */}
          <div className="bg-white border border-slate-200 p-1 rounded-xl flex items-center grid grid-cols-3 gap-1 shadow-xs">
            <button
              id="tab-edit"
              onClick={() => setActiveTab("edit")}
              className={`py-2 px-3 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "edit" ? "bg-teal-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sliders className="w-4 h-4" /> Edit Details
            </button>
            <button
              id="tab-analyze"
              onClick={() => setActiveTab("analyze")}
              className={`py-2 px-3 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 relative ${
                activeTab === "analyze" ? "bg-teal-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BadgeAlert className="w-4 h-4" /> ATS Scanner
              {analysisResult && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] h-4.5 min-w-4.5 px-1 rounded-full flex items-center justify-center font-bold">
                  {analysisResult.atsScore}%
                </span>
              )}
            </button>
            <button
              id="tab-chat"
              onClick={() => setActiveTab("chat")}
              className={`py-2 px-3 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "chat" ? "bg-teal-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <MessageSquare className="w-4 h-4" /> AI Recruiter Coach
            </button>
          </div>

          {/* MAIN TAB AREA: 1. EDIT RESUME DETAILS */}
          {activeTab === "edit" && (
            <div id="tab-content-edit" className="flex flex-col gap-4">
              
              {/* Form Navigation Accordions */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full">
                {[
                  { id: "header", label: "Contact Info" },
                  { id: "summary", label: "Summary" },
                  { id: "skills", label: "Skills" },
                  { id: "experience", label: "Experience" },
                  { id: "projects", label: "Projects" },
                  { id: "education", label: "Education" },
                  { id: "extras", label: "Languages/Extras" },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveSection(s.id)}
                    className={`text-xs px-3 py-1.5 font-medium rounded-full cursor-pointer whitespace-nowrap transition-all ${
                      activeSection === s.id 
                        ? "bg-slate-800 text-white shadow-xs" 
                        : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* SECTION: Contact / Header Information */}
              {activeSection === "header" && (
                <div id="section-contact-card" className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
                  <h3 className="text-base font-bold text-slate-900 border-b pb-2 flex items-center gap-1.5">
                    <User className="text-teal-600 w-4 h-4" /> Contact & Header Details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={resume.fullName}
                        onChange={(e) => setResume(prev => ({ ...prev, fullName: e.target.value }))}
                        placeholder="Johnathan Doe"
                        className="w-full text-sm px-3 py-2 border border-slate-200 rounded-md focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-hidden"
                      />
                    </div>

                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Target Role / Subject Line</label>
                      <input
                        type="text"
                        value={resume.targetRole}
                        onChange={(e) => setResume(prev => ({ ...prev, targetRole: e.target.value }))}
                        placeholder="e.g. Senior Backend Engineer"
                        className="w-full text-sm px-3 py-2 border border-slate-200 rounded-md focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-hidden"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">This will be heavily evaluated against job descriptions on scans.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={resume.contact.email}
                        onChange={(e) => updateContact("email", e.target.value)}
                        placeholder="name@email.com"
                        className="w-full text-sm px-3 py-2 border border-slate-200 rounded-md focus:border-teal-500 outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={resume.contact.phone}
                        onChange={(e) => updateContact("phone", e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        className="w-full text-sm px-3 py-2 border border-slate-200 rounded-md focus:border-teal-500 outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Location / Relocation Info</label>
                      <input
                        type="text"
                        value={resume.contact.location}
                        onChange={(e) => updateContact("location", e.target.value)}
                        placeholder="e.g. Seattle, WA (Open to Remote)"
                        className="w-full text-sm px-3 py-2 border border-slate-200 rounded-md focus:border-teal-500 outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">LinkedIn Profile Link</label>
                      <input
                        type="text"
                        value={resume.contact.linkedin}
                        onChange={(e) => updateContact("linkedin", e.target.value)}
                        placeholder="linkedin.com/in/username"
                        className="w-full text-sm px-3 py-2 border border-slate-200 rounded-md focus:border-teal-500 outline-hidden"
                      />
                    </div>

                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Portfolio or GitHub Website URL</label>
                      <input
                        type="text"
                        value={resume.contact.portfolio}
                        onChange={(e) => updateContact("portfolio", e.target.value)}
                        placeholder="github.com/username or creativefolio.io"
                        className="w-full text-sm px-3 py-2 border border-slate-200 rounded-md focus:border-teal-500 outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION: Professional Summary & Career Objective */}
              {activeSection === "summary" && (
                <div id="section-summary-card" className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
                  <h3 className="text-base font-bold text-slate-900 border-b pb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Award className="text-teal-600 w-4 h-4" /> Summary & Objectives
                    </span>
                  </h3>

                  {/* Objective toggle */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-150 flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      id="toggle-objective-box"
                      checked={resume.showObjective}
                      onChange={(e) => setResume(prev => ({ ...prev, showObjective: e.target.checked }))}
                      className="mt-1 accent-teal-600"
                    />
                    <div>
                      <label htmlFor="toggle-objective-box" className="text-xs font-bold text-slate-800 cursor-pointer">
                        Include Career Objective Section
                      </label>
                      <p className="text-[10px] text-slate-500">
                        Highly recommended if you are a student, recent graduate, or transitioning careers.
                      </p>
                    </div>
                  </div>

                  {resume.showObjective && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                          Career Objective (For Freshers)
                        </label>
                        <button
                          onClick={() => handleAiAutoGenerateSummary("objective")}
                          disabled={isRefining}
                          className="text-[11px] text-teal-600 hover:text-teal-800 font-bold flex items-center gap-1 bg-teal-50 px-2 py-0.5 rounded-sm hover:bg-teal-100 disabled:opacity-50"
                        >
                          <Sparkles className="w-3 h-3" /> AI Tailor
                        </button>
                      </div>
                      <textarea
                        rows={3}
                        value={resume.careerObjective}
                        onChange={(e) => setResume(prev => ({ ...prev, careerObjective: e.target.value }))}
                        placeholder="Detailed career goals focusing on rapid contribution capabilities..."
                        className="w-full text-sm p-2.5 border border-slate-200 rounded-md focus:border-teal-500 outline-hidden font-mono text-xs"
                      />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        Professional Summary (For Experienced Candidates)
                      </label>
                      <button
                        onClick={() => handleAiAutoGenerateSummary("summary")}
                        disabled={isRefining}
                        className="text-[11px] text-teal-600 hover:text-teal-800 font-bold flex items-center gap-1 bg-teal-50 px-2 py-0.5 rounded-sm hover:bg-teal-100 disabled:opacity-50"
                      >
                        <Sparkles className="w-3 h-3" /> AI Generate Summary
                      </button>
                    </div>
                    <textarea
                      rows={5}
                      value={resume.professionalSummary}
                      onChange={(e) => setResume(prev => ({ ...prev, professionalSummary: e.target.value }))}
                      placeholder="High-impact executive overview summarizing core years of experience, unique tech stacks, and quantified business milestones..."
                      className="w-full text-sm p-2.5 border border-slate-200 rounded-md focus:border-teal-500 outline-hidden text-slate-700 leading-relaxed"
                    />
                  </div>

                  {refineFeedback && (
                    <div className="text-[11px] p-2 bg-teal-50 border border-teal-200 text-teal-800 rounded-md animate-pulse">
                      🌱 {refineFeedback}
                    </div>
                  )}
                </div>
              )}

              {/* SECTION: SKILLS */}
              {activeSection === "skills" && (
                <div id="section-skills-card" className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
                  <h3 className="text-base font-bold text-slate-900 border-b pb-2 flex items-center gap-1.5">
                    <Layers className="text-teal-600 w-4 h-4" /> Skills Integration
                  </h3>

                  {/* Technical Hard Skills */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1 bg-slate-50 p-1 px-1.5 rounded-sm">
                      Technical / Hard Skills:
                    </label>
                    <div className="flex flex-wrap gap-1.5 mb-2 max-h-32 overflow-y-auto p-1.5 border border-dashed border-slate-200 rounded-md">
                      {resume.technicalSkills.length === 0 ? (
                        <span className="text-xs text-slate-400 italic">No skills listed yet. Add some below.</span>
                      ) : (
                        resume.technicalSkills.map(skill => (
                          <span key={skill} className="bg-slate-100 text-slate-800 text-xs px-2 py-1 rounded-sm flex items-center gap-1">
                            {skill}
                            <button 
                              type="button" 
                              onClick={() => removeTechSkill(skill)} 
                              className="text-red-500 hover:text-red-700 font-semibold text-xs ml-0.5 focus:outline-hidden"
                            >
                              &times;
                            </button>
                          </span>
                        ))
                      )}
                    </div>

                    <form 
                      onSubmit={(e) => { e.preventDefault(); addTechSkill(newSkillText); }}
                      className="flex gap-1.5"
                    >
                      <input
                        type="text"
                        placeholder="e.g. Next.js, GCP, Python"
                        value={newSkillText}
                        onChange={(e) => setNewSkillText(e.target.value)}
                        className="flex-1 text-xs px-2 py-1.5 border border-slate-200 rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => addTechSkill(newSkillText)}
                        className="bg-slate-800 hover:bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-md font-semibold"
                      >
                        Add Skill
                      </button>
                    </form>
                  </div>

                  {/* Soft Skills */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1 bg-slate-50 p-1 px-1.5 rounded-sm">
                      Professional soft competencies:
                    </label>
                    <div className="flex flex-wrap gap-1.5 mb-2 max-h-32 overflow-y-auto p-1.5 border border-dashed border-slate-200 rounded-md">
                      {resume.softSkills.length === 0 ? (
                        <span className="text-xs text-slate-400 italic">No soft skills added.</span>
                      ) : (
                        resume.softSkills.map(skill => (
                          <span key={skill} className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded-sm flex items-center gap-1">
                            {skill}
                            <button 
                              type="button" 
                              onClick={() => removeSoftSkill(skill)} 
                              className="text-red-400 hover:text-red-600 text-xs font-semibold"
                            >
                              &times;
                            </button>
                          </span>
                        ))
                      )}
                    </div>

                    <form 
                      onSubmit={(e) => { e.preventDefault(); addSoftSkill(newSoftSkillText); }}
                      className="flex gap-1.5"
                    >
                      <input
                        type="text"
                        placeholder="e.g. Technical Mentor, Agile"
                        value={newSoftSkillText}
                        onChange={(e) => setNewSoftSkillText(e.target.value)}
                        className="flex-1 text-xs px-2 py-1.5 border border-slate-200 rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => addSoftSkill(newSoftSkillText)}
                        className="bg-slate-800 hover:bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-md font-semibold"
                      >
                        Add
                      </button>
                    </form>
                  </div>

                  {/* Preset Instant Helpers */}
                  <div className="bg-amber-50/50 border border-amber-200 rounded-md p-3">
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
                      💡 Click to inject missing critical ATS skills matching:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {popularTechSkills.map(ps => (
                        <button
                          key={ps}
                          disabled={resume.technicalSkills.includes(ps)}
                          onClick={() => addTechSkill(ps)}
                          className="bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white text-[10px] text-slate-700 px-2 py-0.5 border border-slate-200 rounded-sm font-medium cursor-pointer transition-colors"
                        >
                          + {ps}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION: WORK EXPERIENCE */}
              {activeSection === "experience" && (
                <div id="section-experience-card" className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                      <Briefcase className="text-teal-600 w-4.5 h-4.5" /> Professional History
                    </h3>
                    <button
                      onClick={() => handleAddField<WorkExperienceEntry>("experience", {
                        id: "",
                        role: "New Position Title",
                        company: "Company Name inc.",
                        location: "Silicon Valley, CA",
                        startDate: "Month 2024",
                        endDate: "Present",
                        description: "• Spearheaded deployment of [X] using complex stacks, lowering latency by [Y]%.\n• Successfully delivered high-quality services to over [Z] clients."
                      })}
                      className="bg-teal-600 hover:bg-teal-700 text-white text-xs px-2.5 py-1.2 rounded-md font-semibold flex items-center gap-1 pointer-events-auto"
                    >
                      <Plus className="w-3.5 h-3.5" /> New Job
                    </button>
                  </div>

                  {resume.experience.length === 0 ? (
                    <div className="p-8 border-2 border-dashed border-slate-200 text-center rounded-lg">
                      <p className="text-xs text-slate-400 italic">No work history provided. Left empty, this section will not print.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {resume.experience.map((exp, index) => (
                        <div key={exp.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 relative group flex flex-col gap-2.5">
                          
                          <button
                            onClick={() => handleRemoveField("experience", exp.id)}
                            className="absolute top-2.5 right-2.5 text-slate-400 hover:text-red-500 p-1 rounded-sm hover:bg-slate-100 transition-colors"
                            title="Remove role"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-sm max-w-max">
                            #Position #{index + 1}
                          </span>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase">Organization / Company</label>
                              <input
                                type="text"
                                value={exp.company}
                                onChange={(e) => handleUpdateField("experience", exp.id, "company", e.target.value)}
                                className="w-full text-xs font-medium bg-white p-1.5 border border-slate-200 rounded-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase">Role / Job Title</label>
                              <input
                                type="text"
                                value={exp.role}
                                onChange={(e) => handleUpdateField("experience", exp.id, "role", e.target.value)}
                                className="w-full text-xs font-semibold bg-white p-1.5 border border-slate-200 rounded-sm text-slate-800"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase">Dates Frame (Start - End)</label>
                              <input
                                type="text"
                                value={exp.startDate && exp.endDate ? `${exp.startDate} - ${exp.endDate}` : exp.startDate || "May 2021 - Present"}
                                onChange={(e) => {
                                  const parts = e.target.value.split("-");
                                  handleUpdateField("experience", exp.id, "startDate", parts[0]?.trim() || "");
                                  handleUpdateField("experience", exp.id, "endDate", parts[1]?.trim() || "");
                                }}
                                placeholder="Start Date - End Date"
                                className="w-full text-xs bg-white p-1.5 border border-slate-200 rounded-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase">Office Location</label>
                              <input
                                type="text"
                                value={exp.location}
                                onChange={(e) => handleUpdateField("experience", exp.id, "location", e.target.value)}
                                className="w-full text-xs bg-white p-1.5 border border-slate-200 rounded-sm"
                              />
                            </div>
                          </div>

                          {/* Bullet description with Refiner tool */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-[10px] font-bold text-slate-600 uppercase">
                                Key Responsibilities & Quantified Accomplishments
                              </label>
                              
                              <button
                                onClick={() => openBulletRefiner("experience", exp.id, exp.description)}
                                className="text-[10px] text-teal-600 hover:text-teal-800 font-bold bg-teal-50 hover:bg-teal-100 p-1 px-2 rounded-sm flex items-center gap-1 cursor-pointer"
                              >
                                <Sparkles className="w-2.5 h-2.5 animate-bounce" /> Clean & Quantify with AI
                              </button>
                            </div>

                            <textarea
                              rows={5}
                              value={exp.description}
                              onChange={(e) => handleUpdateField("experience", exp.id, "description", e.target.value)}
                              placeholder="• Spearheaded dynamic dashboards raising speed index by 32%...&#10;• Orchestrated test loops reducing code deployment crashes..."
                              className="w-full text-xs font-mono p-2 bg-white border border-slate-200 rounded-sm leading-relaxed"
                            />
                            <p className="text-[9px] text-slate-400 mt-0.5">Use newlines starting with • for maximum parsing readability.</p>
                          </div>

                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SECTION: PROJECTS */}
              {activeSection === "projects" && (
                <div id="section-projects-card" className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                      <Cpu className="text-teal-600 w-4.5 h-4.5" /> High-Impact Artifacts / Projects
                    </h3>
                    <button
                      onClick={() => handleAddField<ProjectEntry>("projects", {
                        id: "",
                        title: "Personal Smart Cloud Proxy",
                        technologies: "Node.js, Docker, AWS EC2",
                        description: "Developed proxy loops mitigating heavy load constraints with strict cache schedules.",
                        link: "github.com/my-workspace"
                      })}
                      className="bg-teal-600 hover:bg-teal-700 text-white text-xs px-2.5 py-1.2 rounded-md font-semibold flex items-center gap-1 pointer-events-auto"
                    >
                      <Plus className="w-3.5 h-3.5" /> New Project
                    </button>
                  </div>

                  {resume.projects.length === 0 ? (
                    <div className="p-8 border-2 border-dashed border-slate-200 text-center rounded-lg text-slate-400 italic">
                      No standalone projects listed.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {resume.projects.map((proj, index) => (
                        <div key={proj.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 relative group flex flex-col gap-3">
                          
                          <button
                            onClick={() => handleRemoveField("projects", proj.id)}
                            className="absolute top-2.5 right-2.5 text-slate-400 hover:text-red-500 p-1 rounded-sm hover:bg-slate-100"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-sm max-w-max">
                            Project #{index + 1}
                          </span>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase">Project Title</label>
                              <input
                                type="text"
                                value={proj.title}
                                onChange={(e) => handleUpdateField("projects", proj.id, "title", e.target.value)}
                                className="w-full text-xs font-semibold bg-white p-1.5 border border-slate-200 rounded-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase">Technologies Utilized</label>
                              <input
                                type="text"
                                value={proj.technologies}
                                onChange={(e) => handleUpdateField("projects", proj.id, "technologies", e.target.value)}
                                className="w-full text-xs bg-white p-1.5 border border-slate-200 rounded-sm font-mono"
                                placeholder="React, Express, AWS"
                              />
                            </div>
                            <div className="col-span-1 md:col-span-2">
                              <label className="block text-[10px] font-bold text-slate-500 uppercase">Link URL / Github (Optional)</label>
                              <input
                                type="text"
                                value={proj.link || ""}
                                onChange={(e) => handleUpdateField("projects", proj.id, "link", e.target.value)}
                                className="w-full text-xs bg-white p-1.5 border border-slate-200 rounded-sm"
                                placeholder="e.g. github.com/user/project-repo"
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-[10px] font-bold text-slate-600 uppercase">Description of Architecture & Impact</label>
                              <button
                                onClick={() => openBulletRefiner("project", proj.id, proj.description)}
                                className="text-[10px] text-teal-600 hover:text-teal-800 font-bold bg-teal-50 hover:bg-teal-100 p-1 px-1.5 rounded-md flex items-center gap-1 cursor-pointer"
                              >
                                <Sparkles className="w-2.5 h-2.5" /> AI Refine Description
                              </button>
                            </div>
                            <textarea
                              rows={4}
                              value={proj.description}
                              onChange={(e) => handleUpdateField("projects", proj.id, "description", e.target.value)}
                              placeholder="Orchestrated a resilient proxy mechanism which lowered memory leaks in production servers by..."
                              className="w-full text-xs font-mono p-2 bg-white border border-slate-200 rounded-md leading-relaxed"
                            />
                          </div>

                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SECTION: EDUCATION */}
              {activeSection === "education" && (
                <div id="section-education-card" className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                      <GraduationCap className="text-teal-600 w-4.5 h-4.5" /> Academic Education
                    </h3>
                    <button
                      onClick={() => handleAddField<EducationEntry>("education", {
                        id: "",
                        degree: "Associate's Degree in Science",
                        institution: "Community College",
                        location: "Miami, FL",
                        graduationDate: "Expected Dec 2026",
                        gpaOrHonors: "GPA 3.8 / Honors List"
                      })}
                      className="bg-teal-600 hover:bg-teal-700 text-white text-xs px-2.5 py-1.2 rounded-md font-semibold flex items-center gap-1 pointer-events-auto"
                    >
                      <Plus className="w-3.5 h-3.5" /> New School
                    </button>
                  </div>

                  {resume.education.length === 0 ? (
                    <div className="p-8 border-2 border-dashed border-slate-200 text-center rounded-lg text-slate-400 italic">
                      No educational profile registered.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {resume.education.map((edu, index) => (
                        <div key={edu.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 relative flex flex-col gap-2.5">
                          
                          <button
                            onClick={() => handleRemoveField("education", edu.id)}
                            className="absolute top-2.5 right-2.5 text-slate-400 hover:text-red-500 p-1 rounded-sm hover:bg-slate-100"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-sm max-w-max">
                            Degree #{index + 1}
                          </span>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase">College / Institution</label>
                              <input
                                type="text"
                                value={edu.institution}
                                onChange={(e) => handleUpdateField("education", edu.id, "institution", e.target.value)}
                                className="w-full text-xs font-semibold bg-white p-1.5 border border-slate-200 rounded-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase">Degree Title / Specialization</label>
                              <input
                                type="text"
                                value={edu.degree}
                                onChange={(e) => handleUpdateField("education", edu.id, "degree", e.target.value)}
                                className="w-full text-xs bg-white p-1.5 border border-slate-200 rounded-sm"
                                placeholder="B.S. in Computer Science"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase">Graduation Date (or Expected)</label>
                              <input
                                type="text"
                                value={edu.graduationDate}
                                onChange={(e) => handleUpdateField("education", edu.id, "graduationDate", e.target.value)}
                                className="w-full text-xs bg-white p-1.5 border border-slate-200 rounded-sm"
                                placeholder="May 2025"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase">GPA / Honors / Major Track</label>
                              <input
                                type="text"
                                value={edu.gpaOrHonors || ""}
                                onChange={(e) => handleUpdateField("education", edu.id, "gpaOrHonors", e.target.value)}
                                className="w-full text-xs bg-white p-1.5 border border-slate-200 rounded-sm"
                                placeholder="GPA: 3.8 / 4.0"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SECTION: LANGUAGES & EXTRAS */}
              {activeSection === "extras" && (
                <div id="section-extras-card" className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
                  <h3 className="text-base font-bold text-slate-900 border-b pb-2 flex items-center gap-1.5">
                    <Award className="text-teal-600 w-4 h-4" /> Languages & Peer Achievements
                  </h3>

                  {/* Certifications lists */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-bold text-slate-800">Certifications:</label>
                      <button
                        onClick={() => handleAddField<CertificationEntry>("certifications", {
                          id: "",
                          name: "Azure Cloud Architect Expert",
                          issuer: "Microsoft",
                          date: "July 2024"
                        })}
                        className="text-[10px] text-teal-600 font-bold bg-teal-50 px-2 py-0.5 rounded-sm hover:bg-teal-100 pointer-events-auto"
                      >
                        + Add Cert
                      </button>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      {resume.certifications?.map(c => (
                        <div key={c.id} className="flex gap-2 items-center bg-slate-50 p-2 rounded-md border border-slate-200">
                          <input
                            type="text"
                            value={c.name}
                            onChange={(e) => handleUpdateField("certifications", c.id, "name", e.target.value)}
                            placeholder="Name"
                            className="flex-1 text-xs bg-white p-1 border rounded-xs"
                          />
                          <input
                            type="text"
                            value={c.issuer}
                            onChange={(e) => handleUpdateField("certifications", c.id, "issuer", e.target.value)}
                            placeholder="Issuer"
                            className="w-1/3 text-xs bg-white p-1 border rounded-xs"
                          />
                          <button
                            onClick={() => handleRemoveField("certifications", c.id)}
                            className="text-red-500 hover:text-red-700 text-xs font-bold px-1"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Achievements List */}
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">Key Achievements & Distinctions (Line items):</label>
                    <div className="flex flex-col gap-1.5 mb-2">
                      {resume.achievements.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1 bg-slate-50 p-1.5 border rounded-md">
                          <span className="text-xs text-slate-600 flex-1 truncate">{item}</span>
                          <button 
                            onClick={() => handleRemoveAchievement(idx)}
                            className="text-red-500 text-xs px-1 hover:text-red-700 font-bold"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        placeholder="e.g. Published a tech blog with 10k unique visits"
                        value={newAchievementText}
                        onChange={(e) => setNewAchievementText(e.target.value)}
                        className="flex-1 text-xs px-2 py-1 border border-slate-200 rounded-sm"
                      />
                      <button
                        onClick={handleAddAchievement}
                        className="bg-slate-800 hover:bg-slate-900 text-white text-xs px-2 rounded-sm"
                      >
                        Add Item
                      </button>
                    </div>
                  </div>

                  {/* Languages */}
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">Spoken/Written Languages:</label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {resume.languages.map((lang, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-800 text-xs px-2 py-1 rounded-sm flex items-center gap-1">
                          {lang}
                          <button onClick={() => handleRemoveLanguage(idx)} className="text-red-400 font-bold ml-1 hover:text-red-600">
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        placeholder="e.g. French (Fluent)"
                        value={newLanguageText}
                        onChange={(e) => setNewLanguageText(e.target.value)}
                        className="flex-1 text-xs px-2 py-1 border border-slate-200 rounded-sm"
                      />
                      <button
                        onClick={handleAddLanguage}
                        className="bg-slate-800 hover:bg-slate-900 text-white text-xs px-2 rounded-sm font-semibold"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* References textbox */}
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">References Section text (Optional):</label>
                    <input
                      type="text"
                      value={resume.references}
                      onChange={(e) => setResume(prev => ({ ...prev, references: e.target.value }))}
                      placeholder="e.g. Available immediately upon professional team request."
                      className="w-full text-xs p-1.5 border border-slate-200 rounded-sm"
                    />
                  </div>

                </div>
              )}

            </div>
          )}

          {/* MAIN TAB AREA: 2. ATS SCANNER DIAGNOSTICS */}
          {activeTab === "analyze" && (
            <div id="tab-content-analyze" className="flex flex-col gap-4">
              
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <BadgeAlert className="text-teal-600 w-5 h-5" />
                  <span className="font-bold text-slate-900 text-base">Target Job Description Sync</span>
                </div>
                
                <p className="text-xs text-slate-500 leading-relaxed">
                  ATS parsers filter candidate records by comparing titles, tech verbs, and core criteria in job descriptions. Paste your target ad below and scan for compatibility score & keyword match flags immediately.
                </p>

                <textarea
                  id="target-job-description"
                  rows={6}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the target job description or core role expectations here..."
                  className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:border-teal-500 outline-hidden bg-slate-50 font-mono"
                />

                <button
                  id="btn-scan-ats"
                  disabled={isAnalyzing}
                  onClick={runAtsAnalysis}
                  className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-sm py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer pointer-events-auto"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Deconstructive Parsing of Skills...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Scan ATS Match & Compliancy Score
                    </>
                  )}
                </button>
              </div>

              {/* Parsing Results Panel */}
              {analysisResult && (
                <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col gap-5">
                  
                  {/* Score Indicator */}
                  <div className="flex items-center justify-between border-b pb-3.5">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">ATS Match Diagnostic Result</h4>
                      <p className="text-[10px] text-slate-500">Based on standard logical keyword densities</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="relative flex items-center justify-center">
                        {/* Circle meter */}
                        <svg className="w-14 h-14 transform -rotate-90">
                          <circle cx="28" cy="28" r="24" stroke="#f1f5f9" strokeWidth="4" fill="transparent" />
                          <circle cx="28" cy="28" r="24" stroke={analysisResult.atsScore >= 80 ? "#10b981" : analysisResult.atsScore >= 60 ? "#f59e0b" : "#ef4444"} strokeWidth="4" strokeDasharray={2 * Math.PI * 24} strokeDashoffset={2 * Math.PI * 24 * (1 - analysisResult.atsScore / 100)} fill="transparent" strokeLinecap="round" />
                        </svg>
                        <span className="absolute text-sm font-extrabold text-slate-950">
                          {analysisResult.atsScore}%
                        </span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">
                          {analysisResult.atsScore >= 80 ? "🎯 Exceptional Match Rate" : analysisResult.atsScore >= 60 ? "⚠️ Fair Match Rate" : "🚨 Poor Optimization"}
                        </div>
                        <p className="text-[9px] text-slate-400">Aim for &gt;85% for enterprise tools</p>
                      </div>
                    </div>
                  </div>

                  {/* Missing Vital Keywords */}
                  <div className="flex flex-col gap-1.5 animate-fadeIn">
                    <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Missing High-Leverage Keywords / Phrasing (Important):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {analysisResult.missingKeywords?.length === 0 ? (
                        <span className="text-xs text-green-600 font-semibold">✓ Absolute Keyword Match Achieved!</span>
                      ) : (
                        analysisResult.missingKeywords?.map((kw) => (
                          <button
                            key={kw}
                            onClick={() => addTechSkill(kw)}
                            title="Click to automatically inject into your technical skills"
                            className="bg-red-50 text-red-700 hover:bg-teal-50 hover:text-teal-800 hover:border-teal-300 font-mono text-[10px] sm:text-xs px-2 py-0.5 rounded-sm border border-red-100 flex items-center gap-1 pointer-events-auto cursor-pointer font-semibold transition-colors"
                          >
                            + {kw} 
                          </button>
                        ))
                      )}
                    </div>
                    {analysisResult.missingKeywords?.length > 0 && (
                      <p className="text-[9px] text-slate-400 mt-0.5">💡 Pro Tip: Click any missing keyword above to automatically inject it into your Skills tags list.</p>
                    )}
                  </div>

                  {/* Suggestions list */}
                  <div className="flex flex-col gap-1.5 border-t pt-3">
                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                      🛠️ Actionable Content & Bullet Revisions:
                    </span>
                    <ul className="flex flex-col gap-1.5 text-xs text-slate-600 list-disc pl-4 leading-relaxed">
                      {analysisResult.actionableSuggestions?.map((sug, i) => (
                        <li key={i}>{sug}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Design & Formatting warning indicators */}
                  <div className="flex flex-col gap-1.5 border-t pt-3 bg-slate-50 p-2.5 rounded-md">
                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle className="text-emerald-500 w-3.5 h-3.5" /> Formatting & Design Compliancy Audit:
                    </span>
                    <ul className="flex flex-col gap-1.5 text-[11px] text-slate-500 italic">
                      {analysisResult.formattingCritique?.map((crit, i) => (
                        <li key={i} className="flex items-center gap-1">
                          <Check className="text-emerald-500 w-3 h-3 flex-shrink-0" /> {crit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Praises */}
                  {analysisResult.praiseList?.length > 0 && (
                    <div className="border-t pt-3 text-xs">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">✓ Major Praise Metrics:</span>
                      <p className="text-slate-600 bg-emerald-50/70 p-2.5 border border-emerald-100 italic rounded-md">
                        {analysisResult.praiseList[0]}
                      </p>
                    </div>
                  )}

                </div>
              )}
            </div>
          )}

          {/* MAIN TAB AREA: 3. INTERACTIVE RECRUITER & CAREER COACH CHAT */}
          {activeTab === "chat" && (
            <div id="tab-content-chat" className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col h-[520px] shadow-sm">
              
              {/* Recruiter Header profile */}
              <div className="bg-slate-900 text-white p-3.5 flex items-center gap-2.5">
                <div className="bg-teal-500 text-slate-900 rounded-full h-8 w-8 flex items-center justify-center font-bold">
                  🤖
                </div>
                <div>
                  <h4 className="text-xs font-bold">Coach Helen, Recruiter Consultant</h4>
                  <p className="text-[10px] text-teal-400">Deep insight into ATS models & Technical Headhunting</p>
                </div>
              </div>

              {/* Chat messages viewport */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[85%] ${
                      msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
                    }`}
                  >
                    <div
                      className={`text-xs p-3 rounded-xl leading-relaxed ${
                        msg.role === "user"
                          ? "bg-teal-600 text-white rounded-tr-none"
                          : "bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-xs"
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
                  </div>
                ))}
                
                {isChatLoading && (
                  <div className="mr-auto max-w-[85%] items-start flex flex-col">
                    <div className="bg-white text-slate-800 border border-slate-200 p-2.5 px-3.5 rounded-xl rounded-tl-none flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                      <span className="text-[10px] text-slate-500 italic">Thinking and matching criteria...</span>
                    </div>
                  </div>
                )}
                
                <div ref={chatBottomRef} />
              </div>

              {/* Direct interactive quick prompts */}
              <div className="p-1 px-2 border-t border-slate-100 bg-slate-50 flex gap-1 items-center overflow-x-auto">
                <span className="text-[9px] text-slate-400 font-bold whitespace-nowrap uppercase">Ask Career Bot:</span>
                {[
                  "STAR practice",
                  "Explain React gap",
                  "Cert recommendation",
                ].map((qp) => (
                  <button
                    key={qp}
                    onClick={() => setChatInput(`Please help me with ${qp} for this job and resume combo.`)}
                    className="text-[9px] bg-white border border-slate-200 hover:bg-slate-100 rounded-full px-2 py-0.5 text-slate-600 font-medium whitespace-nowrap cursor-pointer pointer-events-auto"
                  >
                    {qp}
                  </button>
                ))}
              </div>

              {/* Chat Input form */}
              <form
                onSubmit={(e) => { e.preventDefault(); sendChatMessage(); }}
                className="p-2 border-t border-slate-200 bg-white flex items-center gap-1.5"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask Coach: 'How can I make my summary sound native to AWS?'"
                  className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-lg outline-hidden focus:border-teal-500"
                />
                <button
                  type="submit"
                  disabled={isChatLoading || !chatInput.trim()}
                  className="bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white p-2 rounded-lg cursor-pointer transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

            </div>
          )}

        </div>

        {/* Right Column: Premium live visual resume parser simulation preview */}
        <div id="preview-column" className="flex-1 flex flex-col gap-4">
          
          {/* Real-time Theme Controls */}
          <div className="bg-white border border-slate-200 p-3 rounded-xl flex flex-wrap items-center justify-between gap-3 no-print shadow-xs">
            
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Template Layout:</span>
              <div className="flex items-center gap-1">
                {[
                  { id: "modern", label: "Modern Tech" },
                  { id: "executive", label: "Executive Serif" },
                  { id: "editorial", label: "Minimal Editorial" },
                ].map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => setSelectedTemplate(tmpl.id as TemplateType)}
                    className={`text-xs px-2.5 py-1.2 rounded-md font-medium transition-all ${
                      selectedTemplate === tmpl.id 
                        ? "bg-slate-800 text-white shadow-xs" 
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    {tmpl.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              id="btn-print"
              onClick={() => window.print()}
              className="bg-slate-900 border border-slate-800 text-white hover:bg-slate-800 text-xs px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer pointer-events-auto"
            >
              <Printer className="w-4 h-4" /> Print / Save to PDF
            </button>

          </div>

          <div className="text-slate-500 text-[11px] mb-1 leading-relaxed bg-teal-50 border border-teal-100 p-2.5 rounded-lg no-print flex items-start gap-1.5">
            <CheckCircle className="text-teal-600 w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-teal-900">High-Fidelity PDF Generation Tip:</strong> Under Chrome or Edge print controls, choose <strong className="text-teal-900">"Save as PDF"</strong>, set layout to <strong className="text-teal-900">"Portrait"</strong>, and make sure to check/uncheck **"Background graphics"** as preferred to print clean watermarks & visual dividers beautifully.
            </div>
          </div>

          {/* PAPER CONTAINER CANVAS SHEET */}
          <div 
            id="resume-canvas-sheet"
            className="bg-white rounded-lg shadow-xl border border-slate-250 p-8 sm:p-12 mx-auto w-full max-w-[816px] min-h-[1054px] transition-all relative overflow-hidden resume-print-container"
          >
            
            {/* INLINE AI BULLET REFINEMENT OVERLAY (Non-distracting, directly inline for extreme comfort) */}
            {refiningTarget && (
              <div className="absolute inset-0 bg-white/95 z-30 p-6 sm:p-10 flex flex-col justify-center animate-fadeIn no-print">
                <div className="max-w-xl mx-auto w-full bg-slate-50 border border-slate-200 rounded-xl p-5 sm:p-7 shadow-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-[10px] bg-teal-600 text-white font-bold p-1 px-2 rounded-md uppercase">AI Resume Refiner Mode</span>
                      <h3 className="text-base font-bold text-slate-900 mt-1">Convert descriptive wins into high-leverage metric stats</h3>
                    </div>
                    <button 
                      onClick={() => setRefiningTarget(null)} 
                      className="text-slate-400 hover:text-slate-800 text-lg font-bold p-1 rounded-sm cursor-pointer"
                    >
                      &times;
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Your Original Description:</label>
                      <p className="text-xs bg-slate-100 p-3 rounded-md italic text-slate-700 font-mono border">
                        {refiningTarget.originalText || "(Empty)"}
                      </p>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                        Optional Target Guidance / Specific context to inject:
                      </label>
                      <input
                        type="text"
                        value={refiningTarget.note}
                        onChange={(e) => setRefiningTarget(prev => prev ? { ...prev, note: e.target.value } : null)}
                        placeholder="e.g. Highlight AWS costs slash or React speed metric"
                        className="w-full text-xs p-2 border border-slate-300 rounded-sm bg-white"
                      />
                    </div>

                    <button
                      onClick={triggerAiRefinement}
                      disabled={isRefining}
                      className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-5 w-full text-white font-bold text-xs py-2 px-3 rounded-md flex items-center justify-center gap-1.5"
                    >
                      {isRefining ? "Interrogating model..." : "✨ Orchestrate High-Impact Bullet"}
                    </button>

                    {refineFeedback && (
                      <p className="text-[11px] text-teal-700 italic bg-teal-50 p-2 rounded-sm text-center border font-mono">
                        {refineFeedback}
                      </p>
                    )}

                    {refinedResultText && (
                      <div className="bg-emerald-50/70 border border-emerald-200 p-3 rounded-md">
                        <label className="block text-[10px] font-bold text-emerald-800 uppercase mb-1">Optimized ATS Output Suggestion:</label>
                        <p className="text-xs text-slate-900 leading-relaxed font-mono font-medium">
                          {refinedResultText}
                        </p>
                        <div className="flex gap-2 justify-end mt-3">
                          <button
                            onClick={() => setRefiningTarget(null)}
                            className="text-xs text-slate-600 font-medium px-2 py-1 bg-white border rounded-sm"
                          >
                            Discard
                          </button>
                          <button
                            onClick={applyRefinement}
                            className="text-xs text-white bg-slate-900 border font-bold px-3 py-1 rounded-sm bg-teal-700 hover:bg-teal-800 flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" /> Replace Original description
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TEMPLATE DESTRUCT: MODERN SLATE TECH */}
            {selectedTemplate === "modern" && (
              <div className="flex flex-col gap-6 text-slate-800 font-sans">
                
                {/* Header segment */}
                <div className="border-b-2 border-slate-950 pb-5 flex flex-col md:flex-row justify-between items-start gap-4">
                  <div>
                    <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight uppercase">
                      {resume.fullName || "Your Full Name"}
                    </h2>
                    <h3 className="text-base font-semibold text-teal-700 tracking-wide mt-0.5">
                      {resume.targetRole || "Desired Professional Designation"}
                    </h3>
                  </div>

                  {/* Contact details list in columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-slate-600 font-medium">
                    {resume.contact.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-slate-400" /> {resume.contact.email}
                      </span>
                    )}
                    {resume.contact.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-slate-400" /> {resume.contact.phone}
                      </span>
                    )}
                    {resume.contact.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {resume.contact.location}
                      </span>
                    )}
                    {resume.contact.linkedin && (
                      <span className="flex items-center gap-1">
                        <Linkedin className="w-3.5 h-3.5 text-slate-400" /> {resume.contact.linkedin}
                      </span>
                    )}
                    {resume.contact.portfolio && (
                      <span className="flex items-center gap-1 col-span-1 sm:col-span-2">
                        <Globe className="w-3.5 h-3.5 text-slate-400" /> {resume.contact.portfolio}
                      </span>
                    )}
                  </div>
                </div>

                {/* Sub: Objective if toggled */}
                {resume.showObjective && resume.careerObjective && (
                  <div className="print-avoid-break">
                    <h4 className="text-xs font-bold text-slate-950 uppercase tracking-widest border-b border-slate-200 pb-1 mb-1.5">
                      Career Objective
                    </h4>
                    <p className="text-[11px] sm:text-[12px] leading-relaxed text-slate-755 text-justify italic font-serif">
                      "{resume.careerObjective}"
                    </p>
                  </div>
                )}

                {/* Sub: Executive Summary */}
                {resume.professionalSummary && (
                  <div className="print-avoid-break">
                    <h4 className="text-xs font-bold text-slate-950 uppercase tracking-widest border-b border-slate-200 pb-1 mb-1.5">
                      Professional Overview
                    </h4>
                    <p className="text-[11.5px] sm:text-[12.5px] leading-relaxed text-slate-700 text-justify">
                      {resume.professionalSummary}
                    </p>
                  </div>
                )}

                {/* Technical Skills & Soft Grid */}
                {(resume.technicalSkills.length > 0 || resume.softSkills.length > 0) && (
                  <div className="print-avoid-break">
                    <h4 className="text-xs font-bold text-slate-950 uppercase tracking-widest border-b border-slate-200 pb-1 mb-2">
                      Expertise Stack & Competencies
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 text-[11px] sm:text-[12px]">
                      {resume.technicalSkills.length > 0 && (
                        <div className="md:col-span-8">
                          <strong className="text-slate-900 block mb-0.5 uppercase text-[10px] tracking-wider">Functional Tools & Code Frameworks:</strong>
                          <p className="text-slate-700 leading-relaxed max-w-full">
                            {resume.technicalSkills.join("  •  ")}
                          </p>
                        </div>
                      )}
                      
                      {resume.softSkills.length > 0 && (
                        <div className="md:col-span-4 border-l border-slate-200 pl-3.5">
                          <strong className="text-slate-900 block mb-0.5 uppercase text-[10px] tracking-wider">Methodologies:</strong>
                          <p className="text-slate-600 italic">
                            {resume.softSkills.join(", ")}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Pro Experience */}
                {resume.experience.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-950 uppercase tracking-widest border-b border-slate-200 pb-1 mb-3">
                      Professional Experience
                    </h4>
                    <div className="space-y-4">
                      {resume.experience.map((exp) => (
                        <div key={exp.id} className="print-avoid-break">
                          <div className="flex justify-between items-baseline">
                            <h5 className="text-[12px] sm:text-[13px] font-bold text-slate-950">
                              {exp.role} <span className="text-slate-400 font-normal">|</span> <span className="text-teal-800 font-semibold">{exp.company}</span>
                            </h5>
                            <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                              {exp.startDate} – {exp.endDate}
                            </span>
                          </div>
                          
                          {exp.location && (
                            <span className="text-[10px] text-slate-400 font-medium tracking-wide block mb-1">{exp.location}</span>
                          )}

                          {/* Render multiline bullet points cleanly */}
                          <div className="text-[11px] sm:text-[12px] text-slate-700 leading-relaxed pl-1 space-y-1 mt-1">
                            {exp.description.split("\n").map((line, lIdx) => {
                              const cleanedLine = line.trim();
                              if (!cleanedLine) return null;
                              const visibleText = cleanedLine.startsWith("•") || cleanedLine.startsWith("-") 
                                ? cleanedLine.substring(1).trim() 
                                : cleanedLine;
                              return (
                                <div key={lIdx} className="flex items-start gap-1.5 p-0.5">
                                  <span className="text-teal-700 flex-shrink-0 mt-1 text-[10px]">■</span>
                                  <span>{visibleText}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects */}
                {resume.projects.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-950 uppercase tracking-widest border-b border-slate-200 pb-1 mb-3">
                      Selected High-Impact Deployments
                    </h4>
                    <div className="space-y-3.5">
                      {resume.projects.map((proj) => (
                        <div key={proj.id} className="print-avoid-break">
                          <div className="flex justify-between items-baseline">
                            <h5 className="text-[11.5px] sm:text-[12.5px] font-bold text-slate-950 flex items-center gap-1">
                              {proj.title}
                              {proj.link && (
                                <span className="text-[10px] text-slate-400 font-normal italic">({proj.link})</span>
                              )}
                            </h5>
                            <span className="text-[10px] font-mono font-medium text-slate-500 bg-slate-100 p-0.5 px-2 rounded-xs">
                              {proj.technologies}
                            </span>
                          </div>
                          <p className="text-[11px] sm:text-[12px] text-slate-600 mt-1 leading-relaxed pl-3.5 border-l border-slate-200">
                            {proj.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Academic Background */}
                {resume.education.length > 0 && (
                  <div className="print-avoid-break">
                    <h4 className="text-xs font-bold text-slate-950 uppercase tracking-widest border-b border-slate-200 pb-1 mb-2.5">
                      Education & Training
                    </h4>
                    <div className="space-y-2.5">
                      {resume.education.map((edu) => (
                        <div key={edu.id} className="flex justify-between items-start text-[11px] sm:text-[12px]">
                          <div>
                            <strong className="text-slate-900">{edu.degree}</strong>
                            <div className="text-slate-500 font-medium">
                              {edu.institution}{edu.location ? `, ${edu.location}` : ""}
                            </div>
                            {edu.description && (
                              <p className="text-[10.5px] italic text-slate-400 mt-0.5">{edu.description}</p>
                            )}
                          </div>
                          <div className="text-right flex flex-col justify-between">
                            <span className="font-semibold text-slate-600 text-[10px] tracking-wider uppercase">{edu.graduationDate}</span>
                            {edu.gpaOrHonors && (
                              <span className="text-[10px] text-teal-800 font-bold mt-1 bg-teal-50 px-1 inline-block rounded-xs">{edu.gpaOrHonors}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Row of certifications and achievements side by side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print-avoid-break border-t pt-3">
                  
                  {/* Certifications and Languages */}
                  {((resume.certifications && resume.certifications.length > 0) || resume.languages.length > 0) && (
                    <div className="space-y-2">
                      {resume.certifications && resume.certifications.length > 0 && (
                        <div>
                          <strong className="text-[10px] font-extrabold uppercase text-slate-800 tracking-wider">Credential Licensing:</strong>
                          <ul className="text-[11px] text-slate-600 list-inside space-y-0.5 mt-0.5">
                            {resume.certifications.map((c) => (
                              <li key={c.id}>• {c.name} ({c.issuer}) - <span className="font-semibold text-slate-400">{c.date}</span></li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {resume.languages.length > 0 && (
                        <div>
                          <strong className="text-[10px] font-extrabold uppercase text-slate-800 tracking-wider">Languages:</strong>
                          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                            {resume.languages.join("  |  ")}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Achievements */}
                  {resume.achievements.length > 0 && (
                    <div>
                      <strong className="text-[10px] font-extrabold uppercase text-slate-800 tracking-wider">Peer Distinctions:</strong>
                      <ul className="text-[11px] text-slate-600 space-y-1 list-disc pl-4 mt-0.5">
                        {resume.achievements.map((ach, idx) => (
                          <li key={idx} className="leading-relaxed">{ach}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* References */}
                {resume.references && (
                  <div className="text-center border-t pt-3.5 text-[10px] text-slate-400 uppercase tracking-widest font-medium print-avoid-break">
                    {resume.references}
                  </div>
                )}

              </div>
            )}

            {/* TEMPLATE DESTRUCT: EXECUTIVE SERIF */}
            {selectedTemplate === "executive" && (
              <div className="flex flex-col gap-5 text-slate-900 font-serif">
                
                {/* Clean Centered Title block */}
                <div className="text-center flex flex-col items-center border-b pb-4">
                  <h2 className="text-3xl font-extrabold uppercase tracking-widest text-slate-950 font-serif">
                    {resume.fullName || "Your Full Name"}
                  </h2>
                  <h3 className="text-sm font-semibold tracking-wider text-slate-600 uppercase mt-1">
                    {resume.targetRole || "DESIRED TITLE"}
                  </h3>
                  
                  {/* Inline list */}
                  <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-2.5 font-medium">
                    {resume.contact.email && <span>{resume.contact.email}</span>}
                    {resume.contact.phone && <span>• {resume.contact.phone}</span>}
                    {resume.contact.location && <span>• {resume.contact.location}</span>}
                    {resume.contact.linkedin && <span>• {resume.contact.linkedin}</span>}
                    {resume.contact.portfolio && <span className="col-span-full font-mono block mt-0.5">{resume.contact.portfolio}</span>}
                  </div>
                </div>

                {/* Objective details */}
                {resume.showObjective && resume.careerObjective && (
                  <div className="print-avoid-break">
                    <h4 className="text-[11.5px] font-extrabold uppercase tracking-widest text-slate-950 border-b border-slate-350 pb-0.5 mb-1.5">
                      Career Objective
                    </h4>
                    <p className="text-[11px] sm:text-[12px] leading-relaxed text-slate-700 italic text-justify">
                      {resume.careerObjective}
                    </p>
                  </div>
                )}

                {/* Summary */}
                {resume.professionalSummary && (
                  <div className="print-avoid-break">
                    <h4 className="text-[11.5px] font-extrabold uppercase tracking-widest text-slate-950 border-b border-slate-350 pb-0.5 mb-1.5">
                      Executive Profile
                    </h4>
                    <p className="text-[11px] sm:text-[12.5px] leading-relaxed text-slate-850 text-justify">
                      {resume.professionalSummary}
                    </p>
                  </div>
                )}

                {/* Master Grid Skills layout */}
                {resume.technicalSkills.length > 0 && (
                  <div className="print-avoid-break">
                    <h4 className="text-[11.5px] font-extrabold uppercase tracking-widest text-slate-950 border-b border-slate-350 pb-0.5 mb-1.5">
                      Competency Track
                    </h4>
                    <p className="text-[11px] sm:text-[12px] text-slate-700 leading-relaxed font-sans">
                      <strong>Core Hard Stack:</strong> {resume.technicalSkills.join("  |  ")}
                      {resume.softSkills.length > 0 && (
                        <span><br /><strong>Functional Practices:</strong> {resume.softSkills.join(", ")}</span>
                      )}
                    </p>
                  </div>
                )}

                {/* History */}
                {resume.experience.length > 0 && (
                  <div>
                    <h4 className="text-[11.5px] font-extrabold uppercase tracking-widest text-slate-950 border-b border-slate-350 pb-0.5 mb-2.5">
                      Signature Contributions
                    </h4>
                    <div className="space-y-4">
                      {resume.experience.map((exp) => (
                        <div key={exp.id} className="print-avoid-break">
                          <div className="flex justify-between items-baseline">
                            <h5 className="text-[12px] sm:text-[13px] font-extrabold text-slate-900 font-serif">
                              {exp.role} <span className="font-normal italic">at</span> {exp.company}
                            </h5>
                            <span className="text-[10.5px] font-semibold text-slate-600">
                              {exp.startDate} – {exp.endDate}
                            </span>
                          </div>
                          
                          {exp.location && (
                            <span className="text-[10px] text-slate-500 tracking-wide font-sans block mb-1">{exp.location}</span>
                          )}

                          <div className="text-[11px] sm:text-[12px] text-slate-700 leading-relaxed pl-2 space-y-1 font-serif">
                            {exp.description.split("\n").map((line, lIdx) => {
                              const cleanedLine = line.trim();
                              if (!cleanedLine) return null;
                              const textOnly = cleanedLine.startsWith("•") || cleanedLine.startsWith("-") 
                                ? cleanedLine.substring(1).trim() 
                                : cleanedLine;
                              return (
                                <div key={lIdx} className="flex items-start gap-2">
                                  <span className="text-slate-900">•</span>
                                  <span>{textOnly}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects */}
                {resume.projects.length > 0 && (
                  <div>
                    <h4 className="text-[11.5px] font-extrabold uppercase tracking-widest text-slate-950 border-b border-slate-350 pb-0.5 mb-2">
                      Selected Projects & Deployments
                    </h4>
                    <div className="space-y-2.5">
                      {resume.projects.map((p) => (
                        <div key={p.id} className="print-avoid-break text-[11px] sm:text-[12px]">
                          <div className="flex justify-between items-baseline">
                            <strong className="text-slate-900">{p.title}</strong>
                            <span className="text-[10px] text-slate-500 font-mono">({p.technologies})</span>
                          </div>
                          <p className="text-slate-650 italic mt-0.5">{p.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {resume.education.length > 0 && (
                  <div className="print-avoid-break">
                    <h4 className="text-[11.5px] font-extrabold uppercase tracking-widest text-slate-950 border-b border-slate-350 pb-0.5 mb-2">
                      Education
                    </h4>
                    <div className="space-y-2.5">
                      {resume.education.map((edu) => (
                        <div key={edu.id} className="text-[11px] sm:text-[12px] flex justify-between">
                          <div>
                            <strong>{edu.degree}</strong> - <span className="text-slate-600">{edu.institution}</span>
                            {edu.gpaOrHonors && <span className="text-slate-500 block text-[10px]">{edu.gpaOrHonors}</span>}
                          </div>
                          <span className="text-[10px] font-bold text-slate-500">{edu.graduationDate}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Distinctions Footer */}
                {resume.achievements.length > 0 && (
                  <div className="print-avoid-break border-t pt-3 text-[11px] text-slate-700">
                    <strong>Honors & Contributions: </strong>
                    <span>{resume.achievements.join("; ")}</span>
                  </div>
                )}

              </div>
            )}

            {/* TEMPLATE DESTRUCT: MINIMAL EDITORIAL */}
            {selectedTemplate === "editorial" && (
              <div className="flex flex-col gap-6 text-slate-800 font-sans tracking-tight">
                
                {/* Horizontal grid bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-slate-300 pb-5">
                  <div className="md:col-span-2">
                    <h2 className="text-3xl font-bold text-slate-900 uppercase">
                      {resume.fullName || "Your Full Name"}
                    </h2>
                    <h3 className="text-sm tracking-wider font-semibold text-slate-500 uppercase mt-0.5">
                      {resume.targetRole || "Desired Professional Designation"}
                    </h3>
                  </div>

                  <div className="text-left md:text-right text-[11px] text-slate-500 font-medium space-y-0.5">
                    {resume.contact.email && <p>{resume.contact.email}</p>}
                    {resume.contact.phone && <p>{resume.contact.phone}</p>}
                    {resume.contact.location && <p>{resume.contact.location}</p>}
                    {resume.contact.linkedin && <p>{resume.contact.linkedin}</p>}
                    {resume.contact.portfolio && <p className="font-mono text-[10px]">{resume.contact.portfolio}</p>}
                  </div>
                </div>

                {/* Left Header columns layout */}
                <div className="space-y-5">
                  
                  {/* Summary */}
                  {resume.professionalSummary && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 print-avoid-break">
                      <div className="md:col-span-1">
                        <span className="text-[10px] font-extrabold uppercase text-slate-900 tracking-wider">Overview</span>
                      </div>
                      <div className="md:col-span-3 text-[11.5px] sm:text-[12.5px] leading-relaxed text-slate-700">
                        {resume.professionalSummary}
                      </div>
                    </div>
                  )}

                  {/* Objective */}
                  {resume.showObjective && resume.careerObjective && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 print-avoid-break border-t pt-2">
                      <div className="md:col-span-1">
                        <span className="text-[10px] font-extrabold uppercase text-slate-900 tracking-wider">Target Objective</span>
                      </div>
                      <div className="md:col-span-3 text-[11px] sm:text-[12px] leading-relaxed italic text-slate-600">
                        {resume.careerObjective}
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {resume.technicalSkills.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 print-avoid-break border-t pt-2">
                      <div className="md:col-span-1">
                        <span className="text-[10px] font-extrabold uppercase text-slate-900 tracking-wider">Capabilities</span>
                      </div>
                      <div className="md:col-span-3 text-[11px] sm:text-[12px] text-slate-700 space-y-1">
                        <p><strong>Technical:</strong> {resume.technicalSkills.join(" / ")}</p>
                        {resume.softSkills.length > 0 && (
                          <p><strong>Strategic:</strong> {resume.softSkills.join(", ")}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Experience */}
                  {resume.experience.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 border-t pt-3">
                      <div className="md:col-span-1">
                        <span className="text-[10px] font-extrabold uppercase text-slate-900 tracking-wider">Experience</span>
                      </div>
                      <div className="md:col-span-3 space-y-4">
                        {resume.experience.map((exp) => (
                          <div key={exp.id} className="print-avoid-break">
                            <div className="flex justify-between items-baseline">
                              <h5 className="text-[12px] font-bold text-slate-900">
                                {exp.role} <span className="text-slate-400 font-light">@</span> {exp.company}
                              </h5>
                              <span className="text-[10px] text-slate-500 font-semibold">{exp.startDate} – {exp.endDate}</span>
                            </div>
                            
                            {/* Lines */}
                            <div className="text-[11px] sm:text-[11.5px] text-slate-600 space-y-1 mt-1.5 list-disc pl-3">
                              {exp.description.split("\n").map((line, lIdx) => {
                                const clean = line.trim();
                                if (!clean) return null;
                                const text = clean.startsWith("•") || clean.startsWith("-") ? clean.substring(1).trim() : clean;
                                return (
                                  <p key={lIdx} className="bullet-item">
                                    • {text}
                                  </p>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {resume.education.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 border-t pt-3 print-avoid-break">
                      <div className="md:col-span-1">
                        <span className="text-[10px] font-extrabold uppercase text-slate-900 tracking-wider">Education</span>
                      </div>
                      <div className="md:col-span-3 space-y-2 text-[11px] sm:text-[12px]">
                        {resume.education.map((edu) => (
                          <div key={edu.id} className="flex justify-between">
                            <div>
                              <strong>{edu.degree}</strong>
                              <p className="text-slate-500">{edu.institution}</p>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400">{edu.graduationDate}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

              </div>
            )}

            {/* Simulated Watermark indicating ATS compliance alignment */}
            <div className="mt-8 border-t border-slate-100 pt-3 text-center text-[9px] text-slate-350 select-none pointer-events-none no-print uppercase tracking-widest flex items-center justify-center gap-1">
              <Check className="w-3 h-3 text-emerald-400" /> Standard A4 Print Margins Set • Optimized for Automated Parse Scan Engines
            </div>

          </div>

        </div>

      </div>

      {/* Footer bar */}
      <footer className="bg-slate-900 text-slate-400 py-6 text-center text-xs mt-12 border-t border-slate-800 no-print">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p>© 2026 ATS Resume Architect. Powered by Google Gemini-3.5-flash content generation.</p>
          <p className="text-[10px] text-slate-600">
            For ideal output, prioritize clear numeric metrics on all work items and avoid text inside graphic shapes/columns.
          </p>
        </div>
      </footer>

    </div>
  );
}
