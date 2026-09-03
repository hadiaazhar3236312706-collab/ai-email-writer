import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { clientName, invoiceNumber, amount, dueDate } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });

    const prompt = `Write a professional, short, and polite email to a client named ${clientName} reminding them about an unpaid invoice #${invoiceNumber} for the amount ${amount}, which was due on ${dueDate}. Keep it courteous and business-appropriate.`;

    const result = await model.generateContent(prompt);
    const emailText = result.response.text();

    return NextResponse.json({ email: emailText });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate email" },
      { status: 500 }
    );
  }
}