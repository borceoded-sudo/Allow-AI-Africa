import { SiteNav } from "@/components/layout/SiteNav";
import { StackFit } from "@/components/layout/StackFit";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Solutions } from "@/components/sections/Solutions";
import { Technology } from "@/components/sections/Technology";
import { Programs } from "@/components/sections/Programs";
import { Impact } from "@/components/sections/Impact";
import { Leadership } from "@/components/sections/Leadership";
import { Voices } from "@/components/sections/Voices";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

/**
 * Panel order matters twice over: it is the narrative order of the page, and
 * the `index` passed to each Panel becomes its z-index, which is what makes
 * each section scroll up and over the one before it.
 */
export default function Home() {
  return (
    <>
      <SiteNav />
      <StackFit />

      <main className="relative">
        <Hero index={1} />
        <About index={2} />
        <Solutions index={3} />
        <Technology index={4} />
        <Programs index={5} />
        <Impact index={6} />
        <Leadership index={7} />
        <Voices index={8} />
        <CaseStudies index={9} />
        <Faq index={10} />
        <Contact index={11} />
        <Footer index={12} />
      </main>
    </>
  );
}
