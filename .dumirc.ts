import { defineConfig } from 'dumi';

export default defineConfig({
  themeConfig: {
    name: 'webgl-playground',
    github: 'https://github.com/cc7gs/webGL-playground',
    syntaxTheme: {
      shiki: {
        dark: 'one-dark-pro',
      },
    },
    footer:false,
  },
  // 临时解决菜单栏不显示的问题
  styles: [
    `.acss-1gle59q{
      overflow: auto;
    }`
  ]
});
