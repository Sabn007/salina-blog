import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Privacy Policy',
  description: 'Privacy policy for Salina Journal.',
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-medium text-ink dark:text-cream">
        Privacy Policy
      </h1>
      <div className="prose-blog mt-8 space-y-4">
        <p>
          Salina Journal respects your privacy. We collect only the information you voluntarily
          provide — such as your email address when subscribing to our newsletter or details
          submitted through our contact form.
        </p>
        <p>
          We do not sell or share your personal data with third parties. Newsletter emails are
          managed securely and you may unsubscribe at any time.
        </p>
        <p>
          This site may use cookies for analytics and advertising purposes. By continuing to use
          this site, you consent to our use of cookies in accordance with this policy.
        </p>
      </div>
    </div>
  );
}
