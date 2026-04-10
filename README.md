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

- 백엔드 환경변수 파일은 [banchan-killer-api/.env](/Users/terecal/banchan-killer-container/banchan-killer-api/.env) 위치에 둡니다.
- `.env` 파일은 git에 포함되지 않도록 [banchan-killer-api/.gitignore](/Users/terecal/banchan-killer-container/banchan-killer-api/.gitignore)에 추가되어 있습니다.
- Spring Boot는 `spring.config.import=optional:file:.env[.properties]` 설정으로 실행 시 `.env` 값을 읽습니다.

## 백엔드 .env 가이드

아래 값들은 백엔드에서 사용할 수 있는 환경변수입니다.

### 기본 실행용

- `SPRING_DATASOURCE_URL`: MySQL 등 DB 접속 URL
- `SPRING_DATASOURCE_USERNAME`: DB 계정
- `SPRING_DATASOURCE_PASSWORD`: DB 비밀번호
- `SPRING_JPA_HIBERNATE_DDL_AUTO`: 개발 환경에서는 필요에 따라 `update` 등으로 설정
- `JWT_SECRET`: 로그인/인증 토큰 서명 키

### S3 이미지 업로드용

- `AWS_ACCESS_KEY_ID`: AWS 액세스 키
- `AWS_SECRET_ACCESS_KEY`: AWS 시크릿 키
- `AWS_REGION` 또는 `AWS_S3_REGION`: S3 리전
- `S3_BUCKET_NAME`: 상품 이미지 업로드 대상 버킷명

상품 관리 화면에서 이미지 업로드 기능을 쓰려면 S3 관련 값이 필요합니다. 이 값이 없으면 상품 등록/수정 자체는 가능해도 파일 업로드 기능은 정상 동작하지 않을 수 있습니다.

### 외부 연동용

- `OPENAI_API_KEY`
- `GEMINI_API_KEY`
- `CARTESIA_API_KEY`
- `AZURE_SPEECH_KEY`
- `AZURE_SPEECH_REGION`
- `OAUTH2_REDIRECT_BASE_URL`

위 값들은 현재 반찬몰 핵심 상품 관리 기능에 직접 필수는 아닐 수 있지만, 백엔드에서 다른 기능이나 공용 설정으로 참조한다면 함께 관리해야 합니다.

## .env 예시

```env
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/banchan_killer
SPRING_DATASOURCE_USERNAME=your_db_user
SPRING_DATASOURCE_PASSWORD=your_db_password
SPRING_JPA_HIBERNATE_DDL_AUTO=update
JWT_SECRET=replace-with-secure-secret

AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=ap-northeast-2
S3_BUCKET_NAME=your-s3-bucket

OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key
CARTESIA_API_KEY=your_cartesia_key
AZURE_SPEECH_KEY=your_azure_speech_key
AZURE_SPEECH_REGION=koreacentral
OAUTH2_REDIRECT_BASE_URL=https://your-domain.example.com
```

## 참고

- 상품 기본 데이터는 서버 시작 시 상품이 `0개`일 때만 자동 입력됩니다.
- 한 번 상품이 들어간 뒤에는 재시작해도 기존 상품 데이터를 덮어쓰지 않습니다.
