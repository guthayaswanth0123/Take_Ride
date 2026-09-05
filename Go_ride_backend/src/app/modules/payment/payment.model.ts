import { model, Schema } from "mongoose";
import { IPayment, PAYMENT_STATUS } from "./payment.interface";


const paymentSchema = new Schema<IPayment>({
    booking: {
        type: Schema.Types.ObjectId,
        ref: "Booking",
        required: false,
        index: true, // Regular index, not unique
    },
    ride: {
        type: Schema.Types.ObjectId,
        ref: "Ride",
        required: false,
        index: true, // Regular index, not unique
    },
    transactionId: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: String,
        enum: Object.values(PAYMENT_STATUS),
        default: PAYMENT_STATUS.UNPAID,
    },
    amount: {
        type: Number,
        required: true
    },
    paymentGatewayData: {
        type: Schema.Types.Mixed
    },
    invoiceUrl: {
        type: String,
    },
}, {
    timestamps: true
});


paymentSchema.index({ booking: 1, ride: 1 });


export const Payment = model<IPayment>("Payment", paymentSchema)