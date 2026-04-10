package com.banchan.user.application;

import com.banchan.user.domain.User;
import com.banchan.user.domain.UserAddress;
import com.banchan.user.domain.UserAddressRepository;
import com.banchan.user.domain.UserRepository;
import com.banchan.user.presentation.*;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class UserProfileService {

    private final UserRepository userRepository;
    private final UserAddressRepository userAddressRepository;

    public UserProfileService(UserRepository userRepository, UserAddressRepository userAddressRepository) {
        this.userRepository = userRepository;
        this.userAddressRepository = userAddressRepository;
    }

    public MyProfileResponse getMyProfile(Authentication authentication) {
        User user = getCurrentUser(authentication);
        return MyProfileResponse.from(user);
    }

    @Transactional
    public MyProfileResponse updateMyProfile(Authentication authentication, UpdateMyProfileRequest request) {
        User user = getCurrentUser(authentication);
        user.setNickname(request.nickname());
        user.setPhone(request.phone());
        user.setProfileImageUrl(request.profileImageUrl());
        return MyProfileResponse.from(user);
    }

    public List<UserAddressResponse> getMyAddresses(Authentication authentication) {
        User user = getCurrentUser(authentication);
        return userAddressRepository.findByUser(user).stream()
                .map(UserAddressResponse::from)
                .toList();
    }

    @Transactional
    public UserAddressResponse createAddress(Authentication authentication, UserAddressRequest request) {
        User user = getCurrentUser(authentication);
        boolean shouldSetDefault = request.isDefault() || userAddressRepository.findDefaultByUser(user).isEmpty();

        if (shouldSetDefault) {
            userAddressRepository.clearDefaultByUser(user);
        }

        UserAddress address = new UserAddress(
                user,
                request.recipientName(),
                request.recipientPhone(),
                request.zipCode(),
                request.address1(),
                request.address2(),
                request.deliveryRequest(),
                shouldSetDefault
        );

        return UserAddressResponse.from(userAddressRepository.save(address));
    }

    @Transactional
    public UserAddressResponse updateAddress(Authentication authentication, Long addressId, UserAddressRequest request) {
        User user = getCurrentUser(authentication);
        UserAddress address = getOwnedAddress(user, addressId);

        if (request.isDefault()) {
            userAddressRepository.clearDefaultByUser(user);
            address.setDefault(true);
        }

        address.update(
                request.recipientName(),
                request.recipientPhone(),
                request.zipCode(),
                request.address1(),
                request.address2(),
                request.deliveryRequest()
        );

        return UserAddressResponse.from(address);
    }

    @Transactional
    public UserAddressResponse setDefaultAddress(Authentication authentication, Long addressId) {
        User user = getCurrentUser(authentication);
        UserAddress address = getOwnedAddress(user, addressId);
        userAddressRepository.clearDefaultByUser(user);
        address.setDefault(true);
        return UserAddressResponse.from(address);
    }

    @Transactional
    public void deleteAddress(Authentication authentication, Long addressId) {
        User user = getCurrentUser(authentication);
        UserAddress address = getOwnedAddress(user, addressId);
        userAddressRepository.delete(address);
    }

    private User getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
    }

    private UserAddress getOwnedAddress(User user, Long addressId) {
        UserAddress address = userAddressRepository.findById(addressId)
                .orElseThrow(() -> new IllegalArgumentException("배송지를 찾을 수 없습니다."));
        if (!address.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("해당 배송지에 접근할 수 없습니다.");
        }
        return address;
    }
}
