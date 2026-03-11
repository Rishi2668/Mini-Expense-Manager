package com.expensemanager.dto;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;

public class ExpenseRequest {
        @NotNull
        private LocalDate date;

        @NotNull
        @Positive
        private Double amount;

        @NotNull
        private String vendorName;

        private String description;

    public ExpenseRequest() {
    }

    public ExpenseRequest(LocalDate date, Double amount, String vendorName, String description) {
        this.date = date;
        this.amount = amount;
        this.vendorName = vendorName;
        this.description = description;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getVendorName() {
        return vendorName;
    }

    public void setVendorName(String vendorName) {
        this.vendorName = vendorName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}


