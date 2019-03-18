var Seat = (function(factory) {
  return factory.call();
}(function() {
  var __DESC__ = {

  };
  var __CORE__ = {
    init: function(options) {
      this.$el = document.querySelector(options.el);
      this.data = [];
      this.selectedData = [];

      this.$el.innerHTML = this._getDefaultTpl();
      this.$node = this.$el.querySelector('.seatComponent');
      
      // 获取座位容器主要的区域
      var $seatViewContainer = this.$node.querySelector('.seat-container');
      
      this.layer = $seatViewContainer;
      this.layerLeft = 0;
      this.layerTop = 0;
      this.oldLayerLeft = 0;
      this.oldLayerTop = 0;

      // 初始化设置容器的大小
      var boxSize = this._computedContainerSize();
      this.$node.style.width = boxSize.width + 'px';
      this.$node.style.height = boxSize.height + 'px';

      $seatViewContainer.style.width = boxSize.width + 'px';
      // 42 是舞台模块写死的height+margin
      $seatViewContainer.style.height = boxSize.height - 42 + 'px';

      this.width = boxSize.width;
      this.height = boxSize.height - 42;

      // 注册touch事件
      this._onTouchLayer();
    },
    // 组件布局
    _getDefaultTpl: function() {
      return (
        '<div class="seatComponent">' +
          '<div class="screen">' +
            '<span class="title">舞台</span>' +
          '</div>' +
          '<div class="seat-container">' +
          '</div>' + 
        '</div>'        
      );
    },
    // 渲染座位表
    _renderSeat: function() {
      var me = this;
      var data = me.data;
      if (!data.length) return;

      var seatsList = this._createdSeat(data);
      this.layer.innerHTML = seatsList;
    },
    _createdSeat: function(data) {
      var seatsList = '';
      var width = this.width - 20;     // 减去20为了给整个座位表添加一个padding
      var maxSize = this._getWrapperSize(data);
      // 计算一个座位的大小
      var seatWidth = parseInt(width / maxSize.x);
      // 计算整个座位表x轴占满后，剩余的宽度
      var overWidth = width - maxSize.x * seatWidth;
      // 计算左右可用padding
      var offsetLeft = Math.floor(overWidth / 2);

      for (var i = 0, len = data.length; i < len; i++) {
        var item = data[i];
        var _seatLeft = seatWidth * item.x + offsetLeft;
        var _seatTop = seatWidth * item.y;
        // -2 为了空出座位和座位之间的间隙
        var _seatWidth = seatWidth - 2;
        var _seatHeight = seatWidth - 2;
        var style = 'position: absolute; transform: matrix(1, 0, 0, 1,' + _seatLeft.toFixed(1) + ',' + _seatTop.toFixed(1) + '); width:' + _seatWidth.toFixed(1) + 'px;height:' +
        _seatHeight.toFixed(1) + 'px;background-color:' + (item.status === 0 ? '#fff' : 'red') + ';';
        seatsList += '<div class="seat ' + 'seatId-' + item.id + '" data-index="' + i + '" data-type="seat" data-id="' + item.id + '" data-status="' + item.status + '" style="' + style + '"></div>';
      }

      return seatsList;
    },
    // 获取seat中最大的x和y
    _getWrapperSize: function(list) {
      var maxX = 0;
      var maxY = 0;

      if (!list) list = [];
      for (var i = 0, len = list.length; i < len; i++) {
        if (list[i].x > maxX) {
          maxX = list[i].x;
        }
        if (list[i].y > maxY) {
          maxY = list[i].y;
        }
      }

      return {
        x: maxX,
        y: maxY
      };
    },
    // 计算容器的大小
    _computedContainerSize: function() {
      var seatContainer = this.$node.parentNode.getBoundingClientRect();
      return {
        width: seatContainer.width,
        height: seatContainer.height
      };
    },
    _onTouchLayer: function() {
      var me = this, 
          startX, 
          startY, 
          distance = {},
          origin,
          scale;

      me.isMove = false;
      me.isCanScale = false;
      me.scale = 1;
      
      me.$node.addEventListener('touchstart', function(e) {
        e.preventDefault();

        me.isMove = false;
        if (e.touches.length === 1) {
          startX = e.touches[0].clientX;
          startY = e.touches[0].clientY;
        } else if (e.touches.length > 1) {
          // 开始缩放
          me.isCanScale = true;
          distance.start = me.getDistance({
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
          }, {
            x: e.touches[1].clientX,
            y: e.touches[1].clientY
          });
        }
      }, false);

      me.$node.addEventListener('touchmove', function(e) {
        e.preventDefault();
        var moveX, moveY, disX, disY;

        if (e.touches.length === 1) {
          moveX = e.touches[0].clientX;
          moveY = e.touches[0].clientY;

          disX = Math.round(moveX - startX);
          disY = Math.round(moveY - startY);

          // 
          if (Math.abs(disX) + Math.abs(disY) > 0) {
            me.isMove = true;
          }
          startX = moveX;
          startY = moveY;
          // 执行移动
          me._transformLayer(disX, disY);
        } else if (e.touches.length === 2) {
          origin = me._getOrigin({
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
          }, {
            x: e.touches[1].clientX,
            y: e.touches[1].clientY
          });
          distance.stop = me._getDistance({
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
          }, {
            x: e.touches[1].clientX,
            y: e.touches[1].clientY
          });
          scale = Math.ceil(distance.stop / distance.start + me.scale - 1);

          if (scale >= 2) {
            me.scale = 5;
          } else {
            me.scale = 1;
          }

          if (distance.stop - distance.start > 0) {
            // 放大
            me.scale = scale;     
            if (scale > 5) me.scale = 5;
          } else if (distance.stop - distance.start < 0) {
            // 缩小
            me.scale -= scale;
            if (scale < 5) me.scale = 1;
          }
          me.isMove = true;
          me._scaleLayer(origin, me.scale);
        }        

      }, false);

      me.$node.addEventListener('touchend', function(e) {
        e.preventDefault();
        me.isCanScale = false;
        if (me.scale === 1) {
          me._resetTransFormLayer();
        }
      }, false)
    },
    _scaleLayer: function(origin, scale) {
      var x, y;
      x = origin.x + (-origin.x) * scale;
      y = origin.y + (-origin.y) * scale;

      this.layer.style.transform = 'translate3d(' + this.layerLeft + 'px, ' + this.layerTop + 'px, 0) scale(' + scale + ')';
    },
    _transformLayer: function(disX, disY) {
      var me = this;
      // 如果正在缩放，则不进行移动
      if (me.isCanScale) true;

      if (this.layerTop > 100) {
        this.layerTop = 100;
      }

      if (me.scale === 5) {
        // doc.querySelector('.sureBtn').innerText = disY
        if (this.layerLeft >= 900 && disX > 0) {
          disX = 0;
        }

        if (this.layerLeft <= -900 && disX < 0) {
          disX = 0;
        }

        if (this.layerTop <= -1000 && disY < 0) {
          disY = 0;
        }
      }

      this.layerLeft += disX;
      this.layerTop += disY;
      // 开启3D加速移动位置
      this.layer.style.transform = 'translate3d(' + this.layerLeft + 'px, ' + this.layerTop + 'px, 0) scale(' + me.scale + ')';
    },
    _resetTransFormLayer: function() {
      console.log('执行了', this.oldLayerLeft, this.oldLayerTop, this.scale)
      this.layer.style.transform = 'translate3d(' + this.oldLayerLeft + 'px, ' + this.oldLayerTop + 'px, 0) scale(' + this.scale + ')';
      this.layerLeft = this.oldLayerLeft;
      this.layerTop = this.oldLayerTop;
    },
    _getOrigin: function(first, second) {
      return {
        x: (first.x + second.x) / 2,
        y: (first.y + second.y) / 2
      };
    },
    _getDistance: function(start, stop) {
      return Math.sqrt(Math.pow((stop.x - start.x), 2) + Math.pow((stop.y - start.y), 2));
    },
    setData: function(data) {
      this.data = data;
      this._renderSeat();
    }
  };

  return __CORE__;
}));