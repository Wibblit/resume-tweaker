import Link from "next/link";
import { SocialIcon } from "react-social-icons";
import { Separator } from "@/components/ui/separator";
import ThemeAwareLogo from "../ThemeAwareLogo";
import { ThemeAwareWibblitLogo } from "../ThemeAwareLogo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background text-foreground border-t">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Company Information */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <a href="https://wibblit.com/">
                <ThemeAwareWibblitLogo />
              </a>
              <a href="https://resumetweaker.wibblit.com/">
                <ThemeAwareLogo />
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              Empowering Your Career with AI-Driven Tools
            </p>
            <Link href="/about" className="text-sm font-medium hover:underline">
              About Us
            </Link>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Features</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/home" className="text-sm hover:underline">
                  Resume Builder
                </Link>
              </li>
              <li>
                <Link href="/home" className="text-sm hover:underline">
                  Cover Letter Builder
                </Link>
              </li>
              <li>
                <Link href="/ai-review" className="text-sm hover:underline">
                  AI Review
                </Link>
              </li>
              <li>
                <Link href="/ai-interview" className="text-sm hover:underline">
                  AI Interview
                </Link>
              </li>
            </ul>
          </div>

          {/* Pricing */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Pricing</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/pricing" className="text-sm hover:underline">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Support and Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support & Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-sm hover:underline">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/tutorials" className="text-sm hover:underline">
                  Tutorials
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm hover:underline">
                  Blog
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@wibblit.com"
                  className="text-sm hover:underline"
                >
                  Contact Support
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-sm hover:underline"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="text-sm hover:underline"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Social Links and Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex space-x-4">
            <SocialIcon
              url="https://x.com/wibblitofficial"
              network="x"
              bgColor="transparent"
              fgColor="currentColor"
              style={{ height: 30, width: 30 }}
            />
            <SocialIcon
              url="https://www.linkedin.com/in/wibblit-wibblit-00b204328"
              network="linkedin"
              bgColor="transparent"
              fgColor="currentColor"
              style={{ height: 30, width: 30 }}
            />
            <SocialIcon
              url="https://www.facebook.com/Wibblit"
              network="facebook"
              bgColor="transparent"
              fgColor="currentColor"
              style={{ height: 30, width: 30 }}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Wibblit. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
