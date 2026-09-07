package com.goride.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.ResponseEntity;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private int statusCode;
    private boolean success;
    private String message;
    private Meta meta;
    private T data;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Meta {
        private long total;
    }

    public static <T> ResponseEntity<ApiResponse<T>> success(int statusCode, String message, T data) {
        return ResponseEntity.status(statusCode).body(
            ApiResponse.<T>builder()
                .statusCode(statusCode)
                .success(true)
                .message(message)
                .data(data)
                .build()
        );
    }

    public static <T> ResponseEntity<ApiResponse<T>> success(int statusCode, String message, T data, Meta meta) {
        return ResponseEntity.status(statusCode).body(
            ApiResponse.<T>builder()
                .statusCode(statusCode)
                .success(true)
                .message(message)
                .meta(meta)
                .data(data)
                .build()
        );
    }

    public static <T> ResponseEntity<ApiResponse<T>> error(int statusCode, String message) {
        return ResponseEntity.status(statusCode).body(
            ApiResponse.<T>builder()
                .statusCode(statusCode)
                .success(false)
                .message(message)
                .build()
        );
    }
}
