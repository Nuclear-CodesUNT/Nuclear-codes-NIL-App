export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-800 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About NIL Athlete Law</h1>
          <p className="text-lg md:text-xl text-slate-200 max-w-3xl">
            Empowering student athletes to maximize their potential through expert legal
            guidance, financial education, and comprehensive NIL management solutions.
          </p>
        </div>
      </section>

      {/* Our Story & Mission Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-gray-700 mb-4">
              Founded in 2025, NIL Athlete Law and Finance was born from a simple
              observation: student athletes needed dedicated support to navigate
              the complex world of name, image, and likeness rights.
            </p>
            <p className="text-gray-700">
              Our founding team of sports attorneys, financial advisors, former athletes
              and developers came together with a shared mission: to level the playing
              field and ensure every athlete has access to professional guidance,
              regardless of their sport or school.
            </p>
          </div>
          <div className="bg-slate-700 text-white p-8 rounded-lg">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-slate-100 mb-4">
              To provide student athletes with the tools, knowledge, and
              support they need to protect their rights, maximize their
              opportunities, and build sustainable financial futures through
              responsible NIL management.
            </p>
            <p className="text-slate-200 text-sm">
              Serving over 10,000 athletes across 500+ universities nationwide
            </p>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-slate-700 text-white rounded-full flex items-center justify-center mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Athlete First</h3>
              <p className="text-gray-600 text-sm">
                We put athletes at the center of everything we do, ensuring their interests are
                always protected and prioritized.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-slate-700 text-white rounded-full flex items-center justify-center mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Transparency</h3>
              <p className="text-gray-600 text-sm">
                Clear, honest communication about legal requirements, financial
                implications, and partnership opportunities.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-slate-700 text-white rounded-full flex items-center justify-center mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Education</h3>
              <p className="text-gray-600 text-sm">
                Empowering athletes with knowledge to make informed decisions about
                their name, image, and likeness rights.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-slate-700 text-white rounded-full flex items-center justify-center mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p className="text-gray-600 text-sm">
                Leveraging cutting-edge technology to simplify complex legal and financial
                processes for modern athletes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why We Exist Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-6">Why We Exist</h2>
          <p className="text-center text-gray-700 mb-12 max-w-3xl mx-auto">
            The NIL landscape is complex and constantly evolving. Athletes deserve a trusted partner
            who understands both the legal intricacies and the unique pressures of collegiate sports.
          </p>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-slate-800 mb-2">10,000+</div>
              <div className="text-gray-600">Athletes Served</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-slate-800 mb-2">$50M+</div>
              <div className="text-gray-600">Deals Facilitated</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-slate-800 mb-2">500+</div>
              <div className="text-gray-600">Partner Universities</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-slate-800 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What Athletes Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-700 p-6 rounded-lg">
              <p className="text-slate-100 mb-4 italic">
                "This platform completely transformed how I manage my NIL deals. The legal
                guidance and financial tools are absolutely essential for any student
                athlete."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-500 rounded-full"></div>
                <div>
                  <div className="font-semibold">Marcus Johnson</div>
                  <div className="text-sm text-slate-300">Football Player, University of Texas</div>
                </div>
              </div>
            </div>
            <div className="bg-slate-700 p-6 rounded-lg">
              <p className="text-slate-100 mb-4 italic">
                "Finally, a solution built specifically for athletes. This team understands our
                unique challenges and provides expert support every step of the way."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-500 rounded-full"></div>
                <div>
                  <div className="font-semibold">Labrion James</div>
                  <div className="text-sm text-slate-300">Basketball Player, Akron, Ohio</div>
                </div>
              </div>
            </div>
            <div className="bg-slate-700 p-6 rounded-lg">
              <p className="text-slate-100 mb-4 italic">
                "The resources and educational content helped me navigate complex
                contracts with confidence. I recommend this to every athlete
                serious about their NIL opportunities."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-500 rounded-full"></div>
                <div>
                  <div className="font-semibold">David Martinez</div>
                  <div className="text-sm text-slate-300">Baseball Player, UCLA</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Leadership Team</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="font-semibold text-lg">Jennifer Walsh</h3>
              <p className="text-gray-600 text-sm">Founder & CEO</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="font-semibold text-lg">Michael Stevens</h3>
              <p className="text-gray-600 text-sm">Chief Legal Officer</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="font-semibold text-lg">Amanda Foster</h3>
              <p className="text-gray-600 text-sm">Head of Athlete Relations</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="font-semibold text-lg">Robert Chen</h3>
              <p className="text-gray-600 text-sm">Chief Financial Advisor</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}