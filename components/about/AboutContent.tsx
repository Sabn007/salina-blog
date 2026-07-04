'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

function RevealSection({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useReveal();

  return (
    <div
      ref={ref}
      className={cn(
        'translate-y-8 opacity-0 transition-all duration-700 ease-out',
        '[&.revealed]:translate-y-0 [&.revealed]:opacity-100',
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

const HIGHLIGHTS = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    title: 'Authentic Guides',
    desc: 'Written from firsthand experience across Nepal\u2019s diverse landscapes and cultures.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
    ),
    title: 'Hidden Gems',
    desc: 'Discover destinations, foods, and traditions beyond the typical tourist trail.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
      </svg>
    ),
    title: 'Responsible Travel',
    desc: 'Supporting sustainable tourism and the communities that make Nepal extraordinary.',
  },
];

export function AboutContent() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-sage px-4 py-28 text-cream sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-[0.08]">
          <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-gold blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-terracotta blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          <RevealSection>
            <p className="section-label text-gold">About</p>
            <h1 className="mt-4 font-display text-5xl font-medium leading-tight tracking-tight md:text-6xl lg:text-7xl">
              Hi, I&apos;m <em className="text-gold">Salina</em>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-cream/80">
              Tourism & hospitality professional, travel writer, and storyteller —
              helping you experience Nepal beyond the guidebook.
            </p>
          </RevealSection>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <RevealSection>
          <p className="section-label">My Story</p>
          <h2 className="mt-2 font-display text-3xl font-medium text-ink dark:text-cream md:text-4xl">
            Where It All Began
          </h2>
        </RevealSection>

        <div className="mt-10 space-y-6">
          <RevealSection delay={100}>
            <p className="text-lg leading-relaxed text-ink/85 dark:text-cream/85">
              Welcome! I&apos;m <strong className="font-semibold text-ink dark:text-cream">Salina Maharjan</strong>,
              a tourism and hospitality professional with a Bachelor&apos;s degree in Travel and Tourism
              Management and a passion for discovering the beauty, culture, and hidden stories of Nepal.
            </p>
          </RevealSection>

          <RevealSection delay={200}>
            <p className="text-lg leading-relaxed text-ink/85 dark:text-cream/85">
              My journey in the travel industry has allowed me to work in tour operations, travel planning,
              and guest services, giving me valuable insight into what makes a memorable travel experience.
              From organizing tours and coordinating travel arrangements to welcoming guests from around
              the world, I&apos;ve learned that every journey is more than just visiting a destination —
              it&apos;s about creating meaningful experiences.
            </p>
          </RevealSection>

          <RevealSection delay={300}>
            <p className="text-lg leading-relaxed text-ink/85 dark:text-cream/85">
              Through this blog, I aim to share practical travel guides, authentic local experiences,
              destination inspiration, and helpful tips for anyone planning to explore Nepal. Whether
              you&apos;re searching for breathtaking Himalayan adventures, peaceful heritage towns,
              local food recommendations, or hidden cultural gems — my goal is to help you experience
              Nepal beyond the typical tourist attractions.
            </p>
          </RevealSection>

          <RevealSection delay={400}>
            <p className="text-lg leading-relaxed text-ink/85 dark:text-cream/85">
              Every article is written with a focus on accuracy, authenticity, and local insight. I
              believe the best travel experiences come from understanding the people, traditions, and
              stories behind each destination, and I hope this platform inspires you to travel with
              curiosity and confidence.
            </p>
          </RevealSection>
        </div>
      </section>

      {/* Highlights */}
      <section className="bg-cream-dark px-4 py-20 dark:bg-charcoal-light sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <RevealSection>
            <p className="text-center section-label">What You&apos;ll Find Here</p>
            <h2 className="mt-2 text-center font-display text-3xl font-medium text-ink dark:text-cream md:text-4xl">
              Stories With Substance
            </h2>
          </RevealSection>

          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {HIGHLIGHTS.map((item, i) => (
              <RevealSection key={item.title} delay={i * 150}>
                <div className="group rounded-sm bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-charcoal">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-terracotta/10 text-terracotta transition-colors group-hover:bg-terracotta group-hover:text-white">
                    {item.icon}
                  </div>
                  <h3 className="font-display text-xl font-medium text-ink dark:text-cream">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted dark:text-cream/60">
                    {item.desc}
                  </p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <RevealSection>
          <div className="relative rounded-sm border border-ink/5 bg-white p-10 shadow-sm dark:border-cream/10 dark:bg-charcoal-light md:p-14">
            <div className="absolute -top-5 left-10 rounded-sm bg-terracotta px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white">
              My Mission
            </div>
            <blockquote className="font-display text-2xl font-medium leading-snug text-ink dark:text-cream md:text-3xl">
              To inspire meaningful travel by sharing authentic experiences, practical travel advice,
              and the rich cultural heritage of Nepal
            </blockquote>
            <p className="mt-6 text-base leading-relaxed text-ink-muted dark:text-cream/60">
              — helping travelers explore the country with confidence while supporting
              responsible and sustainable tourism.
            </p>
          </div>
        </RevealSection>
      </section>

      {/* Closing */}
      <section className="bg-sage px-4 py-20 text-cream sm:px-6 lg:px-8">
        <RevealSection>
          <div className="mx-auto max-w-2xl text-center">
            <p className="section-label text-gold">Thank You</p>
            <h2 className="mt-4 font-display text-3xl font-medium md:text-4xl">
              Let&apos;s Explore Together
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-cream/80">
              Thank you for visiting. I hope this website becomes a trusted companion for
              your next adventure in Nepal.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="/contact"
                className="rounded-sm bg-terracotta px-8 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-terracotta-dark"
              >
                Get in Touch
              </a>
              <a
                href="/blog"
                className="rounded-sm border border-cream/30 px-8 py-3 text-sm font-semibold uppercase tracking-wider text-cream transition-colors hover:border-cream hover:bg-cream/10"
              >
                Read the Journal
              </a>
            </div>
          </div>
        </RevealSection>
      </section>
    </>
  );
}
