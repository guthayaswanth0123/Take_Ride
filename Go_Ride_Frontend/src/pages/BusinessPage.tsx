import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, TrendingUp, Shield, Clock, Headphones } from "lucide-react";
import { Link } from "react-router-dom";

const BusinessPage = () => {
  const features = [
    {
      icon: Building2,
      title: "Corporate Accounts",
      description: "Centralized billing and expense management for your organization"
    },
    {
      icon: Users,
      title: "Employee Management",
      description: "Add and manage employee ride permissions with ease"
    },
    {
      icon: TrendingUp,
      title: "Analytics Dashboard",
      description: "Track usage, costs, and optimize your transportation budget"
    },
    {
      icon: Shield,
      title: "Enhanced Security",
      description: "Advanced safety features and compliance for business travel"
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Dedicated business support team available around the clock"
    },
    {
      icon: Headphones,
      title: "Account Manager",
      description: "Personal account manager for enterprise-level service"
    }
  ];

 

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-accent/5 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-medium font-primary text-gray-900 dark:text-white mb-3">GoRide for Business</h1>
          <p className="text-xl font-secondary mb-8 max-w-2xl text-gray-700 dark:text-gray-400 mx-auto">
            Streamline your company's transportation needs with our comprehensive business solutions
          </p>
          <Button size="lg" variant="outline" className="bg-primary text-white  dark:text-white">
            Get Started Today
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-medium font-primary text-gray-900 dark:text-white mb-2">
              Why Choose GoRide Business?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 font-secondary max-w-2xl mx-auto">
              Everything you need to manage corporate transportation efficiently
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow font-secondary">
                <CardHeader>
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 -mt-4">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

    
      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-medium font-primary mb-2">Ready to Transform Your Business Travel?</h2>
          <p className="text-base font-secondary mb-8 max-w-2xl mx-auto">
            Join thousands of companies already using GoRide Business
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
            <Button size="lg" variant="ghost" className="border-2 border-white hover:bg-white hover:text-primary">
              Contact Now
            </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BusinessPage;