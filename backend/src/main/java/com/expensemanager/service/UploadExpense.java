package com.expensemanager.service;

import com.expensemanager.dto.ExpenseRequest;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class UploadExpense {

    private static final Logger log = LoggerFactory.getLogger(UploadExpense.class);
    private static final Pattern ALPHANUMERIC = Pattern.compile("^[A-Za-z0-9 ]+$");
    private final SaveExpense saveExpense;

    public UploadExpense(SaveExpense saveExpense) {
        this.saveExpense = saveExpense;
    }

    @Transactional
    public void uploadExpensesFromCsv(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            log.warn("Uploaded file is empty");
            return;
        }

        int lineNumber = 0;
        int successCount = 0;

        java.util.List<ExpenseRequest> requests = new java.util.ArrayList<>();

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {

            String line;

            // Read and validate header line
            line = reader.readLine();
            if (line == null || line.trim().isEmpty()) {
                throw new IllegalArgumentException("CSV header is missing or empty");
            }
            lineNumber++; // header line

            // Process data lines
            while ((line = reader.readLine()) != null) {

                lineNumber++;

                if (!line.trim().isEmpty()) {

                    String[] parts = line.split(",", -1);

                    if (parts.length < 4) {
                        log.warn("Skipping line {}: expected at least 4 columns, got {}", lineNumber, parts.length);
                        throw new IllegalArgumentException(
                                String.format("Invalid CSV format at line %d: expected at least 4 columns, got %d",
                                        lineNumber, parts.length));
                    }

                    try {
                        String rawDate = parts[0];
                        String rawAmount = parts[1];
                        String rawVendor = parts[2];
                        String rawDescription = parts[3];

                        LocalDate date = parseDate(rawDate, lineNumber);
                        Double amount = parseAmount(rawAmount, lineNumber);
                        String vendorName =
                                validateAlphanumeric(rawVendor, "VENDOR NAME", lineNumber).toUpperCase(); // normalize
                        String description =rawDescription;

                        ExpenseRequest request =
                                new ExpenseRequest(date, amount, vendorName, description);

                        requests.add(request);
                        successCount++;

                    } catch (Exception parseException) {
                        log.warn("Failed to process line {}: {} - content: {}",
                                lineNumber, parseException.getMessage(), line);
                        if (parseException instanceof IllegalArgumentException) {
                            throw (IllegalArgumentException) parseException;
                        }
                        throw new IllegalArgumentException(
                                String.format("Failed to process CSV at line %d", lineNumber),
                                parseException);
                    }
                }
            }

        } catch (IOException e) {
            throw new RuntimeException("Failed to read CSV file", e);
        }

        for (ExpenseRequest request : requests) {
            saveExpense.addExpense(request);
        }

        log.info("CSV upload finished. Successful rows: {}",
                successCount);
    }

    private static LocalDate parseDate(String rawDate, int lineNumber) {
        if (rawDate == null || rawDate.trim().isEmpty()) {
            throw new IllegalArgumentException(
                    String.format("Missing date at line %d", lineNumber));
        }
        String value = rawDate.trim();
        try {
            return LocalDate.parse(value);
        } catch (Exception e) {
            throw new IllegalArgumentException(
                    String.format("Invalid date at line %d: '%s' (expected yyyy-MM-dd)", lineNumber, value));
        }
    }

    private static Double parseAmount(String rawAmount, int lineNumber) {
        if (rawAmount == null || rawAmount.trim().isEmpty()) {
            throw new IllegalArgumentException(
                    String.format("Missing amount at line %d", lineNumber));
        }
        String value = rawAmount.trim();
        try {
            return Double.parseDouble(value);
        } catch (Exception e) {
            throw new IllegalArgumentException(
                    String.format("Invalid amount at line %d: '%s' is not a valid number", lineNumber, value));
        }
    }

    private static String validateAlphanumeric(String rawValue, String fieldName, int lineNumber) {
        if (rawValue == null || rawValue.trim().isEmpty()) {
            throw new IllegalArgumentException(
                    String.format("Missing data: column %s at line %d", fieldName, lineNumber));
        }
        String value = rawValue.trim();
        if (!ALPHANUMERIC.matcher(value).matches()) {
            throw new IllegalArgumentException(
                    String.format("Invalid %s at line %d: '%s' must be alphanumeric", fieldName, lineNumber, value));
        }
        return value;
    }
}