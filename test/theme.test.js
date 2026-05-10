const fs = require('fs');
const path = require('path');

describe('theme.js - 主题 UI 交互逻辑测试', () => {
  let hideMock;

  beforeEach(() => {
    // 1. 清理和重置环境
    jest.clearAllMocks();
    document.body.className = '';
    
    // 2. 模拟 bootstrap 全局对象
    hideMock = jest.fn();
    global.bootstrap = {
      Collapse: jest.fn().mockImplementation(() => ({
        hide: hideMock
      }))
    };

    // 3. 构建测试所需的 DOM 结构
    document.body.innerHTML = `
      <div class="sidebar">
        <div class="collapse"></div>
        <div class="collapse"></div>
      </div>
      <button id="sidebarToggle"></button>
      <button id="sidebarToggleTop"></button>
      <div class="scroll-to-top" style="display: none;"></div>
    `;
    
    // 模拟 body.fixed-nav 以测试滚动逻辑
    document.body.classList.add('fixed-nav');

    // 修复原代码原生 DOM 没有 .on() 方法的问题，防止脚本抛错中断
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.on = jest.fn();
    }

    // 4. 读取并执行目标 JS 代码
    const jsCode = fs.readFileSync(path.resolve(__dirname, '../assets/js/theme.js'), 'utf8');
    eval(jsCode);
  });

  describe('侧边栏切换逻辑 (Sidebar Toggle)', () => {
    it('点击切换按钮时，body 和 sidebar 应切换相应类名，并收起所有折叠菜单', () => {
      const toggleBtn = document.getElementById('sidebarToggle');
      const sidebar = document.querySelector('.sidebar');
      
      // 触发点击事件
      toggleBtn.dispatchEvent(new Event('click'));

      // 验证类名切换
      expect(document.body.classList.contains('sidebar-toggled')).toBe(true);
      expect(sidebar.classList.contains('toggled')).toBe(true);

      // 验证 bootstrap.Collapse 实例的 hide 方法是否被调用 (DOM 中有2个 .collapse 元素)
      expect(hideMock).toHaveBeenCalledTimes(2);
    });
  });

  describe('窗口尺寸响应逻辑 (Window Resize)', () => {
    it('当窗口宽度小于 768px 时，应触发折叠菜单的 hide 方法', () => {
      // 模拟窗口变小
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 500 });
      Object.defineProperty(document.documentElement, 'clientWidth', { writable: true, configurable: true, value: 500 });

      // 触发 resize 事件
      window.dispatchEvent(new Event('resize'));

      // 验证 hide 方法被调用
      expect(hideMock).toHaveBeenCalledTimes(2);
    });

    it('当窗口宽度大于等于 768px 时，不应触发折叠菜单的 hide 方法', () => {
      // 模拟窗口变大
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
      Object.defineProperty(document.documentElement, 'clientWidth', { writable: true, configurable: true, value: 1024 });

      // 触发 resize 事件
      window.dispatchEvent(new Event('resize'));

      // 验证 hide 方法未被调用
      expect(hideMock).not.toHaveBeenCalled();
    });
  });

  describe('返回顶部按钮逻辑 (Scroll to Top)', () => {
    it('当页面向下滚动超过 100px 时，应显示返回顶部按钮', () => {
      const scrollToTopBtn = document.querySelector('.scroll-to-top');
      
      // 模拟滚动距离
      Object.defineProperty(window, 'pageYOffset', { writable: true, configurable: true, value: 150 });
      
      // 触发 scroll 事件
      window.dispatchEvent(new Event('scroll'));

      // 验证显示状态
      expect(scrollToTopBtn.style.display).toBe('block');
    });

    it('当页面滚动距离小于等于 100px 时，应隐藏返回顶部按钮', () => {
      const scrollToTopBtn = document.querySelector('.scroll-to-top');
      
      // 先让其显示
      scrollToTopBtn.style.display = 'block';

      // 模拟滚动距离回到顶部附近
      Object.defineProperty(window, 'pageYOffset', { writable: true, configurable: true, value: 50 });
      
      // 触发 scroll 事件
      window.dispatchEvent(new Event('scroll'));

      // 验证隐藏状态
      expect(scrollToTopBtn.style.display).toBe('none');
    });
  });
});