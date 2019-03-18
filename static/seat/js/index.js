// 监听document加载完毕才去初始化各个组件
document.addEventListener("DOMContentLoaded", function (e) {
  // 初始化Footer组件
  Footer.init({
    el: '.footer',
    onHandleSure: function(data) {
      console.log('点击确定等到我们选中的座位信息，发送给服务器', data);
    },
    onClickInfoModule: function(data) {
      console.log('点击了信息模块', data);
    }
  });

  var selectedData = [
    {
      id: 1,
      price: 1,
    },
    {
      id: 2,
      price: 2
    }
  ];

  Footer.setData(selectedData);

  setTimeout(function() {
    Footer.resetStatus();
  }, 2000);

  // 初始化选座组件
  Seat.init({
    el: '.main'
  });

  ajax({
    url: '/seat/data.json',
    method: 'GET'
  })
  .then(function(res) {
    Seat.setData(res);
  });

});