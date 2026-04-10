/**
 * 전화번호 포맷팅 / 유효성 검사 유틸리티
 */

/** 숫자만 추출 */
export function stripPhone(value: string): string {
  return value.replace(/\D/g, '');
}

/** 자동 하이픈 포맷 (입력 중에도 적용) */
export function formatPhone(value: string): string {
  const digits = stripPhone(value);

  // 02 서울 지역번호
  if (digits.startsWith('02')) {
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
    if (digits.length <= 9) return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`;
    return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6, 10)}`;
  }

  // 010, 011, 016, 017, 018, 019 등 휴대폰/일반
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  if (digits.length <= 11) return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
}

/** 한국 전화번호 유효성 검사 */
export function isValidPhone(value: string): boolean {
  const digits = stripPhone(value);
  // 휴대폰: 010/011/016/017/018/019 + 7~8자리 = 총 10~11자리
  // 서울: 02 + 7~8자리 = 총 9~10자리
  // 지역번호: 0XX + 7~8자리 = 총 10~11자리
  return /^(01[016789]\d{7,8}|02\d{7,8}|0[3-9]\d{8,9})$/.test(digits);
}
