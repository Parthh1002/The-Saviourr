import { NextResponse } from 'next/server';

// In a real production app, you would store these in a database linked to the user
let subscriptions: any[] = [];

export async function POST(req: Request) {
  try {
    const subscription = await req.json();
    
    // Check if subscription already exists
    const exists = subscriptions.find(s => s.endpoint === subscription.endpoint);
    if (!exists) {
      subscriptions.push(subscription);
    }

    return NextResponse.json({ success: true, message: 'Subscription registered' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// For sending notifications (in a real app, this would be triggered by detection events)
export async function GET() {
    return NextResponse.json({ subscriptions });
}
