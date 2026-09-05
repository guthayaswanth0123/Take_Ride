import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Clock, CreditCard, Star, Zap, Users } from "lucide-react"
import { motion } from "framer-motion"

export default function ServiceHighlights() {
  const services = [
    {
      icon: Shield,
      title: "Safety First",
      description: "Background-checked drivers, real-time tracking, and 24/7 safety support.",
      badge: "Verified",
      color: "bg-green-100 text-green-700",
    },
    {
      icon: Clock,
      title: "Always Available",
      description: "Book rides anytime, anywhere. We're here when you need us most.",
      badge: "24/7",
      color: "bg-blue-100 text-blue-700",
    },
    {
      icon: CreditCard,
      title: "Cashless Payments",
      description: "Secure, seamless payments with multiple options and automatic receipts.",
      badge: "Secure",
      color: "bg-purple-100 text-purple-700",
    },
    {
      icon: Star,
      title: "Premium Experience",
      description: "High-quality vehicles and professional drivers for the best ride experience.",
      badge: "Premium",
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      icon: Zap,
      title: "Instant Booking",
      description: "Get matched with drivers in seconds with our advanced algorithm.",
      badge: "Fast",
      color: "bg-orange-100 text-orange-700",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Supporting local drivers and building stronger communities together.",
      badge: "Community",
      color: "bg-pink-100 text-pink-700",
    },
  ]

  return (
    <section className="py-20 px-4 bg-gray-100 dark:bg-[#000000]">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-black text-foreground mb-4 font-[family-name:var(--font-montserrat)]"
          >
            Why Choose GoRide?
          </motion.h2>

          <motion.p
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-lg text-muted-foreground font-[family-name:var(--font-open-sans)] max-w-2xl mx-auto"
          >
            Experience the difference with our premium features designed for your comfort and convenience.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-[#11286644] rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                      <service.icon className="w-6 h-6" />
                    </div>
                    <Badge className={service.color}>{service.badge}</Badge>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3 font-[family-name:var(--font-montserrat)] group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground font-[family-name:var(--font-open-sans)] leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
