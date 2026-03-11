package com.expensemanager.repository;

import com.expensemanager.model.Expense;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    @Query("SELECT COALESCE(AVG(e.amount), 0) FROM Expense e WHERE e.category = :category")
    Double findAverageAmountByCategory(@Param("category") String category);
    List<Expense> findAllByOrderByDateDescIdDesc();

}


