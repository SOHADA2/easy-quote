# 간편 견적서 (easy-quote)

휴대폰 웹앱. 사업자가 견적서·거래명세서를 써서 **사진(PNG)으로 카카오톡에 공유**한다. 나이 있는 사업자가 쓰므로 큰 글씨·큰 버튼·적은 단계가 최우선.

- 라이브: https://sohada2.github.io/easy-quote/ (main 푸시 → GitHub Pages 자동 반영)
- 서버 없음. 사업장 정보·기록은 휴대폰 localStorage(`eq_settings`, `eq_docs`, `eq_cur`)에만 저장.
- 파일: `index.html`(전부 인라인) · `sw.js`(네트워크 우선 + 오프라인 캐시, 파일 추가 시 FILES/CACHE 갱신) · `manifest.webmanifest` · 아이콘(`tools/icon.html`을 Edge 헤드리스로 찍어 생성)
- 문서 그림: `drawDoc()`이 캔버스에 직접 그림(1080 논리폭 × 1.5배). 1회차는 높이 측정, 2회차 실제 그리기.
- 공유: `navigator.share({files})` → 안 되면 사진 내려받기 + 안내. iOS 사용자 제스처 유지를 위해 파일은 미리보기 때 미리 만들어 둠.
- 점검: `index.html?demo`(견적서 예시), `?demo=2`(거래명세서·부가세 없음·긴 이름·도장). 휴대폰 폭 화면은 `tools/phone-*.html`(390px iframe)을 Edge 헤드리스로 찍기(헤드리스는 창 최소폭 ~500px이라 직접 찍으면 잘림).
- 문구는 「~합니다」 존댓말, 장식 이모지·그라데이션 금지.
