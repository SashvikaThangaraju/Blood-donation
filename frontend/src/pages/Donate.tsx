import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, User, Phone, Mail, MapPin, Calendar } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { registerDonor } from "@/lib/api";

const Donate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    bloodGroup: "",
    phone: "",
    email: "",
    location: "",
    availability: "",
    medicalHistory: "",
    agreedToTerms: false,
    emergencyContact: ""
  });

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const availabilityOptions = ["Weekdays", "Weekends", "Anytime", "Emergency Only"];

  const mutation = useMutation({
    mutationFn: registerDonor,
    onSuccess: () => {
      toast({
        title: "Registration Successful!",
        description: "Thank you for registering as a blood donor. You're now part of our life-saving community!",
      });
      setFormData({
        fullName: "", age: "", bloodGroup: "", phone: "", email: "", location: "",
        availability: "", medicalHistory: "", agreedToTerms: false, emergencyContact: ""
      });
      setTimeout(() => navigate("/"), 2000);
    },
    onError: (error: Error) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    },
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { fullName, age, bloodGroup, phone, email, location, availability, agreedToTerms } = formData;
    
    if (!fullName.trim()) {
      toast({ title: "Error", description: "Full name is required", variant: "destructive" });
      return false;
    }
    
    const ageNum = parseInt(age);
    if (!age || isNaN(ageNum) || ageNum < 18 || ageNum > 65) {
      toast({ title: "Error", description: "Age must be a number between 18 and 65", variant: "destructive" });
      return false;
    }
    
    if (!bloodGroup) {
      toast({ title: "Error", description: "Blood group is required", variant: "destructive" });
      return false;
    }
    
    if (!phone.trim()) {
      toast({ title: "Error", description: "Phone number is required", variant: "destructive" });
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      toast({ title: "Error", description: "Valid email is required", variant: "destructive" });
      return false;
    }
    
    if (!location.trim()) {
      toast({ title: "Error", description: "Location is required", variant: "destructive" });
      return false;
    }
    
    if (!availability) {
      toast({ title: "Error", description: "Availability is required", variant: "destructive" });
      return false;
    }
    
    if (!agreedToTerms) {
      toast({ title: "Error", description: "You must agree to the terms and conditions", variant: "destructive" });
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

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Heart className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-foreground mb-4">Become a Blood Donor</h1>
          <p className="text-xl text-warm-gray max-w-2xl mx-auto">
            Join our community of heroes and help save lives. Fill out the form below to register as a blood donor.
          </p>
        </div>

        {/* Eligibility Requirements */}
        <Card className="mb-8 blood-card">
          <CardHeader>
            <CardTitle className="text-primary">Donor Eligibility Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-warm-gray">
              <div className="space-y-2">
                <p>• Age: 18-65 years old</p>
                <p>• Weight: At least 110 lbs (50 kg)</p>
                <p>• Good general health</p>
              </div>
              <div className="space-y-2">
                <p>• No recent illness or medication</p>
                <p>• No tattoos/piercings in last 3 months</p>
                <p>• Can donate every 56 days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Registration Form */}
        <Card className="blood-card">
          <CardHeader>
            <CardTitle className="text-primary">Donor Registration Form</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="age" className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    Age *
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    min="18"
                    max="65"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    placeholder="Enter your age"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="bloodGroup">Blood Group *</Label>
                  <Select value={formData.bloodGroup} onValueChange={(value) => handleInputChange("bloodGroup", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      {bloodGroups.map(group => (
                        <SelectItem key={group} value={group}>{group}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center">
                    <Phone className="mr-2 h-4 w-4" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center">
                    <Mail className="mr-2 h-4 w-4" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    Location *
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="City, State"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="availability">Availability *</Label>
                  <Select value={formData.availability} onValueChange={(value) => handleInputChange("availability", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      {availabilityOptions.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                    placeholder="Emergency contact number"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicalHistory">Medical History (Optional)</Label>
                <Textarea
                  id="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={(e) => handleInputChange("medicalHistory", e.target.value)}
                  placeholder="Any medical conditions, medications, or relevant health information..."
                  rows={4}
                />
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-center space-x-2 p-4 bg-warm-gray-light rounded-lg">
                <Checkbox
                  id="terms"
                  checked={formData.agreedToTerms}
                  onCheckedChange={(checked) => handleInputChange("agreedToTerms", checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the terms and conditions and confirm that the information provided is accurate. 
                  I understand that this information will be used to match me with patients in need of blood transfusions.
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full btn-blood text-lg py-3"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Registering..." : "Register as Donor"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Donate;

