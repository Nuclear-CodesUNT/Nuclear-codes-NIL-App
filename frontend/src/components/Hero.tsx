import { Button } from "./ui/button";
import NilLaw from "../imports/NilLaw1";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="max-w-xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Your Name, Image & Likeness 
              <span className="text-[#1E3A8A]"> Deserves Value</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Connect student-athletes with brands and opportunities. Turn your talent, 
              social presence, and personal brand into real income while maintaining 
              your amateur status.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-[#1E3A8A] hover:bg-[#1E2F5A]">
                Join as Athlete
              </Button>
              <Button size="lg" variant="outline">
                Partner as Brand
              </Button>
            </div>
          </div>

          {/* Hero Logo */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-white flex items-center justify-center p-8">
              <NilLaw />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full opacity-20"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#1E3A8A] rounded-full opacity-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}