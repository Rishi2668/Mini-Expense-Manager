package com.expensemanager.service;
import com.expensemanager.dto.DashboardResponse;
import com.expensemanager.dto.ExpenseRequest;
import com.expensemanager.dto.TopVendorDTO;
import com.expensemanager.model.Expense;
import com.expensemanager.model.VendorCategory;
import com.expensemanager.repository.ExpenseRepository;
import com.expensemanager.repository.VendorCategoryRepository;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class SaveExpense {

    private final ExpenseRepository expenseRepository;
    private final VendorCategoryRepository vendorCategoryRepository;

    public SaveExpense(ExpenseRepository expenseRepository, VendorCategoryRepository vendorCategoryRepository) {
        this.expenseRepository = expenseRepository;
        this.vendorCategoryRepository = vendorCategoryRepository;
    }

    public Expense addExpense(ExpenseRequest request) {
        String vendorName = request.getVendorName()
                .trim()
                .toUpperCase();
        String category = resolveCategory(vendorName);


        Double avg = expenseRepository.findAverageAmountByCategory(category);
        if (avg == null) {
            avg = 0.0;
        }

        boolean isAnomaly = avg > 0 && request.getAmount() != null && request.getAmount() > 3 * avg;

        Expense expense = new Expense();
        expense.setDate(request.getDate());
        expense.setAmount(request.getAmount());
        expense.setVendorName(request.getVendorName());
        expense.setDescription(request.getDescription());
        expense.setCategory(category);
        expense.setIsAnomaly(isAnomaly);

        return expenseRepository.save(expense);
    }

    public List<Expense> getAllExpenses() {
        return expenseRepository.findAllByOrderByDateDescIdDesc();
    }

    public DashboardResponse getDashboard() {
        List<Expense> all = expenseRepository.findAll();

        LocalDate today = LocalDate.now();
        LocalDate startOfMonth = today.withDayOfMonth(1);
        LocalDate endOfMonth = today.withDayOfMonth(today.lengthOfMonth());

        Map<String, Double> monthlyTotals = new HashMap<>();

        all.stream()
                .filter(e -> e.getDate() != null
                        && !e.getDate().isBefore(startOfMonth)
                        && !e.getDate().isAfter(endOfMonth))
                .forEach(e -> {
                    String cat = e.getCategory() != null ? e.getCategory() : "Uncategorized";
                    double amount = e.getAmount() != null ? e.getAmount() : 0.0;
                    monthlyTotals.merge(cat, amount, Double::sum);
                });

        Map<String, Double> vendorTotals = new HashMap<>();
        all.forEach(e -> {
            String vendor = e.getVendorName() != null ? e.getVendorName() : "Unknown";
            double amount = e.getAmount() != null ? e.getAmount() : 0.0;
            vendorTotals.merge(vendor, amount, Double::sum);
        });

        List<TopVendorDTO> topVendors = vendorTotals.entrySet().stream()
                .sorted(Map.Entry.<String, Double>comparingByValue().reversed())
                .limit(5)
                .map(e -> new TopVendorDTO(e.getKey(), e.getValue()))
                .collect(Collectors.toList());

        List<Expense> anomalies = all.stream()
                .filter(e -> Boolean.TRUE.equals(e.getIsAnomaly()))
                .collect(Collectors.toList());

        return new DashboardResponse(monthlyTotals, topVendors, anomalies);
    }

    private String resolveCategory(String vendorName) {
        if (vendorName == null || vendorName.isBlank()) {
            return "Others";
        }
        Optional<VendorCategory> mapping = vendorCategoryRepository.findByVendorName(vendorName);
        return mapping.map(VendorCategory::getCategory).orElse("Others");
    }
}


