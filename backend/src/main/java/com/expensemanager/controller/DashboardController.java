package com.expensemanager.controller;

import com.expensemanager.dto.DashboardResponse;
import com.expensemanager.service.SaveExpense;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    private final SaveExpense saveExpense;

    public DashboardController(SaveExpense saveExpense) {
        this.saveExpense = saveExpense;
    }

    @GetMapping
    public DashboardResponse getDashboard() {
        return saveExpense.getDashboard();
    }
}


