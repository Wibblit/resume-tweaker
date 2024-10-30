import "./globals.css";
import { Metadata } from "next";
import { ThemeProviderWrapper } from "@/components/ThemeProviderWrapper";
import { ToastProvider } from "@/components/ToastProviderWrapper";
import { ReduxProvider } from "@/components/ReduxProvider";
import { Roboto_Flex as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: {
    default: "resumetweaker | AI Resume Builder",
    template: "%s - resumetweaker",
  },
  description: "resumetweaker is an AI-powered resume builder that helps you create, tweak, and perfect resumes tailored to your career goals. Boost your job search with smart suggestions and custom templates.",
  openGraph: {
    title: "resumetweaker - AI Resume Builder",
    description: "Create, tweak, and perfect your resume with resumetweaker’s AI-powered resume builder. Stand out in your job search with optimized and tailored resumes.",
    url: "https://resumetweaker.wibblit.com",
    siteName: "resumetweaker",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "resumetweaker - AI Resume Builder",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@wibblitofficial",
    title: "resumetweaker - AI Resume Builder",
    description: "Use resumetweaker's AI to create and optimize your resume effortlessly.",
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
  alternates: {
    canonical: "https://wibblit.com",
  },
  icons: {
    icon: "/icon.ico",
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
};


const fontSans = FontSans({
  // weight: ['100', '300', '400', '500', '700', '900'],
  subsets: ["latin"], 
  variable: "--font-roboto"
})


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      </head>
      <body className={cn(` antialiased font-custom`, fontSans.variable)}>
        <ThemeProviderWrapper>
          <ReduxProvider>{children}</ReduxProvider>
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
