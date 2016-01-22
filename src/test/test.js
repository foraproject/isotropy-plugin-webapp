import __polyfill from "babel-polyfill";
import should from 'should';
import http from "http";
import koa from "koa";
import querystring from "querystring";
import webappModule from "../isotropy-plugin-webapp";

describe("Isotropy WebApp Module", () => {

  let defaultInstance: KoaAppType;

  const makeRequest = (host, port, path, method, headers, _postData, cb, onErrorCb) => {
    const postData = (typeof _postData === "string") ? _postData : querystring.stringify(_postData);
    const options = { host, port, path, method, headers };

    let result = "";
    const req = http.request(options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function(data) { result += data; });
      res.on('end', function() { cb(result); });
    });
    req.on('error', function(e) { onErrorCb(e); });
    req.write(postData);
    req.end();
  };


  before(function() {
    defaultInstance = new koa();
    defaultInstance.listen(8080);
  });


  it(`Should get default configuration values`, () => {
    const config = {};
    const completedConfig = webappModule.getDefaults(config);
    completedConfig.type.should.equal("webapp");
    completedConfig.path.should.equal("/");
  });


  it(`Should serve a web app`, () => {
    const moduleConfig = {
      routes: [
        { url: "/hello", method: "GET", handler: async (context) => { context.body = "hello, world"; } }
      ]
    }
    const appConfig = { module: moduleConfig, path: "/" };
    const isotropyConfig = { dir: __dirname };

    const promise = new Promise((resolve, reject) => {
      webappModule.setup(appConfig, defaultInstance, isotropyConfig).then(() => {
        makeRequest("localhost", 8080, "/hello", "GET", { 'Content-Type': 'application/x-www-form-urlencoded' }, {}, resolve, reject);
      }, reject);
    });

    return promise.then((data) => {
      data.should.equal("hello, world");
    });
  });
});
