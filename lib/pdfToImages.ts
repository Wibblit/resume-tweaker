"use client";
declare const pdfjsLib: any;
const pdfToImages = async (pdfUrl: string): Promise<string[]> => {
  const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
  const numPages = pdf.numPages;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d")!;
  const imageUrls: string[] = [];

  for (let pageIndex = 1; pageIndex <= numPages; pageIndex++) {
    const page = await pdf.getPage(pageIndex);
    const viewport = page.getViewport({ scale: 2 });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport,
    };

    await page.render(renderContext).promise;
    const imageUrl = canvas.toDataURL("image/png");
    imageUrls.push(imageUrl);
  }

  return imageUrls;
};

export default pdfToImages;