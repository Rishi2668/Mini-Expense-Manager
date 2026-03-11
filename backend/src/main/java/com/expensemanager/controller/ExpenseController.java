package com.expensemanager.controller;

import com.expensemanager.dto.ExpenseRequest;
import com.expensemanager.model.Expense;
import com.expensemanager.service.SaveExpense;
import com.expensemanager.service.UploadExpense;
import java.util.List;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/expenses")
public class ExpenseController {

    private final SaveExpense saveExpense;
    private final UploadExpense uploadExpense;

    public ExpenseController(SaveExpense saveExpense, UploadExpense uploadExpense) {
        this.saveExpense = saveExpense;
        this.uploadExpense = uploadExpense;
    }

    @PostMapping
    public ResponseEntity<Expense> addExpense(@Valid @RequestBody ExpenseRequest request) {
        Expense saved = saveExpense.addExpense(request);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping
    public List<Expense> getExpenses() {
        return saveExpense.getAllExpenses();
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadCsv(@RequestParam("file") MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }
        uploadExpense.uploadExpensesFromCsv(file);
        return ResponseEntity.ok("CSV uploaded successfully");
    }
}


