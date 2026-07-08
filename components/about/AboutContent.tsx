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
    title: 'Travel & Culture',
    desc: 'Destinations, local experiences, and stories that go beyond the typical guidebook.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
      </svg>
    ),
    title: 'Lifestyle & Wellness',
    desc: 'Health, habits, career, and everyday advice to help you live with more intention.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    title: 'Ideas & Inspiration',
    desc: 'Sports, history, relationships, and topics that spark curiosity and meaningful conversation.',
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
              Tourism & hospitality professional, content writer, and lifelong learner —
              sharing thoughtful articles that inform, inspire, and help in everyday life.
            </p>
          </RevealSection>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <RevealSection>
          <p className="section-label">About Me</p>
          <h2 className="mt-2 font-display text-3xl font-medium text-ink dark:text-cream md:text-4xl">
            A Space for Curious Readers
          </h2>
        </RevealSection>

        <div className="mt-10 space-y-6">
          <RevealSection delay={100}>
            <p className="text-lg leading-relaxed text-ink/85 dark:text-cream/85">
              Welcome! I&apos;m <strong className="font-semibold text-ink dark:text-cream">Salina Maharjan</strong>,
              a tourism and hospitality professional, content writer, and lifelong learner with a
              Bachelor&apos;s degree in <strong className="font-semibold text-ink dark:text-cream">Travel and Tourism Management</strong>.
              I created this blog as a place to share reliable, engaging, and thoughtfully researched
              content that informs, inspires, and helps readers in their everyday lives.
            </p>
          </RevealSection>

          <RevealSection delay={200}>
            <p className="text-lg leading-relaxed text-ink/85 dark:text-cream/85">
              While my professional background is rooted in the travel and hospitality industry, my
              interests extend far beyond a single niche. Here, you&apos;ll find articles covering{' '}
              <strong className="font-semibold text-ink dark:text-cream">travel, health, sports, lifestyle, career, relationships, history</strong>,
              and other topics that encourage curiosity, personal growth, and meaningful conversations.
            </p>
          </RevealSection>

          <RevealSection delay={300}>
            <p className="text-lg leading-relaxed text-ink/85 dark:text-cream/85">
              My experience working in tour operations, travel planning, and guest services has taught me
              the value of clear communication, attention to detail, and understanding people&apos;s diverse
              interests. Those same principles guide every article I publish, whether I&apos;m exploring a
              hidden destination in Nepal, discussing healthy habits, analyzing a football match, or sharing
              practical lifestyle advice.
            </p>
          </RevealSection>

          <RevealSection delay={400}>
            <p className="text-lg leading-relaxed text-ink/85 dark:text-cream/85">
              Every piece of content is created with a commitment to{' '}
              <strong className="font-semibold text-ink dark:text-cream">accuracy, authenticity, and readability</strong>.
              My goal isn&apos;t simply to share information, it&apos;s to provide content that is useful,
              trustworthy, and enjoyable to read.
            </p>
          </RevealSection>

          <RevealSection delay={500}>
            <p className="text-lg leading-relaxed text-ink/85 dark:text-cream/85">
              I believe learning never stops, and the best ideas often come from exploring different
              perspectives. Through this platform, I hope to build a space where readers can discover
              new places, gain practical knowledge, stay informed, and find inspiration for everyday life.
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
              Topics I Write About
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
              To create reliable, thoughtfully researched content that informs, inspires, and helps
              readers discover new ideas and find inspiration for everyday life
            </blockquote>
            <p className="mt-6 text-base leading-relaxed text-ink-muted dark:text-cream/60">
              — whether through travel stories, practical advice, or conversations that encourage
              curiosity and personal growth.
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
              Happy Reading
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-cream/80">
              Thank you for visiting, and I hope you enjoy reading as much as I enjoy
              creating content for you.
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
