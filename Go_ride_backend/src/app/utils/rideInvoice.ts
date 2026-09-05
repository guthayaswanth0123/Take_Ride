/* eslint-disable @typescript-eslint/no-explicit-any */
import PDFDocument from "pdfkit";
import AppError from "../errorHelpers/AppError";

export interface IRideInvoiceData {
    transactionId: string;
    rideDate: Date;
    riderName: string;
    pickupLocation: string;
    destinationLocation: string;
    fare: number;
}

export const generateRideInvoicePdf = async (invoiceData: IRideInvoiceData): Promise<Buffer> => {
    try {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ size: "A4", margin: 50 });
            const buffer: Uint8Array[] = [];

            doc.on("data", (chunk) => buffer.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(buffer)));
            doc.on("error", (err) => reject(err));

            // Header
            doc.fontSize(24).text("Go-Ride", { align: "center" });
            doc.fontSize(16).text("Ride Invoice", { align: "center" });
            doc.moveDown(2);

            // Invoice Details
            doc.fontSize(12);
            doc.text(`Invoice ID: ${invoiceData.transactionId}`, 50, doc.y);
            doc.text(`Date: ${invoiceData.rideDate.toLocaleDateString()}`, 50, doc.y);
            doc.text(`Rider: ${invoiceData.riderName}`, 50, doc.y);
            doc.moveDown();

            // Ride Details
            doc.fontSize(14).text("Ride Details:", 50, doc.y);
            doc.fontSize(12);
            doc.text(`From: ${invoiceData.pickupLocation}`, 70, doc.y);
            doc.text(`To: ${invoiceData.destinationLocation}`, 70, doc.y);
            doc.moveDown();

            // Payment Details
            doc.fontSize(14).text("Payment Details:", 50, doc.y);
            doc.fontSize(12);
            doc.text(`Fare: ৳${invoiceData.fare}`, 70, doc.y);
            doc.text(`Payment Method: Card`, 70, doc.y);
            doc.text(`Status: Paid`, 70, doc.y);
            doc.moveDown(2);

            // Footer
            doc.fontSize(10).text("Thank you for using Go-Ride!", { align: "center" });
            doc.text("For support, contact us at support@go-ride.com", { align: "center" });

            doc.end();
        });
    } catch (error: any) {
        console.log(error);
        throw new AppError(401, `Ride invoice PDF creation error: ${error.message}`);
    }
};