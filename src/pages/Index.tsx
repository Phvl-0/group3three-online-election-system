import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Vote, ChartBar, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";

const Index = () => {
  const features = [
    {
      icon: <Shield className="w-12 h-12 text-primary" />,
      title: "Secure Voting",
      description: "State-of-the-art encryption and authentication to protect your vote",
    },
    {
      icon: <Vote className="w-12 h-12 text-primary" />,
      title: "Easy Participation",
      description: "Simple and intuitive interface for casting your vote",
    },
    {
      icon: <ChartBar className="w-12 h-12 text-primary" />,
      title: "Real-time Results",
      description: "Watch election results unfold in real-time with live updates",
    },
    {
      icon: <Users className="w-12 h-12 text-primary" />,
      title: "Candidate Profiles",
      description: "Detailed information about each candidate to help you decide",
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Secure Online Voting System
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience democracy in the digital age with our secure, transparent, and easy-to-use voting platform.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/register">
                Get Started
                <ArrowRight className="ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/elections">View Elections</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-primary/10 to-blue-600/10 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold mb-4">Ready to Make Your Voice Heard?</h2>
          <p className="text-lg text-gray-600 mb-6">
            Join thousands of voters who trust our platform for secure and transparent elections.
          </p>
          <Button asChild size="lg">
            <Link to="/register">Register Now</Link>
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-4xl font-bold text-primary mb-2">100%</h3>
            <p className="text-gray-600">Secure Voting</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-primary mb-2">24/7</h3>
            <p className="text-gray-600">System Availability</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-primary mb-2">10k+</h3>
            <p className="text-gray-600">Active Users</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;