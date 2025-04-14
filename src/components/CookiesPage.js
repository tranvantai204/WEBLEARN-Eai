import React from 'react';
import '../css/components/LegalPage.css';

const CookiesPage = () => {
  return (
    <div className="legal-page">
      <div className="container">
        <div className="legal-header">
          <h1>Cookie Policy</h1>
          <p>Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>

        <div className="legal-content">
          <section className="legal-section">
            <h2>1. Introduction</h2>
            <p>
              This Cookie Policy explains how WordWise ("we," "our," or "us") uses cookies and similar technologies to recognize you when you visit our website and language learning platform (collectively, the "Service").
            </p>
            <p>
              It explains what these technologies are and why we use them, as well as your rights to control our use of them. This Cookie Policy should be read together with our Privacy Policy and Terms of Service.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. What Are Cookies?</h2>
            <p>
              Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners to make their websites work efficiently and to provide reporting information.
            </p>
            <p>
              Cookies set by the website owner (in this case, WordWise) are called "first-party cookies." Cookies set by parties other than the website owner are called "third-party cookies." Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics).
            </p>
          </section>

          <section className="legal-section">
            <h2>3. Why Do We Use Cookies?</h2>
            <p>
              We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons for our Service to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies enable us to track and target the interests of our users to enhance the experience on our Service. Third parties serve cookies through our Service for advertising, analytics, and other purposes.
            </p>
            <p>
              Specifically, we use cookies for the following purposes:
            </p>
            <ul>
              <li><strong>Essential cookies:</strong> These cookies are strictly necessary to provide you with our Service and to enable you to use some of its features, such as access to secure areas.</li>
              <li><strong>Functionality cookies:</strong> These allow us to remember choices you make (such as your username, language, or the region you are in) and provide enhanced, more personal features.</li>
              <li><strong>Analytics cookies:</strong> These cookies help us understand how visitors interact with our Service by collecting and reporting information anonymously.</li>
              <li><strong>Personalization cookies:</strong> These cookies help us provide a personalized learning experience by remembering your progress, preferences, and settings.</li>
              <li><strong>Advertising cookies:</strong> These cookies are used to make advertising messages more relevant to you and your interests.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>4. Types of Cookies We Use</h2>
            <div className="table-wrapper">
              <table className="cookie-table">
                <thead>
                  <tr>
                    <th>Type of Cookie</th>
                    <th>Purpose</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Session Cookies</td>
                    <td>These cookies are temporary and are erased when you close your browser. They are essential for enabling user functions and to ensure proper functioning of the website.</td>
                    <td>Session</td>
                  </tr>
                  <tr>
                    <td>Persistent Cookies</td>
                    <td>These cookies remain on your device until they expire or you delete them. They help us recognize you as an existing user to make return visits easier and allow us to customize content for you.</td>
                    <td>Up to 2 years</td>
                  </tr>
                  <tr>
                    <td>Authentication Cookies</td>
                    <td>These cookies help us identify you when you're logged in so we can show you appropriate content and features.</td>
                    <td>30 days</td>
                  </tr>
                  <tr>
                    <td>Preference Cookies</td>
                    <td>These cookies enable us to remember your preferences, such as language selection and display settings.</td>
                    <td>1 year</td>
                  </tr>
                  <tr>
                    <td>Analytics Cookies</td>
                    <td>These cookies collect information about how visitors use our Service, which pages they visited, and if they get error messages. This data helps us improve our Service.</td>
                    <td>Up to 2 years</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="legal-section">
            <h2>5. Third-Party Cookies</h2>
            <p>
              We may use various third-party services on our Service, which may also set cookies on your device. These include but are not limited to:
            </p>
            <ul>
              <li><strong>Google Analytics:</strong> Used to analyze website traffic and user behavior.</li>
              <li><strong>Facebook Pixel:</strong> Used for advertising and measuring the effectiveness of our ads.</li>
              <li><strong>Stripe:</strong> Used for processing payments securely.</li>
              <li><strong>Intercom:</strong> Used for customer support chat functionality.</li>
            </ul>
            <p>
              Please note that we have no access to or control over cookies that are used by third-party services. Each third-party service provider has its own privacy policy and method for opting out.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. How to Control Cookies</h2>
            <p>
              Most web browsers allow you to manage your cookie preferences. You can set your browser to refuse cookies or delete certain cookies. However, if you disable cookies, you may not be able to use all the features of our Service.
            </p>
            <p>
              The following links provide information on how to modify your cookie settings in various browsers:
            </p>
            <ul>
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
              <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
            </ul>
            <p>
              In addition, most advertising networks offer you a way to opt out of targeted advertising. To find out more information, please visit:
            </p>
            <ul>
              <li><a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">Digital Advertising Alliance</a></li>
              <li><a href="http://www.youronlinechoices.com/" target="_blank" rel="noopener noreferrer">Your Online Choices (EU)</a></li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>7. Cookie Consent</h2>
            <p>
              When you first visit our Service, we may ask for your consent to set cookies. You can choose to accept all cookies, reject all cookies, or manage your cookie preferences. By clicking "Accept All Cookies," you agree to the storing of cookies on your device to enhance site navigation, analyze site usage, and assist in our marketing efforts.
            </p>
            <p>
              If you choose to reject all cookies, you will still be able to use our Service, but some parts may not function properly.
            </p>
          </section>

          <section className="legal-section">
            <h2>8. Changes to This Cookie Policy</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes in technology, regulation, or our business practices. Any changes will become effective when we post the revised Cookie Policy on our Service. We encourage you to periodically review this page to stay informed about our use of cookies.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Contact Us</h2>
            <p>
              If you have any questions about our use of cookies or this Cookie Policy, please contact us at:
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

export default CookiesPage; 