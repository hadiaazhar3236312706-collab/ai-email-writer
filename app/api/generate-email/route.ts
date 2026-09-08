import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { extractText, getDocumentProxy } from "unpdf";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const topic = formData.get("topic") as string;
    const tone = formData.get("tone") as string;
    const docFile = formData.get("pdf") as File | null; // can be PDF or Word
    const imageFile = formData.get("image") as File | null;

    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });

    // Build the base prompt
    let promptText = `Write a professional email based on the following request. Match the requested tone exactly.\n\nRequest: ${topic}\nTone: ${tone}`;

    // Extract text from an attached document (PDF or Word)
    if (docFile) {
      let extractedText = "";

      if (docFile.name.toLowerCase().endsWith(".pdf") || docFile.type === "application/pdf") {
        const buffer = new Uint8Array(await docFile.arrayBuffer());
        const pdf = await getDocumentProxy(buffer);
        const { text } = await extractText(pdf, { mergePages: true });
        extractedText = text;
      } else if (docFile.name.toLowerCase().endsWith(".docx")) {
        const mammothModule: any = await import("mammoth");
        const mammoth = mammothModule.default ?? mammothModule;
        const buffer = Buffer.from(await docFile.arrayBuffer());
        const result = await mammoth.extractRawText({ buffer });
        extractedText = result.value;
      }

      if (extractedText) {
        promptText += `\n\nThe user has also attached a document. Here is its extracted text content — use relevant details from it in the email:\n"""${extractedText.slice(0, 6000)}"""`;
      }
    }

    // Build the parts array (text + optional image)
    const parts: any[] = [{ text: promptText }];

    if (imageFile) {
      const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
      const base64Image = imageBuffer.toString("base64");
      parts.push({
        inlineData: {
          mimeType: imageFile.type || "image/jpeg",
          data: base64Image,
        },
      });
      parts.push({
        text: "The user has also attached an image (e.g. a brochure, flyer, or screenshot). Look at it and incorporate any relevant details (offers, dates, product names, text visible in it) into the email.",
      });
    }

    const result = await model.generateContent(parts);
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