/* @flow */
import type { HttpMethodRouteArgsType } from "isotropy-router";
import Router from "isotropy-router";
import type { IncomingMessage, ServerResponse } from "./flow/http";
import webappAdapter from "isotropy-adapter-webapp";

type WebAppType = {
  routes: Array<HttpMethodRouteArgsType>,
  type: string,
  path: string,
  toHtml?: (html: string, props?: Object) => string,
  elementSelector: string,
  onRender?: (html: string) => void
};

type getDefaultsParamsType = {
  type: string,
  routes: Array<HttpMethodRouteArgsType>,
  path?: string,
  toHtml?: (html: string, props?: Object) => string,
  elementSelector?: string,
  onRender?: (html: string) => void
};

type WebAppConfigType = {}

const getDefaults = function(val: getDefaultsParamsType) : WebAppType {
  return {
    type: val.type,
    routes: val.routes,
    path: val.path || "/",
    toHtml: val.toHtml || ((html) => html),
    elementSelector: val.elementSelector || "#isotropy-container",
    onRender: val.onRender
  };
};


const setup = async function(appConfig: WebAppType, router: Router, config: WebAppConfigType) : Promise {
  const routes = appConfig.routes.map(
    route => {
      return {
        type: "pattern",
        method: route.method,
        url: route.url,
        handler: async (req: IncomingMessage, res: ServerResponse, args: Object) => {
          await webappAdapter.render({
            req,
            res,
            args,
            handler: route.handler,
            toHtml: route.toHtml || appConfig.toHtml,
            elementSelector: route.elementSelector || appConfig.elementSelector,
            onRender: route.onRender || appConfig.onRender
          });
        },
        options: { argumentsAsObject: true }
      };
    }
  );
  router.add(routes);
};


export default {
  name: "webapp",
  getDefaults,
  setup
};
