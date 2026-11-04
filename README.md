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
