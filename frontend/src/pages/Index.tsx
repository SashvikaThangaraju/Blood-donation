import { Link } from "react-router-dom";
import { Heart, Users, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const Index = () => {
  const stats = [
    { icon: Heart, label: "Lives Saved", value: "10,000+", color: "text-red-500" },
    { icon: Users, label: "Active Donors", value: "5,000+", color: "text-blue-500" },
    { icon: Clock, label: "Years of Service", value: "15+", color: "text-green-500" },
    { icon: Award, label: "Blood Banks", value: "50+", color: "text-purple-500" },
  ];

  const bloodTypes = [
    { type: "O+", compatibility: "Can donate to O+, A+, B+, AB+", demand: "High" },
    { type: "O-", compatibility: "Universal donor", demand: "Critical" },
    { type: "A+", compatibility: "Can donate to A+, AB+", demand: "Medium" },
    { type: "B+", compatibility: "Can donate to B+, AB+", demand: "Medium" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Donate Blood, <span className="text-yellow-300">Save Lives</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Every drop counts. Your donation can save up to 3 lives and bring hope to families in need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/donate">
                <Button className="btn-hero text-lg px-8 py-4">
                  <Heart className="mr-2 h-5 w-5" />
                  Donate Now
                </Button>
              </Link>
              <Link to="/find-donors">
                <Button variant="outline" className="glass-card text-lg px-8 py-4 text-white border-white hover:bg-white/10">
                  Find Donors
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-warm-gray-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="blood-card text-center">
                <CardContent className="pt-6">
                  <stat.icon className={`h-12 w-12 mx-auto mb-4 ${stat.color}`} />
                  <h3 className="text-3xl font-bold text-primary mb-2">{stat.value}</h3>
                  <p className="text-warm-gray font-medium">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Donate Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why Your Donation Matters</h2>
            <p className="text-xl text-warm-gray max-w-3xl mx-auto">
              Blood cannot be manufactured – it can only come from generous donors like you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="blood-card">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Heart className="mr-2 h-6 w-6" />
                  Save Lives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-warm-gray">
                  One donation can save up to three lives. Help patients with cancer, chronic diseases, and traumatic injuries.
                </p>
              </CardContent>
            </Card>

            <Card className="blood-card">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Users className="mr-2 h-6 w-6" />
                  Community Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-warm-gray">
                  Support your local hospitals and blood banks. Be a hero in your community and inspire others to donate.
                </p>
              </CardContent>
            </Card>

            <Card className="blood-card">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Award className="mr-2 h-6 w-6" />
                  Health Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-warm-gray">
                  Regular donation can reduce iron levels, improve cardiovascular health, and provide free health screenings.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Blood Types Section */}
      <section className="py-16 bg-warm-gray-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Blood Type Compatibility</h2>
            <p className="text-xl text-warm-gray">
              Understanding your blood type helps us match you with patients in need.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bloodTypes.map((blood, index) => (
              <Card key={index} className="blood-card">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-primary text-center">
                    {blood.type}
                  </CardTitle>
                  <CardDescription className={`text-center font-semibold ${
                    blood.demand === 'Critical' ? 'text-red-600' : 
                    blood.demand === 'High' ? 'text-orange-600' : 'text-yellow-600'
                  }`}>
                    {blood.demand} Demand
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-warm-gray text-center">{blood.compatibility}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 text-white/90">
            Join thousands of heroes who have already made a difference. Your donation could be the gift of life someone is waiting for.
          </p>
          <Link to="/donate">
            <Button className="btn-hero text-lg px-8 py-4">
              Register as Donor Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;