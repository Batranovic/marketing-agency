package com.bsep.marketingacency.repository;

import com.bsep.marketingacency.model.LoginToken;
import com.bsep.marketingacency.model.Package;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface LoginTokenRepository extends JpaRepository<LoginToken, UUID> {
}