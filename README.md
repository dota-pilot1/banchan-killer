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

## 참고

- 현재 백엔드 기본 DB 설정은 PostgreSQL 기준입니다.
- 로컬 기본 설정은 `jdbc:postgresql://localhost:5432/mydatabase` 형태를 사용합니다.
- 프론트는 별도 설정이 없으면 `/api` 프록시 기준으로 백엔드를 호출합니다.
- 상품 기본 데이터는 서버 시작 시 상품이 `0개`일 때만 자동 입력됩니다.
- 한 번 상품이 들어간 뒤에는 재시작해도 기존 상품 데이터를 덮어쓰지 않습니다.
