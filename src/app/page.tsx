import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Work } from '@/components/sections/Work';
import { Services } from '@/components/sections/Services';
import { Process } from '@/components/sections/Process';
import { Contact } from '@/components/sections/Contact';
import { Testimonials } from '@/components/sections/Testimonials';
import { FAQ } from '@/components/sections/FAQ';
import { Clients } from '@/components/sections/Clients';
import { Navbar } from '@/components/ui/Navbar';

export default function Home() {
  return (
    <main className="min-h-screen bg-background selection:bg-black selection:text-white">
      <Navbar />
      <Hero />
      <About />
      <Work />
      <Clients />
      <Services />
      <Process />
      <Testimonials />
      <FAQ />
      <Contact />
    </main>
  );
}
