import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Vote, Shield, Clock, Users, Award, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";

const Index = () => {
  const features = [
    {
      icon: <Vote className="h-12 w-12 text-primary" />,
      title: "Secure Voting",
      description: "Cast your vote with confidence using our state-of-the-art secure voting system",
    },
    {
      icon: <Shield className="h-12 w-12 text-primary" />,
      title: "Data Protection",
      description: "Your data and votes are protected with advanced encryption and security measures",
    },
    {
      icon: <Clock className="h-12 w-12 text-primary" />,
      title: "Real-time Results",
      description: "View election results instantly as they happen with our real-time updates",
    },
    {
      icon: <Users className="h-12 w-12 text-primary" />,
      title: "Multiple Elections",
      description: "Participate in various elections with different candidates and positions",
    },
    {
      icon: <Award className="h-12 w-12 text-primary" />,
      title: "Candidate Profiles",
      description: "Learn about candidates through detailed profiles and campaign information",
    },
    {
      icon: <Lock className="h-12 w-12 text-primary" />,
      title: "Verified Identity",
      description: "Ensure election integrity with our secure user verification system",
    },
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Welcome to VoteSecure
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your trusted platform for secure and transparent online voting. Participate in
            elections with confidence and make your voice heard.
          </p>
          <div className="flex gap-4 justify-center mt-8">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link to="/register">Get Started</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/elections">View Elections</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="p-6 hover:shadow-lg transition-shadow border-2 hover:border-primary/50"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                {feature.icon}
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center bg-accent/10 rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Make Your Voice Heard?</h2>
          <p className="text-lg text-gray-600 mb-6">
            Join thousands of voters who trust VoteSecure for fair and transparent elections.
          </p>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link to="/register">Create Account</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Index;