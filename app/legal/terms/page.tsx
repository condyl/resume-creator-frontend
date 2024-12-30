import React from 'react';

export default function Terms() {
  return (
    <div className="container py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Agreement to Terms</h2>
        <p className="mb-4">
          By accessing or using our Resume Creator service, you agree to be bound by these Terms of Service. 
          If you disagree with any part of these terms, you may not access the service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Description of Service</h2>
        <p className="mb-4">
          Resume Creator is a web-based service that allows users to:
          <ul className="list-disc ml-6 mb-4">
            <li>Create and edit professional resumes</li>
            <li>Save and manage multiple resume versions</li>
            <li>Generate PDF versions of resumes</li>
            <li>Access resume templates and formatting options</li>
          </ul>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">User Accounts</h2>
        <p className="mb-4">
          To use our service, you must:
          <ul className="list-disc ml-6 mb-4">
            <li>Create an account using GitHub or Google authentication</li>
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account</li>
            <li>Accept responsibility for all activities under your account</li>
          </ul>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">User Content</h2>
        <p className="mb-4">
          You retain all rights to the content you create using our service. By using our service, you:
          <ul className="list-disc ml-6 mb-4">
            <li>Grant us permission to store and process your content</li>
            <li>Confirm that your content does not violate any rights or laws</li>
            <li>Accept responsibility for the accuracy of your content</li>
          </ul>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Acceptable Use</h2>
        <p className="mb-4">
          You agree not to:
          <ul className="list-disc ml-6 mb-4">
            <li>Use the service for any illegal purpose</li>
            <li>Attempt to gain unauthorized access to the service</li>
            <li>Interfere with or disrupt the service</li>
            <li>Share false or misleading information</li>
            <li>Violate any applicable laws or regulations</li>
          </ul>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Intellectual Property</h2>
        <p className="mb-4">
          The service, including its original content, features, and functionality, is owned by us and is protected by 
          international copyright, trademark, patent, trade secret, and other intellectual property laws.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Termination</h2>
        <p className="mb-4">
          We may terminate or suspend your account and access to the service:
          <ul className="list-disc ml-6 mb-4">
            <li>Without prior notice or liability</li>
            <li>For any reason, including breach of these Terms</li>
            <li>At our sole discretion</li>
          </ul>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
        <p className="mb-4">
          We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from:
          <ul className="list-disc ml-6 mb-4">
            <li>Your use or inability to use the service</li>
            <li>Any unauthorized access to your data</li>
            <li>Any interruption or cessation of transmission to or from the service</li>
            <li>Any bugs, viruses, or other harmful code that may be transmitted through the service</li>
          </ul>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
        <p className="mb-4">
          We reserve the right to modify or replace these Terms at any time. We will provide notice of any changes by 
          posting the new Terms on this page. Your continued use of the service after any changes constitutes acceptance 
          of the new Terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        <p className="mb-4">
          If you have any questions about these Terms, please contact us at:
          <a href="mailto:terms@example.com" className="text-primary hover:underline ml-1">
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