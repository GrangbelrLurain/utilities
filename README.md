# 프로젝트 목표

개발자에게 필요한 각종 유틸리티를 제공합니다.

# JSON

## json compare

두 json의 key를 비교하여 서로 다른 경우 리스트 업 합니다.

## json key naming convention

선택한 json naming convention과 동일한 case를 확인하여 리스트업합니다.

- thisIsAString - "camel"
- This Is A String - "capital"
- THIS_IS_A_STRING - "constant"
- this.is.a.string - "dot"
- this is a string - "lower"
- ThisIsAString - "pascal"
- This is a string - "sentence"
- this-is-a-string - "slug"
- this_is_a_string - "snake"
- this is a string - "space"
- This Is a String - "title"
- THIS IS A STRING - "upper"

## json key to csv

json key를 csv로 변환합니다.

# URL

## url to json

url을 json으로 변환합니다.

# Translation

## encode

문자열을 인코딩합니다.

## decode

인코딩된 문자열을 디코딩합니다.

## 작업자

- kim
- shin

## Commit & Branch Pattern

### type

- feat(기능 개발)
- hotfix(버그 수정)
- docs(문서 관련 수정)
- style(코드 포맷팅 관련)
- refactor(리팩토링)
- chore(package.json, env 등)
- build(빌드 관련 설정 수정)
- deploy(Ci/Cd, Helm, Docker)
- revert(원복)
- test(테스트)

### Branch Name

- type/name/#issueNo
- ex: feat/john/#123

### Commit Message

- [type/name] subject
  <br/>
  <br/>
  markdown
- ex: [feat/john] 로그인 기능 구현
  <br/>
  <br/>
  로그인 기능 구현 상세

## Directory Style

- 기본 FSD 방식을 따름(https://feature-sliced.design/docs/get-started/overview#next-steps)
- 기본 Directory명: "slug"
- Component명: "pascal"
  - ex: ThisIsAString
  - index.tsx로 묶어서 export 하는 경우: Directory명 "pascal"
