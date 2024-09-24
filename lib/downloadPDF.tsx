// "use server";

// import type { Browser, LaunchOptions } from "puppeteer-core";
// import type { PuppeteerNodeLaunchOptions } from "puppeteer";

// const PAGE_FORMATS = {
//   a4: { width: 794, height: 1123 },
//   letter: { width: 816, height: 1056 },
// };

// export async function generateResume(
//   htmlContent: string,
//   numberOfPages: number,
//   pageFormat: "a4" | "letter"
// ) {
//   let browser: Browser | null = null;
//   try {
//     let puppeteer;
//     let options: PuppeteerNodeLaunchOptions = {};

//     if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
//       // Running on AWS Lambda
//       puppeteer = await import("puppeteer-core");
//       const chromium = await import("chrome-aws-lambda");
//       options = {
//         //@ts-ignore
//         args: chromium.args,
//         //@ts-ignore
//         defaultViewport: chromium.defaultViewport,
//         //@ts-ignore
//         executablePath: await chromium.executablePath,
//         //@ts-ignore
//         headless: chromium.headless,
//       };
//     } else {
//       // Running locally
//       puppeteer = await import("puppeteer");
//       options = {
//         headless: true,
//       };
//     }

//     browser = await puppeteer.launch(options as LaunchOptions) as Browser;
//     const page = await browser?.newPage();

//     // Set the viewport to match the page format
//     const { width, height } = PAGE_FORMATS[pageFormat];
//     await page.setViewport({ width, height, deviceScaleFactor: 1 });

//     // Set the content of the page
//     await page.setContent(htmlContent, { waitUntil: "networkidle0" });

//     // Generate PDF
//     const pdf = await page.pdf({
//       format: pageFormat,
//       printBackground: true,
//       margin: { top: "0", right: "0", bottom: "0", left: "0" },
//       preferCSSPageSize: true,
//     });

//     // Convert Buffer to Base64
//     const base64Pdf = Buffer.from(pdf).toString("base64");

//     return { success: true, pdf: base64Pdf };
//   } catch (error: unknown) {
//     console.error("Error generating resume:", error);
//     if (error instanceof Error) {
//       return { success: false, error: error.message };
//     } else {
//       return { success: false, error: "An unknown error occurred" };
//     }
//   } finally {
//     if (browser) {
//       await browser.close();
//     }
//   }
// }

"use server";

import { Browser, LaunchOptions, Page } from "puppeteer-core";
import type { PuppeteerLaunchOptions } from "puppeteer";

const PAGE_FORMATS = {
  a4: { width: 794, height: 1123 },
  letter: { width: 816, height: 1056 },
} as const;

type PageFormat = keyof typeof PAGE_FORMATS;

export async function generateResume(
  htmlContent: string,
  numberOfPages: number,
  pageFormat: PageFormat
): Promise<{ success: boolean; pdf?: string; error?: string }> {
  let browser: Browser | null = null;
  try {
    let puppeteer;
    let options: PuppeteerLaunchOptions;

    if (process.env.NODE_ENV === "production") {
      // Production environment (e.g., Vercel)
      puppeteer = await import("puppeteer-core");
      options = {
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        executablePath:
          process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/google-chrome",
      };
    } else {
      // Local development environment
      puppeteer = await import("puppeteer");
      options = {
        headless: true,
      };
    }   

    browser = await puppeteer.launch(options as LaunchOptions) as Browser;
    const page: Page = await browser.newPage();

    // Set the viewport to match the page format
    const { width, height } = PAGE_FORMATS[pageFormat];
    await page.setViewport({ width, height, deviceScaleFactor: 1 });

    // Set the content of the page
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    // Generate PDF
    const pdf = await page.pdf({
      format: pageFormat,
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
      preferCSSPageSize: true,
    });

    // Convert Buffer to Base64
    const base64Pdf = Buffer.from(pdf).toString("base64");

    return { success: true, pdf: base64Pdf };
  } catch (error: unknown) {
    console.error("Error generating resume:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    } else {
      return { success: false, error: "An unknown error occurred" };
    }
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}