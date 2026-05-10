// chart-init.test.js

describe('Chart Initialization Script', () => {
  let mockChartConstructor;

  beforeEach(() => {
    // 1. 在全局模拟 Chart 构造函数
    // 这样当业务代码调用 new Chart() 时，Jest 会拦截它并记录调用情况
    mockChartConstructor = jest.fn().mockImplementation(function (element, config) {
      this.element = element;
      this.config = config;
    });
    global.Chart = mockChartConstructor;

    // 2. 模拟 HTML DOM 结构
    // 创建两个带有 valid JSON 数据的 canvas 元素，和一个没有该属性的 div
    document.body.innerHTML = `
      <canvas id="chart1" data-bss-chart='{"type":"bar","data":{"labels":["A"]}}'></canvas>
      <canvas id="chart2" data-bss-chart='{"type":"pie","data":{"labels":["B"]}}'></canvas>
      <div id="no-chart">我不应该被初始化</div>
    `;

    // 3. 清除模块缓存
    // 确保每次测试加载 js 文件时，都会重新执行并绑定事件监听器
    jest.resetModules();
  });

  afterEach(() => {
    // 每次测试后清理 DOM 和全局变量
    document.body.innerHTML = '';
    delete global.Chart;
  });

  it('应该在 DOMContentLoaded 时为所有 data-bss-chart 元素初始化 Chart 实例', () => {
    // 引入你的业务代码文件 (请把这里的路径替换为你实际的文件相对路径)
    require('../assets/js/bs-init.js');

    // 获取我们刚才模拟的节点
    const canvas1 = document.getElementById('chart1');
    const canvas2 = document.getElementById('chart2');

    // 此时尚未触发事件，不应该有 Chart 被实例化
    expect(mockChartConstructor).not.toHaveBeenCalled();
    expect(canvas1.chart).toBeUndefined();

    // 4. 模拟浏览器触发 DOMContentLoaded 事件
    const event = new Event('DOMContentLoaded');
    document.dispatchEvent(event);

    // 5. 断言与验证
    // 页面上有 2 个带有 data-bss-chart 的元素，所以 Chart 应该被 new 了 2 次
    expect(mockChartConstructor).toHaveBeenCalledTimes(2);

    // 验证第一个图表是否被正确初始化（检查参数是否正确传递）
    expect(mockChartConstructor).toHaveBeenNthCalledWith(
      1, 
      canvas1, 
      { type: 'bar', data: { labels: ['A'] } }
    );
    
    // 验证实例是否被成功挂载到了 DOM 元素的 .chart 属性上
    expect(canvas1.chart).toBeInstanceOf(mockChartConstructor);

    // 验证第二个图表
    expect(mockChartConstructor).toHaveBeenNthCalledWith(
      2, 
      canvas2, 
      { type: 'pie', data: { labels: ['B'] } }
    );
    expect(canvas2.chart).toBeInstanceOf(mockChartConstructor);
  });
});