import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Zap, Award, Heart } from "lucide-react";

export default function About() {
  const teamMembers = [
    {
      name: "Sarah Chen",
      role: "CEO & Founder",
      bio: "Former Uber executive with 10+ years in transportation technology. Passionate about sustainable urban mobility.",
      image: "/images/about/manager.jpg",
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO",
      bio: "Ex-Google engineer specializing in real-time systems and mobile applications. Expert in scalable ride-sharing platforms.",
      image: "/images/about/cto.jpg",
    },
    {
      name: "Priya Patel",
      role: "Head of Operations",
      bio: "Operations leader with experience at Lyft and DoorDash. Focused on driver experience and safety protocols.",
      image: "/images/about/operations.jpeg",
    },
    {
      name: "David Kim",
      role: "Head of Product",
      bio: "Product strategist from Tesla with expertise in user experience design and autonomous vehicle integration.",
      image: "/images/about/ceo.jpg",
    },
  ];

  const values = [
    {
      icon: Shield,
      title: "Safety First",
      description:
        "Advanced safety features, background checks, and 24/7 support ensure secure rides for everyone.",
    },
    {
      icon: Zap,
      title: "Innovation",
      description:
        "Cutting-edge technology including AI-powered matching and predictive routing for optimal experiences.",
    },
    {
      icon: Heart,
      title: "Community",
      description:
        "Building stronger communities by connecting people and supporting local drivers and businesses.",
    },
    {
      icon: Award,
      title: "Excellence",
      description:
        "Committed to providing the highest quality service with continuous improvement and user feedback.",
    },
  ];

  const motionUp = {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.8 },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/5 py-20 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-3">
          <motion.div
            {...motionUp}
            transition={{ ...motionUp.transition, delay: 0.1 }}
          ></motion.div>
          <motion.h1
            {...motionUp}
            transition={{ ...motionUp.transition, delay: 0.3 }}
            className="text-4xl md:text-4xl font-medium font-primary text-foreground"
          >
            Revolutionizing Urban Transportation
          </motion.h1>
          <motion.p
            {...motionUp}
            transition={{ ...motionUp.transition, delay: 0.5 }}
            className="text-lg font-secondary text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            We're building the future of mobility with safe, reliable, and
            sustainable ride-sharing solutions that connect communities and
            empower drivers.
          </motion.p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center font-secondary">
          <motion.div
            {...motionUp}
            transition={{ ...motionUp.transition, delay: 0.2 }}
          >
            <h2 className="text-3xl  font-semibold text-foreground mb-6 ">
              Our Story
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p className="text-lg leading-relaxed">
                Founded in 2020, RideShare emerged from a simple observation:
                urban transportation needed to be more accessible, sustainable,
                and community-focused. Our founders, having worked at major tech
                companies, saw an opportunity to create something better.
              </p>
              <p className="text-lg leading-relaxed">
                Starting in just three cities, we've grown to serve millions of
                riders and thousands of drivers across the region. Our platform
                combines cutting-edge technology with human-centered design to
                create experiences that work for everyone.
              </p>
              <p className="text-lg leading-relaxed">
                Today, we're not just a ride-sharing company – we're a platform
                that empowers economic opportunity, reduces urban congestion,
                and builds stronger communities through shared mobility.
              </p>
            </div>
          </motion.div>
          <motion.div
            {...motionUp}
            transition={{ ...motionUp.transition, delay: 0.4 }}
          >
            <img
              src="/images/about/header.jpg"
              alt="Urban transportation"
              className="rounded-lg shadow-lg w-full h-[200px] md:h-[500px]"
            />
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <motion.h2
            {...motionUp}
            transition={{ ...motionUp.transition, delay: 0.2 }}
            className="text-3xl md:text-4xl font-primary font-medium text-foreground mb-3"
          >
            Our Values
          </motion.h2>
          <motion.p
            {...motionUp}
            transition={{ ...motionUp.transition, delay: 0.4 }}
            className="text-lg text-muted-foreground  font-secondary"
          >
            The principles that guide everything we do
          </motion.p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 font-secondary max-w-6xl mx-auto">
          {values.map((value, index) => (
            <motion.div
              key={index}
              {...motionUp}
              transition={{ ...motionUp.transition, delay: 0.2 + index * 0.2 }}
            >
              <Card className="p-6 text-center hover:shadow-lg transition-shadow bg-card border-0">
                <CardContent className="p-0">
                  <value.icon className="w-8 h-8 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-card-foreground mb-3 font-[family-name:var(--font-montserrat)]">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground font-[family-name:var(--font-open-sans)]">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team Profiles */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <motion.h2
            {...motionUp}
            transition={{ ...motionUp.transition, delay: 0.2 }}
            className="text-3xl md:text-4xl font-medium text-foreground mb-3 font-primary"
          >
            Meet Our Team
          </motion.h2>
          <motion.p
            {...motionUp}
            transition={{ ...motionUp.transition, delay: 0.4 }}
            className="text-lg text-muted-foreground font-secondary"
          >
            The passionate people driving our mission forward
          </motion.p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              {...motionUp}
              transition={{ ...motionUp.transition, delay: 0.2 + index * 0.2 }}
            >
              <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105 bg-card border-0 group">
                <CardContent className="p-0">
                  <div className="relative mb-6">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-accent/20 group-hover:border-accent/40 transition-colors"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-card-foreground mb-2 font-primary">
                    {member.name}
                  </h3>
                  <Badge variant="secondary" className="mb-4">
                    {member.role}
                  </Badge>
                  <p className="text-sm text-muted-foreground leading-relaxed font-secondary">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
