import {
  Car,
  Users,
  Clock,
  Shield,
  Star,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const ServicesPage = () => {
  const mainServices = [
    {
      icon: Car,
      title: "GoRide X",
      description: "Affordable everyday rides for your daily commute and short trips",
      price: "From $ 120",
      features: [
        "4 passengers",
        "Standard comfort",
        "Everyday pricing",
        "2 min average wait",
      ],
      bestFor: ["Daily commute", "Short trips & rides", "Budget travel"],
      color: "blue",
    },
    {
      icon: Users,
      title: "GoRide Comfort",
      description: "Newer cars with extra legroom and top-rated drivers",
      price: "From $ 180",
      features: [
        "4 passengers",
        "Extra legroom",
        "Top-rated drivers",
        "5 min average wait",
      ],
      bestFor: ["Business meetings", "Comfortable travel", "Airport rides"],
      color: "green",
    },
    {
      icon: Shield,
      title: "GoRide Premier",
      description: "Premium luxury vehicles with professional drivers",
      price: "From $ 250",
      features: [
        "4 passengers",
        "Luxury vehicles",
        "Professional drivers",
        "7 min average wait",
      ],
      bestFor: ["Special occasions", "Business travel", "Luxury experience"],
      color: "purple",
    },
  ];



  const serviceFeatures = [
    {
      icon: Clock,
      title: "Quick Booking",
      description: "Book a ride in less than 30 seconds with our intuitive app",
    },
    {
      icon: Shield,
      title: "Safe Rides",
      description:
        "24/7 safety support and driver verification for peace of mind",
    },
    {
      icon: Star,
      title: "Rated Drivers",
      description: "All drivers are rated and reviewed by our rider community",
    },
    {
      icon: Zap,
      title: "Live Tracking",
      description: "Real-time tracking and ETA updates for your convenience",
    },
  ];



  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/5 py-20 px-4">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-medium font-primary text-foreground mb-4">
              Our Services
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed font-secondary">
              Discover the perfect ride for every occasion. From daily commutes
              to special events, we've got you covered with safe, reliable, and
              affordable transportation.
            </p>
            <Link to="/login">
              <Button className="bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-800 px-8 py-6 text-lg">
                Book Your Ride Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Ride Services */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-primary font-medium text-card-foreground mb-3">
              Choose Your Ride
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto  font-secondary">
              Select from our range of ride options designed for different needs
              and budgets
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {mainServices.map((service, index) => (
              <Card
                key={index}
                className="border bg-gray-50 shadow-lg hover:shadow-xl transition-shadow group"
              >
                <CardContent className="p-8">
                  {/* Service Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`w-16 h-16 rounded-full  flex items-center justify-center group-hover:scale-110 transition-transform text-blue-600`}
                    >
                      <service.icon className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-card-foreground  font-secondary">
                        {service.title}
                      </h3>
                      <p className="text-3xl font-medium text-primary  font-secondary">
                        {service.price}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground mb-6 leading-relaxed  font-secondary">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="mb-6 font-secondary">
                    <h4 className="font-semibold text-card-foreground mb-3">
                      Features:
                    </h4>
                    <ul className="">
                      {service.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-center gap-2 text-muted-foreground"
                        >
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Best For */}
                  <div className="mb-6  font-secondary">
                    <h4 className="font-semibold text-card-foreground mb-3">
                      Best For:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {service.bestFor.map((useCase, useCaseIndex) => (
                        <span
                          key={useCaseIndex}
                          className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm"
                        >
                          {useCase}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link to="/login">
                    <Button className="w-full bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 py-6">
                      Book {service.title}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

    

      {/* Service Features */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-medium font-primary text-card-foreground mb-4">
              Why Choose GoRide?
            </h2>
            <p className="text-xl font-secondary text-muted-foreground">
              Experience the difference with our premium features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {serviceFeatures.map((feature, index) => (
              <div key={index} className="text-center group  font-secondary">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-card-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    

     
    </div>
  );
};

export default ServicesPage;
