import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

import { envVars } from "../../config/env";
import { sendResponse } from "../../utils/sendResponse";
import { PaymentService } from "./payment.service";
import { SSLService } from "../sslCommerz/sslCommerz.service";



const initPayment = catchAsync(async (req: Request, res: Response) => {
  const bookingId = req.params.bookingId;

  const result = await PaymentService.initPayment(bookingId as string);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Payment successful",
    data: result,
  });
});

const initRidePayment = catchAsync(async (req: Request, res: Response) => {
  const rideId = req.params.rideId;

  const result = await PaymentService.initRidePayment(rideId as string);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Ride payment initialized",
    data: result,
  });
});

// success payment
const successPayment = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await PaymentService.successPayment(
    query as Record<string, string>
  );
  if (result.success) {
    res.redirect(
      `${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transaction}&message=${result.message}&amount=${query.amount}&status=${query.status}`
    );
  }
});

const failPayment = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await PaymentService.failPayment(
    query as Record<string, string>
  );
  if (!result.success) {
    res.redirect(
      `${envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transaction}&message=${result.message}&amount=${query.amount}&status=${query.status}`
    );
  }
});

const cancelPayment = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await PaymentService.cancelPayment(
    query as Record<string, string>
  );
  if (result.success) {
    res.redirect(
      `${envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transaction}&message=${result.message}&amount=${query.amount}&status=${query.status}`
    );
  }
});

const getInvoiceDownloadUrl = catchAsync(
  async (req: Request, res: Response) => {
    const { paymentId } = req.params;
    const result = await PaymentService.getInvoiceDownloadUrl(paymentId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Invoice download URL retrieved successfully",
      data: result,
    });
  }
);

const validatePayment = catchAsync(async (req: Request, res: Response) => {
  console.log("sslcommerz IPN url body", req.body);
  await SSLService.validatePayment(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment Validated Successfully",
    data: null,
  });
});

export const PaymentController = {
  successPayment,
  failPayment,
  cancelPayment,
  initPayment,
  initRidePayment,
  getInvoiceDownloadUrl,
  validatePayment,
};