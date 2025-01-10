import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Vote, ChartBar, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";

const Index = () => {
  const features = [
    {
      icon: <Shield className="w-12 h-12 text-primary" />,
      title: "Secure Voting",
      description: "State-of-the-art encryption and blockchain technology to protect your vote",
    },
    {
      icon: <Vote className="w-12 h-12 text-primary" />,
      title: "Easy Participation",
      description: "Simple and intuitive interface for casting your vote from anywhere",
    },
    {
      icon: <ChartBar className="w-12 h-12 text-primary" />,
      title: "Real-time Results",
      description: "Watch election results unfold in real-time with live updates and analytics",
    },
    {
      icon: <Users className="w-12 h-12 text-primary" />,
      title: "Candidate Profiles",
      description: "Detailed information about each candidate to help make informed decisions",
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Secure Online Voting System
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience democracy in the digital age with our secure, transparent, and easy-to-use voting platform.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" className="animate-pulse">
              <Link to="/register">
                Get Started
                <ArrowRight className="ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/elections">View Elections</Link>
            </Button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="text-center hover:shadow-lg transition-shadow h-full">
                <CardContent className="pt-6">
                  <div className="mb-4 flex justify-center">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center bg-gradient-to-r from-primary/10 to-blue-600/10 rounded-2xl p-8 mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Make Your Voice Heard?</h2>
          <p className="text-lg text-gray-600 mb-6">
            Join thousands of voters who trust our platform for secure and transparent elections.
          </p>
          <Button asChild size="lg">
            <Link to="/register">Register Now</Link>
          </Button>
        </motion.div>

        {/* Trust Indicators */}
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-4xl font-bold text-primary mb-2">100%</h3>
            <p className="text-gray-600">Secure Voting</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-4xl font-bold text-primary mb-2">24/7</h3>
            <p className="text-gray-600">System Availability</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-4xl font-bold text-primary mb-2">10k+</h3>
            <p className="text-gray-600">Active Users</p>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;