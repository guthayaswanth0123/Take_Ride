import Slider from "react-slick";
import { motion } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const partners = [
  { name: "bKash", img: "/images/bkash.jpg" },
  { name: "Nagad", img: "/images/nagad.svg" },
  { name: "VISA", img: "/images/visa.jpg" },
  { name: "MasterCard", img: "/images/mastercard.png" },
  { name: "Google Maps", img: "/images/google-map.png" },
  { name: "SSL Commerz", img: "/images/sslcommerz.png" },
];

const badges = [
  { label: "ISO 27001 Certified", icon: "🔒" },
  { label: "SSL Secured", icon: "🛡️" },
  { label: "BTRC Licensed", icon: "✅" },
  { label: "PCI DSS Compliant", icon: "💳" },
];

const settings = {
  dots: false,
  arrows: false,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 0,
  speed: 3000,
  cssEase: "linear",
  slidesToShow: 5,
  slidesToScroll: 1,
  pauseOnHover: true,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 4 } },
    { breakpoint: 768, settings: { slidesToShow: 3 } },
    { breakpoint: 480, settings: { slidesToShow: 2 } },
  ],
};

export default function PartnersSection() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-sm font-semibold text-blue-500 uppercase tracking-widest mb-3 font-secondary">
            Trusted By Many
          </span>
          <h2 className="text-4xl md:text-5xl font-bold font-primary text-gray-900 dark:text-gray-100 mb-4">
            Our Partners & Trust Badges
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto font-secondary">
            We work with industry-leading partners to ensure secure payments, reliable navigation, and a seamless ride experience.
          </p>
          <div className="mt-5 flex justify-center gap-2">
            <span className="block w-10 h-1 rounded-full bg-primary"></span>
            <span className="block w-4 h-1 rounded-full bg-primary/40"></span>
            <span className="block w-2 h-1 rounded-full bg-primary/20"></span>
          </div>
        </div>

        {/* Carousel */}
        <div className="mb-14">
          <Slider {...settings}>
            {partners.map((partner, i) => (
              <div key={i} className="px-3">
                <div className="flex items-center justify-center h-20 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow px-4">
                  <img
                    src={partner.img}
                    alt={partner.name}
                    className="max-h-10 max-w-full object-contain"
                  />
                </div>
              </div>
            ))}
          </Slider>
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4"
        >
          {badges.map((badge, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full shadow-sm font-secondary text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              <span className="text-base">{badge.icon}</span>
              {badge.label}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
