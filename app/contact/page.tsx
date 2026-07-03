import { ContactForm } from '@/components/contact/ContactForm';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Contact',
  description: 'Get in touch with Salina Journal.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="mb-12 text-center">
        <p className="section-label">Get in Touch</p>
        <h1 className="mt-2 font-display text-5xl font-medium text-ink dark:text-cream">
          Contact
        </h1>
        <p className="mt-4 text-ink-muted dark:text-cream/60">
          Collaborations, press inquiries, or just saying hello — we&apos;d love to hear from you.
        </p>
      </header>

      <ContactForm />
    </div>
  );
}
