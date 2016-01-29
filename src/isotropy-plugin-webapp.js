/* @flow */
import type { HttpMethodRouteArgsType } from "isotropy-router";
import Router from "isotropy-router";
import type { IncomingMessage, ServerResponse } from "./flow/http";

type ModuleType = {
  routes: Array<HttpMethodRouteArgsType>
}

type WebAppType = {
  module: ModuleType,
  type: string,
  path: string
};

type WebAppConfigType = {}


const getDefaults = function(val: Object = {}) : WebAppType {
  if (!val.module) {
    val = { module: val }
  }
  return {
    module: val.module,
    type: val.type || "webapp",
    path: val.path || "/"
  };
};


const setup = async function(app: WebAppType, router: Router, config: WebAppConfigType) : Promise {
  const routes = [].concat(app.module.routes);
  router.add(routes);
};


export default {
  getDefaults,
  setup
};
