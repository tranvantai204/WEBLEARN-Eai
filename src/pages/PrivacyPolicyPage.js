import React from 'react';
import './PrivacyPolicyPage.css';

const PrivacyPolicyPage = () => {
    return (
        <div className="privacy-policy-container">
            <div className="privacy-policy-content">
                <h1>Privacy Policy</h1>
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                
                <section>
                    <h2>Introduction</h2>
                    <p>
                        WordWise ("we," "our," or "us") is committed to protecting your privacy. 
                        This Privacy Policy explains how your personal information is collected, 
                        used, and disclosed by WordWise.
                    </p>
                    <p>
                        This Privacy Policy applies to our website, and its associated subdomains 
                        (collectively, our "Service"). By accessing or using our Service, 
                        you signify that you have read, understood, and agree to our collection, 
                        storage, use, and disclosure of your personal information as described in 
                        this Privacy Policy and our Terms of Service.
                    </p>
                </section>

                <section>
                    <h2>Information We Collect</h2>
                    <p>
                        We collect information from you when you visit our website, register on our site, 
                        place an order, subscribe to our newsletter, respond to a survey, or fill out a form.
                    </p>
                    <h3>Personal Information</h3>
                    <p>
                        When you register with us, we collect personally identifiable information, such as:
                    </p>
                    <ul>
                        <li>Your name</li>
                        <li>Email address</li>
                        <li>Phone number</li>
                        <li>Learning preferences</li>
                        <li>Language proficiency levels</li>
                    </ul>
                    <h3>Usage Data</h3>
                    <p>
                        We may also collect information on how the service is accessed and used. 
                        This usage data may include:
                    </p>
                    <ul>
                        <li>Your computer's Internet Protocol (IP) address</li>
                        <li>Browser type</li>
                        <li>Browser version</li>
                        <li>Pages of our service that you visit</li>
                        <li>Time and date of your visit</li>
                        <li>Time spent on those pages</li>
                        <li>Other diagnostic data</li>
                    </ul>
                </section>

                <section>
                    <h2>How We Use Your Information</h2>
                    <p>
                        We use the information we collect from you for the following purposes:
                    </p>
                    <ul>
                        <li>To personalize your experience</li>
                        <li>To improve our website</li>
                        <li>To improve customer service</li>
                        <li>To process transactions</li>
                        <li>To administer content, promotions, surveys, or other site features</li>
                        <li>To send periodic emails regarding your account or other products and services</li>
                    </ul>
                </section>

                <section>
                    <h2>Data Security</h2>
                    <p>
                        We implement appropriate security measures to protect against unauthorized access, 
                        alteration, disclosure, or destruction of your personal information, username, 
                        password, transaction information, and data stored on our systems.
                    </p>
                </section>

                <section>
                    <h2>Third-Party Disclosure</h2>
                    <p>
                        We do not sell, trade, or otherwise transfer your personally identifiable 
                        information to outside parties without your consent. This does not include 
                        trusted third parties who assist us in operating our website, conducting our 
                        business, or servicing you, as long as those parties agree to keep this 
                        information confidential.
                    </p>
                </section>

                <section>
                    <h2>Your Rights</h2>
                    <p>
                        You have the right to:
                    </p>
                    <ul>
                        <li>Access the personal information we have about you</li>
                        <li>Correct any personal information we have about you</li>
                        <li>Delete any personal information we have about you</li>
                        <li>Object to processing of your personal information</li>
                        <li>Request restriction of processing your personal information</li>
                        <li>Request transfer of your personal information</li>
                        <li>Withdraw consent where we rely on consent to process your personal information</li>
                    </ul>
                </section>

                <section>
                    <h2>Changes to This Privacy Policy</h2>
                    <p>
                        We may update our Privacy Policy from time to time. We will notify you of any 
                        changes by posting the new Privacy Policy on this page and updating the 
                        "Last updated" date at the top of this page.
                    </p>
                </section>

                <section>
                    <h2>Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at:
                    </p>
                    <p>Email: privacy@wordwise.com</p>
                    <p>Phone: +1 (234) 567-8901</p>
                    <p>Address: 123 Learning Lane, Education City, 12345</p>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage; 