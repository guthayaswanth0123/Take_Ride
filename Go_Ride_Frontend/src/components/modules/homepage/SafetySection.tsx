import { Shield, UserCheck, Map, Phone } from 'lucide-react';
import img from "/images/img2.jpg";

const SafetyFeatures = () => {
  const features = [
    {
      icon: Shield,
      title: "24/7 Safety Support",
      description: "Round-the-clock support team for any safety concerns"
    },
    {
      icon: UserCheck,
      title: "Driver Verification",
      description: "All drivers undergo thorough background checks"
    },
    {
      icon: Map,
      title: "Real-time Tracking",
      description: "Share your ride details with friends and family"
    },
    {
      icon: Phone,
      title: "Emergency Assistance",
      description: "Quick access to emergency services when needed"
    }
  ];

  return (
    <section id="safety" className="py-20 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-sm font-semibold text-blue-500 uppercase tracking-widest mb-3 font-secondary">
            Ride With Confidence
          </span>
          <h2 className="text-4xl md:text-5xl font-bold font-primary text-gray-900 dark:text-gray-100 mb-4">
            Safety You Can Trust{" "}
           
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto font-secondary">
            Every ride is backed by industry-leading safety standards — so you can focus on the journey, not the worry.
          </p>
          <div className="mt-5 flex justify-center gap-2">
            <span className="block w-10 h-1 rounded-full bg-primary"></span>
            <span className="block w-4 h-1 rounded-full bg-primary/40"></span>
            <span className="block w-2 h-1 rounded-full bg-primary/20"></span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left side - Image */}
          <div className="lg:w-1/2">
            <div className="relative">
              <img 
                src={img} 
                alt="Safety features" 
                className="rounded-2xl shadow-2xl w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="lg:w-1/2">
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-medium font-primary text-gray-900 dark:text-gray-100 mb-3">
                Your Safety is Our Priority
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 font-secondary">
                We've implemented multiple safety features to ensure you have a secure journey and a hassle-free experience.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4 group border p-4 rounded-md bg-gray-100 dark:bg-gray-900">
                  <div className=" w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0  transition-colors">
                    <feature.icon className="h-6 w-6 text-primary dark:text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary dark:text-gray-300  mb-1 font-secondary">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-secondary">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SafetyFeatures;