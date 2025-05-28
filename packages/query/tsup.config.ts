import { defineConfig } from "tsup";
import { resolve } from "path";

export default defineConfig({
  entry: {
    index: resolve(__dirname, "index.ts"), // 진입점
  },
  format: ["esm"], // ESModule 형식으로 번들
  dts: true, // TypeScript 타입 정의 파일 생성
  clean: true, // build 전에 outDir 비우기
  outDir: "build", // 출력 디렉토리
  external: ["react", "react-dom", "react/jsx-runtime"], // 번들에서 제외할 외부 모듈

  esbuildOptions(options) {
    options.jsx = "automatic"; // React 17+ JSX 방식 사용
    options.platform = "neutral"; // node/browser 둘 다 호환
    options.target = ["es2020"]; // 지원 타겟 (모던 브라우저 기준)
  },
  treeshake: true, // 사용되지 않는 코드 제거
  splitting: true, // 코드 스플리팅 활성화
  onSuccess: "echo 'Build completed successfully!'", // 빌드 성공 시 메시지 출력
});
