import Image from 'next/image';
import Link from 'next/link';

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-brand-navy text-white py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Name, Your Image, Your Legacy.<br/> We Protect and Empower It All.</h1>
            <p className="text-lg md:text-xl text-slate-200 max-w-3xl">
              At NIL Athlete Law & Agency PLLC, we are built on a simple, powerful belief:<br/> Your athletic talent is only one part of your potential.<br/>Your name, image, and likeness (NIL) represent your personal brand—a valuable business asset that deserves expert protection and strategic growth. <br/>We are more than just legal advisors; we are your partners in building a foundation for generational wealth.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Image
              src="/logo/NIL Law.svg"
              alt="NIL Law Logo"
              width={300}
              height={300}
              className="w-64 md:w-80"
            />
          </div>
        </div>
      </section>

      {/* Our Story & Mission Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Unique Commitment: <br/> Beyond the Contract</h2>
            <p className="text-gray-700 mb-4">
              While many may offer deal-making, we provide a comprehensive blueprint for lifelong success. Our promise is twofold:
            </p>
            <ol className="list-disc list-inside space-y-3 ml-4">
              <li className="text-gray-700">
                <span className="font-semibold">Top-of-the-Line Representation:</span> We are Texas' premier law firm specializing exclusively in NIL. We provide fierce legal advocacy to protect your rights, negotiate your contracts, and safeguard your eligibility.
              </li>
              <li className="text-gray-700">
                <span className="font-semibold">Paving Your Road to Generational Wealth:</span> We go beyond the signature on the deal. Our mission is to empower you with the knowledge and mentorship to transform NIL earnings into lasting financial freedom and business success.
              </li>
            </ol>
          </div>
          <div className="bg-brand-navy text-white p-8 rounded-lg">
            <h2 className="text-3xl font-bold mb-6">Your Journey Starts Here</h2>
            <p className="text-slate-100 mb-4">
              You've dedicated your life to excellence on the field. Now, let us help you apply that same discipline to building your legacy off it.
              Ready to build more than just a brand? Contact Us today to begin the journey.
            </p>
            <Link href="/signup"
            className="btn-primary !bg-slate-700">
                Get Started!
            </Link>
            <p className="text-slate-200 text-sm mt-4">
              Serving over 10,000 athletes across 500+ universities nationwide
            </p>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="bg-brand-navy py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-6">The Pillars of Our Mentorship</h2>
          <h3 className="text-white text-center mb-6">We equip you with the tools not just for your next game, but for your entire life. Our holistic program includes:</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-brand-navy text-white rounded-full flex items-center justify-center mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Money Management Mastery</h3>
              <p className="text-gray-600 text-sm">
                Learn how to budget, save, and manage your new income responsibly.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-brand-navy text-white rounded-full flex items-center justify-center mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Business Acumen & Investing</h3>
              <p className="text-gray-600 text-sm">
                Gain foundational knowledge in business and explore strategic investment opportunities to make your money work for you.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-brand-navy text-white rounded-full flex items-center justify-center mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Entrepreneurship Guidance</h3>
              <p className="text-gray-600 text-sm">
                For those looking to start their own ventures, we provide the initial strategic insight to help you build your own brand.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-slate-700 text-white rounded-full flex items-center justify-center mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="text-xl font-semibold mb-3">Maintaining a Healthy Lifestyle</h3>
              <p className="text-gray-600 text-sm">
                We provide resources and guidance on balancing the new demands of business with the discipline required to excel in your sport and personal life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why We Exist Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-6">Why Texas Athletes Trust Us</h2>
          <p className="text-center text-gray-700 mb-12 max-w-3xl mx-auto">
            <span className="font-semibold">Exclusive NIL Expertise </span><br/> Our practice is 100% dedicated to the complex landscape of Name, Image, and Likeness. We know the NCAA rules, Texas laws, and the business landscape inside and out.<br/>
              <span className="font-semibold">Attorney-Led Assurance</span><br/>As a licensed law firm (PLLC), your dealings are protected by attorney-client privilege. This means the highest standard of confidentiality and a legal duty to put your interests first.<br/>
              <span className="font-semibold">Proven Insight</span><br/>Our team includes a former NCAA athlete-turned-attorney, providing a unique understanding of the challenges and opportunities you face.
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
      <section className="bg-brand-navy text-white py-16 px-6">
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

      {/* Footer Section */}
      <footer className="bg-brand-navy text-white py-12 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">NIL Athlete Law</h3>
            <p className="text-slate-300 text-sm mb-4">
              Empowering student athletes through expert legal and financial guidance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/about" className="text-slate-300 hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/services" className="text-slate-300 hover:text-white transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="/resources" className="text-slate-300 hover:text-white transition-colors">
                  Resources
                </a>
              </li>
              <li>
                <a href="/blog" className="text-slate-300 hover:text-white transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>📧 info@nilathletelaw.com</li>
              <li>📞 (555) 123-4567</li>
              <li>📍 Dallas, TX</li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a href="#" className="text-slate-300 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-slate-700 flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
          <p>© 2025 NIL Athlete Law and Finance. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="/cookies" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}