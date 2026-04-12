# banchan-killer

매일 먹기 좋은 기본 반찬을 판매하는 반찬몰 프로젝트입니다.

## 구성

- `banchan-killer-front`: React + Vite 프론트엔드
- `banchan-killer-api`: Spring Boot API

## 핵심 컨셉

- 야채 반찬 / 고기 반찬 / 김치류 카테고리
- 매일 꺼내 먹기 좋은 기본 반찬
- 부담 없이 자주 주문할 수 있는 실속형 반찬몰

## 실행 전 준비

### 1. 백엔드용 `.env` 파일 만들기

루트가 아니라 [banchan-killer-api/.env](/Users/terecal/banchan-killer-container/banchan-killer-api/.env) 경로에 `.env` 파일을 만들어야 합니다.

- 위치: `banchan-killer-api/.env`
- 이 파일은 git에 포함되지 않도록 [banchan-killer-api/.gitignore](/Users/terecal/banchan-killer-container/banchan-killer-api/.gitignore)에 추가되어 있습니다.
- Spring Boot는 `spring.config.import=optional:file:.env[.properties]` 설정으로 실행 시 이 파일을 읽습니다.

#### 백엔드 `.env`에 넣을 값

필수

- `SPRING_DATASOURCE_URL`: PostgreSQL DB 접속 URL
- `SPRING_DATASOURCE_USERNAME`: DB 계정
- `SPRING_DATASOURCE_PASSWORD`: DB 비밀번호
- `JWT_SECRET`: 로그인/인증 토큰 서명 키

선택

- `SPRING_JPA_HIBERNATE_DDL_AUTO`: 현재 프로젝트 기본값은 `update`
- `JWT_ACCESS_TOKEN_VALIDITY_IN_SECONDS`: 액세스 토큰 만료 시간(초 단위), 기본값 `86400`

- `AWS_ACCESS_KEY_ID`: AWS 액세스 키
- `AWS_SECRET_ACCESS_KEY`: AWS 시크릿 키
- `AWS_REGION` 또는 `AWS_S3_REGION`: S3 리전
- `S3_BUCKET_NAME`: 상품 이미지 업로드 대상 버킷명

- `TOSS_SECRET_KEY`: 백엔드에서 Toss 승인 API 호출 시 사용하는 시크릿 키

현재 반찬몰 핵심 기능에서는 미사용 또는 비필수

- `OPENAI_API_KEY`
- `GEMINI_API_KEY`
- `CARTESIA_API_KEY`
- `AZURE_SPEECH_KEY`
- `AZURE_SPEECH_REGION`
- `OAUTH2_REDIRECT_BASE_URL`

위 값들은 현재 상품, 장바구니, 주문서, 주문 생성 흐름에는 직접 필요하지 않습니다. 다른 실험 기능이나 외부 연동을 붙일 때만 별도로 관리하면 됩니다.

#### 백엔드 `.env` 예시

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/mydatabase
SPRING_DATASOURCE_USERNAME=your_db_user
SPRING_DATASOURCE_PASSWORD=your_db_password
SPRING_JPA_HIBERNATE_DDL_AUTO=update
JWT_SECRET=replace-with-secure-secret
JWT_ACCESS_TOKEN_VALIDITY_IN_SECONDS=86400

AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=ap-northeast-2
S3_BUCKET_NAME=your-s3-bucket

TOSS_SECRET_KEY=your_toss_secret_key

OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key
CARTESIA_API_KEY=your_cartesia_key
AZURE_SPEECH_KEY=your_azure_speech_key
AZURE_SPEECH_REGION=koreacentral
OAUTH2_REDIRECT_BASE_URL=https://your-domain.example.com
```

설명:

- 로컬 기본 DB 설정은 PostgreSQL 기준이다.
- `ddl-auto`는 이 프로젝트에서는 `update`를 유지하는 것이 기본이다.
- `JWT_SECRET`는 최소 32바이트 이상 길게 잡는 것이 안전하다.

### 2. 프론트용 `.env.local` 파일 만들기

프론트에서 API 주소나 Toss 결제 키를 바꾸려면 `banchan-killer-front/.env.local`에 Vite 환경변수를 둡니다.

#### 프론트 `.env.local`에 넣을 값

- `VITE_API_BASE_URL`: 프론트가 호출할 API 기본 주소, 기본값은 `/api`
- `VITE_TOSS_CLIENT_KEY`: Toss 결제창 호출용 클라이언트 키

#### 프론트 `.env.local` 예시

```env
# banchan-killer-front/.env.local
VITE_API_BASE_URL=http://localhost:8080/api
VITE_TOSS_CLIENT_KEY=your_toss_client_key
```

## 토스페이먼츠 결제 연동 가이드

### 개요

PG사로 **토스페이먼츠(Toss Payments)**를 사용하며, SDK 개별 연동 방식으로 구현되어 있습니다.

- 프론트: `@tosspayments/tosspayments-sdk`로 결제창 호출
- 백엔드: 토스 승인 API(`POST https://api.tosspayments.com/v1/payments/confirm`) 호출 후 결제 확정

### 결제 흐름

```
사용자 → 주문서 작성(OrderPage) → 주문 생성 API → PaymentPage
→ 토스 결제창 → 결제 완료 → PaymentSuccessPage → 백엔드 승인 API → 결제 확정
```

1. 사용자가 주문서를 작성하면 `PENDING_PAYMENT` 상태의 주문이 생성됩니다.
2. 프론트에서 토스 SDK로 결제창을 띄웁니다.
3. 결제 완료 후 토스가 `paymentKey`, `orderId`, `amount`를 쿼리 파라미터로 리다이렉트합니다.
4. 프론트가 이 값들을 백엔드 승인 API(`POST /api/payments/confirm`)로 전달합니다.
5. 백엔드에서 금액 위변조 검증 + 중복 결제 방지 + 토스 승인 API 호출 후 주문 상태를 `PAID`로 전환합니다.

### 키 관리

토스 대시보드에서 발급받은 키를 `.env` 파일에 설정합니다.

| 키 | 위치 | 용도 |
|---|---|---|
| `TOSS_SECRET_KEY` | `banchan-killer-api/.env` | 백엔드 승인 API 호출 시 Basic 인증 |
| `VITE_TOSS_CLIENT_KEY` | `banchan-killer-front/.env.local` | 프론트 결제창 SDK 초기화 |

- **테스트 키**: `test_sk_...` / `test_ck_...` — 테스트 결제용 (실제 과금 없음)
- **라이브 키**: `live_sk_...` / `live_ck_...` — 실결제용 (심사 통과 후 사용)
- 키는 절대 git에 커밋하지 않습니다. `.env` 파일은 `.gitignore`에 포함되어 있습니다.

### 로컬 테스트 방법

1. [토스 개발자센터](https://developers.tosspayments.com/)에서 테스트 키를 발급받습니다.
2. `banchan-killer-api/.env`에 `TOSS_SECRET_KEY=test_sk_...` 설정
3. `banchan-killer-front/.env.local`에 `VITE_TOSS_CLIENT_KEY=test_ck_...` 설정
4. 백엔드/프론트 서버 실행 후 상품 → 장바구니 → 주문서 → 결제 흐름을 테스트합니다.
5. 테스트 결제 시 토스에서 제공하는 테스트 카드 정보를 사용합니다.

### 주요 파일

**백엔드**
- `PaymentController.java` — 결제 승인, 결제 목록, 결제 상세 API
- `PaymentService.java` — 토스 승인 API 호출, 금액 검증, 중복 방지 로직
- `Payment.java` — 결제 엔티티 (paymentKey, method, status, receiptUrl 등)

**프론트**
- `PaymentPage.tsx` — 토스 SDK 초기화 + 결제 요청
- `PaymentSuccessPage.tsx` — 결제 성공 후 백엔드 승인 API 호출
- `PaymentFailPage.tsx` — 결제 실패 안내
- `PaymentsPage.tsx` — 결제 내역 목록
- `PaymentDetailPage.tsx` — 결제 상세 (영수증 링크 포함)

### 보안 체크리스트

- [x] 시크릿 키는 백엔드에서만 사용 (프론트에 노출 금지)
- [x] 결제 금액 위변조 검증 (주문 금액과 결제 금액 비교)
- [x] 중복 결제 방지 (이미 결제된 주문 재결제 차단)
- [x] `.env` 파일 `.gitignore` 등록
- [ ] 웹훅 엔드포인트 구현 (실결제 전환 시 필요)

## 현재 구현 현황 및 다음 단계

### 구현 완료

| 기능 | 설명 |
|---|---|
| **상품 관리** | 카테고리별 상품 목록, 상품 상세, 상품 이미지(S3), 초기 데이터 자동 시딩 |
| **회원 인증** | 이메일 기반 회원가입/로그인, JWT 토큰 인증 |
| **장바구니** | 장바구니 담기/수량 변경/삭제, 결제 완료 시 자동 비우기 |
| **주문서 작성** | 배송지 입력, 배송비 계산(4만원 이상 무료배송), 주문 생성 |
| **토스 결제** | 토스페이먼츠 SDK 연동, 결제 승인, 금액 검증, 중복 방지 |
| **결제 내역** | 결제 목록/상세 조회, 영수증 링크 |
| **주문 내역** | 주문 목록/상세 조회 |
| **마이페이지** | 배송지 관리 (CRUD) |

### 다음 단계

**1단계: 실결제 전환 (토스 심사 통과 후)**
- 테스트 키 → 라이브 키 교체
- 실제 카드로 소액(100원) 결제 테스트
- 토스 대시보드에서 거래 내역 확인

**2단계: 주문 취소 및 환불**
- 주문 취소 API 구현 (PAID 상태 → 토스 환불 API 호출)
- 주문 취소 UI 구현
- 환불 상태 관리

**3단계: 웹훅 연동**
- `POST /api/payments/webhook` 엔드포인트 구현
- 토스 대시보드에 웹훅 URL 등록
- 결제 상태 비동기 동기화

**4단계: 운영 기능**
- 관리자 대시보드 (주문/결제 관리)
- 배송 상태 관리 (준비중 → 배송중 → 배송완료)
- 주문 상태별 필터링/검색

## 참고

- 현재 백엔드 기본 DB 설정은 PostgreSQL 기준입니다.
- 로컬 기본 설정은 `jdbc:postgresql://localhost:5432/mydatabase` 형태를 사용합니다.
- 프론트는 별도 설정이 없으면 `/api` 프록시 기준으로 백엔드를 호출합니다.
- 상품 기본 데이터는 서버 시작 시 상품이 `0개`일 때만 자동 입력됩니다.
- 한 번 상품이 들어간 뒤에는 재시작해도 기존 상품 데이터를 덮어쓰지 않습니다.
