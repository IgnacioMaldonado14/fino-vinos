import {defineConfig,devices} from '@playwright/test';
export default defineConfig({
 testDir:'./tests/e2e',fullyParallel:false,workers:2,timeout:45000,
 use:{baseURL:process.env.TEST_BASE_URL??'http://localhost:3000',trace:'retain-on-failure',launchOptions:{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH}},
 projects:[{name:'desktop',use:{...devices['Desktop Chrome'],viewport:{width:1440,height:1000}}},{name:'mobile',use:{...devices['iPhone 13'],defaultBrowserType:'chromium'}}],
 webServer:process.env.TEST_BASE_URL?undefined:{command:'npm run dev',url:'http://localhost:3000',reuseExistingServer:!process.env.CI,timeout:60000},
});
