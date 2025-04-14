import React from 'react';
import '../css/components/LegalPage.css';

const PrivacyPolicyPage = () => {
  return (
    <div className="legal-page">
      <div className="container">
        <div className="legal-header">
          <h1>Privacy Policy</h1>
          <p>Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>

        <div className="legal-content">
          <section className="legal-section">
            <h2>1. Introduction</h2>
            <p>
              Welcome to WordWise ("we," "our," or "us"). We are committed to protecting your privacy and the personal information that you share with us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and language learning platform (collectively, the "Service").
            </p>
            <p>
              Please read this Privacy Policy carefully. By accessing or using our Service, you acknowledge that you have read, understood, and agree to be bound by all the terms of this Privacy Policy. If you do not agree with our policies and practices, please do not use our Service.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Information We Collect</h2>
            
            <h3>2.1 Personal Information</h3>
            <p>
              We may collect personal information that you voluntarily provide to us when you register for an account, express interest in obtaining information about us or our products and services, or otherwise contact us. The personal information we collect may include:
            </p>
            <ul>
              <li>Name</li>
              <li>Email address</li>
              <li>Password</li>
              <li>Profile information (such as profile photo, native language, and target languages)</li>
              <li>Payment information (processed securely through our third-party payment processors)</li>
              <li>Communication preferences</li>
            </ul>

            <h3>2.2 Usage Data</h3>
            <p>
              We automatically collect certain information when you visit, use, or navigate our Service. This information does not reveal your specific identity but may include:
            </p>
            <ul>
              <li>Device and browser information</li>
              <li>IP address</li>
              <li>Usage patterns and learning progress</li>
              <li>Time spent on specific features</li>
              <li>Pages viewed</li>
              <li>Referring website address</li>
            </ul>

            <h3>2.3 Learning Data</h3>
            <p>
              To provide personalized learning experiences, we collect data about your learning activities, including:
            </p>
            <ul>
              <li>Flashcard sets created or studied</li>
              <li>Quiz and exercise results</li>
              <li>Progress in language courses</li>
              <li>Writing samples submitted for feedback</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect for various purposes, including to:</p>
            <ul>
              <li>Create and manage your account</li>
              <li>Provide and maintain our Service</li>
              <li>Personalize your learning experience</li>
              <li>Process transactions and send related information</li>
              <li>Send administrative information, such as updates, security alerts, and support messages</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Monitor usage patterns and analyze trends to improve our Service</li>
              <li>Protect our Service and prevent fraud</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>4. Information Sharing and Disclosure</h2>
            <p>We may share information in the following situations:</p>

            <h3>4.1 Third-Party Service Providers</h3>
            <p>
              We may share your information with third-party vendors, service providers, and other third parties who perform services on our behalf, such as payment processing, data analysis, email delivery, hosting services, and customer service.
            </p>

            <h3>4.2 Business Transfers</h3>
            <p>
              We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.
            </p>

            <h3>4.3 Legal Requirements</h3>
            <p>
              We may disclose your information where we are legally required to do so to comply with applicable law, governmental requests, judicial proceedings, court orders, or legal processes.
            </p>

            <h3>4.4 With Your Consent</h3>
            <p>
              We may disclose your personal information for any other purpose with your consent.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect the security of your personal information. However, please be aware that no method of transmission over the internet or method of electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee its absolute security.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. Your Data Protection Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul>
              <li>The right to access the personal information we have about you</li>
              <li>The right to request correction of inaccurate personal information</li>
              <li>The right to request deletion of your personal information</li>
              <li>The right to object to processing of your personal information</li>
              <li>The right to request restriction of processing of your personal information</li>
              <li>The right to data portability</li>
              <li>The right to withdraw consent</li>
            </ul>
            <p>
              To exercise any of these rights, please contact us using the information provided in the "Contact Us" section below.
            </p>
          </section>

          <section className="legal-section">
            <h2>7. Children's Privacy</h2>
            <p>
              Our Service is not directed to children under the age of 13, and we do not knowingly collect personal information from children under 13. If we learn that we have collected personal information from a child under 13, we will take steps to delete such information as quickly as possible.
            </p>
          </section>

          <section className="legal-section">
            <h2>8. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes to our practices or for other operational, legal, or regulatory reasons. The updated version will be indicated by an updated "Last Updated" date. We encourage you to review this Privacy Policy frequently to stay informed about how we are protecting your information.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Contact Us</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <div className="contact-details">
              <p><strong>Email:</strong> privacy@wordwise.com</p>
              <p><strong>Address:</strong> 123 Language Street, Learning City, LC 12345</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage; 