import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Faq = () => {
  const faqs = [
    {
      question: "How do I book a ride?",
      answer: "Simply open the app, enter your destination, choose your ride type, and confirm your booking. A driver will be assigned to you within minutes."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, digital wallets, and cash payments depending on your location."
    },
    {
      question: "How is the fare calculated?",
      answer: "Fares are calculated based on distance, time, demand, and vehicle type. You'll see the estimated fare before confirming your ride."
    },
    {
      question: "Can I cancel my ride?",
      answer: "Yes, you can cancel your ride through the app. Cancellation fees may apply if you cancel after the driver has been assigned."
    },
    {
      question: "Is GoRide available 24/7?",
      answer: "Yes, GoRide operates 24/7 in most cities. However, availability may vary by location and demand."
    },
    {
      question: "How do I contact my driver?",
      answer: "Once your ride is confirmed, you can call or message your driver directly through the app without sharing personal phone numbers."
    }
  ];

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-medium font-primary text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl font-secondary mx-auto text-lg">
            Find answers to common questions about using GoRide
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4 font-secondary">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white dark:bg-gray-800 rounded-lg border">
                <AccordionTrigger className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white text-base hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600 dark:text-gray-300">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default Faq;