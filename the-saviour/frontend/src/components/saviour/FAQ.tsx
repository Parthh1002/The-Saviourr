"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, ShieldAlert, Cpu, Radio, Sparkles, MessageCircle, ArrowRight } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";

type FAQItem = {
  id: string;
  category: "ai" | "alerts" | "hardware" | "security";
  categoryLabel: string;
  question: string;
  answer: string;
  badgeColor: string;
};

const FAQS: FAQItem[] = [
  {
    id: "faq-1",
    category: "ai",
    categoryLabel: "AI & Vision Engine",
    question: "How does YOLOv8 object detection classify poachers, weapons, and wildlife in real time?",
    answer: "Our custom-trained YOLOv8 neural network processes surveillance feeds frame-by-frame at sub-200ms speeds. It detects bounding boxes and classifies entities into distinct categories (e.g., Poachers, Firearms, Vehicles, Tigers, Elephants, Rhinos) with high-confidence probability scoring.",
    badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
  },
  {
    id: "faq-2",
    category: "alerts",
    categoryLabel: "Alerts & SOS Engine",
    question: "What automated protocol triggers the instant a critical intrusion or weapon is identified?",
    answer: "When a threat passes the confidence threshold (>90%), the system instantly logs the incident in MongoDB Atlas, broadcasts a WebSocket alert to all Ranger Command Dashboards, triggers the Emergency Siren, and sends automated Gmail OTP & email notifications with exact Leaflet GIS coordinates.",
    badgeColor: "bg-red-500/10 text-red-600 border-red-500/20"
  },
  {
    id: "faq-3",
    category: "hardware",
    categoryLabel: "Field Hardware & Mesh",
    question: "Can camera traps process AI feeds offline in deep jungle reserves without internet?",
    answer: "Yes! Edge AI nodes process video streams locally on field hardware. If satellite or cellular connection drops, detection logs are saved in encrypted local storage and automatically synchronized to the cloud mesh as soon as network signal is restored.",
    badgeColor: "bg-blue-500/10 text-blue-600 border-blue-500/20"
  },
  {
    id: "faq-4",
    category: "alerts",
    categoryLabel: "Alerts & SOS Engine",
    question: "How do field rangers receive live alerts on mobile devices while patrolling?",
    answer: "Rangers receive multi-channel alerts (SMS, email, and Web App push notifications) containing live threat severity, camera ID, species or intruder status, and direct GIS location markers for immediate field deployment.",
    badgeColor: "bg-amber-500/10 text-amber-600 border-amber-500/20"
  },
  {
    id: "faq-5",
    category: "ai",
    categoryLabel: "AI & Vision Engine",
    question: "Can custom trained YOLO models be updated for new endangered species or weapons?",
    answer: "Absolutely. The Saviour platform supports a Google Colab GPU training pipeline. You can annotate custom dataset images, train YOLOv8 weights on T4/A100 GPUs, and seamlessly hot-swap the exported best.pt model into the FastAPI inference engine.",
    badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
  },
  {
    id: "faq-6",
    category: "security",
    categoryLabel: "Security & Auth",
    question: "Is officer access secured with role-based permissions and encrypted tokens?",
    answer: "Yes. We enforce enterprise Role-Based Access Control (Command Officers vs Field Ops vs Public Viewers) backed by JWT tokens, Bcrypt password hashing, Gmail OTP verification, and Firebase Auth security rules.",
    badgeColor: "bg-purple-500/10 text-purple-600 border-purple-500/20"
  }
];

const CATEGORIES = [
  { id: "all", label: "All Questions", icon: HelpCircle },
  { id: "ai", label: "AI & Vision Engine", icon: Cpu },
  { id: "alerts", label: "Alerts & SOS Engine", icon: ShieldAlert },
  { id: "hardware", label: "Field Hardware", icon: Radio },
  { id: "security", label: "Security & Auth", icon: Sparkles }
];

export function FAQ() {
  const ref = useReveal<HTMLDivElement>();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [openId, setOpenId] = useState<string | null>("faq-1");

  const filteredFaqs = activeTab === "all" 
    ? FAQS 
    : FAQS.filter(item => item.category === activeTab);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="relative py-12 md:py-20 px-4 sm:px-6 overflow-hidden bg-background">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div ref={ref} className="reveal mx-auto max-w-4xl relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-[11px] font-mono uppercase tracking-[0.3em] mb-4">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Knowledge Base & Intelligence FAQ
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
            Frequently Asked <span className="text-shimmer">Questions</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Everything you need to know about <strong className="text-foreground">The Saviour</strong> AI vision architecture, real-time alert dispatch, and field deployment.
          </p>
        </div>

        {/* Filter Category Chips */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all duration-300 border active:scale-95 ${
                  isActive
                    ? "bg-primary text-white border-primary shadow-[0_4px_20px_rgba(0,112,60,0.3)] scale-105"
                    : "bg-panel text-secondary border-border hover:border-primary/30 hover:text-foreground hover:bg-primary/5"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Accordions List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <motion.div
                  key={faq.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className={`glass rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen 
                      ? "border-primary/40 shadow-[0_10px_30px_rgba(0,112,60,0.12)] bg-white/95" 
                      : "border-border/70 hover:border-primary/30"
                  }`}
                >
                  <button
                    onClick={() => toggle(faq.id)}
                    className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left transition-colors focus:outline-none"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border ${faq.badgeColor}`}>
                        {faq.categoryLabel}
                      </span>
                      <span className="font-semibold text-foreground text-base sm:text-lg tracking-tight">
                        {faq.question}
                      </span>
                    </div>
                    
                    <div className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                      isOpen ? "bg-primary text-white rotate-180" : "bg-primary/10 text-primary"
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="px-6 pb-6 pt-2 text-muted-foreground text-sm sm:text-base leading-relaxed border-t border-border/40 font-normal">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Bottom Help Box */}
        <div className="mt-10 glass rounded-2xl p-6 sm:p-8 text-center border border-primary/20 bg-gradient-to-r from-primary/5 via-panel to-primary/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="font-bold text-base text-foreground flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Have more questions about installation or API integration?
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              Read our full System Architecture or log into the Command Center for live documentation.
            </p>
          </div>
          <a
            href="/login"
            className="shrink-0 px-6 py-3 rounded-xl bg-primary text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-primary/90 transition-all flex items-center gap-2 shadow-md active:scale-95"
          >
            Access Platform Docs <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
}
