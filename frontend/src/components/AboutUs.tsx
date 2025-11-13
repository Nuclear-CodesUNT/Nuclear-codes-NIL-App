import { Shield, TrendingUp, Briefcase, Heart } from "lucide-react";
import { Button } from "./ui/button";

export function AboutUs() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Your Name, Your Image, Your Legacy.{" "}
            <span className="text-[#1E3A8A]">We Protect and Empower It All.</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            At NIL Athlete Law & Agency PLLC, we are built on a simple, powerful belief: your 
            athletic talent is only one part of your potential. Your name, image, and likeness (NIL) 
            represent your personal brand—a valuable business asset that deserves expert protection 
            and strategic growth. We are more than just legal advisors; we are your partners in 
            building a foundation for generational wealth.
          </p>
        </div>

        {/* Our Unique Commitment */}
        <div className="mb-16">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            Our Unique Commitment: Beyond the Contract
          </h3>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto text-center">
            While many may offer deal-making, we provide a comprehensive blueprint for lifelong 
            success.
          </p>
        </div>
      </div>
    </section>
  );
}