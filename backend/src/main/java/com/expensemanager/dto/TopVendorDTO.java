package com.expensemanager.dto;

public class TopVendorDTO {

    private String vendor;
    private Double total;

    public TopVendorDTO() {
    }

    public TopVendorDTO(String vendor, Double total) {
        this.vendor = vendor;
        this.total = total;
    }

    public String getVendor() {
        return vendor;
    }

    public void setVendor(String vendor) {
        this.vendor = vendor;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }
}


