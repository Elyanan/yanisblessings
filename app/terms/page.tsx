import type { Metadata } from 'next'
import { PolicyLayout } from '@/components/policy/policy-layout'
import { PolicySection } from '@/components/policy/policy-section'
import { PolicyContactBlock } from '@/components/policy/policy-contact-block'
import { policyPlaceholders, policySite } from '@/lib/policies/constants'
import { bankTransferLabel, paymentMethods } from '@/lib/payments'
import { siteConfig } from '@/lib/site-config'
import { buildBreadcrumbSchema, buildPolicyWebPageSchema } from '@/lib/policies/json-ld'
import { buildPageMetadata } from '@/lib/seo/metadata'

const title = 'Terms & Conditions'
const description =
  "Read the terms for using Yani's Blessings website, placing orders, payments, delivery and pickup, and ordering homemade bakery products in Addis Ababa, Ethiopia."

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path: '/terms',
  keywords: ['terms and conditions', 'terms of service'],
})

export default function TermsPage() {
  const jsonLd = [
    buildPolicyWebPageSchema({
      path: '/terms',
      name: title,
      description,
      dateModified: '2026-05-29',
    }),
    buildBreadcrumbSchema('/terms', title),
  ]

  return (
    <PolicyLayout title={title} description={description} jsonLd={jsonLd}>
      <PolicySection id="agreement" title="Agreement to These Terms">
        <p>
          By accessing {policySite.url} or placing an order with {policySite.name}, you agree to these
          Terms & Conditions and our Privacy Policy. If you do not agree, please do not use the website.
        </p>
        <p>
          These terms apply to visitors and customers in Ethiopia and elsewhere who use our English or
          Amharic website experience.
        </p>
      </PolicySection>

      <PolicySection id="website-use" title="Website Usage">
        <p>You agree to use our website lawfully and respectfully. You must not:</p>
        <ul>
          <li>Submit false order or contact information.</li>
          <li>Attempt to disrupt the website, servers, or security.</li>
          <li>Copy, scrape, or misuse our content, images, or branding without permission.</li>
          <li>Use the site for fraudulent or harmful purposes.</li>
        </ul>
        <p>
          We may suspend access if we believe these terms are violated.
        </p>
      </PolicySection>

      <PolicySection id="products" title="Products & Availability">
        <p>
          We sell homemade granola, cupcakes, cookies, cakes, seasonal items, and gift boxes. Product
          photos are for illustration; actual appearance may vary slightly because items are handmade.
        </p>
        <ul>
          <li>Menu items may sell out or become unavailable without notice.</li>
          <li>Ingredients and recipes may change; allergen information on the site is provided as a guide — contact us for specific concerns.</li>
          <li>Custom products are made according to agreed specifications after we confirm your request.</li>
        </ul>
      </PolicySection>

      <PolicySection id="pricing" title="Pricing & Changes">
        <p>
          Prices are shown in Ethiopian Birr (ETB) unless stated otherwise. We may change prices, delivery
          fees, or promotions at any time. The price shown at checkout or confirmed for custom orders is
          the price that applies to your order.
        </p>
        <p>
          Free delivery may apply above {siteConfig.freeDeliveryThreshold.toLocaleString()} ETB subtotal;
          standard delivery fee is {siteConfig.deliveryFee} ETB where applicable. Details may be updated on
          the website.
        </p>
      </PolicySection>

      <PolicySection id="ordering" title="Ordering Process">
        <h3 className="font-semibold text-foreground text-base">Standard orders</h3>
        <p>
          You may add items to your cart, enter delivery details, and submit an order through the website.
          Submitting an order is a request to purchase. We may contact you to confirm availability, delivery
          time, or payment before the order is final.
        </p>
        <h3 className="font-semibold text-foreground text-base pt-2">Custom orders</h3>
        <p>
          Custom cake and gift box forms collect your requirements. Submission does not guarantee
          acceptance until we confirm date, design, and price with you.
        </p>
        <p>
          Order notifications are sent to our team by email. You are responsible for providing accurate
          contact and address information.
        </p>
      </PolicySection>

      <PolicySection id="payment" title="Payment Terms">
        <p>Accepted payment methods include:</p>
        <ul>
          <li><strong>Cash on Delivery (COD)</strong> — pay when you receive your order.</li>
          <li><strong>Telebirr</strong> — {paymentMethods.telebirr}</li>
          <li><strong>Bank Transfer</strong> — {bankTransferLabel}</li>
        </ul>
        <p>
          For custom orders, we may require a deposit before production. Deposit terms will be communicated
          when your order is confirmed.
        </p>
        <p>
          You are responsible for completing payment as agreed. Unpaid confirmed orders may be cancelled.
        </p>
      </PolicySection>

      <PolicySection id="delivery-pickup" title="Delivery & Pickup">
        <p>
          We offer delivery and pickup in and around Addis Ababa. Delivery areas:{' '}
          {policyPlaceholders.deliveryAreas}. Pickup location: {policyPlaceholders.pickupAddress}.
        </p>
        <ul>
          <li>Delivery times are estimates, not guarantees, especially during busy periods or weather.</li>
          <li>Someone must be available to receive the order or arrange pickup within the agreed window.</li>
          <li>Risk of loss passes to you once the order is delivered to your address or collected by you at pickup.</li>
        </ul>
      </PolicySection>

      <PolicySection id="cancellations-refunds" title="Cancellations & Refunds">
        <p>
          Cancellation, refund, and quality issues are governed by our{' '}
          <a href="/refund-policy">Refund & Cancellation Policy</a>, which is part of these terms.
        </p>
      </PolicySection>

      <PolicySection id="intellectual-property" title="Intellectual Property">
        <p>
          All content on this website — including text, logos, photos, designs, and layout — belongs to{' '}
          {policySite.name} or our licensors unless stated otherwise. You may not reproduce or use our
          content for commercial purposes without written permission.
        </p>
        <p>
          Inspiration images you upload for custom orders remain yours; you grant us permission to use them
          only to fulfill your request (see Privacy Policy).
        </p>
      </PolicySection>

      <PolicySection id="disclaimer" title="Food & Health Disclaimer">
        <p>
          Our products are prepared in a home bakery environment. While we follow good hygiene practices,
          we cannot guarantee they are free from traces of allergens (nuts, gluten, dairy, etc.). Customers
          with allergies or dietary restrictions should contact us before ordering.
        </p>
      </PolicySection>

      <PolicySection id="liability" title="Limitation of Liability">
        <p>
          To the fullest extent permitted by applicable law, {policySite.name} is not liable for indirect,
          incidental, or consequential damages arising from use of the website or products.
        </p>
        <p>
          Our total liability for any claim related to a specific order is limited to the amount you paid
          for that order, except where law requires otherwise.
        </p>
        <p>
          We are not responsible for delays or failures caused by events outside our reasonable control
          (for example, severe weather, power outages, or supplier shortages).
        </p>
      </PolicySection>

      <PolicySection id="governing-law" title="Governing Law">
        <p>
          These terms are governed by the laws of Ethiopia. Disputes should first be raised with us in good
          faith; we aim to resolve customer concerns directly.
        </p>
      </PolicySection>

      <PolicySection id="updates" title="Updates to These Terms">
        <p>
          We may update these Terms & Conditions at any time. Changes take effect when posted on this page.
          Your continued use of the website after changes constitutes acceptance.
        </p>
      </PolicySection>

      <PolicyContactBlock />
    </PolicyLayout>
  )
}
