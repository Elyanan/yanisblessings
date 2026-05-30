import type { Metadata } from 'next'
import { PolicyLayout } from '@/components/policy/policy-layout'
import { PolicySection } from '@/components/policy/policy-section'
import { PolicyContactBlock } from '@/components/policy/policy-contact-block'
import { policySite } from '@/lib/policies/constants'
import { buildBreadcrumbSchema, buildPolicyWebPageSchema } from '@/lib/policies/json-ld'

const title = 'Privacy Policy'
const description =
  "Learn how Yani's Blessings collects, uses, and protects your information when you browse our website, place orders, or submit custom requests in Addis Ababa, Ethiopia."

export const metadata: Metadata = {
  title: `${title} | ${policySite.name}`,
  description,
  alternates: { canonical: `${policySite.url}/privacy-policy` },
  openGraph: {
    title: `${title} | ${policySite.name}`,
    description,
    url: `${policySite.url}/privacy-policy`,
    type: 'website',
  },
}

export default function PrivacyPolicyPage() {
  const jsonLd = [
    buildPolicyWebPageSchema({
      path: '/privacy-policy',
      name: title,
      description,
      dateModified: '2026-05-29',
    }),
    buildBreadcrumbSchema('/privacy-policy', title),
  ]

  return (
    <PolicyLayout title={title} description={description} jsonLd={jsonLd}>
      <PolicySection id="introduction" title="Introduction">
        <p>
          Welcome to {policySite.name} ({policySite.url}). We are a small homemade bakery in Addis Ababa,
          Ethiopia, offering granola, cupcakes, cookies, cakes, and gift boxes. We respect your privacy and
          want you to understand what information we collect and how we use it.
        </p>
        <p>
          This Privacy Policy applies to visitors and customers who use our website in English or Amharic,
          place standard orders through the cart, submit custom order requests, or contact us through our
          forms.
        </p>
      </PolicySection>

      <PolicySection id="information-collected" title="Information We Collect">
        <p>Depending on how you use our website, we may collect:</p>
        <ul>
          <li>
            <strong>Contact information</strong> — such as your name, phone number, email address, and
            delivery address when you place an order or send us a message.
          </li>
          <li>
            <strong>Order information</strong> — items you select, quantities, prices shown at checkout,
            delivery or pickup preference, notes, and order status.
          </li>
          <li>
            <strong>Custom order details</strong> — product type (e.g. birthday cake, gift box), preferred
            date, flavor preferences, budget range, special messages, and any text you provide in custom
            order forms.
          </li>
          <li>
            <strong>Uploaded images</strong> — inspiration photos you attach to custom order requests (for
            example, cake design references).
          </li>
          <li>
            <strong>Technical information</strong> — basic data such as browser type, device type, and pages
            visited, often collected through cookies or analytics tools (see below).
          </li>
          <li>
            <strong>Communication records</strong> — messages you send by email, WhatsApp, or through our
            contact form.
          </li>
        </ul>
        <p>
          We do not intentionally collect sensitive personal data (such as government ID numbers) through
          the website. Please do not send unnecessary sensitive information in order notes or messages.
        </p>
      </PolicySection>

      <PolicySection id="how-we-use" title="How We Use Your Information">
        <p>We use your information to:</p>
        <ul>
          <li>Receive, confirm, prepare, and deliver (or arrange pickup for) your orders.</li>
          <li>Respond to custom cake and custom gift box requests and follow up with quotes or questions.</li>
          <li>Send order notifications to our team by email so we can process requests promptly.</li>
          <li>Contact you about your order by phone, WhatsApp, or email when needed.</li>
          <li>Improve our website, menu, and customer experience.</li>
          <li>Comply with reasonable legal or safety requirements when applicable.</li>
        </ul>
        <p>
          We do not sell your personal information to third parties for marketing purposes.
        </p>
      </PolicySection>

      <PolicySection id="order-email" title="Orders & Email Notifications">
        <p>
          When you place an order or submit a custom request on our website, order details are stored in
          our business systems and a notification is sent to our team by email through our email service
          provider. This helps us see new orders quickly and serve you on time.
        </p>
        <p>
          Please make sure your phone number and address are correct so we can reach you about delivery or
          pickup.
        </p>
      </PolicySection>

      <PolicySection id="custom-images" title="Images You Upload">
        <p>
          If you upload an inspiration image with a custom order, we use it only to understand your
          request and prepare your order. We do not use your photos for public marketing unless you give us
          clear written permission.
        </p>
        <p>
          Uploaded images may be stored on our content or hosting systems for as long as needed to complete
          the order and for reasonable business records.
        </p>
      </PolicySection>

      <PolicySection id="data-security" title="Data Security">
        <p>
          We take reasonable steps to protect your information, including secure connections (HTTPS) on
          our website and limiting access to order data to authorized team members.
        </p>
        <p>
          No method of transmission over the internet is 100% secure. While we work to protect your data, we
          cannot guarantee absolute security.
        </p>
      </PolicySection>

      <PolicySection id="cookies" title="Cookies & Similar Technologies">
        <p>
          Our website may use cookies and similar technologies to remember preferences (such as language
          selection between English and Amharic), keep your shopping cart working, and understand how
          visitors use the site.
        </p>
        <p>
          You can control cookies through your browser settings. Disabling some cookies may affect how
          certain features work (for example, language preference or cart).
        </p>
      </PolicySection>

      <PolicySection id="third-party" title="Third-Party Services">
        <p>We may use trusted third-party services to run our website and business, such as:</p>
        <ul>
          <li>Website hosting and analytics (e.g. Vercel Analytics in production).</li>
          <li>Email delivery for order and contact notifications (e.g. EmailJS).</li>
          <li>Content management for our menu and product information (e.g. Sanity).</li>
          <li>Payment-related communication when you pay by bank transfer or Telebirr (handled outside the website checkout in many cases).</li>
        </ul>
        <p>
          These providers process data according to their own privacy policies. We choose services that
          help us operate reliably and only share what is needed for each purpose.
        </p>
      </PolicySection>

      <PolicySection id="retention" title="How Long We Keep Information">
        <p>
          We keep order and contact records for as long as needed to fulfill orders, handle questions or
          disputes, and maintain basic business records. We may delete or anonymize older data when it is
          no longer needed.
        </p>
      </PolicySection>

      <PolicySection id="your-rights" title="Your Rights & Choices">
        <p>You may:</p>
        <ul>
          <li>Ask what personal information we hold about you related to an order or inquiry.</li>
          <li>Request correction of inaccurate contact or delivery details.</li>
          <li>Ask us to delete certain information where reasonable and not required for legal or business records.</li>
          <li>Opt out of non-essential marketing messages (we send few, if any, promotional messages).</li>
        </ul>
        <p>
          To exercise these rights, contact us using the details below. We will respond within a reasonable
          time.
        </p>
      </PolicySection>

      <PolicySection id="children" title="Children's Privacy">
        <p>
          Our website is not directed at children under 13. We do not knowingly collect personal information
          from children. If you believe a child has provided us information, please contact us so we can
          remove it.
        </p>
      </PolicySection>

      <PolicySection id="changes" title="Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. The &quot;Last updated&quot; date at the top
          of this page will change when we do. Continued use of the website after updates means you accept
          the revised policy.
        </p>
      </PolicySection>

      <PolicyContactBlock />
    </PolicyLayout>
  )
}
