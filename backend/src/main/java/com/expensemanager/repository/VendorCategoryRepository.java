package com.expensemanager.repository;

import com.expensemanager.model.VendorCategory;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VendorCategoryRepository extends JpaRepository<VendorCategory, Long> {

    Optional<VendorCategory> findByVendorName(String vendorName);
}


