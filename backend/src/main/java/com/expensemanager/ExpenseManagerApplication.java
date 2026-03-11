package com.expensemanager;

import com.expensemanager.model.VendorCategory;
import com.expensemanager.repository.VendorCategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class ExpenseManagerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ExpenseManagerApplication.class, args);
    }

    @Bean
    public CommandLineRunner seedVendorCategories(VendorCategoryRepository vendorCategoryRepository) {
        return args -> {
            if (vendorCategoryRepository.count() == 0) {

                vendorCategoryRepository.save(new VendorCategory(null, "SWIGGY", "Food"));
                vendorCategoryRepository.save(new VendorCategory(null, "ZOMATO", "Food"));

                vendorCategoryRepository.save(new VendorCategory(null, "UBER", "Travel"));
                vendorCategoryRepository.save(new VendorCategory(null, "OLA", "Travel"));
                vendorCategoryRepository.save(new VendorCategory(null, "RAPIDO", "Travel"));

                vendorCategoryRepository.save(new VendorCategory(null, "AMAZON", "Shopping"));
                vendorCategoryRepository.save(new VendorCategory(null, "FLIPKART", "Shopping"));

                vendorCategoryRepository.save(new VendorCategory(null, "BIGBASKET", "Groceries"));
                vendorCategoryRepository.save(new VendorCategory(null, "BLINKIT", "Groceries"));
            }
        };
    }
}


