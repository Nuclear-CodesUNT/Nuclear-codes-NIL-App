"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, DollarSign, Shield, Trophy, Users, Zap } from "lucide-react";

// ---------------------------------------------------------------------------
// Typewriter hook — cycles through `words` with typing + deleting animation
// ---------------------------------------------------------------------------
function useTypewriter(
  words: string[],
  typingSpeed = 90,
  deletingSpeed = 50,
  pause = 2200
) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex];
    let delay: number;

    if (!isDeleting && text === current) {
      delay = pause;
      const t = setTimeout(() => setIsDeleting(true), delay);
      return () => clearTimeout(t);
    }

    if (isDeleting && text === "") {
      setIsDeleting(false);
      setWordIndex((i) => (i + 1) % words.length);
      return;
    }

    delay = isDeleting ? deletingSpeed : typingSpeed;
    const t = setTimeout(() => {
      setText(
        isDeleting
          ? current.slice(0, text.length - 1)
          : current.slice(0, text.length + 1)
      );
    }, delay);
    return () => clearTimeout(t);
  }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pause]);

  return text;
}

// ---------------------------------------------------------------------------
// ScrollReveal — uses IntersectionObserver to fade+slide children in
// ---------------------------------------------------------------------------
function ScrollReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.12, rootMargin: "0px 0px -150px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(36px)",
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// FeatureItem — checkmark list entry
// ---------------------------------------------------------------------------
function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3 text-[15px] leading-7 text-slate-300">
      <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-green-500" />
      <span>{text}</span>
    </li>
  );
}

// ---------------------------------------------------------------------------
// StatCard — dark stat tile used below the athlete image
// ---------------------------------------------------------------------------
function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-slate-700/60 bg-brand-card px-6 py-5 text-center">
      <div className="mb-2 text-brand-red">{icon}</div>
      <div className="text-[28px] font-extrabold leading-none text-white">
        {value}
      </div>
      <div className="mt-2 text-sm text-slate-400">{label}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// HeroSection — full-viewport centered layout with aurora glow + stars
// ---------------------------------------------------------------------------
function HeroSection() {
  const typed = useTypewriter(["Name", "Image", "Likeness", "Legacy"]);

  return (
    <section className="bg-brand-bg overflow-hidden pt-2 pb-2">
      {/* Hero card — image with text overlay, like Railway */}
      <div className="relative mx-4 sm:mx-8 md:mx-14 lg:mx-20 rounded-2xl overflow-hidden">
        {/* Background image */}
        <Image
          src="/images/hero-athlete.png"
          alt="College athlete holding a football"
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 95vw, 85vw"
          priority
        />

        {/* Dark overlay — top fade for text legibility, bottom fade into next section */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: `
              linear-gradient(to bottom,
                rgba(12,16,37,0.55) 0%,
                rgba(12,16,37,0.20) 35%,
                rgba(12,16,37,0.30) 65%,
                rgba(12,16,37,0.95) 100%
              )
            `,
          }}
        />

        {/* Stars layer over the top portion */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-80"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.14) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
            opacity: 0.4,
          }}
        />

        {/* Text content — overlays the top of the image */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 pt-16 pb-40 sm:pt-20 sm:pb-56 lg:pt-24 lg:pb-72 min-h-150">

          {/* Main headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
            Your{" "}
            <span
              className="">
              {typed}
            </span>
            <span className="typewriter-cursor" aria-hidden="true" />,
            <br />
            Deserves Value.
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-xl text-lg md:text-xl text-slate-200 leading-relaxed drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)]">
            Connect student athletes with brands and opportunities.
            <br/>
             Turn your
            talent into real income while protecting your amateur status.
          </p>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="/signup"
              className="rounded-xl border border-white/30 bg-brand-navy text-white font-semibold px-7 py-3 hover:opacity-90 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
            >
              Get Started →
            </a>
            <a
              href="/about"
              className="rounded-xl border border-white/30 text-white bg-white/10 backdrop-blur-sm px-7 py-3 hover:bg-white/20 hover:border-white/50 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// MissionSection — dark centered copy block
// ---------------------------------------------------------------------------
function MissionSection() {
  return (
    <section className="bg-brand-bg py-24 px-6">
      <div className="mx-auto max-w-4xl text-center">
        <ScrollReveal>
          <h2 className="text-3xl  font-extrabold leading-tight tracking-tight text-white">
            Your Name, Your Image, Your Legacy.
            <br />
            {" "}
            <span className="text-6xl">
              We Protect and Empower It All.
            </span>
              
          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-9 text-slate-400">
            At NIL Athlete Law &amp; Agency PLLC, we are built on a simple,
            powerful belief: your athletic talent is only one part of your
            potential. Your name, image, and likeness (NIL) represent your
            personal brand, a valuable business asset that deserves expert
            protection and strategic growth. We are more than just legal
            advisors; we are your partners in building a foundation for
            generational wealth.
          </p>

          <h3 className="mt-16 text-3xl font-extrabold tracking-tight text-white">
            Our Unique Commitment: Beyond the Contract
          </h3>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            While many may offer deal-making, we provide a comprehensive
            blueprint for lifelong success.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// FeaturedForSection — three dark feature cards with staggered scroll reveal
// ---------------------------------------------------------------------------
function FeaturedForSection() {
  const cards = [
    {
      icon: <Shield size={28} />,
      title: "Legal Protection",
      body: "Expert NIL attorneys review every deal to protect your amateur status and maximize your rights.",
      delay: 0,
      bgColor: "bg-orange-500"
    },
    {
      icon: <Zap size={28} />,
      title: "Fast Deal Flow",
      body: "From discovery to signed contract in days, not weeks. We handle the paperwork.",
      delay: 100,
      bgColor: "bg-yellow-500"
    },
    {
      icon: <Users size={28} />,
      title: "Brand Connections",
      body: "Access a curated network of brands actively seeking authentic college athlete partnerships.",
      delay: 200,
      bgColor: "bg-green-500"
    },
  ];

  return (
    <section className="bg-brand-bg py-24 px-6">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <ScrollReveal key={card.title} delay={card.delay}>
              <div className="rounded-2xl border border-slate-700/60 bg-brand-card p-8 h-full">
                <div className={`${card.bgColor} p-3 rounded-xl inline-flex mb-5`}>
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {card.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">{card.body}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// AthleteSection — two-column layout with feature list and stat cards
// ---------------------------------------------------------------------------
function AthleteSection() {
  return (
    <section className="bg-brand-bg py-24 px-6">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-14 lg:grid-cols-2 lg:items-start">
        {/* Left column */}
        <ScrollReveal delay={0}>
          <h3 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            For Student Athletes
          </h3>

          <p className="mt-7 text-lg leading-8 text-slate-400">
            Take control of your Name, Image, and Likeness. Build your personal
            brand, connect with sponsors, and start earning while you compete.
          </p>

          <ul className="mt-10 space-y-5">
            <FeatureItem text="Create and showcase your personal brand" />
            <FeatureItem text="Connect with local and national sponsors" />
            <FeatureItem text="Earn money through endorsements and appearances" />
            <FeatureItem text="Access educational resources about NIL rights" />
            <FeatureItem text="Get support with contract negotiations" />
            <FeatureItem text="Track your earnings and partnership performance" />
          </ul>
        </ScrollReveal>

        {/* Right column */}
        <ScrollReveal delay={150}>
          <div className="relative h-80 overflow-hidden rounded-[20px] bg-brand-card sm:h-96">
            <Image
              src="/images/basketball.png"
              alt="swish"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 640px"
            />
          </div>

            <div className="mt-4 grid grid-cols-3 gap-4">
            <StatCard
              icon={<Trophy className="h-6 w-6 text-yellow-400" />}
              value="10,000+"
              label="Athletes Registered"
            />
            <StatCard
              icon={<DollarSign className="h-6 w-6 text-green-500" />}
              value="$2.5M+"
              label="Total Earnings"
            />
            <StatCard
              icon={<Users className="h-6 w-6 text-orange-500" />}
              value="500+"
              label="Brand Partners"
            />
            </div>
        </ScrollReveal>
      </div>
    </section>
  );
}



// ---------------------------------------------------------------------------
// Page root
// ---------------------------------------------------------------------------
export default function NilLandingPage() {
  return (
    <main className="min-h-screen bg-brand-bg text-slate-900">
      <HeroSection />
      <MissionSection />
      <FeaturedForSection />
      <AthleteSection />
    </main>
  );
}
