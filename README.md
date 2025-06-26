# AI 코딩 테스트

## 프롬프트
```text
상단에 네비게이션 영역을 만들고 '도구 설정' 메뉴를 추가해줘.
도구 관리 메뉴를 클릭하면 이동되는 페이지를 추가해줘.
추가되는 페이지는 LLM에게 전달하는 tool의 스키마를 설정하기 위한 목적이야.
UI의 구성에 따라 modal로 할지 페이지로 할지는 알아서 선택해줘.

페이지의 하단 우측에는 적용 버튼을 추가해줘.

form에서 제공해야 할 설정 항목은 다음과 같아.
- 이름: 도구의 이름이야
- 설명: 도구의 설명이야
- 인증 방식: selectbox로 구성하고, 옵션은 basic auth, bearer token, OAuth, JWT, API Key 으로 해줘.
- API URL: http method, http url 두개의 input:text로 구성되어야 해
- URL 변수: URL에 {변수명}을 치환할 매퍼야. '필수', '시스템 변수 사용' 체크박스와 '변수 이름', '변수 설명' input:text가 있어야 해
- 요청 파라메터: tool의 request parameter 스키마를 설정하기 위한 목적이야.
- 응답 파라메터: tool의 response parameter 스키마를 설정하기 위한 목적이야.

요청 파라메터와 응답 파라메터는 기본적으로 변수명(text), 자료형(select box), 필수 여부(check box), 시스템 변수 사용(check box), 변수 설명(text) 으로 구성되고, 
array, enum, object 자료형을 위한 nested 구조로 설정할 수 있게 만들어야 해.
```

## 비교
### claude code
1회 요청으로 기대한 결과 생성

### cursor-claude-3.5-sonet
- 요청하지 않은 tailwindcss 설치
- 패키지 설치를 실패하였으나 인지하지 못하고 phase 진행
- 런타임, 서버 사이드 오류가 다량 발생하였고, 6회에 걸친 디버깅 요청으로 동작되도록 구성 완료
  - 해당 과정에서 turbo-pack 등 다양한 환경 손상
- 최종 산출물도 기대와는 다른 결과가 생성됨
  - URL 변수 항목에서 자료형 선택이 존재하지 않아야 함
  - 요청 파라메터, 응답 파라메터에서 nested 구조로 설정할 수 있는 기능 및 UI가 제공되지 않음

### gemini-cli (gemini-2.5-pro)
- 런타임 경고 발생 (Navbar.tsx:7 `legacyBehavior` is deprecated and will be removed in a future release.)
- 요청 파라메터, 응답 파라메터에서 nested 구조는 구현되었으나 하위 항목 추가시 정상적으로 추가되지 않고 초기화됨