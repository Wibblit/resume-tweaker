"use client";

import Link from "next/link";
import { SocialIcon } from "react-social-icons";
import { Separator } from "@/components/ui/separator";
import ThemeAwareLogo from "../ThemeAwareLogo";
import { ThemeAwareWibblitLogo } from "../ThemeAwareLogo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background text-foreground border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          {/* Company Information */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1 space-y-6">
            <div className="flex items-center gap-4">
              <a href="https://wibblit.com/" className="shrink-0">
                <ThemeAwareWibblitLogo />
              </a>
              <a href="https://resumetweaker.wibblit.com/" className="shrink-0">
                <ThemeAwareLogo />
              </a>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Empowering Your Career with AI-Driven Tools
            </p>
            <Link
              href="/about"
              className="inline-block text-sm font-medium hover:underline"
            >
              About Us
            </Link>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">Features</h3>
            <ul className="space-y-3">
              {[
                { href: "/editor", label: "Editor" },
                { href: "/review", label: "AI Review" },
                { href: "/interview", label: "AI Interview" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">Pricing</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/pricing"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Support and Resources */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">Support & Resources</h3>
            <ul className="space-y-3">
              {[
                { href: "/faq", label: "FAQs" },
                { href: "/tutorials", label: "Tutorials" },
                { href: "/blog", label: "Blog" },
                {
                  href: "mailto:contact@wibblit.com",
                  label: "Contact Support",
                },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">Legal</h3>
            <ul className="space-y-3">
              {[
                { href: "/legal/privacy-policy", label: "Privacy Policy" },
                { href: "/legal/terms-of-service", label: "Terms of Service" },
                { href: "/legal/cookie-policy", label: "Cookie Policy" },
                { href: "/legal/refund-policy", label: "Refund Policy" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Social Links and Copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex gap-4">
            {[
              { url: "https://x.com/wibblitofficial", network: "x" },
              {
                url: "https://www.linkedin.com/in/wibblit-wibblit-00b204328",
                network: "linkedin",
              },
              { url: "https://www.facebook.com/Wibblit", network: "facebook" },
            ].map((social) => (
              <SocialIcon
                key={social.network}
                url={social.url}
                network={social.network}
                bgColor="transparent"
                fgColor="currentColor"
                style={{ height: 30, width: 30 }}
                className="hover:opacity-80 transition-opacity"
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Wibblit. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
