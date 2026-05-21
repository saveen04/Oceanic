import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { MongoClient } from "mongodb";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "placeholder_secret",
});

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri || "mongodb://localhost:27017");

export async function POST(req) {
  try {
    const { hotelId, hotelName, amount, userName, userEmail } = await req.json();

    // 1. Create Razorpay Order
    const order = await razorpay.orders.create({
      amount: amount * 100, // in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    // 2. Save Pending Booking to MongoDB
    if (uri) {
        await client.connect();
        const db = client.db("oceanic_viz");
        await db.collection("bookings").insertOne({
          orderId: order.id,
          hotelId,
          hotelName,
          amount,
          userName,
          userEmail,
          status: "pending",
          createdAt: new Date(),
        });
    }

    return NextResponse.json({ 
        orderId: order.id, 
        amount: order.amount,
        key: process.env.RAZORPAY_KEY_ID 
    });
  } catch (error) {
    console.error("Booking Error:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  } finally {
    if (uri) await client.close();
  }
}
