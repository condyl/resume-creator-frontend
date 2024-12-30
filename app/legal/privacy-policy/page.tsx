import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="container py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
        <p className="mb-4">
          This Privacy Policy explains how we collect, use, and protect your personal information when you use our Resume Creator service. 
          By using our service, you agree to the collection and use of information in accordance with this policy.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
        <h3 className="text-xl font-medium mb-2">Account Information</h3>
        <p className="mb-4">
          When you create an account, we collect:
          <ul className="list-disc ml-6 mb-4">
            <li>Your email address</li>
            <li>Authentication information from third-party providers (GitHub, Google)</li>
          </ul>
        </p>

        <h3 className="text-xl font-medium mb-2">Resume Information</h3>
        <p className="mb-4">
          When you create and save resumes, we collect:
          <ul className="list-disc ml-6 mb-4">
            <li>Personal information you provide (name, contact details, etc.)</li>
            <li>Professional experience and education details</li>
            <li>Skills and other resume content</li>
          </ul>
        </p>

        <h3 className="text-xl font-medium mb-2">Usage Information</h3>
        <p className="mb-4">
          We automatically collect certain information about how you use our service:
          <ul className="list-disc ml-6 mb-4">
            <li>Log data (IP address, browser type, pages visited)</li>
            <li>Device information</li>
            <li>Usage patterns and preferences</li>
          </ul>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
        <p className="mb-4">
          We use your information to:
          <ul className="list-disc ml-6 mb-4">
            <li>Provide and maintain our service</li>
            <li>Save and manage your resumes</li>
            <li>Improve and personalize your experience</li>
            <li>Communicate with you about our service</li>
            <li>Ensure the security of our service</li>
          </ul>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Data Storage and Security</h2>
        <p className="mb-4">
          We use Supabase to store your data securely. All data is encrypted in transit and at rest. 
          We implement appropriate security measures to protect against unauthorized access, alteration, 
          disclosure, or destruction of your information.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
        <p className="mb-4">
          We use the following third-party services:
          <ul className="list-disc ml-6 mb-4">
            <li>Supabase for data storage and authentication</li>
            <li>GitHub and Google for authentication</li>
          </ul>
          Each of these services has their own privacy policies that govern how they handle your data.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
        <p className="mb-4">
          You have the right to:
          <ul className="list-disc ml-6 mb-4">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Export your data</li>
            <li>Opt out of communications</li>
          </ul>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
          the new Privacy Policy on this page and updating the &quot;last updated&quot; date.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy, please contact us at:
          <a href="mailto:privacy@example.com" className="text-primary hover:underline ml-1">
            connorbbrocku@gmail.com
          </a>
        </p>
      </section>

      <footer className="text-sm text-muted-foreground">
        Last updated: {new Date().toLocaleDateString()}
      </footer>
    </div>
  );
} 