package com.banchan.user.infrastructure;

import com.banchan.user.domain.User;
import com.banchan.user.domain.UserAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

interface UserAddressJpaRepository extends JpaRepository<UserAddress, Long> {

    List<UserAddress> findByUserOrderByCreatedAtDesc(User user);

    Optional<UserAddress> findByUserAndIsDefaultTrue(User user);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("update UserAddress a set a.isDefault = false where a.user = :user")
    void clearDefaultByUser(User user);
}
