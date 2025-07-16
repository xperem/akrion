// app/api/export/pdf/route.ts
import { NextRequest } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(request: NextRequest) {
  try {
    const { html, filename } = await request.json();

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920x1080'
      ]
    });

    const page = await browser.newPage();
    
    const fullHTML = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fiche Produit</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 40px 20px; 
        }
        h1 { color: #2563eb; text-align: center; margin-bottom: 30px; font-size: 28px; }
        h2 { color: #1e40af; margin: 25px 0 15px 0; font-size: 20px; }
        h3 { color: #1e40af; margin: 20px 0 10px 0; font-size: 16px; }
        .section { 
            background: #f8fafc; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 20px 0; 
            border-left: 4px solid #3b82f6; 
        }
        .field { margin-bottom: 12px; }
        .field-label { font-weight: 600; color: #374151; display: inline-block; min-width: 180px; }
        .field-value { color: #6b7280; }
        .question-item { 
            margin: 10px 0; 
            padding: 10px; 
            background: #ffffff; 
            border-radius: 6px; 
            border: 1px solid #e5e7eb; 
        }
        .question-text { font-weight: 500; color: #374151; margin-bottom: 5px; }
        .answer-text { color: #059669; font-weight: bold; }
        .tool-result { 
            background: white; 
            padding: 15px; 
            margin: 10px 0; 
            border-radius: 6px; 
            border: 1px solid #e5e7eb; 
        }
        .footer { 
            margin-top: 40px; 
            padding-top: 20px; 
            border-top: 1px solid #e5e7eb; 
            text-align: center; 
            color: #6b7280; 
            font-size: 14px; 
        }
        @media print {
            body { print-color-adjust: exact; }
            .section { break-inside: avoid; }
            .tool-result { break-inside: avoid; }
        }
    </style>
</head>
<body>
    ${html}
</body>
</html>`;

    await page.setContent(fullHTML, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      },
      printBackground: true,
      preferCSSPageSize: true
    });

    await browser.close();

    // Convertir en ReadableStream
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(pdfBuffer);
        controller.close();
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error) {
    console.error('Erreur génération PDF:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur lors de la génération du PDF' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}