
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Shield, Check, ArrowRight, FileCheck, Lock, Timer } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Home = () => {
  const { user } = useAuth();
  
  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted/30 py-20">
        <Container className="flex flex-col items-center text-center space-y-8">
          <div className="inline-block p-3 bg-primary/10 rounded-full">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Secure Identity Verification for the Modern Business
            </h1>
            <p className="text-xl text-muted-foreground">
              Verify identity documents and credentials with ease. Our platform simplifies the KYC process
              for businesses of all sizes.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center">
            {user?.isAuthenticated ? (
              <Link to="/kyc">
                <Button size="lg" className="gap-2">
                  Start Verification
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button size="lg" className="gap-2">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </Container>
      </section>
      
      {/* Features Section */}
      <section className="py-20">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Comprehensive Verification Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform offers a wide range of verification services to meet regulatory requirements and protect your business.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-lg mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
      
      {/* CTA Section */}
      <section className="bg-muted py-20">
        <Container>
          <div className="flex flex-col md:flex-row items-center md:justify-between gap-8 bg-card border rounded-xl p-8 shadow-md">
            <div className="space-y-4 text-center md:text-left">
              <h2 className="text-2xl font-bold">Ready to streamline your verification process?</h2>
              <p className="text-muted-foreground">
                Sign up today and simplify your KYC workflow with our secure platform.
              </p>
            </div>
            
            {user?.isAuthenticated ? (
              <Link to="/kyc">
                <Button size="lg" className="gap-2">
                  Start Verification
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button size="lg" className="gap-2">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </Container>
      </section>
    </div>
  );
};

const features = [
  {
    title: "Identity Verification",
    description: "Verify user identity with Aadhaar cards, PAN cards, and biometric authentication.",
    icon: FileCheck,
  },
  {
    title: "Business Verification",
    description: "Validate business entities through CIN, DIN, and GSTIN verification.",
    icon: Check,
  },
  {
    title: "Bank Account Verification",
    description: "Verify bank account details and IFSC codes for secure financial transactions.",
    icon: Lock,
  },
  {
    title: "Real-time Processing",
    description: "Get instant verification results with our efficient processing system.",
    icon: Timer,
  },
  {
    title: "Comprehensive Reports",
    description: "Generate detailed verification reports for your records and compliance needs.",
    icon: FileCheck,
  },
  {
    title: "Secure Data Handling",
    description: "All personal and business data is encrypted and handled with strict security protocols.",
    icon: Shield,
  },
];

export default Home;
