

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, CheckCircle, Facebook, Linkedin, Twitter } from "lucide-react";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
  inquiryType: z.enum(["general", "driver", "rider", "business", "support"]),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      inquiryType: "general",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // simulate API
    console.log(" Contact form submitted:", data);
    setIsSubmitted(true);
    setIsSubmitting(false);
    form.reset();
  };

  const fadeUp = (delay: number) => ({
    initial: { y: 40, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.6, delay },
  });

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center font-secondary">
        <motion.div
          {...fadeUp(0.2)}
          className="max-w-2xl mx-auto text-center bg-white rounded-2xl shadow-xl p-12"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h1 className="font-montserrat text-3xl font-bold text-gray-900 mb-4">
            Thank You!
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Your message has been received. Our team will get back to you within
            24 hours.
          </p>
          <Button
            onClick={() => setIsSubmitted(false)}
            className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-3 cursor-pointer"
          >
            Send Another Message
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <motion.h1
            {...fadeUp(0.1)}
            className="text-foreground text-3xl md:text-4xl font-primary font-medium mb-4"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            {...fadeUp(0.3)}
            className="text-lg text-muted-foreground max-w-2xl mx-auto font-secondary"
          >
            Have questions about our ride-sharing platform? We're here to help.
            Reach out to us and we'll respond as soon as possible.
          </motion.p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="pb-20">
        <div className="container mx-auto px-4 max-w-6xl ">
          <div className="grid lg:grid-cols-3 gap-12 ">
            {/* Contact Information */}
            <motion.div {...fadeUp(0.2)} className="lg:col-span-1 ">
              <Card className="border-0 shadow-lg font-secondary">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold font-secondary text-foreground mt-4">
                    Contact Information
                  </CardTitle>
                  <CardDescription>
                    Multiple ways to reach our team
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <MapPin className="w-6 h-6 text-primary mt-1 dark:text-blue-600" />
                    <div>
                      <h4 className="font-semibold text-foreground text-lg">Address</h4>
                      <p className="text-muted-foreground">
                        123 Innovation Drive
                        <br />
                        Tech District, City 12345
                      </p>

                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Phone className="w-6 h-6 text-primary dark:text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-foreground text-lg">Phone</h4>
                      <p className="text-muted-foreground">+1 (555) 123-4567</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Mail className="w-6 h-6 text-primary mt-1 dark:text-blue-600" />
                    <div>
                      <h4 className="font-semibold text-foreground text-lg">Email</h4>
                      <p className="text-muted-foreground">
                        contact@goride.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Clock className="w-6 h-6 text-primary mt-1 dark:text-blue-600" />
                    <div>
                      <h4 className="font-semibold text-foreground text-lg">Hours</h4>
                      <p className="text-muted-foreground">
                        Mon - Fri: 9:00 AM - 6:00 PM
                        <br />
                        Sat - Sun: 10:00 AM - 4:00 PM
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 mb-6">
                    <Facebook className="w-6 h-6 text-primary dark:text-blue-600 mt-1" />
                    <Linkedin className="w-6 h-6 text-primary dark:text-blue-600 mt-1" />
                    <Twitter className="w-6 h-6 text-primary dark:text-blue-600 mt-1 font-bold" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Form */}
            <motion.div {...fadeUp(0.4)} className="lg:col-span-2 lg:px-12">
              <Card className="border-0 shadow-xl font-secondary">
                <CardHeader>
                  <CardTitle className="font-montserrat text-2xl text-gray-900 dark:text-gray-200">
                    Send us a Message
                  </CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you soon
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-4"
                    >
                      <div className="grid md:grid-cols-2 gap-6">
                        {[
                          {
                            name: "name",
                            label: "Full Name",
                            placeholder: "Your Name",
                          },
                          {
                            name: "email",
                            label: "Email Address",
                            placeholder: "your@email.com",
                            type: "email",
                          },
                        ].map((field, i) => (
                          <motion.div key={field.name} {...fadeUp(0.5 + i * 0.2)}>
                            <FormField
                              control={form.control}
                              name={field.name as keyof ContactFormData}
                              render={({ field: f }) => (
                                <FormItem>
                                  <FormLabel>{field.label}</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder={field.placeholder}
                                      type={field.type || "text"}
                                      {...f}
                                       className="placeholder:text-gray-500"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </motion.div>
                        ))}
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <motion.div {...fadeUp(0.7)}>
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Phone Number"
                                    {...field}
                                     className="placeholder:text-gray-500"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </motion.div>

                        <motion.div {...fadeUp(0.9)}>
                          <FormField
                            control={form.control}
                            name="inquiryType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Inquiry Type</FormLabel>
                                <FormControl>
                                  <select
                                    {...field}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm  placeholder:text-gray-500"
                                  >
                                    <option value="general">
                                      General Inquiry
                                    </option>
                                    <option value="driver">
                                      Driver Support
                                    </option>
                                    <option value="rider">Rider Support</option>
                                    <option value="business">
                                      Business Partnership
                                    </option>
                                    <option value="support">
                                      Technical Support
                                    </option>
                                  </select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      </div>

                      <motion.div {...fadeUp(1.1)}>
                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subject</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="How can we help you?"
                                  {...field}
                                  className="placeholder:text-gray-500"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <motion.div {...fadeUp(1.3)}>
                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Message</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Please provide details about your inquiry..."
                                  className="min-h-[120px]  placeholder:text-gray-500"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <motion.div {...fadeUp(1.5)}>
                        <Button
                          type="submit"
                          className="w-full text-white py-3 text-lg font-semibold cursor-pointer"
                          disabled={isSubmitting}
                        >
                          {isSubmitting
                            ? "Sending Message..."
                            : "Send Message"}
                        </Button>
                      </motion.div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
