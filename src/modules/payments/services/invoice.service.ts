// src/modules/payments/services/invoice.service.ts
import { db } from "../../../config/db";
import { invoices } from "../../../db/schema/invoices";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";

export class InvoiceService {
  static async generateInvoice(user: any, payment: any) {
    try {
      // ✅ Ensure invoices folder exists
      const invoicesDir = path.join(__dirname, "../../../../invoices");
      if (!fs.existsSync(invoicesDir)) {
        fs.mkdirSync(invoicesDir, { recursive: true });
        console.log(`📁 Created invoices folder: ${invoicesDir}`);
      }

      // ✅ Validate data
      if (!user || !user.id || !user.name || !user.email) {
        throw new Error("Missing user data for invoice generation");
      }
      if (!payment || !payment.id || !payment.amount) {
        throw new Error("Missing payment data for invoice generation");
      }

      // ✅ Generate PDF
      const filePath = path.join(invoicesDir, `invoice-${payment.id}.pdf`);
      console.log(`📝 Generating invoice at: ${filePath}`);

      const doc = new PDFDocument();
      doc.pipe(fs.createWriteStream(filePath));

      doc.fontSize(20).text("INVOICE", { align: "center" });
      doc.moveDown();
      doc.text(`Invoice ID: ${payment.id}`);
      doc.text(`Customer: ${user.name} (${user.email})`);
      doc.text(`Amount: $${payment.amount / 100}`);
      doc.text(`Status: ${payment.status}`);
      doc.text(`Date: ${new Date().toLocaleDateString()}`);

      doc.end();

      // ✅ Save invoice record in DB
      await db.insert(invoices).values({
        userId: user.id,
        paymentId: payment.id,
        invoiceUrl: filePath,
      });

      console.log(`✅ Invoice saved in DB & generated: ${filePath}`);
      return filePath;
    } catch (error: any) {
      console.error("❌ Failed to generate invoice:", error.message);
      throw new Error("Invoice generation failed");
    }
  }

  static async sendInvoiceEmail(user: any, filePath: string) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"MyApp" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "Your Invoice",
        text: "Please find attached your invoice.",
        attachments: [{ filename: "invoice.pdf", path: filePath }],
      });

      console.log(`📧 Invoice email sent to ${user.email}`);
    } catch (error: any) {
      console.error("❌ Failed to send invoice email:", error.message);
    }
  }
}
