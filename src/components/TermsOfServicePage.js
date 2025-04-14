import React from 'react';
import '../css/components/LegalPage.css';

const TermsOfServicePage = () => {
  return (
    <div className="legal-page">
      <div className="container">
        <div className="legal-header">
          <h1>Terms of Service</h1>
          <p>Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>

        <div className="legal-content">
          <section className="legal-section">
            <h2>1. Agreement to Terms</h2>
            <p>
              These Terms of Service ("Terms") constitute a legally binding agreement between you and WordWise ("we," "our," or "us") regarding your access to and use of the WordWise website and language learning platform (collectively, the "Service").
            </p>
            <p>
              By accessing or using our Service, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, you must not access or use the Service.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Eligibility</h2>
            <p>
              To use our Service, you must be at least 13 years of age. If you are under 18 years of age, you represent that you have your parent or guardian's permission to use the Service and they have read and agreed to these Terms on your behalf.
            </p>
            <p>
              By using our Service, you represent and warrant that you meet all eligibility requirements we outline in these Terms. We may still refuse to let certain people access or use the Service. We may also change our eligibility criteria at any time.
            </p>
          </section>

          <section className="legal-section">
            <h2>3. Account Registration and Security</h2>
            <p>
              To access certain features of our Service, you may need to register for an account. When you register, you agree to provide accurate, current, and complete information and to update this information to maintain its accuracy.
            </p>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account or any other breach of security.
            </p>
            <p>
              We reserve the right to disable any user account at any time, including if you have failed to comply with any of the provisions of these Terms.
            </p>
          </section>

          <section className="legal-section">
            <h2>4. Subscription and Payments</h2>
            <h3>4.1 Subscription Plans</h3>
            <p>
              We offer both free and paid subscription plans. Features and limitations of each plan are described on our website. We reserve the right to modify, terminate, or otherwise amend our offered subscription plans at any time.
            </p>

            <h3>4.2 Payment and Billing</h3>
            <p>
              When you purchase a subscription, you agree to pay all fees associated with the plan you select. All payments are processed securely through our third-party payment processors.
            </p>
            <p>
              Unless otherwise stated, subscriptions automatically renew for additional periods equal to the initial subscription term unless canceled before the renewal date. You can manage your subscription settings in your account dashboard.
            </p>

            <h3>4.3 Refunds</h3>
            <p>
              Refunds are provided in accordance with our Refund Policy, which can be found on our website. In general, we offer a 7-day money-back guarantee for new premium subscribers.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. Intellectual Property Rights</h2>
            <h3>5.1 Our Content</h3>
            <p>
              The Service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of WordWise and its licensors. The Service is protected by copyright, trademark, and other laws.
            </p>
            <p>
              Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
            </p>

            <h3>5.2 User Content</h3>
            <p>
              You retain any intellectual property rights you hold in the content you create and share on our Service ("User Content"). By posting User Content, you grant us a non-exclusive, royalty-free, worldwide, transferable license to use, reproduce, modify, publish, distribute, and display such content in connection with providing and promoting the Service.
            </p>
            <p>
              You represent and warrant that you own or have the necessary rights to your User Content and that it does not violate any third party's intellectual property or other rights.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. Prohibited Conduct</h2>
            <p>
              You agree not to use the Service in any way that:
            </p>
            <ul>
              <li>Violates any applicable law or regulation</li>
              <li>Infringes the intellectual property rights of others</li>
              <li>Transmits any material that is harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable</li>
              <li>Interferes with or disrupts the integrity or performance of the Service</li>
              <li>Attempts to gain unauthorized access to the Service, user accounts, or computer systems</li>
              <li>Engages in any automated use of the Service, such as using scripts to collect information or interact with the Service</li>
              <li>Uses the Service for any commercial solicitation purposes without our consent</li>
              <li>Copies or stores any significant portion of the Service's content</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>7. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, in no event shall WordWise, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
            </p>
            <ul>
              <li>Your access to or use of or inability to access or use the Service</li>
              <li>Any conduct or content of any third party on the Service</li>
              <li>Any content obtained from the Service</li>
              <li>Unauthorized access, use, or alteration of your transmissions or content</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>8. Disclaimer of Warranties</h2>
            <p>
              The Service is provided "as is" and "as available" without warranties of any kind, either express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.
            </p>
            <p>
              WordWise does not warrant that the Service will function uninterrupted, secure, or available at any particular time or location, or that any errors or defects will be corrected.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Governing Law and Dispute Resolution</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which WordWise is established, without regard to its conflict of law provisions.
            </p>
            <p>
              Any disputes arising under or in connection with these Terms shall be resolved through good faith negotiations. If such negotiations fail, the dispute shall be submitted to binding arbitration in accordance with the rules of the American Arbitration Association.
            </p>
          </section>

          <section className="legal-section">
            <h2>10. Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
            <p>
              By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the Service.
            </p>
          </section>

          <section className="legal-section">
            <h2>11. Termination</h2>
            <p>
              We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason whatsoever, including, without limitation, if you breach these Terms.
            </p>
            <p>
              Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service or delete your account through your account settings.
            </p>
          </section>

          <section className="legal-section">
            <h2>12. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <div className="contact-details">
              <p><strong>Email:</strong> legal@wordwise.com</p>
              <p><strong>Address:</strong> 123 Language Street, Learning City, LC 12345</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage; 