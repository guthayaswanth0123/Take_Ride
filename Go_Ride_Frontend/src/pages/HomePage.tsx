import CTASection from "@/components/modules/homepage/CTASection";
import FAQSection from "@/components/modules/homepage/Faq";
import HeroSection from "@/components/modules/homepage/HeroSection";
import HowItWorksSection from "@/components/modules/homepage/HowItWorksSection";
import PartnersSection from "@/components/modules/homepage/PartnersSection";
import SafetyFeatures from "@/components/modules/homepage/SafetySection";
import ServiceHighlights from "@/components/modules/homepage/ServiceHighlights";
import StatsSection from "@/components/modules/homepage/StatsSection";
import TestimonialsSection from "@/components/modules/homepage/TestimonialsSection";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <StatsSection />
      <ServiceHighlights />
      <HowItWorksSection />
      <SafetyFeatures />
      <TestimonialsSection />
      <PartnersSection />
      <FAQSection />
      <CTASection />
    </div>
  );
};

export default Home;
