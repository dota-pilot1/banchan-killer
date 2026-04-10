import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DeliveryAddress {
  recipientName: string;
  recipientPhone: string;
  zipCode: string;
  address1: string;
  address2: string;
  deliveryRequest: string;
}

interface ProfileState {
  profileImageUrl: string;
  nickname: string;
  email: string;
  phone: string;
  defaultAddress: DeliveryAddress;
  hydrateFromAuth: (auth: { email?: string | null; nickname?: string | null }) => void;
  updateProfile: (updates: { profileImageUrl?: string; nickname?: string; email?: string; phone?: string }) => void;
  updateDefaultAddress: (updates: Partial<DeliveryAddress>) => void;
}

const emptyAddress: DeliveryAddress = {
  recipientName: '',
  recipientPhone: '',
  zipCode: '',
  address1: '',
  address2: '',
  deliveryRequest: '',
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profileImageUrl: '',
      nickname: '',
      email: '',
      phone: '',
      defaultAddress: emptyAddress,
      hydrateFromAuth: (auth) =>
        set((state) => ({
          nickname: state.nickname || auth.nickname || '',
          email: state.email || auth.email || '',
        })),
      updateProfile: (updates) =>
        set((state) => ({
          ...state,
          ...updates,
        })),
      updateDefaultAddress: (updates) =>
        set((state) => ({
          defaultAddress: {
            ...state.defaultAddress,
            ...updates,
          },
        })),
    }),
    {
      name: 'profile-storage',
    }
  )
);
