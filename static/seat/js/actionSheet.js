var ActionSheet = (function(factory) {
  return factory.call();
}(function() {
  var __CORE__ = {
    init: function(options) {
      var $mask = document.createElement('div');
      var $ul = document.createElement('ul');
      
      $mask.className = 'mask';
      $ul.className = 'ul';

      this.onDeleted = options.onDeleted || function() {};

      this.data = [];
      this.$mask = $mask;
      this.$ul = $ul;
      this.$el = document.querySelector(options.el);
      this.$el.appendChild($mask);
      this.$el.appendChild($ul);
      this.render();
      this.onEvent();
    },
    onEvent: function() {
      var me = this;
      this.$el.addEventListener('click', function (e) {
        var target = e.target;
        var className = target.className;
        var index = -1;
        if (className === 'closeBtn') {
          index = +target.getAttribute('data-index');
          me.remove(index);
        } else if (className === 'mask') {
          me.close();
        }
      });
    },
    // 打开面板
    open: function() {
      var currClass = this.$el.className;
      var newClass = currClass + ' open';

      this.$el.className = newClass;
    },
    // 关闭面板
    close: function() {
      var currClass = this.$el.className;
      var newClass = currClass.replace(/open/g, '');
      this.$el.className = newClass;
    },
    // 删除已选的座位
    remove: function(index) {
      var delSeat = this.data[index];
      this.onDeleted(delSeat);
    },
    // 根据传入的listData渲染列表
    render: function(listData) {
      var data = listData || [];
      var tpl = '';

      this.data = listData ? listData : [];

      data.forEach((item, index) => {
        tpl += '<li class="listItem">' + item.y + '排' + (item.x + 1) + '座' + '<span class="closeBtn" data-index=' + index + '>✕</span></li>';
      });

      if (!data.length) {
        tpl = '<li class="noData">当前没有数据</li>'
      }

      this.$ul.innerHTML = tpl;
    }
  };

  return __CORE__;
}));