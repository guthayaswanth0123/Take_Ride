/* eslint-disable @typescript-eslint/no-explicit-any */

import AppError from "../../errorHelpers/AppError";
import { uploadBufferToCloudinary } from "../../config/cloudinary.config";
import { generateRideInvoicePdf } from "../../utils/rideInvoice";
import { sendEmail } from "../../utils/sendEmail";

import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { Ride } from "../ride/ride.model";
import mongoose from "mongoose";

import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";
import httpStatus from "http-status-codes";

const initRidePayment = async (rideId: string) => {
  const ride = await Ride.findById(rideId).populate('rider');

  if (!ride) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Ride not found"
    );
  }

  // Check if payment already exists for this ride
  const existingPayment = await Payment.findOne({ ride: rideId });
  if (existingPayment) {
    // If payment is already completed, don't allow new payment
    if (existingPayment.status === PAYMENT_STATUS.PAID) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Payment already completed for this ride"
      );
    }
    
    // If payment is pending/failed, reinitialize with same transaction ID
    const sslPayload: ISSLCommerz = {
      address: (ride.rider as any).address || "Dhaka, Bangladesh",
      email: (ride.rider as any).email,
      phoneNumber: (ride.rider as any).phone || "01700000000",
      name: (ride.rider as any).name,
      amount: ride.fare,
      transactionId: existingPayment.transactionId,
    };

    const sslPayment = await SSLService.sslPaymentInit(sslPayload);
    return sslPayment;
  }

  const rider = ride.rider as any;
  const transactionId = `RIDE-${Date.now()}-${rideId.slice(-6)}`;

  // Create payment record
  const payment = await Payment.create({
    ride: rideId,
    amount: ride.fare,
    transactionId,
    status: PAYMENT_STATUS.PENDING,
  });

  const sslPayload: ISSLCommerz = {
    address: rider.address || "Dhaka, Bangladesh",
    email: rider.email,
    phoneNumber: rider.phone || "01700000000",
    name: rider.name,
    amount: ride.fare,
    transactionId: payment.transactionId,
  };

  const sslPayment = await SSLService.sslPaymentInit(sslPayload);
  return sslPayment;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const initPayment = async (bookingId: string) => {
  // This method is for tour booking payments (not implemented for ride system)
  throw new AppError(
    httpStatus.NOT_IMPLEMENTED,
    "Tour booking payment not implemented"
  );
};

// success payment
const successPayment = async (query: Record<string, string>) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      {
        status: PAYMENT_STATUS.PAID,
      },
      { runValidators: true, session }
    );
    
    if (!updatedPayment) {
      throw new AppError(401, "Payment not found");
    }

    // Check if this is a ride payment
    if (updatedPayment.ride) {
      // Update ride payment status
      const ride = await Ride.findByIdAndUpdate(
        updatedPayment.ride,
        { isPaid: true },
        { runValidators: true, session, new: true }
      ).populate('rider');
      
      if (ride) {
        // Generate invoice PDF
        const invoiceData = {
          transactionId: updatedPayment.transactionId,
          rideDate: ride.createdAt || new Date(),
          riderName: (ride.rider as any).name,
          pickupLocation: typeof ride.pickupLocation === 'object' ? ride.pickupLocation.address : ride.pickupLocation,
          destinationLocation: typeof ride.destinationLocation === 'object' ? ride.destinationLocation.address : ride.destinationLocation,
          fare: ride.fare,
        };

        try {
          const pdfBuffer = await generateRideInvoicePdf(invoiceData);
          const cloudinaryResult = await uploadBufferToCloudinary(pdfBuffer, `ride-invoice-${updatedPayment.transactionId}`);
          
          if (cloudinaryResult) {
            // Update payment with invoice URL
            await Payment.findByIdAndUpdate(
              updatedPayment._id,
              { invoiceUrl: cloudinaryResult.secure_url },
              { runValidators: true, session }
            );

            // Send email with invoice
            await sendEmail({
              to: (ride.rider as any).email,
              subject: "Ride Invoice - Payment Confirmation",
              templateName: "rideInvoice",
              templateData: invoiceData,
              attachments: [
                {
                  filename: `ride-invoice-${updatedPayment.transactionId}.pdf`,
                  content: pdfBuffer,
                  contentType: "application/pdf",
                },
              ],
            });
          }
        } catch (error) {
          console.log('Invoice generation/email error:', error);
          // Don't fail the payment if invoice fails
        }
      }
      
      await session.commitTransaction();
      session.endSession();
      return { success: true, message: "Ride payment completed successfully" };
    }

    // Original booking payment logic would go here
    // For now, just return success for ride payments
    await session.commitTransaction();
    session.endSession();
    return { success: true, message: "Payment completed successfully" };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// fail payment
const failPayment = async (query: Record<string, string>) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      {
        status: PAYMENT_STATUS.FAILED,
      },
      { runValidators: true, session }
    );

    if (updatedPayment?.ride) {
      await Ride.findByIdAndUpdate(
        updatedPayment.ride,
        { 
          isPaid: false,
          status: 'CANCELLED',
          'timestamps.cancelledAt': new Date()
        },
        { runValidators: true, session }
      );
    }

    await session.commitTransaction();
    session.endSession();
    return { success: false, message: "Payment failed" };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// cancel payment
const cancelPayment = async (query: Record<string, string>) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      {
        status: PAYMENT_STATUS.CANCELLED,
      },
      { runValidators: true, session }
    );

    if (updatedPayment?.ride) {
      await Ride.findByIdAndUpdate(
        updatedPayment.ride,
        { 
          isPaid: false,
          status: 'CANCELLED',
          'timestamps.cancelledAt': new Date()
        },
        { runValidators: true, session }
      );
    }

    await session.commitTransaction();
    session.endSession();
    return { success: false, message: "Payment cancelled" };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// download invoice
const getInvoiceDownloadUrl = async (paymentId: string) => {
  const payment = await Payment.findById(paymentId).select("invoiceUrl");

  if (!payment) {
    throw new AppError(401, "Payment not found");
  }

  if (!payment.invoiceUrl) {
    throw new AppError(401, "No invoice found");
  }

  return payment.invoiceUrl;
};



export const PaymentService = {
  initPayment,
  initRidePayment,
  successPayment,
  failPayment,
  cancelPayment,
  getInvoiceDownloadUrl,
};