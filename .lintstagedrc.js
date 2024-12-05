module.exports = {
  // 스테이징된 모든 파일에 대해 Prettier 실행
  '*': ['prettier --write'],
  // TypeScript/JavaScript 파일에 대해 ESLint 실행
  '*.{js,jsx,ts,tsx}': ['eslint --fix'],
  // CSS 파일에 대해 Prettier 실행
  '*.{css,scss}': ['prettier --write'],
};
