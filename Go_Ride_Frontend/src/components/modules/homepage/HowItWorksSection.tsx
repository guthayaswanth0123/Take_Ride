
import { MapPin, Car, CreditCard } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: MapPin,
      title: "Set your location",
      description: "Enter your pickup and destination addresses"
    },
    {
      icon: Car,
      title: "Choose your ride",
      description: "Select from various vehicle options and prices"
    },
    {
      icon: CreditCard,
      title: "Pay seamlessly",
      description: "Cashless payment with multiple options"
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-primary font-medium text-gray-900 dark:text-gray-100 mb-4">
            How GoRide Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-secondary">
            Getting where you need to go has never been easier with GoRide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                <step.icon className="h-10 w-10 text-primary" />
              </div>
             
              <h3 className="text-2xl font-primary text-gray-900 dark:text-gray-100">
                {step.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg font-secondary">
                {step.description}
              </p>
              
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;