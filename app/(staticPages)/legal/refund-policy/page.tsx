import React from 'react';
import { Metadata } from "next"
export const metadata: Metadata = {
  title: "Refund Policy",
  description:
    "This is the Refund policy of Resumetweaker. Create professional resumes and cover letters with ResumeTweaker's AI-powered tools. Build and customize your job application documents effortlessly.",
  alternates: {
    canonical: "https://resumetweaker.wibblit.com/legal/refund-policy",
  }
};
export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:p-6 lg:p-28">
      <div className="max-w-4xl mx-auto bg-background shadow-sm rounded-lg">
        <div className="p-8">
          {/* Header Section */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Return Policy</h1>
            <p className="text-lg text-muted-foreground">Last updated January 16, 2025</p>
          </div>

          {/* Refunds Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Refunds</h2>
            <p className="text-muted-foreground mb-4">
              All <strong className="text-foreground">successful sales</strong> are final and no refund will be issued.
            </p>

            <h3 className="text-xl font-bold text-foreground mb-4">What is a Successful Sale?</h3>
            <p className="text-muted-foreground mb-4">
              A successful sale is defined as a completed transaction where payment has been processed and access to the purchased product or service has been granted. This includes, but is not limited to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
              <li>Credits successfully added to your account</li>
              <li>Access provided to purchased features or services</li>
              <li>No payment disputes or cancellations during the transaction process</li>
            </ul>

            <h3 className="text-xl font-bold text-foreground mb-4">Failed Transactions</h3>
            <p className="text-muted-foreground mb-4">
              If a transaction fails due to technical issues or incomplete payment, it will not be considered a successful sale. Please contact us at{' '}
              <a 
                href="mailto:contact@wibblit.com" 
                className="text-primary hover:text-primary/80 transition-colors"
              >
                contact@wibblit.com
              </a>{' '}
              for assistance in resolving such issues.
            </p>

            <h3 className="text-xl font-bold text-foreground mb-4">Examples of Successful and Unsuccessful Sales</h3>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                <strong className="text-foreground">Example of a successful sale:</strong> You purchase 100 credits, payment is processed, and credits are added to your account.
              </p>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Example of an unsuccessful sale:</strong> You attempt a payment, but the transaction is declined or credits are not added due to an error.
              </p>
            </div>
          </div>

          {/* Questions Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Questions</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions concerning our return policy, please contact us at:
            </p>
            <p className="text-muted-foreground">
              <a 
                href="mailto:contact@wibblit.com"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                contact@wibblit.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
