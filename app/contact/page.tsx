// app/contact/page.tsx
import { ContactCard } from '@/components/contact/ContactCard';

const CONTACT_EMAIL = 'campuslinkmw@gmail.com';
const WHATSAPP_NUMBER = '265981789298';

const emailBody = `Hi CampusLink Team,

My name is [Your Name]. I'm a student from [School/College], studying [Programme/Year].

I'd like to share some feedback about CampusLink:

[Your feedback / issue / suggestion]

Thank you.`;

const whatsappMessage = `Hi, my name is [Name]. I'm a student from [School/College], studying [Programme/Year]. I'd like to share some feedback about CampusLink.

[Feedback / issue / suggestion]

Thank you.`;

export default function ContactPage() {
  const emailHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    'CampusLink Feedback'
  )}&body=${encodeURIComponent(emailBody)}`;

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div className="min-h-screen bg-off-white py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-text mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-muted-text max-w-2xl mx-auto">
            Questions, feedback, suggestions — we would love to hear from you.
            Choose whichever way is easiest.
          </p>
        </div>

        {/* Two contact options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <ContactCard
            icon={<EmailIcon />}
            title="Email Us"
            description="Open your email app with our address ready to go. Type your message and send — we'll reply as soon as we can."
            buttonLabel="Email Us"
            href={emailHref}
          />

          <ContactCard
            icon={<WhatsAppIcon />}
            title="WhatsApp"
            description="Open WhatsApp with a message ready to edit. Change anything you like before you send it."
            buttonLabel="Message on WhatsApp"
            href={whatsappHref}
            external
          />
        </div>

        {/* Closing note */}
        <div className="bg-white border border-gray-200 p-8 text-center">
          <p className="text-muted-text">
            We look forward to hearing from you. Your questions, feedback,
            suggestions, and reports help us improve CampusLink.
          </p>
        </div>
      </div>
    </div>
  );
}

function EmailIcon() {
  return (
    <svg
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      className="h-6 w-6"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}
