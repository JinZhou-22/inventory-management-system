const fs = require('fs');
const path = require('path');
const $ = require('jquery');

// 将 jQuery 挂载到全局，因为原代码依赖全局的 $
global.$ = global.jQuery = $;

// 模拟 DataTables (只模拟该业务代码中用到的属性和方法)
$.fn.dataTable = {
  isDataTable: jest.fn().mockReturnValue(true) // 假设表格已经初始化
};

$.fn.DataTable = function() {
  return {
    buttons: () => ({
      nodes: () => ({
        toArray: () => [
          { querySelector: () => ({}), find: () => ({ text: jest.fn() }) },
          { querySelector: () => ({}), find: () => ({ text: jest.fn() }) },
          { querySelector: () => ({}), find: () => ({ text: jest.fn() }) },
          { querySelector: () => ({}), find: () => ({ text: jest.fn() }) }
        ]
      })
    })
  };
};

// 模拟 LocalStorage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: function(key) {
      return store[key] || null;
    },
    setItem: function(key, value) {
      store[key] = value.toString();
    },
    clear: function() {
      store = {};
    }
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('i18n.js 业务逻辑测试', () => {

  beforeEach(() => {
    // 1. 清理环境
    window.localStorage.clear();
    jest.clearAllMocks();
    
    // 2. 准备基础 DOM 结构，覆盖原代码中查找的节点
    document.body.innerHTML = `
      <div id="languageToggleBtn"></div>
      <h1 data-i18n="manageInventory"></h1>
      <div id="addModal"><input placeholder="" /></div>
      <div class="dataTables_filter"><input placeholder="" /></div>
      <table id="myTable">
        <thead>
          <tr><th></th><th></th><th></th><th></th><th></th></tr>
        </thead>
      </table>
      <div class="dataTables_empty"></div>
    `;

    // 3. 动态加载执行 i18n.js (请根据实际路径调整)
    const jsCode = fs.readFileSync(path.resolve(__dirname, '../assets/js/i18n.js'), 'utf8');
    // 使用 eval 执行，使其在当前的 DOM 模拟环境中运行
    eval(jsCode); 

    // 👇 新增行：手动触发 DOM 的翻译更新，填补 $(document).ready 在 jsdom 中的时差
    window.refreshContent(document);
  });

  describe('基础翻译功能 window.t()', () => {
    it('默认语言应为英语，并能正确翻译存在的键', () => {
      expect(window.t('itemName')).toBe('Item Name');
    });

    it('当找不到翻译键时，应返回键名本身', () => {
      expect(window.t('unknownKey_123')).toBe('unknownKey_123');
    });
  });

  describe('语言切换逻辑', () => {
    it('切换为中文后，window.t 应返回中文翻译，且 DOM lang 属性改变', () => {
      window.changeLanguage('zh');
      
      expect(window.t('itemName')).toBe('商品名称');
      expect(window.localStorage.getItem('i18nextLng')).toBe('zh');
      expect(document.documentElement.lang).toBe('zh-CN');
    });

    it('如果传入了不支持的语言，应回退到英语', () => {
      window.changeLanguage('fr'); // 法语不存在于字典中
      
      expect(window.t('itemName')).toBe('Item Name');
      expect(window.localStorage.getItem('i18nextLng')).toBe('en');
    });

    it('toggleLanguage 应在英文和中文之间正确切换', () => {
      window.changeLanguage('en'); // 确保初始为英文
      expect(document.documentElement.lang).toBe('en');

      window.toggleLanguage(); // 切换至中文
      expect(window.localStorage.getItem('i18nextLng')).toBe('zh');
      
      window.toggleLanguage(); // 切换回英文
      expect(window.localStorage.getItem('i18nextLng')).toBe('en');
    });
  });

  describe('DOM 更新逻辑 (refreshContent)', () => {
    it('页面初始化/切换语言时，带有 data-i18n 属性的标签内容会被更新', () => {
      // 初始化已执行，校验英文默认态
      let header = document.querySelector('[data-i18n="manageInventory"]');
      expect(header.textContent).toBe('Manage Inventory');

      // 切换为中文
      window.changeLanguage('zh');
      expect(header.textContent).toBe('库存管理');
    });

    it('输入框的 placeholder 能够根据语言被正确更新', () => {
      let filterInput = document.querySelector('.dataTables_filter input');
      
      window.changeLanguage('en');
      expect(filterInput.getAttribute('placeholder')).toBe("🔍︎    Search inventory");

      window.changeLanguage('zh');
      expect(filterInput.getAttribute('placeholder')).toBe("🔍︎    搜索库存");
    });

    it('切换语言按钮的状态能根据当前语言正确渲染', () => {
      let toggleBtn = document.getElementById('languageToggleBtn');
      
      window.changeLanguage('en');
      expect(toggleBtn.textContent).toBe('中文'); // 当前是英文时，按钮提示切为中文
      
      window.changeLanguage('zh');
      expect(toggleBtn.textContent).toBe('EN');
    });
  });
});