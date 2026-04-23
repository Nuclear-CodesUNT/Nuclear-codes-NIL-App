"use client";

import Image from "next/image";
import {
  CheckCircle2,
  DollarSign,
  Trophy,
  Users,
} from "lucide-react";

type StatCardProps = {
  icon: React.ReactNode;
  value: string;
  label: string;
};

type FeatureItemProps = {
  text: string;
};

function FeatureItem({ text }: FeatureItemProps) {
  return (
    <li className="flex items-start gap-3 text-[15px] leading-7 text-slate-600">
      <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-green-500" />
      <span>{text}</span>
    </li>
  );
}

function StatCard({ icon, value, label }: StatCardProps) {
  return (
    <div className="flex min-h-29.5 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-5 text-center shadow-sm">
      <div className="mb-2 text-[#27469a]">{icon}</div>
      <div className="text-[32px] font-extrabold leading-none text-slate-900">
        {value}
      </div>
      <div className="mt-2 text-sm text-slate-500">{label}</div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="bg-[#dfe8f4]">
      <div className="mx-auto grid max-w-360 grid-cols-1 items-center gap-14 px-6 py-16 md:px-10 lg:grid-cols-2 lg:px-16 lg:py-24 xl:px-20">
        <div className="max-w-140">
          <h1 className="max-w-130 text-5xl font-extrabold leading-[1.02] tracking-[-0.03em] text-slate-900 md:text-6xl">
            Your Name, Image
            <br />&amp; Likeness
            <br />
            <span className="text-brand-dark">Deserve Value.</span>
          </h1>

          <p className="mt-8 max-w-130 text-lg leading-8 text-slate-600">
            Connect student-athletes with brands and opportunities. Turn your
            talent, social presence, and personal brand into real income while
            maintaining your amateur status.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a href="/signup" className="rounded-xl bg-brand-dark px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95">
              Join as Athlete
            </a>
            <a href="/signup" className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50">
              Partner as Brand
            </a>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="rounded-[22px] bg-white p-4 shadow-sm md:p-5">
            <div className="relative h-70 w-full overflow-hidden rounded-md bg-[#0c1125] sm:h-85 sm:w-130 lg:h-115 lg:w-165">
              <Image
                src="/logo/NIL Law.svg"
                alt="NIL Law logo"
                fill
                className="object-contain p-8"
                sizes="(max-width: 1024px) 100vw, 660px"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MissionSection() {
  return (
    <section className="bg-[#f7f7f8]">
      <div className="mx-auto max-w-295 px-6 py-20 text-center md:px-10 lg:px-16 lg:py-24">
        <h2 className="mx-auto max-w-270 text-4xl font-extrabold leading-tight tracking-[-0.03em] text-slate-900 md:text-5xl">
          Your Name, Your Image, Your Legacy.{" "}
          <span className="text-brand-navy">
            We Protect and Empower It All.
          </span>
        </h2>

        <p className="mx-auto mt-8 max-w-237.5 text-lg leading-9 text-slate-500">
          At NIL Athlete Law &amp; Agency PLLC, we are built on a simple,
          powerful belief: your athletic talent is only one part of your
          potential. Your name, image, and likeness (NIL) represent your
          personal brand—a valuable business asset that deserves expert
          protection and strategic growth. We are more than just legal advisors;
          we are your partners in building a foundation for generational wealth.
        </p>

        <h3 className="mt-16 text-3xl font-extrabold tracking-[-0.02em] text-slate-900">
          Our Unique Commitment: Beyond the Contract
        </h3>

        <p className="mx-auto mt-6 max-w-190 text-lg leading-8 text-slate-500">
          While many may offer deal-making, we provide a comprehensive blueprint
          for lifelong success.
        </p>
      </div>
    </section>
  );
}

function AthleteSection() {
  return (
    <section className="pb-20">
      <div className="mx-auto grid max-w-360 grid-cols-1 gap-14 px-6 md:px-10 lg:grid-cols-[1fr_1.05fr] lg:px-16 xl:px-20">
        <div className="rounded-sm px-6 py-14 md:px-10 lg:min-h-162.5 lg:px-12 lg:py-20">
          <div className="max-w-140">
            <h3 className="text-4xl font-extrabold tracking-[-0.03em] text-slate-900 md:text-5xl">
              For Student Athletes
            </h3>

            <p className="mt-7 text-lg leading-8 text-slate-600">
              Take control of your Name, Image, and Likeness. Build your
              personal brand, connect with sponsors, and start earning while you
              compete.
            </p>

            <ul className="mt-10 space-y-5">
              <FeatureItem text="Create and showcase your personal brand" />
              <FeatureItem text="Connect with local and national sponsors" />
              <FeatureItem text="Earn money through endorsements and appearances" />
              <FeatureItem text="Access educational resources about NIL rights" />
              <FeatureItem text="Get support with contract negotiations" />
              <FeatureItem text="Track your earnings and partnership performance" />
            </ul>
          </div>
        </div>

        <div className="flex flex-col justify-end">
          <div className="relative h-80 overflow-hidden rounded-[20px] bg-slate-200 sm:h-105 lg:h-130">
            <Image
              src="/images/ImageWithFallback.svg"
              alt="Student athletes running on a track"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 700px"
            />
          </div>

          {/* <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              icon={<Trophy className="h-6 w-6" />}
              value="10,000+"
              label="Athletes Registered"
            />
            <StatCard
              icon={<DollarSign className="h-6 w-6" />}
              value="$2.5M+"
              label="Total Earnings"
            />
            <StatCard
              icon={<Users className="h-6 w-6" />}
              value="500+"
              label="Brand Partners"
            />
          </div> */}
        </div>
      </div>
    </section>
  );
}

export default function NilLandingPage() {
  return (
    <main className="min-h-screen bg-[#f7f7f8] text-slate-900">
      <HeroSection />
      <MissionSection />
      <AthleteSection />
    </main>
  );
}