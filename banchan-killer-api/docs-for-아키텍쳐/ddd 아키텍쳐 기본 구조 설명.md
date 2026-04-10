# DDD 아키텍처 기본 구조

## 패키지 구조
```
com.banchan
├── auth/                          ── 인증 도메인
│   ├── presentation/              ← 외부 요청/응답
│   │   ├── AuthController.java
│   │   ├── SignupRequest.java
│   │   └── SignupResponse.java
│   ├── application/               ← 유스케이스 조율
│   │   └── AuthService.java
│   └── domain/                    ← 비즈니스 규칙
│       ├── DuplicateUsernameException.java
│       └── DuplicateEmailException.java
│
├── user/                          ── 사용자 도메인
│   ├── presentation/
│   │   └── UserController.java
│   ├── domain/
│   │   ├── User.java
│   │   └── UserRepository.java        ← 순수 인터페이스 (JPA 의존 없음)
│   └── infrastructure/            ← 기술 구현 (JPA, 외부 API 등)
│       ├── UserJpaRepository.java     ← Spring Data JPA
│       └── UserRepositoryImpl.java    ← 도메인 인터페이스 구현체
│
├── common/                        ── 공통
│   ├── entity/
│   │   └── BaseEntity.java
│   └── exception/
│       ├── GlobalExceptionHandler.java
│       └── ErrorResponse.java
│
└── config/                        ── 설정
    └── SecurityConfig.java
```

## 4개 계층 설명

### presentation (표현 계층)
- **역할**: HTTP 요청 수신, 응답 반환
- **포함**: Controller, Request/Response DTO
- **규칙**: 비즈니스 로직 없음. 요청 검증(@Valid) 후 application에 위임

### application (응용 계층)
- **역할**: 유스케이스 단위로 흐름을 조율
- **포함**: Service (트랜잭션 관리, 도메인 객체 조합)
- **규칙**: 직접 비즈니스 판단 X. domain 객체에 위임하고 결과를 조합

### domain (도메인 계층)
- **역할**: 핵심 비즈니스 규칙과 엔티티 정의
- **포함**: Entity, Value Object, Repository 인터페이스, 도메인 예외
- **규칙**: 다른 계층에 의존하지 않음. JPA, Spring 등 기술 프레임워크를 모름

### infrastructure (인프라 계층)
- **역할**: 기술적 구현 (DB, 외부 API, 메시징 등)
- **포함**: JPA Repository 구현체, 외부 서비스 클라이언트
- **규칙**: domain 인터페이스를 구현. 기술 교체 시 이 계층만 변경

## 의존성 방향
```
presentation → application → domain ← infrastructure
```
- domain이 중심. 아무것도 의존하지 않음
- infrastructure가 domain을 의존 (의존성 역전)
- 화살표 방향 = "누가 누구를 아는가"
