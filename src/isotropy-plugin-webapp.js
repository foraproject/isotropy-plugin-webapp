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
  routes: Array<HttpMethodRouteArgsType>,
  type?: string,
  path?: string
};

type WebAppConfigType = {}

const getDefaults = function(val: getDefaultsParamsType = { routes: [] }) : WebAppType {
  return {
    routes: val.routes,
    type: val.type || "webapp",
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
