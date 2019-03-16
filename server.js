const serve = require('koa-static');
const http = require('http');
const koa = require('koa');
const app = new koa();

app.use(serve(__dirname + '/static/'));

http.createServer(app.callback()).listen(3002, () => {
  console.log('http => 3002')
});