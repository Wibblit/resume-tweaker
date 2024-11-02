"use client";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Provider } from "react-redux";
import store from "@/store";
import { Toaster } from "@/components/ui/toaster";
import { Roboto_Flex as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";

// const LTWave = localFont({
//   src: "./fonts/LTWave-Regular.ttf",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });

const fontSans = FontSans({
  // weight: ['100', '300', '400', '500', '700', '900'],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.cdnfonts.com/css/lt-wave-2"
          rel="stylesheet"
        />
      </head>
      <body className={cn(` antialiased font-custom`, fontSans.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Provider store={store}>{children}</Provider>
        </ThemeProvider>
        <Toaster />
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
