/* eslint-disable @typescript-eslint/no-unused-vars */


import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"
import { motion } from "framer-motion"
import Slider from "react-slick"

import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Business Executive",
      content:
        "GoRide has transformed my daily commute. The drivers are professional, cars are clean, and the app is incredibly user-friendly. I can't imagine using any other service!",
      rating: 5,
      image: "/images/home/review-4.jpg",
    },
    {
      name: "Michael Chen",
      role: "College Student",
      content:
        "As a student, I need affordable and reliable transportation. GoRide delivers on both fronts. The pricing is fair and I always feel safe during my rides.",
      rating: 5,
      image: "/images/home/review-1.jpg",
    },
    {
      name: "Emily Rodriguez",
      role: "Working Mom",
      content:
        "The safety features give me peace of mind, especially when traveling with my kids. Real-time tracking and driver verification are game-changers for busy parents like me.",
      rating: 5,
      image: "/images/home/review-2.jpg",
    },
  ]

  const settings = {
    // dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1 },
      },
    ],
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-indigo-50 dark:bg-gradient-to-tl dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-primary font-medium text-foreground mb-4">
            What Our Riders Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl font-secondary mx-auto">
            Don't just take our word for it. Here's what our community has to say about their GoRide experience.
          </p>
        </motion.div>

        {/* Carousel */}
        <Slider {...settings}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className="px-2">
              <Card className="border bg-primary/5 dark:bg-gray-800 h-full">
                <CardContent className="p-8 relative flex flex-col justify-between h-full">
                  <Quote className="w-8 h-8 text-blue-600 mb-4 absolute right-10 -mt-10" />
                  <p className="text-foreground mb-6 font-[family-name:var(--font-open-sans)] leading-relaxed italic">
                    "{testimonial.content}"
                  </p>

                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  <div className="flex items-center">
                    <img
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <div className="font-semibold text-foreground font-[family-name:var(--font-montserrat)]">
                        {testimonial.name}
                      </div>
                      <div className="text-muted-foreground text-sm font-[family-name:var(--font-open-sans)]">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  )
}