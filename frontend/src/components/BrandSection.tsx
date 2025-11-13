import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Target, TrendingUp, Users, Zap } from "lucide-react";

const brandBenefits = [
  {
    icon: Target,
    title: "Targeted Reach",
    description: "Connect with specific demographics through authentic athlete partnerships."
  },
  {
    icon: TrendingUp,
    title: "Measurable ROI",
    description: "Track engagement, reach, and conversion metrics from your NIL campaigns."
  },
  {
    icon: Users,
    title: "Authentic Connections",
    description: "Build genuine relationships with student-athletes who align with your brand values."
  },
  {
    icon: Zap,
    title: "Quick Activation",
    description: "Launch campaigns quickly with our streamlined partnership process."
  }
];

export function BrandSection() {
  return (
    <section id="brands" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="lg:order-1">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758599543157-bc1a94fec33c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHBhcnRuZXJzaGlwJTIwaGFuZHNoYWtlfGVufDF8fHx8MTc1OTMwMjcyN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Business partnership handshake"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="lg:order-2">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              For Brands & Sponsors
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Partner with the next generation of athletes. Reach engaged audiences 
              through authentic storytelling and meaningful partnerships.
            </p>

            {/* Brand Benefits */}
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              {brandBenefits.map((benefit, index) => (
                <Card key={index} className="border border-gray-200">
                  <CardHeader className="pb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                      <benefit.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-gray-600">
                      {benefit.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Partner With Us
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}