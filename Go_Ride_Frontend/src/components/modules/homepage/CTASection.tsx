import { Button } from "@/components/ui/button";

import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-20 bg-primary dark:bg-blue-600/50 text-white relative overflow-hidden">
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-medium font-primary mb-6">
            Ready to Transform Your Commute?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto font-secondary">
            Join thousands of satisfied riders. Download GoRide today and
            experience the future of transportation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/login">
              <Button
                size="lg"
                variant="default"
                className="text-base shadow-lg border-none bg-white text-primary hover:bg-primary hover:text-white dark:bg-white dark:text-primary dark:hover:bg-white dark:hover:text-primary transition-all duration-300 ease-in-out"
              >
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
