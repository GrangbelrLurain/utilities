module.exports = {
  // TypeScript/JavaScript 파일에 대해 ESLint와 Prettier 실행
  '*.{js,jsx,ts,tsx}': ['prettier --write'],

  // CSS 파일에 대해 Prettier 실행
  '*.{css,scss}': ['prettier --write'],
};
