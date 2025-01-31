import "./globals.css";
import { Metadata } from "next";
import { ThemeProviderWrapper } from "@/components/ThemeProviderWrapper";
import { ToastProvider } from "@/components/ToastProviderWrapper";
import { ReduxProvider } from "@/components/ReduxProvider";
import { Montserrat as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import { LandingNav } from "@/components/LandingNav";
import Footer from "@/components/LandingPage/Footer";
import { GoogleAnalytics } from "@next/third-parties/google"

export const metadata: Metadata = {
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_BASE_URL}`),
  title: {
    default: "ResumeTweaker | AI Resume, Cover Letter, Review & Interview Prep",
    template: "%s | ResumeTweaker",
  },
  description:
    "Optimize your job search with AI-powered resume building and reviews, cover letter building, and interview prep. Get professional tools for every step of your application process with ResumeTweaker",
  openGraph: {
    title: "ResumeTweaker | AI Resume Review, Cover Letter & Interview Prep",
    description:
      "Create, tweak, and perfect your resume with resumetweaker’s AI-powered resume builder. Stand out in your job search with optimized and tailored resumes.",
    url: "https://resumetweaker.wibblit.com",
    siteName: "resumetweaker",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "ResumeTweaker | AI Resume Review & Interview Prep",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@wibblitofficial",
    title: "ResumeTweaker | AI Resume Review & Interview Prep",
    description:
      "Use resumetweaker's AI to create and optimize your resume effortlessly.",
    images: [
      {
        url: "/opengraph-image.png",
        alt: "resumetweaker - AI Resume Builder",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
  },
  keywords: [
    "AI resume builder",
    "resume maker",
    "AI resume review",
    "AI resume analysis",
    "AI Interviw",
    "resume optimizer",
    "resumetweaker",
    "job search tools",
    "resume templates",
    "resume tweaking",
    "AI resume writing",
    "career tools",
    "wibblit",
    "resumetweaker",
    "resume tweaker",
  ],
  appleWebApp: {
    title: "ResTweak",
  },
  icons: {
    icon: [
      {
        rel: "icon",
        type: "image/png",
        url: "/favicons/favicon-96x96.png",
        sizes: "96x96",
      },
      {
        rel: "icon",
        type: "image/svg+xml",
        url: "/favicons/favicon.svg",
      },
      {
        rel: "shortcut icon",
        url: "/favicons/favicon.ico",
      },
      {
        rel: "apple-touch-icon",
        url: "/favicons/apple-touch-icon.png",
        sizes: "180x180",
      },
    ],
  },
  manifest: "/favicons/site.webmanifest",
};

const fontSans = FontSans({
  // weight: ['100', '300', '400', '500', '700', '900'],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <GoogleAnalytics gaId="G-2SNY7ETV6E" />
        <script
          id="schema-org-script"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "resumetweaker",
              alternateName: ["ResumeTweaker"],
              url: "https://resumetweaker.wibblit.com/",
            }),
          }}
        />
      </head>
      <body className={cn(` antialiased font-custom`, fontSans.className)}>
        <ThemeProviderWrapper>
          <ReduxProvider>
            <LandingNav />
            {children}
            <Footer />
          </ReduxProvider>
        </ThemeProviderWrapper>
        <ToastProvider />
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.min.js"
          integrity="sha512-Z8CqofpIcnJN80feS2uccz+pXWgZzeKxDsDNMD/dJ6997/LSRY+W4NmEt9acwR+Gt9OHN0kkI1CTianCwoqcjQ=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        ></script>
      </body>
    </html>
  );
}
