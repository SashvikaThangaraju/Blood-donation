import { Heart, Users, Target, Zap } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const About = () => {
  const benefits = [
    {
      title: "Free Health Screening",
      description: "Every donation includes a mini health checkup including blood pressure, temperature, and hemoglobin testing."
    },
    {
      title: "Reduces Iron Levels",
      description: "Regular donation helps maintain healthy iron levels and reduces the risk of heart disease."
    },
    {
      title: "Burns Calories",
      description: "Donating blood burns approximately 650 calories per donation."
    },
    {
      title: "Stimulates Blood Production",
      description: "Your body replenishes donated blood within 24-48 hours, promoting healthy blood cell production."
    }
  ];

  const statistics = [
    { number: "1", text: "donation can save up to", highlight: "3 Lives" },
    { number: "38%", text: "of the US population is eligible to donate, but only", highlight: "2% Actually Do" },
    { number: "15M", text: "blood donations are collected in the US each year" },
    { number: "5M", text: "patients receive blood transfusions annually" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            About <span className="text-yellow-300">BloodConnect</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto">
            Bridging the gap between life-saving donors and patients in need through technology and compassion.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">Our Mission</h2>
              <p className="text-lg text-warm-gray mb-6">
                BloodConnect was founded with a simple yet powerful mission: to create a seamless connection 
                between blood donors and those who need life-saving transfusions. We believe that technology 
                can bridge the gap in the blood donation process, making it easier for heroes like you to save lives.
              </p>
              <p className="text-lg text-warm-gray">
                Our platform serves as a digital bridge, connecting generous donors with blood banks, hospitals, 
                and patients in need. Every drop of blood donated through our network represents hope, healing, 
                and a second chance at life.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card className="blood-card">
                <CardHeader>
                  <Heart className="h-12 w-12 text-primary mb-4" />
                  <CardTitle className="text-primary">Compassion</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-warm-gray">Driven by empathy and the desire to help others in their time of need.</p>
                </CardContent>
              </Card>

              <Card className="blood-card">
                <CardHeader>
                  <Users className="h-12 w-12 text-blue-500 mb-4" />
                  <CardTitle className="text-blue-500">Community</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-warm-gray">Building a strong network of donors, recipients, and healthcare partners.</p>
                </CardContent>
              </Card>

              <Card className="blood-card">
                <CardHeader>
                  <Target className="h-12 w-12 text-green-500 mb-4" />
                  <CardTitle className="text-green-500">Efficiency</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-warm-gray">Streamlining the donation process to save time and lives.</p>
                </CardContent>
              </Card>

              <Card className="blood-card">
                <CardHeader>
                  <Zap className="h-12 w-12 text-yellow-500 mb-4" />
                  <CardTitle className="text-yellow-500">Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-warm-gray">Maximizing the life-saving potential of every donation.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-warm-gray-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-12">The Impact of Blood Donation</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {statistics.map((stat, index) => (
              <Card key={index} className="blood-card">
                <CardContent className="pt-6 text-center">
                  <div className="text-5xl font-bold text-primary mb-2">{stat.number}</div>
                  <p className="text-warm-gray mb-2">{stat.text}</p>
                  {stat.highlight && (
                    <p className="text-xl font-semibold text-primary">{stat.highlight}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Benefits of Blood Donation</h2>
            <p className="text-xl text-warm-gray max-w-3xl mx-auto">
              Donating blood doesn't just help others – it can benefit your health too.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="blood-card">
                <CardHeader>
                  <CardTitle className="text-primary text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-warm-gray">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Our Vision</h2>
          <p className="text-xl text-white/90 mb-8">
            We envision a world where no one dies due to lack of blood. A world where finding a blood donor 
            is as simple as a few clicks, and where every eligible person feels empowered to become a life-saver.
          </p>
          <p className="text-lg text-white/80">
            Together, we're building a community of heroes – one donation at a time.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;