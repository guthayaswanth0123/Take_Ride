import { Card, CardContent } from "@/components/ui/card";
import { Users, Car, MapPin, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function StatsSection() {
  const stats = [
    {
      icon: Users,
      number: "2M+",
      label: "Happy Riders",
    },
    {
      icon: Car,
      number: "50K+",
      label: "Active Drivers",
    },
    {
      icon: MapPin,
      number: "100+",
      label: "Cities Served",
    },
    {
      icon: Star,
      number: "4.9",
      label: "Average Rating",
    },
  ];

  return (
    <motion.section
      initial={{ y: 100, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
      className="py-16 px-4 bg-gray-50 dark:bg-gray-950"
    >
      <div className="max-w-6xl mx-auto font-secondary">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="text-center border shadow-lg hover:shadow-xl transition-shadow"
            >
              <CardContent className="p-4 ">
                <stat.icon className={`w-12 h-12 mx-auto mb-4 text-primary dark:text-blue-700`} />
                <div className="text-3xl font-black text-foreground mb-2 ">
                  {stat.number}
                </div>
                <div className="text-muted-foreground ">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
