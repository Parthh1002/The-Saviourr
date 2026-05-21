import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/saviour/Nav";
import { Hero } from "@/components/saviour/Hero";
import { Collage } from "@/components/saviour/Collage";
import { Story } from "@/components/saviour/Story";
import { Features } from "@/components/saviour/Features";
import { Dataset } from "@/components/saviour/Dataset";
import { Methodology } from "@/components/saviour/Methodology";
import { Detection } from "@/components/saviour/Detection";
import { Alerts } from "@/components/saviour/Alerts";
import { Analytics } from "@/components/saviour/Analytics";
import { OfficerLogin } from "@/components/saviour/OfficerLogin";
import { Future } from "@/components/saviour/Future";
import { Impact, Enter } from "@/components/saviour/Impact";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="relative bg-background text-foreground">
      <Nav />
      <Hero />
      <Collage />
      <Story />
      <Features />
      <Dataset />
      <Methodology />
      <Detection />
      <Alerts />
      <Analytics />
      <OfficerLogin />
      <Future />
      <Impact />
      <Enter />
    </main>
  );
}
