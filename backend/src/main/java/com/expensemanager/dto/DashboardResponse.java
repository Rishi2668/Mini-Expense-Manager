package com.expensemanager.dto;

import com.expensemanager.model.Expense;
import java.util.List;
import java.util.Map;

public class DashboardResponse {

    private Map<String, Double> monthlyTotals;
    private List<TopVendorDTO> topVendors;
    private List<Expense> anomalies;

    public DashboardResponse() {
    }

    public DashboardResponse(Map<String, Double> monthlyTotals, List<TopVendorDTO> topVendors, List<Expense> anomalies) {
        this.monthlyTotals = monthlyTotals;
        this.topVendors = topVendors;
        this.anomalies = anomalies;
    }

    public Map<String, Double> getMonthlyTotals() {
        return monthlyTotals;
    }

    public void setMonthlyTotals(Map<String, Double> monthlyTotals) {
        this.monthlyTotals = monthlyTotals;
    }

    public List<TopVendorDTO> getTopVendors() {
        return topVendors;
    }

    public void setTopVendors(List<TopVendorDTO> topVendors) {
        this.topVendors = topVendors;
    }

    public List<Expense> getAnomalies() {
        return anomalies;
    }

    public void setAnomalies(List<Expense> anomalies) {
        this.anomalies = anomalies;
    }
}


