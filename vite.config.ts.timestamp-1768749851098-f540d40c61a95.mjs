// vite.config.ts
import path from "path";
import checker from "file:///E:/Lan_Production/TFourthGitHub/A_React/vendor-retal-international/node_modules/vite-plugin-checker/dist/esm/main.js";
import { loadEnv, defineConfig } from "file:///E:/Lan_Production/TFourthGitHub/A_React/vendor-retal-international/node_modules/vite/dist/node/index.js";
import react from "file:///E:/Lan_Production/TFourthGitHub/A_React/vendor-retal-international/node_modules/@vitejs/plugin-react-swc/index.mjs";
var PORT = 8081;
var env = loadEnv("all", process.cwd());
var vite_config_default = defineConfig({
  // base: env.VITE_BASE_PATH,
  plugins: [
    react(),
    checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"'
      },
      overlay: {
        position: "tl",
        initialIsOpen: false
      }
    })
  ],
  resolve: {
    alias: [
      {
        find: /^~(.+)/,
        replacement: path.join(process.cwd(), "node_modules/$1")
      },
      {
        find: /^src(.+)/,
        replacement: path.join(process.cwd(), "src/$1")
      }
    ]
  },
  server: { port: PORT, host: true },
  preview: { port: PORT, host: true }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxMYW5fUHJvZHVjdGlvblxcXFxURm91cnRoR2l0SHViXFxcXEFfUmVhY3RcXFxcdmVuZG9yLXJldGFsLWludGVybmF0aW9uYWxcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXExhbl9Qcm9kdWN0aW9uXFxcXFRGb3VydGhHaXRIdWJcXFxcQV9SZWFjdFxcXFx2ZW5kb3ItcmV0YWwtaW50ZXJuYXRpb25hbFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovTGFuX1Byb2R1Y3Rpb24vVEZvdXJ0aEdpdEh1Yi9BX1JlYWN0L3ZlbmRvci1yZXRhbC1pbnRlcm5hdGlvbmFsL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XHJcbmltcG9ydCBjaGVja2VyIGZyb20gJ3ZpdGUtcGx1Z2luLWNoZWNrZXInO1xyXG5pbXBvcnQgeyBsb2FkRW52LCBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0LXN3Yyc7XHJcblxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5jb25zdCBQT1JUID0gODA4MTtcclxuXHJcbmNvbnN0IGVudiA9IGxvYWRFbnYoJ2FsbCcsIHByb2Nlc3MuY3dkKCkpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICAvLyBiYXNlOiBlbnYuVklURV9CQVNFX1BBVEgsXHJcbiAgcGx1Z2luczogW1xyXG4gICAgcmVhY3QoKSxcclxuICAgIGNoZWNrZXIoe1xyXG4gICAgICB0eXBlc2NyaXB0OiB0cnVlLFxyXG4gICAgICBlc2xpbnQ6IHtcclxuICAgICAgICBsaW50Q29tbWFuZDogJ2VzbGludCBcIi4vc3JjLyoqLyoue2pzLGpzeCx0cyx0c3h9XCInLFxyXG4gICAgICB9LFxyXG4gICAgICBvdmVybGF5OiB7XHJcbiAgICAgICAgcG9zaXRpb246ICd0bCcsXHJcbiAgICAgICAgaW5pdGlhbElzT3BlbjogZmFsc2UsXHJcbiAgICAgIH0sXHJcbiAgICB9KSxcclxuICBdLFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiBbXHJcbiAgICAgIHtcclxuICAgICAgICBmaW5kOiAvXn4oLispLyxcclxuICAgICAgICByZXBsYWNlbWVudDogcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdub2RlX21vZHVsZXMvJDEnKSxcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGZpbmQ6IC9ec3JjKC4rKS8sXHJcbiAgICAgICAgcmVwbGFjZW1lbnQ6IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAnc3JjLyQxJyksXHJcbiAgICAgIH0sXHJcbiAgICBdLFxyXG4gIH0sXHJcbiAgc2VydmVyOiB7IHBvcnQ6IFBPUlQsIGhvc3Q6IHRydWUgfSxcclxuICBwcmV2aWV3OiB7IHBvcnQ6IFBPUlQsIGhvc3Q6IHRydWUgfSxcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBa1ksT0FBTyxVQUFVO0FBQ25aLE9BQU8sYUFBYTtBQUNwQixTQUFTLFNBQVMsb0JBQW9CO0FBQ3RDLE9BQU8sV0FBVztBQUlsQixJQUFNLE9BQU87QUFFYixJQUFNLE1BQU0sUUFBUSxPQUFPLFFBQVEsSUFBSSxDQUFDO0FBRXhDLElBQU8sc0JBQVEsYUFBYTtBQUFBO0FBQUEsRUFFMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sUUFBUTtBQUFBLE1BQ04sWUFBWTtBQUFBLE1BQ1osUUFBUTtBQUFBLFFBQ04sYUFBYTtBQUFBLE1BQ2Y7QUFBQSxNQUNBLFNBQVM7QUFBQSxRQUNQLFVBQVU7QUFBQSxRQUNWLGVBQWU7QUFBQSxNQUNqQjtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixhQUFhLEtBQUssS0FBSyxRQUFRLElBQUksR0FBRyxpQkFBaUI7QUFBQSxNQUN6RDtBQUFBLE1BQ0E7QUFBQSxRQUNFLE1BQU07QUFBQSxRQUNOLGFBQWEsS0FBSyxLQUFLLFFBQVEsSUFBSSxHQUFHLFFBQVE7QUFBQSxNQUNoRDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRLEVBQUUsTUFBTSxNQUFNLE1BQU0sS0FBSztBQUFBLEVBQ2pDLFNBQVMsRUFBRSxNQUFNLE1BQU0sTUFBTSxLQUFLO0FBQ3BDLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
