import type { Metadata } from 'next'
import { PolicyLayout } from '@/components/policy/policy-layout'
import { PolicySection } from '@/components/policy/policy-section'
import { PolicyContactBlock } from '@/components/policy/policy-contact-block'
import { policyPlaceholders, policySite } from '@/lib/policies/constants'
import { buildBreadcrumbSchema, buildPolicyWebPageSchema } from '@/lib/policies/json-ld'

const title = 'Refund & Cancellation Policy'
const description =
  "Understand how cancellations, changes, refunds, and order issues work at Yani's Blessings for standard menu orders and custom cakes or gift boxes in Addis Ababa."

export const metadata: Metadata = {
  title: `${title} | ${policySite.name}`,
  description,
  alternates: { canonical: `${policySite.url}/refund-policy` },
  openGraph: {
    title: `${title} | ${policySite.name}`,
    description,
    url: `${policySite.url}/refund-policy`,
    type: 'website',
  },
}

export default function RefundPolicyPage() {
  const jsonLd = [
    buildPolicyWebPageSchema({
      path: '/refund-policy',
      name: title,
      description,
      dateModified: '2026-05-29',
    }),
    buildBreadcrumbSchema('/refund-policy', title),
  ]

  return (
    <PolicyLayout title={title} description={description} jsonLd={jsonLd}>
      <PolicySection id="overview" title="Overview">
        <p>
          At {policySite.name}, we prepare fresh homemade treats with care. Because many items are made to
          order, our refund and cancellation rules depend on whether you ordered standard menu products or
          a custom cake / gift box request.
        </p>
        <p>
          Please read this policy before placing an order. If anything is unclear, contact us — we prefer
          to solve problems early.
        </p>
      </PolicySection>

      <PolicySection id="standard-orders" title="Standard Product Orders (Menu & Cart)">
        <p>Standard orders include items from our menu such as granola, cupcakes, cookies, and ready-made gift boxes listed on the website.</p>
        <h3 className="font-semibold text-foreground text-base pt-2">Cancellations</h3>
        <ul>
          <li>
            You may cancel free of charge if you contact us at least{' '}
            <strong>{policyPlaceholders.cancellationHoursStandard} hours</strong> before your scheduled
            delivery or pickup time.
          </li>
          <li>
            If we have already started preparing your order, a cancellation may not be possible or may
            only qualify for partial credit at our discretion.
          </li>
        </ul>
        <h3 className="font-semibold text-foreground text-base pt-2">Changes to your order</h3>
        <ul>
          <li>Small changes (e.g. adding an item) may be accepted if we have not started preparation.</li>
          <li>We cannot always change orders after preparation has begun.</li>
        </ul>
        <h3 className="font-semibold text-foreground text-base pt-2">Refunds</h3>
        <ul>
          <li>
            If we cancel your order or cannot fulfill it, you will receive a full refund using the same
            payment method when possible (cash, bank transfer, or Telebirr).
          </li>
          <li>
            If you cancel in time (see above), any payment you made in advance will be refunded within a
            reasonable period — typically within <strong>[REFUND PROCESSING DAYS — e.g. 3–7 business days]</strong>.
          </li>
        </ul>
      </PolicySection>

      <PolicySection id="custom-orders" title="Custom Orders (Cakes, Cupcakes, Gift Boxes)">
        <p>
          Custom orders require planning, ingredients, and often design work. Different rules apply:
        </p>
        <ul>
          <li>
            A custom request submitted on the website is not confirmed until we contact you and agree on
            details, price, and date.
          </li>
          <li>
            Cancellations should be made at least{' '}
            <strong>{policyPlaceholders.cancellationHoursCustom} hours</strong> before the agreed delivery
            or pickup date.
          </li>
          <li>
            Deposits or advance payments for custom work may be{' '}
            <strong>non-refundable</strong> if cancellation happens after we have purchased materials or
            started production. We will explain this when we confirm your order.
          </li>
          <li>
            Changes to design, size, or date may not be possible close to the event date and could affect
            price.
          </li>
        </ul>
      </PolicySection>

      <PolicySection id="damaged-incorrect" title="Damaged, Missing, or Incorrect Orders">
        <p>
          We want you to enjoy every bite. Please check your order at delivery or pickup and contact us
          <strong> within 24 hours</strong> if:
        </p>
        <ul>
          <li>Items are missing or incorrect compared to your confirmed order.</li>
          <li>Products arrive clearly damaged or unfit to eat due to our handling (not after long delays on your side).</li>
        </ul>
        <p>Depending on the situation, we may offer:</p>
        <ul>
          <li>Replacement of affected items</li>
          <li>Store credit for a future order</li>
          <li>Partial or full refund when replacement is not possible</li>
        </ul>
        <p>
          Photos of the issue sent via WhatsApp or email help us resolve cases faster.
        </p>
      </PolicySection>

      <PolicySection id="non-refundable" title="Situations That Are Usually Not Refundable">
        <ul>
          <li>Change of mind after we have completed preparation or delivery.</li>
          <li>Delays caused by incorrect address or phone number provided by the customer.</li>
          <li>Customer not available to receive delivery within the agreed window (after reasonable contact attempts).</li>
          <li>Custom orders cancelled late after materials were bought or work began (see custom order section).</li>
          <li>Products consumed before reporting a problem.</li>
        </ul>
      </PolicySection>

      <PolicySection id="payment-methods" title="Payment Methods & Refunds">
        <p>We accept:</p>
        <ul>
          <li><strong>Cash on Delivery (COD)</strong></li>
          <li><strong>Bank Transfer</strong> — {policyPlaceholders.bankAccount}</li>
          <li><strong>Telebirr</strong> — {policyPlaceholders.telebirr}</li>
        </ul>
        <p>
          Refunds are returned using the same method when possible. Bank and Telebirr refunds may take a few
          business days depending on your provider.
        </p>
      </PolicySection>

      <PolicySection id="how-to-contact" title="How to Report an Issue">
        <p>Contact us as soon as possible with:</p>
        <ol>
          <li>Your name and order date</li>
          <li>Order number or description of items</li>
          <li>A clear description of the problem</li>
          <li>Photos if relevant</li>
        </ol>
        <p>
          We will review your message and respond during our business hours. Most issues are resolved
          within a few days.
        </p>
      </PolicySection>

      <PolicySection id="policy-changes" title="Changes to This Policy">
        <p>
          We may update this Refund & Cancellation Policy. The latest version will always be on this page
          with an updated date.
        </p>
      </PolicySection>

      <PolicyContactBlock />
    </PolicyLayout>
  )
}
