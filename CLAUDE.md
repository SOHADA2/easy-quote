# 간편 견적서 (easy-quote)

휴대폰 웹앱. 사업자가 견적서·거래명세서를 써서 **사진(PNG)으로 카카오톡에 공유**한다. 나이 있는 사업자가 쓰므로 큰 글씨·큰 버튼·적은 단계가 최우선.

- 라이브: https://sohada2.github.io/easy-quote/ (main 푸시 → GitHub Pages 자동 반영)
- 서버 없음. 사업장 정보·기록은 휴대폰 localStorage(`eq_settings`, `eq_docs`, `eq_cur`)에만 저장.
- 파일: `index.html`(전부 인라인) · `sw.js`(네트워크 우선 + 오프라인 캐시, 파일 추가 시 FILES/CACHE 갱신) · `manifest.webmanifest` · 아이콘(`tools/icon.html`을 Edge 헤드리스로 찍어 생성)
- 문서 그림: `drawDoc()`이 캔버스에 직접 그림(1080 논리폭 × 1.5배). 1회차는 높이 측정, 2회차 실제 그리기.
- 공유: `navigator.share({files})` → 안 되면 사진 내려받기 + 안내. iOS 사용자 제스처 유지를 위해 파일은 미리보기 때 미리 만들어 둠.
- 점검: `index.html?demo`(견적서 예시), `?demo=2`(거래명세서·부가세 없음·긴 이름·도장). 휴대폰 폭 화면은 `tools/phone-*.html`(390px iframe)을 Edge 헤드리스로 찍기(헤드리스는 창 최소폭 ~500px이라 직접 찍으면 잘림).
- 문구는 「~합니다」 존댓말, 장식 이모지·그라데이션 금지.

## 업체 전용판 (shops)
- `shops/<id>.json`(상호·대표·등록번호 등 기본 정보 + 자주 쓰는 품목 `items:[{name,price}]`) → `node tools/build.mjs` → `<id>/` 폴더(index.html·manifest·sw.js) 생성 → 주소 `sohada2.github.io/easy-quote/<id>/`.
- **루트 index.html을 고치면 반드시 `node tools/build.mjs` 다시 돌려서 같이 커밋**(전용판은 복사본).
- 전용판은 `window.EQ_PRESET`으로 기본값을 받고, 저장 키는 `eq_<id>_settings` 등으로 분리(같은 github.io 도메인 공유). 휴대폰에서 「내 정보」를 저장하면 그 휴대폰 값이 우선.
- 아이콘: `powershell -File tools\make-icons.ps1 -Text 대성 -Out daesung`(ps1은 한글 때문에 UTF-8 BOM 유지).
- 생년월일은 공개 리포에 넣지 않음. 도장은 사장님 요청(2026-11-24)으로 대성 판에 기본 도장 `daesung/stamp.png`를 넣음(settings.stamp=`"stamp.png"`, 사진은 cleanStamp로 배경 제거한 것). 휴대폰에서 「도장 빼기」 후 저장하면 `stampOff`로 기억해 기본 도장을 다시 넣지 않음.
- 기본 문구를 바꿀 때: 예전 문구를 shops json `old.<필드>` 배열에 넣으면, 휴대폰에 그 예전 문구가 그대로 저장돼 있을 때 새 기본값으로 자동 교체됨(사장님이 직접 고친 문구는 유지).
- 현재 업체: `daesung` = 대성인테리어설비(대성 인테리어) · 계약서 켬(`"contract": true`) · 전화·계좌·기본 도장·안내 문구(유효기간·대금·추가 공사만. 「진행합니다」 답장 요청·하자보수 문구는 사장님이 별로라 해서 뺌).

## 공사 계약서 (contract)
- shops json에 `"contract": true`인 업체만 세 번째 종류로 나옴(조항이 공사용이라 기본 앱은 끔).
- `cur.ct` = 공사명·장소·손님 연락처·기간·계약금%·중도금%·잔금 시기·하자보수 기간·서명. 금액은 `payPlan()`(10만원 이상이면 천원 단위 반올림, 잔금이 나머지).
- 조항 제4~9조는 `drawDoc()` 안 `arts` 배열. 제8조는 민법 계약금(해약금) 규정을 따름.
- 제7조 하자보수는 업체에 유리하게 범위를 좁힘(시공 잘못만, 제외 사유 나열, 기간 뒤 유상). 기간 선택 3개월/6개월/1년, 기본 6개월. 계약서에 아예 안 쓰면 민법 기본 책임이 적용되므로 빼지 않음.
- 손님께 「동의합니다」 답장을 요청하는 문구는 넣지 않음(사장님이 별로라 함).
- 손님 서명: 휴대폰 화면 서명 창(`#signModal`). 서명할 때 `signKey()` 저장 → 미리 보기 전에 내용이 바뀌었으면 서명 자동 삭제.
- 견적서·명세서에서 종류를 계약서로 바꾸면 새 문서(id·날짜 새로)로 복사되어 원래 기록은 남음.
