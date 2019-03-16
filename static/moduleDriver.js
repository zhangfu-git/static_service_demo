var ModuleDriver = (function(global, factory) {
  return factory.call(global);
})(window, function() {
  var __MODULES__ = {};
  var __CORE__ = {
    module: function(view, render) {
      return {
        model: null,
        render: render,
        view: view
      }
    },
    init: function(data, modules) {
      // 初始化对象
      __MODULES__ = {};
      for (let module in modules) {
        __MODULES__[module] = modules[module];
      }
      this.load(data);
    },
    load: function(data) {
      this.fetch(data); // 解析填充模块信息
      this.render() // 渲染view
    },
    fetch: function(data) {
      for (let module in data) {
        console.log(data, module)
        __MODULES__[module].model = data[module];
      }
    },
    render: function() {
      for (let module in __MODULES__) {
        __MODULES__[module].render();
      }
    }
  };
  return __CORE__;
});