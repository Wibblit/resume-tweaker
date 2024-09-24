'use server'

import puppeteer from "puppeteer";

const PAGE_FORMATS = {
  A4: { width: 794, height: 1123 }, // A4 size in pixels at 96 DPI
  LETTER: { width: 816, height: 1056 }, // Letter size in pixels at 96 DPI
};

export async function generateResume(htmlContent: string, numberOfPages: number, pageFormat: "A4" | "LETTER") {
  let browser = null;
  try {
    browser = await puppeteer.launch({ 
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true // Use the new headless mode
    });
    const page = await browser.newPage();

    // Set the viewport to match the page format
    const { width, height } = PAGE_FORMATS[pageFormat];
    await page.setViewport({ width, height, deviceScaleFactor: 1 });

    // Set the content of the page
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // Generate PDF
    const pdf = await page.pdf({ 
      format: pageFormat,
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
      preferCSSPageSize: true
    });

    // Convert Buffer to Base64
    const base64Pdf = Buffer.from(pdf).toString('base64');

    return { success: true, pdf: base64Pdf };
  } catch (error: unknown) {
    console.error("Error generating resume:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    } else {
      return { success: false, error: 'An unknown error occurred' };
    }
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}