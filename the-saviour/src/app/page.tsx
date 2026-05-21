"use client";

import { Nav } from "@/components/saviour/Nav";
import { Hero } from "@/components/saviour/Hero";
import { VideoFrame } from "@/components/saviour/VideoFrame";
import { Collage } from "@/components/saviour/Collage";
import { Story } from "@/components/saviour/Story";
import { Features } from "@/components/saviour/Features";
import { Dataset } from "@/components/saviour/Dataset";
import { Methodology } from "@/components/saviour/Methodology";
import { Detection } from "@/components/saviour/Detection";
import { Alerts } from "@/components/saviour/Alerts";
import { Analytics } from "@/components/saviour/Analytics";
import { OfficerLogin } from "@/components/saviour/OfficerLogin";
import { RegistrationCTA } from "@/components/saviour/RegistrationCTA";
import { Future } from "@/components/saviour/Future";
import { Chapter10 } from "@/components/saviour/Chapter10";
import { Impact, Enter } from "@/components/saviour/Impact";
import { FAQ } from "@/components/saviour/FAQ";
import { IntroLoader } from "@/components/saviour/IntroLoader";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <IntroLoader key="loader" />}
      </AnimatePresence>
      
      <main className="relative bg-background text-foreground min-h-screen font-body selection:bg-primary/20 selection:text-primary">
        <Nav />
        <Hero />
        <VideoFrame />
        <Collage />
        <Story />
        <Features />
        <Dataset />
        <Methodology />
        <Detection />
        <Alerts />
        <Analytics />
        <OfficerLogin />
        <RegistrationCTA />
        <FAQ />
        <Future />
        <Chapter10 />
        <Impact />
        <Enter />
      </main>
    </>
  );
}
