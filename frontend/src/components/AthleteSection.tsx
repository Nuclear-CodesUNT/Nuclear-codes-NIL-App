import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { CheckCircle, Trophy, Users, DollarSign } from "lucide-react";

const benefits = [
  "Create and showcase your personal brand",
  "Connect with local and national sponsors",
  "Earn money through endorsements and appearances",
  "Access educational resources about NIL rights",
  "Get support with contract negotiations",
  "Track your earnings and partnership performance"
];

const stats = [
  { icon: Trophy, label: "Athletes Registered", value: "10,000+" },
  { icon: DollarSign, label: "Total Earnings", value: "$2.5M+" },
  { icon: Users, label: "Brand Partners", value: "500+" }
];

export function AthleteSection() {
  return (
    <section id="athletes" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              For Student-Athletes
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Take control of your Name, Image, and Likeness. Build your personal brand, 
              connect with sponsors, and start earning while you compete.
            </p>

            {/* Benefits List */}
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Image and Stats */}
          <div className="space-y-6">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1623208525215-a573aacb1560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwYXRobGV0ZSUyMHRyYWluaW5nfGVufDF8fHx8MTc1OTM2ODIzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Student athlete training"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-4">
                    <stat.icon className="h-6 w-6 text-[#1E3A8A] mx-auto mb-2" />
                    <div className="font-bold text-lg text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}