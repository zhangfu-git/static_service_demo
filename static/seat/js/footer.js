var Footer = (function(factory) {
  return factory.call();
}(function() {
  // 定义默认的回调
  var __DESC__ = {
    onClickInfoModule: function() {},
    onHandleSure: function() {},
    /**
     * 默认格式化数据的回调
     * @param {Array} data 例如：[{id: 1, price: 2}]
     * 注意: 如果没有定义formatData回调，需要确保item中包含price
     * @return {total, count}
     */
    formatData: function(data) {
     var total = 0, count = 0, res = {};
     if (Object.prototype.toString.call(data) === "[object Array]") {
      for (var i = 0, len = data.length; i < len; i++) {
        count++;
        if (data[i].price) {
          total += data[i].price;
        } else {
          new Error('座位信息中没有price字段');
          break;
        }
      }
      res.total = total;
      res.count = count;
     } else {
      new Error('data 不是一个数组');
     }
     return res;
    }
  };
  var __CORE__ = {
    init: function(options) {
      this.$el = document.querySelector(options.el);
      this.onHandleSure = options.onHandleSure || __DESC__.onHandleSure;
      this.formatData = options.formatData || __DESC__.formatData;
      this.onClickInfoModule = options.onClickInfoModule || __DESC__.onClickInfoModule;
      this.data = [];
      this._renderDefaultTpl();
      this._onClickSureBtn();
      this._onClickInfoModule();
      return this;
    },
    // 监听点击了信息模块的回调
    _onClickInfoModule: function () {
      var me = this;

      me.$el.addEventListener('touchstart', function (e) {
        var target = e.target;
        var parentNode = target.parentNode;
        if (parentNode.className && parentNode.className.indexOf('priceBox') > -1 || parentNode.parentNode.className && parentNode.parentNode.className.indexOf('priceBox') > -1) {
          if (typeof me.onClickInfoModule === 'function') {
            me.onClickInfoModule.call(me, me.data);
          }
        }
      });
    },
    // 监听确定选座按钮
    _onClickSureBtn: function() {
      var me = this;
      me.$el.addEventListener('touchstart', function (e) {
        var target = e.target;
        if (target.className && target.className.indexOf('sureBtn') > -1) {
          if (typeof me.onHandleSure === 'function') {
            me.onHandleSure.call(me, me.data);
          }
        }
      });
    },
    // 私有方法：渲染选中的座位信息
    _renderSelectedSeatInfo: function(total, count) {
      var tpl = '<div class="priceBox"><i>应付: <span class="price">' + total + '元' + '</span></i>' +
        '<span>共' + count + '张</span></div>';
      this.$el.querySelector('.total').innerHTML = tpl;
    },
    // 私有方法：渲染默认的组件状态
    _renderDefaultTpl: function() {
      var tpl = ('<div class="footer-component">' +
        '<div class="total">' +
        '请选择座位' +
        '</div>' +
        '<div class="sureBtn">确定选座</div>' +
        '</div>');
      this.$el.innerHTML = tpl;
    },
    /**
     * 
     * @param {*} data 传入的数据
     * 如果没有自定义formatData回调，约定data数据中必须包含price, 例如: [{ price: 2 }]
     */
    setData: function(data) {
      var res = {};
      this.data = data;
      if (typeof this.formatData === 'function') {
        res = this.formatData(data);
      }
      if (res && res.total && res.count) {
        this._renderSelectedSeatInfo(res.total, res.count);
      } else {
        new Error('formatData 返回的参数没有total和count');
      }
    },
    // 重置初始化状态
    resetStatus: function() {
      this.data = [];
      this._renderDefaultTpl();
    }
  };

  return __CORE__;
}));