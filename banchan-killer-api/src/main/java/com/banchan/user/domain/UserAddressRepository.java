package com.banchan.user.domain;

import java.util.List;
import java.util.Optional;

public interface UserAddressRepository {

    UserAddress save(UserAddress address);

    List<UserAddress> findByUser(User user);

    Optional<UserAddress> findById(Long id);

    Optional<UserAddress> findDefaultByUser(User user);

    void clearDefaultByUser(User user);

    void delete(UserAddress address);
}
