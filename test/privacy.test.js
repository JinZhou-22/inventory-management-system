const fs = require('fs');
const path = require('path');

describe('privacy.js - Cookie 弹窗逻辑测试', () => {
  let cookieBanner;
  let acceptButton;
  let declineButton; // 新增：声明拒绝按钮变量

  beforeEach(() => {
    // 1. 重置 LocalStorage 和 DOM
    window.localStorage.clear();
    
    // 初始状态下，我们假设弹窗是用 CSS 隐藏的 (display: none)
    document.body.innerHTML = `
      <div id="cookie-banner" style="display: none;">
        这是一个 Cookie 提示
        <button id="accept-cookies">接受</button>
        <!-- 新增：在 DOM 中添加拒绝按钮 -->
        <button id="decline-cookies">拒绝</button> 
      </div>
    `;

    cookieBanner = document.getElementById('cookie-banner');
    acceptButton = document.getElementById('accept-cookies');
    declineButton = document.getElementById('decline-cookies'); // 新增：获取拒绝按钮 DOM

    // 2. 加载目标 JS 代码
    const jsCode = fs.readFileSync(path.resolve(__dirname, '../assets/js/privacy.js'), 'utf8');
    eval(jsCode); 
  });

  // 修改：完善描述，现在是既没有接受也没有拒绝
  it('如果用户未接受且未拒绝过 Cookie，页面加载时应显示弹窗', () => {
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

  // 新增：测试之前拒绝过的情况
  it('如果用户之前已经拒绝过 Cookie，页面加载时不应显示弹窗', () => {
    // 模拟用户之前拒绝过的情况
    window.localStorage.setItem('cookiesDeclined', 'true');

    document.dispatchEvent(new Event('DOMContentLoaded'));

    // 弹窗同样应该保持隐藏状态
    expect(cookieBanner.style.display).toBe('none');
  });

  it('点击接受按钮后，应在 LocalStorage 中写入记录并隐藏弹窗', () => {
    // 先触发页面加载，使事件监听器绑定成功
    document.dispatchEvent(new Event('DOMContentLoaded'));
    
    // 确认初始状态是弹出的
    expect(cookieBanner.style.display).toBe('block');

    // 模拟用户点击"接受"按钮
    acceptButton.click();

    // 验证 LocalStorage 被正确写入，并且没有误写 declined
    expect(window.localStorage.getItem('cookiesAccepted')).toBe('true');
    expect(window.localStorage.getItem('cookiesDeclined')).toBeNull(); 
    // 验证弹窗被隐藏
    expect(cookieBanner.style.display).toBe('none');
  });

  // 新增：测试点击拒绝按钮的逻辑
  it('点击拒绝按钮后，应在 LocalStorage 中写入 declined 记录并隐藏弹窗', () => {
    document.dispatchEvent(new Event('DOMContentLoaded'));
    
    expect(cookieBanner.style.display).toBe('block');

    // 模拟用户点击"拒绝"按钮
    declineButton.click();

    // 验证 LocalStorage 被正确写入，并且没有误写 accepted
    expect(window.localStorage.getItem('cookiesDeclined')).toBe('true');
    expect(window.localStorage.getItem('cookiesAccepted')).toBeNull();
    // 验证弹窗被隐藏
    expect(cookieBanner.style.display).toBe('none');
  });
});