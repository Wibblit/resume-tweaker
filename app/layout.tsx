"use client";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Provider } from "react-redux";
import store from "@/store";
import { Toaster } from "@/components/ui/toaster";
import AuthSessionProvider from "@/components/AuthSessionProvider";

// const LTWave = localFont({
//   src: "./fonts/LTWave-Regular.ttf",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });

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
      <body className={` antialiased font-custom`}>
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
