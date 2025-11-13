import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Handshake, TrendingUp, Shield, Users, DollarSign, Star } from "lucide-react";

const features = [
  {
    icon: DollarSign,
    title: "Monetize Your Brand",
    description: "Turn your athletic achievements and social media presence into real income opportunities."
  },
  {
    icon: Handshake,
    title: "Brand Partnerships",
    description: "Connect with local and national brands looking to partner with student-athletes."
  },
  {
    icon: Shield,
    title: "NCAA Compliant",
    description: "All opportunities are vetted to ensure compliance with NCAA NIL regulations."
  },
  {
    icon: TrendingUp,
    title: "Performance Analytics",
    description: "Track your social media growth and measure the impact of your partnerships."
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Join a network of student-athletes sharing experiences and best practices."
  },
  {
    icon: Star,
    title: "Career Development",
    description: "Build professional skills and network that extend beyond your athletic career."
  }
];

export function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why Choose NIL Connect?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We provide the tools, connections, and support you need to maximize 
            your Name, Image, and Likeness opportunities while staying compliant.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}