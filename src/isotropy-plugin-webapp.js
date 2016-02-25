/* @flow */
import type { HttpMethodRouteArgsType } from "isotropy-router";
import Router from "isotropy-router";
import type { IncomingMessage, ServerResponse } from "./flow/http";

type WebAppType = {
  routes: Array<HttpMethodRouteArgsType>,
  type: string,
  path: string
};

type getDefaultsParamsType = {
  type: string,
  routes: Array<HttpMethodRouteArgsType>,
  path?: string
};

type WebAppConfigType = {}

const getDefaults = function(val: getDefaultsParamsType) : WebAppType {
  return {
    type: val.type,
    routes: val.routes,
    path: val.path || "/"
  };
};


const setup = async function(app: WebAppType, router: Router, config: WebAppConfigType) : Promise {
  const routes = [].concat(app.routes);
  router.add(routes);
};


export default {
  getDefaults,
  setup
};
