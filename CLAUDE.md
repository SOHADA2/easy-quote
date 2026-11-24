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
- **도장 이미지·생년월일은 공개 리포에 넣지 않음**(위조 위험). 도장은 각 휴대폰에서 「도장 사진 넣기」로 넣는다.
- 현재 업체: `daesung` = 대성인테리어설비(대성 인테리어).
