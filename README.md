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