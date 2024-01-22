interface RouteNode {
  path: string;
  children?: { [key: string]: RouteNode };
}

class Route {
  _node: RouteNode;
  _children: { [key: string]: Route } = {};
  parent?: Route;

  constructor(node: RouteNode = { path: "/" }) {
    this._node = node;
  }

  set children(values: { [key: string]: Route }) {
    this._children = values;
  }

  child(path: string) {
    return (this.toString() + "/" + path).replaceAll("//", "/");
  }

  toString(): string {
    let node = this.parent;
    let fullPath = [this._node.path];
    while (node) {
      const parentPath = node.toString();
      if (parentPath !== "/") {
        fullPath.unshift(parentPath);
      }

      node = node.parent;
    }

    return ("/" + fullPath.join("/")).replaceAll("//", "/");
  }
}

const factory = (node: RouteNode) =>
  new Proxy<Route>(new Route(node), {
    get: function (target: Route, name: string) {
      if (name in target) {
        return target[name as keyof Route];
      }

      return target._children[name as any];
    },
  });

type RouteProxy = typeof Proxy<Route>;

const init = (config: RouteNode, root: Route = new Route()): RouteProxy => {
  return Object.keys(config).reduce((acc: RouteProxy, key: string) => {
    if (["path"].includes(key)) {
      return acc;
    }

    const node = config[key as keyof RouteNode] as RouteNode;
    const route = factory(config);
    if (node && key === "children") {
      const _node = node as RouteNode;
      let children = {} as { [key: string]: Route };
      Object.keys(_node).forEach((childKey: string) => {
        const value = _node[childKey as keyof RouteNode] as RouteNode;
        const child = init(value, factory(value));
        child.parent = route;

        children[childKey] = child;
      });

      route.children = children;
    }

    return route;
  }, root);
};

const route: RouteNode = {
  path: "/",
  children: {
    main: {
      path: "main",
      children: {
        projects: {
          path: "projects",
        },
        tasks: {
          path: "tasks",
        },
      },
    },
  },
};

export default init(route);
