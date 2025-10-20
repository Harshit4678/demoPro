import BeginTheChange from "@/components/home/AnimatedCards";
import DonorReviews from "@/components/home/DonorReviews";
import FAQSection from "@/components/home/FAQSection";
import FocusAreaSection from "@/components/home/FocusAreaSection";
import GallerySection from "@/components/home/GallerySection";

import MissionSection from "@/components/home/MissionSection";

import PerformanceStats from "@/components/home/PerformanceStats";
import StoriesCarousel from "@/components/home/StoriesCarousel";
import ContactSection from "@/components/home/ContactSection";
// import HeroAdvanced from "@/components/home/LiveImpactHero";
import LiveImpactHero from "@/components/home/HeroSection";
import OurPartners from "@/components/home/OurPartners";

// import BeginTheChange from './../components/home/AnimatedCards';

export default function HomePage() {
  return (
    <div>
      <LiveImpactHero/>
     
      <MissionSection />
      <FocusAreaSection/>
      <StoriesCarousel/>
    
      <BeginTheChange/>
      <PerformanceStats/>
      <GallerySection/>
      <OurPartners/>
      <FAQSection/>
      <DonorReviews compact/>
      <ContactSection/>

    </div>
  );
}

