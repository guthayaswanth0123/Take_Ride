package com.goride.controller;

import com.goride.common.ApiResponse;
import com.goride.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/init-ride-payment/{rideId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> initRidePayment(@PathVariable("rideId") String rideId) {
        Map<String, Object> response = paymentService.initRidePayment(rideId);
        return ApiResponse.success(200, "Payment initialized successfully", response);
    }

    @PostMapping("/init-payment/{bookingId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> initPayment(@PathVariable("bookingId") String bookingId) {
        Map<String, Object> response = paymentService.initRidePayment(bookingId);
        return ApiResponse.success(200, "Payment initialized successfully", response);
    }

    @RequestMapping(value = "/success", method = {RequestMethod.GET, RequestMethod.POST})
    public void successPayment(@RequestParam("transactionId") String transactionId,
                               @RequestParam(value = "amount", required = false) Double amount,
                               HttpServletResponse response) throws IOException {
        String redirectUrl = paymentService.handleSuccess(transactionId, amount);
        response.sendRedirect(redirectUrl);
    }

    @RequestMapping(value = "/fail", method = {RequestMethod.GET, RequestMethod.POST})
    public void failPayment(@RequestParam("transactionId") String transactionId,
                            HttpServletResponse response) throws IOException {
        String redirectUrl = paymentService.handleFail(transactionId);
        response.sendRedirect(redirectUrl);
    }

    @RequestMapping(value = "/cancel", method = {RequestMethod.GET, RequestMethod.POST})
    public void cancelPayment(@RequestParam("transactionId") String transactionId,
                              HttpServletResponse response) throws IOException {
        String redirectUrl = paymentService.handleCancel(transactionId);
        response.sendRedirect(redirectUrl);
    }

    @PostMapping("/invoice/{paymentId}")
    public ResponseEntity<ApiResponse<Map<String, String>>> getInvoiceDownloadUrl(@PathVariable("paymentId") String paymentId) {
        String url = paymentService.getInvoiceDownloadUrl(paymentId);
        Map<String, String> data = new HashMap<>();
        data.put("downloadUrl", url);
        return ApiResponse.success(200, "Invoice download URL retrieved successfully", data);
    }
}
