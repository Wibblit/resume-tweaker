"use server";

import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const RATE_LIMIT_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_REQUESTS = 5; // Maximum number of requests allowed per hour

interface RateLimitEntry {
  count: number;
  firstRequest: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry) {
    rateLimitMap.set(ip, { count: 1, firstRequest: now });
    return false;
  }

  if (now - entry.firstRequest > RATE_LIMIT_DURATION) {
    rateLimitMap.set(ip, { count: 1, firstRequest: now });
    return false;
  }

  entry.count++;
  return entry.count > MAX_REQUESTS;
}

export async function submitEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const ip = formData.get("ip") as string;

  try {
    // Check rate limit
    if (isRateLimited(ip)) {
      return {
        success: false,
        message: "Rate limit exceeded. Please try again later.",
      };
    }

    // Check if email already exists in the database
    const existingUser = await prisma.waitlist.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        success: true,
        message: "You've already joined the waitlist. We'll notify you soon!",
      };
    }

    // Save new email to the database
    await prisma.waitlist.create({
      data: { email },
    });

    // Send confirmation email to the user
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Welcome to AI Resume Builder Waitlist",
      text: "Thank you for joining our waitlist. We'll keep you updated on our launch!",
      html: `
      <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Resume Tweaker Waitlist</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #3f3f46;
            background-color: #f4f4f5;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
        }
        .header {
            text-align: center;
            padding: 20px 0;
        }
        h1 {
            color: #18181b;
            font-size: 24px;
            margin-bottom: 20px;
        }
        .content {
            background-color: #f4f4f5;
            padding: 20px;
            border-radius: 5px;
        }
        .quote {
            color: #52525b;
            margin-bottom: 20px;
        }
        .cta-button {
            display: inline-block;
            background-color:  #18181b;
            color: #ffffff;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #71717a;
        }
     .logoimg {
    width: 50px;  
    height: 50px;
}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://drive.google.com/uc?export=view&id=1NsuqIyx5Ost_uoQ0d4HaxsNJ1HEicApU" alt="Resume Tweaker Logo" class="logoimg">
        </div>
        <div class="content">
            <h1>Welcome to the Resume Tweaker Waitlist!</h1>
            <p>Thank you for joining our waitlist. We're excited to have you on board!</p>
            <div class="quote">
                <p><strong>Elevate Your Resume with AI</strong></p>
                <p>Craft a standout resume with ease using the power of AI. Receive tailored suggestions, optimize your content for specific job roles, and ensure your resume perfectly aligns with job descriptions—designed to accelerate your path to landing your dream job.</p>
            </div>
            <p>We'll keep you updated on our launch and provide you with exclusive early access when we're ready.</p>
            <p>In the meantime, check out our blog for resume tips and career advice:</p>
            <a href="https://resumetweaker.wibblit.com/blogs" class="cta-button">Read Our Blog</a>
        </div>
        <div class="footer">
            <p>Resume Tweaker is a product of <a href="https://resumetweaker.wibblit.com">Wibblit</a></p>
            <p>Team Wibblit</p>
            <p>&copy; 2024 Wibblit. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
        `,
    });

    console.log("Success: Email saved and sent successfully");
    return {
      success: true,
      message:
        "Successfully joined the waitlist! We'll keep you updated on our launch.",
    };
  } catch (error) {
    console.error("Error processing waitlist signup:", error);
    return {
      success: false,
      message:
        "Error joining the waitlist. Please try again or contact support.",
    };
  } finally {
    await prisma.$disconnect();
  }
}


