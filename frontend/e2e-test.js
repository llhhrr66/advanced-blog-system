const puppeteer = require('puppeteer');

async function testLogin() {
  console.log('🚀 开始端到端登录测试...\n');
  
  let browser;
  try {
    // 启动浏览器
    browser = await puppeteer.launch({
      headless: false,  // 设置为false以便看到浏览器操作
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // 1. 访问登录页面
    console.log('📍 步骤1: 访问登录页面...');
    await page.goto('http://localhost:3000/login', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    console.log('✅ 登录页面加载成功\n');
    
    // 等待表单加载
    await page.waitForSelector('input[id="login_username"]', { timeout: 5000 });
    
    // 2. 输入用户名
    console.log('📝 步骤2: 输入用户名...');
    await page.type('input[id="login_username"]', 'testadmin');
    console.log('✅ 用户名输入完成: testadmin\n');
    
    // 3. 输入密码
    console.log('🔐 步骤3: 输入密码...');
    await page.type('input[id="login_password"]', 'admin123');
    console.log('✅ 密码输入完成: admin123\n');
    
    // 4. 点击登录按钮
    console.log('🖱️ 步骤4: 点击登录按钮...');
    
    // 设置请求拦截来监控API调用
    page.on('response', response => {
      if (response.url().includes('/api/auth/login')) {
        console.log(`  API响应状态: ${response.status()}`);
      }
    });
    
    // 点击登录按钮
    await page.click('button[type="submit"]');
    
    // 等待响应或页面跳转
    await page.waitForTimeout(3000);
    
    // 5. 检查结果
    console.log('\n📊 步骤5: 检查登录结果...');
    
    // 检查是否跳转到主页
    const currentUrl = page.url();
    if (currentUrl === 'http://localhost:3000/') {
      console.log('✅ 登录成功！已跳转到主页');
    } else {
      console.log(`⚠️ 仍在页面: ${currentUrl}`);
      
      // 检查是否有错误提示
      const errorMessage = await page.$eval('.ant-alert-message', el => el.textContent).catch(() => null);
      if (errorMessage) {
        console.log(`❌ 登录失败，错误信息: ${errorMessage}`);
      }
    }
    
    // 检查localStorage中的token
    const token = await page.evaluate(() => localStorage.getItem('access_token'));
    if (token) {
      console.log(`✅ Token已保存: ${token.substring(0, 20)}...`);
    } else {
      console.log('❌ 未找到Token');
    }
    
    console.log('\n✨ 测试完成！');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// 运行测试
testLogin();
