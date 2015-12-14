/* @flow */
import { KoaContextType, KoaHandlerType } from "koa";
import type KoaAppType from "koa";
import type { HttpMethodRouteArgsType } from "isotropy-router";
import Router from "isotropy-router";

type ModuleType = {
    routes: Array<HttpMethodRouteArgsType>
}

type WebAppType = {
    module: ModuleType,
    type: string,
    path: string
};

type WebAppConfigType = {}


const getDefaultValues = function(val: Object = {}) : WebAppType {
    if (!val.module) {
        val = { module: val }
    }
    return {
        module: val.module,
        type: val.type || "webapp",
        path: val.path || "/"
    };
};


const setup = async function(app: WebAppType, server: KoaAppType, config: WebAppConfigType) : Promise {
    const router = new Router();
    const routes = [].concat(app.module.routes);
    router.add(routes);
    server.use(async (ctx, next) => { await router.doRouting(ctx, next) });
};


export default {
    getDefaultValues,
    setup
};
