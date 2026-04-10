# 컨트롤러의 `@Valid` 어노테이션 파헤치기

`@Valid`는 사용자가 API로 보내는 데이터(JSON 등)가 우리가 원하는 **규칙(형식)에 맞는지 검사하는 문지기** 역할을 합니다. 

현재 작성된 로그인 프로세스의 구조를 보며 이해해봅시다.

## 1. 컨트롤러에서의 동작 (`AuthController.java`)
```java
@PostMapping("/login")
public ResponseEntity<LoginResponse> login(
    @Valid @RequestBody LoginRequest request  // ← 여기에 위치합니다!
) {
    LoginResponse response = authService.login(request);
    return ResponseEntity.ok(response);
}
```
HTTP POST 요청이 컨트롤러로 들어오게 되면, 스프링 부트는 즉시 서비스 로직(`authService.login`)을 실행하지 않고, `@Valid`가 붙어있는 객체(`LoginRequest`)의 내부 검사 규칙을 살펴봅니다.

## 2. 규칙은 어디에 명시되어 있을까? (`LoginRequest.java`)
```java
public record LoginRequest(
    @NotBlank(message = "Username is required")
    String username,
    
    @NotBlank(message = "Password is required")
    String password
) {}
```
`LoginRequest` DTO를 열어보면 필드 변수 앞에 `@NotBlank`, `@Size`, `@Email` 등의 제약조건 어노테이션이 붙어있습니다.
`@Valid`는 바로 이 제약조건들을 바탕으로 동작합니다. 

위 예시의 `@NotBlank`는 다음과 같은 악의적인 혹은 잘못된 요청을 모두 걸러냅니다.
* `"username": null` (null 값)
* `"username": ""` (빈 문자열)
* `"username": "   "` (공백만 있는 문자열)

## 3. 검사에 실패하면 어떻게 될까? (`GlobalExceptionHandler.java`)
`@Valid` 문지기가 검사하다가 **"어? 비밀번호가 입력이 안됐네?"** 라고 발견하면, 곧바로 **`MethodArgumentNotValidException`** 이라는 에러 카드를 던집니다.

이 에러카드는 비즈니스 로직(Service)으로 넘어가지 못하고, 중앙 에러 제어탑인 `GlobalExceptionHandler`로 날아갑니다.

```java
// GlobalExceptionHandler.java 내부
@ExceptionHandler(MethodArgumentNotValidException.class)
public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException e) {
    // 에러 메시지 추출 후 400 Bad Request 던짐
    // ...
}
```
결과적으로 프론트엔드(클라이언트)는 내부 500 에러 대신, `400 Bad Request`와 함께 적절한 에러 메시지(`"Password is required"`)를 응답으로 받게 됩니다.

---

## 💡 요약: `@Valid`를 쓰면 뭐가 좋나요?
1. **역할 분리 (DDD 관점)**: 도메인/비즈니스 레이어에서는 "값이 비어있는지"를 검사하는 지루한 if-else 문을 없애고 오직 **중요한 비즈니스 정책(비밀번호가 일치하는가?)에만 집중**할 수 있습니다.
2. **안전성 (방어적 프로그래밍)**: 쓸데없는 쓰레기 데이터가 비즈니스 로직의 깊은 곳이나 DB까지 도달하기 전에 컨트롤러 앞단에서 미리 차단할 수 있습니다.
3. **사용자 경험 (일관된 에러)**: 클라이언트에게 어떤 값이 잘못되었는지 일관되고 명확한 메시지를 전달할 수 있습니다.
