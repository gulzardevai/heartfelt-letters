import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-serif text-4xl font-bold text-rose-900 mb-2">Privacy Policy</h1>
        <p className="text-rose-500 text-sm mb-10">Effective date: July 1, 2025</p>

        <div className="prose prose-rose max-w-none space-y-10 text-rose-800/80">
          <section>
            <h2 className="font-serif text-2xl font-bold text-rose-900 mb-3">1. Information We Collect</h2>
            <p>We collect information you provide directly: your email address and name when you create an account, and the content of letters you write. We also collect usage data such as pages visited and features used, and technical information like IP address, browser type, and device information.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-rose-900 mb-3">2. How We Use Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our services; to send you service-related communications; to detect and prevent fraud and abuse; and to understand how people use our service so we can improve it.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-rose-900 mb-3">3. Data Storage & Security</h2>
            <p>Your data is stored securely using Supabase, which uses industry-standard encryption at rest and in transit. We use Row Level Security to ensure your letters are only accessible to you and the people you share them with. Letters on the free plan expire after 30 days.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-rose-900 mb-3">4. Sharing of Information</h2>
            <p>We do not sell your personal information. We do not share your data with third parties except as required by law or as necessary to provide our service (e.g., our hosting provider). Letters you create and share via link are accessible to anyone with that link.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-rose-900 mb-3">5. Cookies</h2>
            <p>We use cookies and similar tracking technologies to maintain your session when you are logged in and to understand how you use our service. You can disable cookies in your browser, but this may prevent you from using some features.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-rose-900 mb-3">6. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal information. You may request a copy of your data or ask us to delete your account by contacting us at <a href="mailto:hello@heartfeltletters.app" className="text-rose-600 underline">hello@heartfeltletters.app</a>.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-rose-900 mb-3">7. Children&apos;s Privacy</h2>
            <p>Our service is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-rose-900 mb-3">8. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page with an updated effective date. Your continued use of our service after changes constitutes your acceptance of the updated policy.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-rose-900 mb-3">9. Contact</h2>
            <p>If you have questions about this Privacy Policy, please contact us at <a href="mailto:hello@heartfeltletters.app" className="text-rose-600 underline">hello@heartfeltletters.app</a>.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
