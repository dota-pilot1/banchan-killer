import { create } from 'zustand';

export interface DeliveryAddress {
  id?: number;
  recipientName: string;
  recipientPhone: string;
  zipCode: string;
  address1: string;
  address2: string;
  deliveryRequest: string;
  isDefault?: boolean;
}

interface ProfileState {
  profileImageUrl: string;
  nickname: string;
  email: string;
  phone: string;
  defaultAddress: DeliveryAddress;
  setProfile: (profile: { profileImageUrl?: string; nickname?: string; email?: string; phone?: string }) => void;
  hydrateFromAuth: (auth: { email?: string | null; nickname?: string | null }) => void;
  updateProfile: (updates: { profileImageUrl?: string; nickname?: string; email?: string; phone?: string }) => void;
  setDefaultAddress: (address: DeliveryAddress) => void;
  updateDefaultAddress: (updates: Partial<DeliveryAddress>) => void;
}

export const emptyDeliveryAddress: DeliveryAddress = {
  recipientName: '',
  recipientPhone: '',
  zipCode: '',
  address1: '',
  address2: '',
  deliveryRequest: '',
};

export const useProfileStore = create<ProfileState>()(
  (set) => ({
    profileImageUrl: '',
    nickname: '',
    email: '',
    phone: '',
    defaultAddress: emptyDeliveryAddress,
    setProfile: (profile) =>
      set((state) => ({
        ...state,
        ...profile,
      })),
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
    setDefaultAddress: (address) =>
      set({
        defaultAddress: {
          ...emptyDeliveryAddress,
          ...address,
        },
      }),
    updateDefaultAddress: (updates) =>
      set((state) => ({
        defaultAddress: {
          ...state.defaultAddress,
          ...updates,
        },
      })),
  })
);
