# 진가네 쇼핑몰 (Vercel 배포용)

## 로컬 실행
1. Node.js LTS 설치
2. 터미널에서 이 폴더로 이동
3. `npm install`
4. `npm run dev`

## 배포
GitHub에 이 폴더의 파일 전체를 올린 뒤 Vercel에서 해당 저장소를 Import 합니다.
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

현재 구성은 프런트엔드 시연용입니다. 실제 주문·결제·회원가입·상품 DB·인증서 검증을 운영하려면 별도의 백엔드와 보안 검토가 필요합니다.

## 정품 검증 기능 범위와 실제 연동
- 사진 속 인쇄 문자·숫자는 Tesseract.js OCR로 추출합니다. 이미지의 외형만으로 AI 정품 판정을 하지 않습니다.
- OCR에서 상품번호·일련번호·공장명 형식을 찾아 입력란을 보조할 수 있지만, 인식 결과는 사용자가 확인해야 합니다.
- 현재 상품·공장 목록은 진가네 시연용 예시 데이터이며 제조사 공식 데이터베이스가 아닙니다.
- 제조사 공식 조회를 연결하려면 서버 측 검증 API가 필요합니다. 서버 API는 `POST` JSON `{ productId, brand, serialNumber, factory }`를 받고 `{ verified: true | false }`를 반환하도록 구성해야 합니다.
- Vercel 환경 변수 `VITE_MANUFACTURER_VERIFY_API_URL`에는 서버 측 검증 API의 URL만 설정합니다. 제조사 API 비밀키를 `VITE_` 환경 변수나 브라우저 코드에 넣으면 안 됩니다. API 키는 서버 함수의 비공개 환경 변수로 보관해야 합니다.
- 공식 API가 연결되지 않은 경우 화면은 정품 확률을 표시하지 않고 `정품 여부 확인 불가`로 표시합니다.

### Vercel 서버 API 설정
프로젝트에는 `/api/verify-manufacturer` 서버리스 함수 뼈대가 포함되어 있습니다. 실제 제조사/공인 검증 사업자의 API 계약을 확인한 뒤 다음 환경 변수를 Vercel의 Project Settings → Environment Variables에 등록해야 합니다.
- `MANUFACTURER_API_URL`: 제조사 또는 검증 사업자의 공식 API URL
- `MANUFACTURER_API_KEY`: 해당 사업자가 발급한 비공개 API 키

이 함수는 공급자 API가 JSON 응답의 `verified`를 boolean으로 반환한다고 가정합니다. 실제 API의 인증 방식, 요청 필드, 응답 형식은 공급자 문서에 맞게 서버 함수를 수정해야 합니다. API 제공처와 계약/권한이 없으면 실제 정품 조회는 동작하지 않습니다.


## 업로드한 이미지 적용
- `public/images/headphones.png`: 제공된 헤드폰 이미지
- `public/images/sulwhasoo-serum.png`: 제공된 설화수 세럼 이미지
두 이미지는 상품 데이터에서 로컬 경로로 불러오므로 외부 이미지 호스팅에 의존하지 않습니다.

## Vercel 배포 체크리스트
1. 압축을 푼 프로젝트 전체를 GitHub 저장소에 업로드합니다.
2. Vercel에서 **Add New → Project**를 선택하고 해당 저장소를 Import합니다.
3. Framework Preset은 **Vite**, Build Command는 `npm run build`, Output Directory는 `dist`로 설정합니다. Install Command는 `npm install`입니다.
4. **Deploy**를 누릅니다.

`/api/verify-manufacturer`는 외부 제조사 검증 API가 설정되기 전에는 실제 정품 검증을 하지 않는 서버 함수 뼈대입니다. 실제 연결 시 Vercel 환경 변수 `MANUFACTURER_API_URL`, `MANUFACTURER_API_KEY`를 설정해야 합니다. 현재 화면의 상품/인증 정보는 시연용 데이터입니다.


## 공장번호·일련번호 이미지 점검
검증 화면은 OCR로 라벨의 공장번호(Factory/Plant No.)와 일련번호(Serial/SN)를 읽어 결과에 표시합니다. 공식 제조사 검증 API가 설정되어 있으면 해당 번호를 서버로 전달해 대조 응답을 확인합니다. 공식 API가 설정되지 않은 경우에는 번호를 추출해도 진품/가품 확정 판정을 하지 않고 추가 확인 필요로 표시합니다.

Vercel 환경 변수 `MANUFACTURER_API_URL`, `MANUFACTURER_API_KEY`에는 제조사 또는 신뢰할 수 있는 인증 제공자의 실제 검증 API 정보를 설정해야 합니다. API는 `{ "verified": true }` 또는 `{ "verified": false }` 형태로 공식 대조 결과를 반환해야 합니다. 임의의 예시 데이터만으로 진위 판정을 하지 마세요.
