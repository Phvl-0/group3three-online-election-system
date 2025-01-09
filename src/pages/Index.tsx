import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Vote, Shield, Clock } from "lucide-react";
import Layout from "@/components/Layout";

const Index = () => {
  const features = [
    {
      icon: <Vote className="h-12 w-12 text-primary" />,
      title: "Secure Voting",
      description: "Cast your vote with confidence using our secure voting system",
    },
    {
      icon: <Shield className="h-12 w-12 text-primary" />,
      title: "Data Protection",
      description: "Your data and votes are protected with state-of-the-art encryption",
    },
    {
      icon: <Clock className="h-12 w-12 text-primary" />,
      title: "Real-time Results",
      description: "View election results as they happen with our real-time updates",
    },
  ];

  return (
    <Layout>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">Welcome to VoteSecure</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your trusted platform for secure and transparent online voting. Participate in
          elections with confidence.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {features.map((feature, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
              {feature.icon}
              <h3 className="text-xl font-semibold mt-4 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground animate-vote-pulse">
          View Active Elections
        </Button>
      </div>
    </Layout>
  );
};

export default Index;