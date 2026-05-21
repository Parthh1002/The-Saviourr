"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";

const FAQS = [
  {
    question: "How does the AI detection work?",
    answer: "Our system uses advanced deep learning models to analyze video feeds from thermal and standard cameras in real-time. It accurately classifies objects into humans, animals (by species), and vehicles, operating with high precision even in low-light conditions."
  },
  {
    question: "What happens when a poaching threat is detected?",
    answer: "The moment a threat is identified, the system logs the event and instantly triggers a multi-channel alert protocol. The Command Center dashboard flashes a red warning, and designated officers receive immediate email and mobile notifications with the exact GPS coordinates."
  },
  {
    question: "How are forest officers alerted?",
    answer: "Officers are notified via instantaneous secure email alerts, on-screen dashboard notifications, and mobile alerts. The system ensures that critical information, including visual evidence and location data, reaches the rapid response teams without delay."
  },
  {
    question: "Is the system active 24/7?",
    answer: "Yes. The Saviour platform is designed for continuous, uninterrupted surveillance. Our integrated thermal night-vision capabilities ensure that monitoring remains fully effective even in complete darkness."
  }
];

export function FAQ() {
  const ref = useReveal<HTMLDivElement>();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative py-24 px-6 overflow-hidden bg-background">
      <div ref={ref} className="reveal mx-auto max-w-3xl">
        <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-[0.3em] text-neon/80 mb-6 justify-center">
          <span className="w-12 h-px bg-neon/40" />
          Frequently Asked Questions
          <span className="w-12 h-px bg-neon/40" />
        </div>
        
        <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight text-center mb-12">
          Understanding <span className="text-shimmer">The Saviour</span>.
        </h2>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div 
              key={idx} 
              className="border border-border rounded-2xl bg-panel overflow-hidden transition-all duration-300 hover:border-primary/30 shadow-sm"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="font-medium text-foreground text-lg">{faq.question}</span>
                <span className="ml-4 flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                  <motion.div
                    animate={{ rotate: openIndex === idx ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </span>
              </button>
              
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-5 pt-1 text-muted-foreground leading-relaxed border-t border-border/50">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
