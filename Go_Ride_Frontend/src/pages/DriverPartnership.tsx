import React from "react";
import {
  Users,
  DollarSign,
  Clock,
  Shield,
  Car,
  Star,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const DriverPartnership: React.FC = () => {
  const registrationSteps = [
    {
      id: 1,
      title: "Sign Up Online",
      description: "Fill out the simple registration form with your details",
      duration: "5 mins",
      icon: <Users className="w-6 h-6" />,
    },
    {
      id: 2,
      title: "Document Verification",
      description: "Upload required documents for background check",
      duration: "24-48 hours",
      icon: <Shield className="w-6 h-6" />,
    },
    {
      id: 3,
      title: "Vehicle Inspection",
      description: "Get your vehicle verified at our partner centers",
      duration: "1 hour",
      icon: <Car className="w-6 h-6" />,
    },
    {
      id: 4,
      title: "Start Earning",
      description: "Complete onboarding and start accepting rides",
      duration: "Immediate",
      icon: <DollarSign className="w-6 h-6" />,
    },
  ];

  const earningStats = [
    {
      id: 1,
      title: "Weekly Earnings",
      amount: "$15,000 -$25,000",
      description: "Average weekly income for full-time drivers",
      icon: <DollarSign className="w-6 h-6" />,
    },
    {
      id: 2,
      title: "Flexible Hours",
      description: "Work whenever you want, no fixed schedules",
      icon: <Clock className="w-6 h-6" />,
    },
    {
      id: 3,
      title: "Bonus & Incentives",
      description: "Extra earnings through surge pricing and bonuses",
      icon: <Star className="w-6 h-6" />,
    },
  ];

  const requirements = [
    "Valid Driver's License",
    "Vehicle Insurance",
    "Vehicle Age: Under 10 years",
    "Police Verification Certificate",
    "Vehicle Registration Certificate",
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900/20 transition-colors duration-300">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl  text-foreground mb-4 font-primary font-medium"
          >
            Become a GoRide Partner
          </motion.h2>
          <motion.p
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-lg text-muted-foreground font-secondary max-w-2xl mx-auto"
          >
            Join thousands of drivers earning great income with flexible
            schedules and comprehensive support
          </motion.p>
        </div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Side - Registration Process */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center font-primary">
                <Users className="w-8 h-8 mr-3 text-blue-600 dark:text-blue-400" />
                Registration Process
              </h3>

              <div className="space-y-6">
                {registrationSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className="flex items-start space-x-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
                  >
                    {/* Step Number */}
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-600 dark:bg-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {index + 1}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xl font-semibold text-gray-900 dark:text-white font-secondary">
                          {step.title}
                        </h4>
                        <div className="text-blue-600 dark:text-blue-400">
                          {step.icon}
                        </div>
                      </div>

                      <p className="text-gray-600 dark:text-gray-300 mb-3 font-secondary">
                        {step.description}
                      </p>

                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4 mr-1" />
                        {step.duration}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* CTA Button */}
              <div className="text-center mt-10">
                <Link to="/login">
                  <button className="bg-primary hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white py-3 px-8 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center mx-auto cursor-pointer">
                    Start Your Application
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </Link>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                  No upfront fees • Start earning in 3 days
                </p>
              </div>
            </div>

            {/* Right Side - Earning Potential & Requirements */}
            <div className="space-y-8">
              {/* Earning Potential */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-2xl font-medium text-gray-900 dark:text-white mb-4 flex items-center font-primary">
                  Earning Potential
                </h3>

                <div className="space-y-3 mb-6 font-secondary">
                  {earningStats.map((stat) => (
                    <div
                      key={stat.id}
                      className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <div className="text-blue-800 dark:text-blue-100">
                          {stat.icon}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {stat.title}
                        </h4>
                        {stat.amount && (
                          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {stat.amount}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {stat.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Additional Benefits */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 ">
                  <h5 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                    Additional Benefits:
                  </h5>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• Fuel cost assistance programs</li>
                    <li>• Free insurance coverage</li>
                    <li>• 24/7 partner support</li>
                    <li>• Weekly payment settlements</li>
                  </ul>
                </div>
              </div>

              {/* Requirements */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 font-primary">
                  Requirements
                </h3>

                <div className="space-y-1 font-secondary">
                  {requirements.map((requirement, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {requirement}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DriverPartnership;
