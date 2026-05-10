const fs = require('fs');
const path = require('path');

describe('privacy.js - Cookie 弹窗逻辑测试', () => {
  let cookieBanner;
  let acceptButton;

  beforeEach(() => {
    // 1. 重置 LocalStorage 和 DOM
    window.localStorage.clear();
    
    // 初始状态下，我们假设弹窗是用 CSS 隐藏的 (display: none)
    document.body.innerHTML = `
      <div id="cookie-banner" style="display: none;">
        这是一个 Cookie 提示
        <button id="accept-cookies">接受</button>
      </div>
    `;

    cookieBanner = document.getElementById('cookie-banner');
    acceptButton = document.getElementById('accept-cookies');

    // 2. 加载目标 JS 代码
    const jsCode = fs.readFileSync(path.resolve(__dirname, '../assets/js/privacy.js'), 'utf8');
    eval(jsCode); 
  });

  it('如果用户未接受过 Cookie，页面加载时应显示弹窗', () => {
    // 手动派发 DOMContentLoaded 事件，触发 privacy.js 内部的逻辑
    document.dispatchEvent(new Event('DOMContentLoaded'));

    // 验证弹窗的 display 属性是否被修改为 block
    expect(cookieBanner.style.display).toBe('block');
  });

  it('如果用户之前已经接受过 Cookie，页面加载时不应显示弹窗', () => {
    // 模拟用户之前已经同意过的情况
    window.localStorage.setItem('cookiesAccepted', 'true');

    // 触发页面加载事件
    document.dispatchEvent(new Event('DOMContentLoaded'));

    // 弹窗应该保持隐藏状态
    expect(cookieBanner.style.display).toBe('none');
  });

  it('点击接受按钮后，应在 LocalStorage 中写入记录并隐藏弹窗', () => {
    // 先触发页面加载，使事件监听器绑定成功
    document.dispatchEvent(new Event('DOMContentLoaded'));
    
    // 确认初始状态是弹出的
    expect(cookieBanner.style.display).toBe('block');

    // 模拟用户点击"接受"按钮
    acceptButton.click();

    // 验证 LocalStorage 被正确写入
    expect(window.localStorage.getItem('cookiesAccepted')).toBe('true');
    // 验证弹窗被隐藏
    expect(cookieBanner.style.display).toBe('none');
  });
});