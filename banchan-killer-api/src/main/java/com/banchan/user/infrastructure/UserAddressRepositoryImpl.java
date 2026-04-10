package com.banchan.user.infrastructure;

import com.banchan.user.domain.User;
import com.banchan.user.domain.UserAddress;
import com.banchan.user.domain.UserAddressRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class UserAddressRepositoryImpl implements UserAddressRepository {

    private final UserAddressJpaRepository jpaRepository;

    public UserAddressRepositoryImpl(UserAddressJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public UserAddress save(UserAddress address) {
        return jpaRepository.save(address);
    }

    @Override
    public List<UserAddress> findByUser(User user) {
        return jpaRepository.findByUserOrderByCreatedAtDesc(user);
    }

    @Override
    public Optional<UserAddress> findById(Long id) {
        return jpaRepository.findById(id);
    }

    @Override
    public Optional<UserAddress> findDefaultByUser(User user) {
        return jpaRepository.findByUserAndIsDefaultTrue(user);
    }

    @Override
    public void clearDefaultByUser(User user) {
        jpaRepository.clearDefaultByUser(user);
    }

    @Override
    public void delete(UserAddress address) {
        jpaRepository.delete(address);
    }
}
