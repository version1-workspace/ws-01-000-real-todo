interface Config {
  path: string;
}

interface Functions {
  toString: () => string;
  with: (path: string) => string;
}
type RouteNodeValue = Config & RouteNode & Functions;

interface RouteNode {
  [key: string]: RouteNodeValue;
}

const handler = {
  get: (target: RouteNode, prop: string): RouteNode => {
    if (prop in target) {
      return target[prop as keyof { config: Config }] as RouteNode;
    }

    const config = target.config as Config;

    const route: any = {
      config: {
        path: config.path,
      },
    };
    route.with = (path: string) => {
      if (route.config.path.slice(-1) === "/") {
        return route.config.path + path;
      }
      return route.config.path + "/" + path;
    };
    route.config.path = route.with(prop);
    route.toString = () => {
      return route.config.path;
    };

    return new Proxy(route, handler);
  },
};

const root = { config: { path: "" } } as any;

const route = new Proxy(root, handler);

export default route as RouteNode;
