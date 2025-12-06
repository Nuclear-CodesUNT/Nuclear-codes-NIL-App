export default async function Home() {
  return (
  <>
    <header className="w-full bg-white h-[64.8px] flex items-center border-b border-gray-200">
  <div className="max-w-[1280px] w-full mx-auto flex items-center justify-between px-4">

    
    {/** LEFT — Logo / Brand **/}
    <div className="flex items-center">
      <a href="/" className="text-xl font-bold text-black">
        NIL Connect
      </a>
    </div>

    {/** CENTER — Navigation (3 clickable links) **/}
    <nav className="flex items-center justify-center gap-10">
      <a 
        href="/athletes" 
        className="flex items-center gap-2 text-black hover:text-gray-600 transition"
      >
        <span>👤</span>
        <span>For Athletes</span>
      </a>

      <a 
        href="/brands" 
        className="flex items-center gap-2 text-black hover:text-gray-600 transition"
      >
        <span>🎁</span>
        <span>For Brands</span>
      </a>

      <a 
        href="/contact" 
        className="flex items-center gap-2 text-black hover:text-gray-600 transition"
      >
        <span>✉️</span>
        <span>Contact</span>
      </a>
    </nav>

    {/** RIGHT — Icons + CTA button (all clickable) **/}
    <div className="flex justify-end items-center gap-6">

      <a href="/apps" className="hover:text-gray-600 transition">
        ▦
      </a>

      <a href="/messages" className="relative hover:text-gray-600 transition">
        💬
        <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
          3
        </span>
      </a>

      <a href="/account" className="hover:text-gray-600 transition">
        👤
      </a>

      <a 
        href="/get-started" 
        className="bg-[#1A3B8A] text-white px-5 py-2 rounded-md hover:bg-[#133069] transition"
      >
        Get Started
      </a>

    </div>
  </div>
</header>

<section className="w-full bg-gradient-to-br from-[#EEF4FF] to-[#DCE8FF] py-20">
  <div className="max-w-[1280px] w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-4">


    {/* LEFT — Text */}
    <div>
      <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
        Your Name, Image<br/> & Likeness
      </h1>

      <p className="text-gray-600 text-lg leading-relaxed mb-10 max-w-xl">
        Connect student-athletes with brands and opportunities. Turn your
        talent, social presence, and personal brand into income while
        maintaining your amateur status.
      </p>

      <div className="flex gap-4">
        <a 
          href="/athletes"
          className="bg-[#1A3B8A] text-white px-6 py-3 rounded-md font-medium hover:bg-[#133069] transition"
        >
          Join as Athlete
        </a>

        <a 
          href="/brands"
          className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition"
        >
          Partner as Brand
        </a>
      </div>
    </div>

    {/* RIGHT — Image with decorative shapes */}
    <div className="relative flex justify-center">
      
      {/* Decorative circle — top right */}
      <div className="absolute -top-6 -right-6 w-20 h-20 bg-yellow-300 opacity-60 rounded-full"></div>

      {/* Decorative circle — bottom center */}
      <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-blue-300 opacity-40 rounded-full"></div>

      {/* Main card */}
      <div className="bg-white rounded-xl shadow-lg p-4 max-w-full">
        <img 
          src="/logo/NIL Law.svg"
          alt="NIL Law logo"
          width={584}
          height={338}
          className="rounded-lg w-full h-auto"
        />
      </div>
    </div>

  </div>
</section>

<section className="w-full bg-white py-24">
  <div className="max-w-[1280px] w-full mx-auto text-center px-4">


    {/* MAIN HEADLINE */}
    <h2 className="text-5xl font-bold text-gray-900 leading-tight mb-8">
      Your Name, Your Image, Your Legacy.
    </h2>

    {/* SUPPORTING PARAGRAPH */}
    <p className="text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto mb-16">
      At NIL Athlete Law & Agency PLLC, we are built on a simple, powerful belief: 
      your athletic talent is only one part of your potential. Your name, image, and 
      likeness (NIL) represent your personal brand—a valuable business asset that deserves 
      expert protection and strategic growth. We are more than just legal advisors; we are 
      your partners in building a foundation for generational wealth.
    </p>

    {/* SUBHEADLINE */}
    <h3 className="text-2xl font-semibold text-gray-900 mb-6">
      Our Unique Commitment: Beyond the Contract
    </h3>

    {/* FINAL PARAGRAPH */}
    <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
      While many may offer deal-making, we provide a comprehensive blueprint for lifelong success.
    </p>

  </div>
</section>

<section className="w-full bg-white py-24">
  <div className="max-w-[1216px] w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start px-4">


    {/* LEFT — Text */}
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        For Student-Athletes
      </h2>

      <p className="text-gray-700 text-lg leading-relaxed mb-8 max-w-lg">
        Take control of your Name, Image, and Likeness. Build your personal brand, 
        connect with sponsors, and start earning money while you compete.
      </p>

      {/* BULLET LIST */}
      <ul className="space-y-4 text-gray-700 text-lg">
        <li className="flex items-start gap-3">
          <span className="text-green-500 text-xl">✔</span>
          Create and showcase your personal brand
        </li>
        <li className="flex items-start gap-3">
          <span className="text-green-500 text-xl">✔</span>
          Connect with local and national sponsors
        </li>
        <li className="flex items-start gap-3">
          <span className="text-green-500 text-xl">✔</span>
          Earn money through endorsements and appearances
        </li>
        <li className="flex items-start gap-3">
          <span className="text-green-500 text-xl">✔</span>
          Access educational resources about NIL rights
        </li>
        <li className="flex items-start gap-3">
          <span className="text-green-500 text-xl">✔</span>
          Get support with contract negotiations
        </li>
        <li className="flex items-start gap-3">
          <span className="text-green-500 text-xl">✔</span>
          Track your earnings and partnership performance
        </li>
      </ul>
    </div>

    {/* RIGHT — Image + Stats */}
    <div className="space-y-6">

      {/* MAIN IMAGE CARD */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <img
          src="/images/ImageWithFallback.svg"
          alt="Student athletes running"
          width={327}
          height={178}
          className="rounded-xl w-full h-auto object-cover"
        />
      </div>

      {/* STATS SECTION */}
        <div className="grid grid-cols-1 sm:grid-cols-3 bg-white rounded-xl shadow-md border border-gray-100 p-6 text-center gap-6 sm:gap-0">
        
        {/* CARD 1 */}
        <div className="flex flex-col items-center border-r border-gray-200">
          <span className="text-gray-800 text-2xl font-bold mb-1">10,000+</span>
          <span className="text-gray-500 text-sm">Athletes Registered</span>
        </div>

        {/* CARD 2 */}
        <div className="flex flex-col items-center border-r border-gray-200">
          <span className="text-gray-800 text-2xl font-bold mb-1">$2.5M+</span>
          <span className="text-gray-500 text-sm">Total Earnings</span>
        </div>

        {/* CARD 3 */}
        <div className="flex flex-col items-center">
          <span className="text-gray-800 text-2xl font-bold mb-1">500+</span>
          <span className="text-gray-500 text-sm">Brand Partners</span>
        </div>

      </div>
    </div>

  </div>
</section>

</>

  );
}


