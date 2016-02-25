import __polyfill from "babel-polyfill";
import should from 'should';
import http from "http";
import querystring from "querystring";
import Router from "isotropy-router";
import promisify from "nodefunc-promisify";
import webappModule from "../isotropy-plugin-webapp";

describe("Isotropy WebApp Module", () => {

  const makeRequest = (host, port, path, method, headers, _postData) => {
    return new Promise((resolve, reject) => {
      const postData = (typeof _postData === "string") ? _postData : querystring.stringify(_postData);
      const options = { host, port, path, method, headers };

      let result = "";
      const req = http.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function(data) { result += data; });
        res.on('end', function() { resolve({ result, res }); });
      });
      req.on('error', function(e) { reject(e); });
      req.write(postData);
      req.end();
    });
  };

  let server, router;

  before(async () => {
    server = http.createServer((req, res) => router.doRouting(req, res));
    const listen = promisify(server.listen.bind(server));
    await listen(0);
  });

  beforeEach(() => {
    router = new Router();
  });


  it(`Should get default configuration values`, () => {
    const config = {};
    const completedConfig = webappModule.getDefaults(config);
    completedConfig.type.should.equal("webapp");
    completedConfig.path.should.equal("/");
  });


  it(`Should serve a web app`, async () => {
    const routes = [
      { url: "/hello", method: "GET", handler: async (req, res) => res.end("hello, world") }
    ];
    const appConfig = { routes, path: "/" };
    const isotropyConfig = { dir: __dirname };

    await webappModule.setup(appConfig, router, isotropyConfig);
    const { result } = await makeRequest("localhost", server.address().port, "/hello", "GET", { 'Content-Type': 'application/x-www-form-urlencoded' }, {});
    result.should.equal("hello, world");
  });
});
