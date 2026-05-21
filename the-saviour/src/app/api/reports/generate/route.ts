import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { reportCache } from '@/lib/reportCache';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  try {
    const filters = await request.json();

    // In a real scenario, we would use filters to query MongoDB via Mongoose.
    // e.g., const data = await ActivityLog.find({ timestamp: { $gte: filters.startDate } });
    
    // For this demonstration, we'll simulate an advanced AI analysis engine combining real and mock data.
    const reportData = {
      id: randomUUID(),
      filters,
      timestamp: new Date().toISOString(),
      summary: {
        totalDetections: Math.floor(Math.random() * 500) + 100,
        humanDetections: Math.floor(Math.random() * 50) + 10,
        animalDetections: Math.floor(Math.random() * 300) + 50,
        alertsTriggered: Math.floor(Math.random() * 20) + 5,
        activeZones: 5
      },
      aiInsights: [
        `High human intrusion detected in ${filters.location !== 'All' ? filters.location : 'Sector Alpha'} during off-hours.`,
        "Animal movement highest between 02:00 AM and 05:00 AM.",
        "Repeated anomalous activity detected near Camera CAM-03.",
        "Overall threat level indicates a 15% decrease in unauthorized vehicle movement compared to last week."
      ],
      hotspots: [
        { name: 'Sector Alpha', coordinates: '29.5350, 78.7700', risk: 'High', incidents: 42 },
        { name: 'North Gate', coordinates: '29.5400, 78.7900', risk: 'Critical', incidents: 85 },
        { name: 'River Basin', coordinates: '29.5250, 78.7850', risk: 'Low', incidents: 12 },
      ],
      activityData: [
        { name: 'Sector Alpha', Human: 12, Animal: 45, Vehicle: 5 },
        { name: 'Sector Bravo', Human: 4, Animal: 30, Vehicle: 2 },
        { name: 'North Gate', Human: 20, Animal: 15, Vehicle: 18 },
        { name: 'River Basin', Human: 2, Animal: 60, Vehicle: 0 },
      ],
      timeData: [
        { time: 'Week 1', incidents: 45 },
        { time: 'Week 2', incidents: 52 },
        { time: 'Week 3', incidents: 38 },
        { time: 'Week 4', incidents: 65 },
      ],
      pieData: [
        { name: 'Animal', value: 150 },
        { name: 'Human', value: 38 },
        { name: 'Vehicle', value: 25 },
      ]
    };

    // Store the data in the in-memory cache
    reportCache.set(reportData.id, reportData);

    // Launch Puppeteer to generate the PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // We navigate to a specific hidden route in our Next.js app that renders the report visually
    // using the cached data ID.
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    await page.goto(`${baseUrl}/report-view?id=${reportData.id}`, {
      waitUntil: 'networkidle0', // Wait until all charts have animated and loaded
      timeout: 15000
    });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    await browser.close();

    // Return the PDF buffer directly
    return new NextResponse(pdfBuffer as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Saviour_Enterprise_Report.pdf"'
      }
    });

  } catch (error) {
    console.error('PDF Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF report' }, { status: 500 });
  }
}
