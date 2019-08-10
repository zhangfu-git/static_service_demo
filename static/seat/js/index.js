// 监听document加载完毕才去初始化各个组件
document.addEventListener("DOMContentLoaded", function (e) {
  // 初始化Footer组件
  Footer.init({
    el: '.footer',
    onHandleSure: function(data) {
      console.log('获取选择的座位，提交给服务器', data);
    },
    onClickInfoModule: function(data) {
      console.log('点击了信息模块', data);
      ActionSheet.open();
    },
    /**
     * @description 自定义计算价格
     * @param {array} seatData   选择的座位信息
     * @return {total, count}
     */
    formatData: function(seatData) {
      // 假设座位的价格都相同为56元
      var price = 56;
      var count = seatData.length;
      return {
        count: count,
        total: count * price
      }
    }
  });

  ActionSheet.init({
    el: '.actionSheet',
    onDeleted: function(seat) {
      var id = seat.id
      Seat.removeSeat(id);
    }
  });

  // 初始化选座组件
  Seat.init({
    el: '.main',
    event: {
      onChange: function(selectedData) {
        console.log('删除', selectedData)
        // 给footer设置值，通过Footer初始化的formatData进行格式化数据返回渲染
        Footer.setData(selectedData);
        ActionSheet.render(selectedData);
      }
    }
  });

  // 获取座位图数据
  ajax({
    url: '/seat/data.json',
    method: 'GET'
  })
  .then(function(res) {
    // 根据数据渲染座位表
    Seat.renderSeat(res);
  });

});