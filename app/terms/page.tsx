import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-serif text-4xl font-bold text-rose-900 mb-2">Terms of Service</h1>
        <p className="text-rose-500 text-sm mb-10">Effective date: July 21, 2026</p>

        <div className="prose prose-rose max-w-none space-y-10 text-rose-800/80">
          <section>
            <h2 className="font-serif text-2xl font-bold text-rose-900 mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using ShareLove Letters, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-rose-900 mb-3">2. Description of Service</h2>
            <p>ShareLove Letters is a web application that allows users to compose, store, and share personal letters. We provide letter templates, a rich text editor, and shareable links for distribution.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-rose-900 mb-3">3. User Accounts</h2>
            <p>You must create an account to write and save letters. You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You must provide accurate information when creating your account.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-rose-900 mb-3">4. Free Plan Limitations</h2>
            <p>The free plan allows you to create up to 10 letters. Letters on the free plan expire and are automatically deleted after 30 days from creation. We reserve the right to modify these limits at any time with reasonable notice.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-rose-900 mb-3">5. Acceptable Use</h2>
            <p>You agree not to use ShareLove Letters to: send spam or unsolicited messages; harass, threaten, or harm others; post illegal content or content that infringes on others&apos; rights; attempt to gain unauthorized access to our systems; or use our service in any way that violates applicable laws.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-rose-900 mb-3">6. Content Ownership</h2>
            <p>You retain ownership of the content you create using ShareLove Letters. By using our service, you grant us a limited license to store and display your content as necessary to provide the service. We do not claim any ownership over your letters.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-rose-900 mb-3">7. Privacy</h2>
            <p>Your use of ShareLove Letters is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy to understand our practices.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-rose-900 mb-3">8. Disclaimer of Warranties</h2>
            <p>ShareLove Letters is provided &quot;as is&quot; without any warranties, express or implied. We do not guarantee that our service will be uninterrupted, error-free, or completely secure. We are not responsible for any loss of data.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-rose-900 mb-3">9. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, ShareLove Letters shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our service, even if we have been advised of the possibility of such damages.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-rose-900 mb-3">10. Termination</h2>
            <p>We reserve the right to suspend or terminate your account at any time for violation of these terms. You may also delete your account at any time by contacting us. Upon termination, your letters will be permanently deleted.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-rose-900 mb-3">11. Contact</h2>
            <p>If you have questions about these Terms, please contact us at <a href="mailto:hello@shareloveletters.com" className="text-rose-600 underline">hello@shareloveletters.com</a>.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
