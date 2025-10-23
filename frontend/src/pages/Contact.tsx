import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createMessage } from "@/lib/api";

const Contact = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient(); // Get the query client instance
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const mutation = useMutation({
    mutationFn: createMessage,
    onSuccess: () => {
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you within 24 hours.",
      });
      // Invalidate the messages query to refetch data on the admin dashboard
      queryClient.invalidateQueries({ queryKey: ['adminMessages'] });
      // Reset form
      setFormData({ name: "", email: "", subject: "", message: "" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    },
  });


  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { name, email, subject, message } = formData;
    
    if (!name.trim()) {
      toast({ title: "Error", description: "Name is required", variant: "destructive" });
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      toast({ title: "Error", description: "Valid email is required", variant: "destructive" });
      return false;
    }
    
    if (!subject.trim()) {
      toast({ title: "Error", description: "Subject is required", variant: "destructive" });
      return false;
    }
    
    if (!message.trim()) {
      toast({ title: "Error", description: "Message is required", variant: "destructive" });
      return false;
    }
    
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      mutation.mutate(formData);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: ["+1 (555) 123-4567", "Emergency: (555) 911-BLOOD"],
      color: "text-blue-500"
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@bloodconnect.org", "emergency@bloodconnect.org"],
      color: "text-green-500"
    },
    {
      icon: MapPin,
      title: "Address",
      details: ["123 Healthcare Avenue", "Medical District, NY 10001"],
      color: "text-red-500"
    },
    {
      icon: Clock,
      title: "Hours",
      details: ["Mon-Fri: 8:00 AM - 6:00 PM", "Sat-Sun: 9:00 AM - 4:00 PM"],
      color: "text-purple-500"
    }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Contact Us</h1>
          <p className="text-xl text-warm-gray max-w-2xl mx-auto">
            Have questions or need assistance? We're here to help. Reach out to us and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card className="blood-card">
              <CardHeader>
                <CardTitle className="text-primary flex items-center">
                  <Send className="mr-2 h-5 w-5" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      placeholder="What is your message about?"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Tell us how we can help you..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full btn-blood"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => (
                <Card key={index} className="blood-card">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <info.icon className={`h-8 w-8 mx-auto mb-3 ${info.color}`} />
                      <h3 className="font-semibold text-foreground mb-2">{info.title}</h3>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-sm text-warm-gray">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Emergency Contact */}
            <Card className="bg-red-50 border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-700 mb-4">
                  For urgent blood requirements or emergencies, please call our 24/7 emergency hotline.
                </p>
                <Button className="bg-red-600 hover:bg-red-700 text-white w-full">
                  Emergency: (555) 911-BLOOD
                </Button>
              </CardContent>
            </Card>

            {/* Map */}
            <Card className="blood-card">
              <CardHeader>
                <CardTitle className="text-primary">Our Location</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="aspect-video">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830921453!2d-74.11976390469238!3d40.697670063849474!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a22a3bda30d%3A0xb89d1fe6bc499443!2sDowntown%20Brooklyn%2C%20Brooklyn%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1642678484807!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="BloodConnect Location"
                  ></iframe>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <Card className="mt-12 blood-card">
          <CardHeader>
            <CardTitle className="text-primary text-center">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-foreground mb-2">How often can I donate blood?</h4>
                <p className="text-warm-gray text-sm mb-4">
                  You can donate whole blood every 56 days (8 weeks). Platelet donations can be made every 7 days, up to 24 times per year.
                </p>
                
                <h4 className="font-semibold text-foreground mb-2">What should I do before donating?</h4>
                <p className="text-warm-gray text-sm">
                  Get plenty of sleep, eat a healthy meal, drink extra water, and avoid alcohol for 24 hours before donation.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-2">How long does the donation process take?</h4>
                <p className="text-warm-gray text-sm mb-4">
                  The entire process takes about 1 hour, but the actual blood donation only takes 8-10 minutes.
                </p>
                
                <h4 className="font-semibold text-foreground mb-2">Is blood donation safe?</h4>
                <p className="text-warm-gray text-sm">
                  Yes, blood donation is completely safe. All equipment is sterile and used only once.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contact;

