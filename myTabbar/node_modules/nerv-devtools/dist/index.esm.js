import { Component, options } from 'nervjs';

// tslint:disable-next-line
var global = (function () {
    let local;
    if (typeof global !== 'undefined') {
        local = global;
    }
    else if (typeof self !== 'undefined') {
        local = self;
    }
    else {
        try {
            // tslint:disable-next-line:function-constructor
            local = Function('return this')();
        }
        catch (e) {
            throw new Error('global object is unavailable in this environment');
        }
    }
    return local;
})();
const isBrowser = typeof window !== 'undefined';
// tslint:disable-next-line:no-empty
function noop$1() { }
const fakeDoc = {
    createElement: noop$1,
    createElementNS: noop$1,
    createTextNode: noop$1
};
const doc = isBrowser ? document : fakeDoc;
const UA = isBrowser && window.navigator.userAgent.toLowerCase();
const isMacSafari = isBrowser && UA && window.navigator.platform &&
    /mac/i.test(window.navigator.platform) && /^((?!chrome|android).)*safari/i.test(UA);
const isIE9 = UA && UA.indexOf('msie 9.0') > 0;
const isiOS = (UA && /iphone|ipad|ipod|ios/.test(UA));

const isSupportSVG = isFunction(doc.createAttributeNS);
function isString(arg) {
    return typeof arg === 'string';
}
function isFunction(arg) {
    return typeof arg === 'function';
}
const isArray = Array.isArray;
/* istanbul ignore next */
// tslint:disable-next-line
Object.is = Object.is || function (x, y) {
    if (x === y) {
        return x !== 0 || 1 / x === 1 / y;
    }
    return x !== x && y !== y;
};

function getNodeType(vnode) {
    if (isFunction(vnode.type)) {
        return 'Composite';
    }
    else if (isString(vnode.type)) {
        return 'Native';
    }
    return 'Text';
}
function getDisplayName(vnode) {
    if (isFunction(vnode.type)) {
        return vnode.type.displayName || vnode.type.name;
    }
    else if (isString(vnode.type)) {
        return vnode.type;
    }
    return '#text';
}
function setIn(obj, path, value) {
    const last = path.pop();
    const parent = path.reduce((acc, attr) => (acc ? acc[attr] : null), obj);
    if (parent) {
        parent[last] = value;
    }
}
function isEqual(a) {
    return (b) => a === b;
}
function isRoot(vnode) {
    return options.roots.some(isEqual(vnode));
}
function getInstance(vnode) {
    if (vnode.component) {
        return vnode.component;
    }
    return vnode.dom;
}
function shallowEqual(a, b, isProps) {
    if (a == null || b == null) {
        return false;
    }
    for (const key in a) {
        if (isProps && key === 'children' && b[key] != null) {
            continue;
        }
        if (a[key] !== b[key]) {
            return false;
        }
    }
    if (Object.keys(a).length !== Object.keys(b).length) {
        return false;
    }
    return true;
}
function hasDataChanged(prev, next) {
    return ((prev.props !== next.props &&
        !shallowEqual(prev.props, next.props, true)) ||
        (prev.component != null &&
            !shallowEqual(next.component.prevState, next.component.state)) ||
        // prev.vnode.dom !== next.vnode.dom || @FIXME
        prev.ref !== next.ref);
}
function getChildren(vnode) {
    const c = vnode.component;
    if (c == null) {
        if (vnode.children) {
            if (isArray(vnode.children)) {
                return vnode.children.slice();
            }
            return [vnode.children];
        }
        return [];
    }
    return !Array.isArray(c._rendered) && c._rendered != null
        ? [c._rendered]
        : null;
}
function getData(_vnode) {
    const vnode = _vnode instanceof Component ? _vnode.vnode : _vnode;
    const component = vnode.component;
    let updater = null;
    if (component && component instanceof Component) {
        updater = {
            setState: component.setState.bind(component),
            forceUpdate: component.forceUpdate.bind(component),
            setInState(path, value) {
                component.setState((prev) => {
                    setIn(prev, path, value);
                    return prev;
                });
            },
            setInProps(path, value) {
                setIn(vnode.props, path, value);
                component.setState({});
            },
            setInContext(path, value) {
                setIn(component.context, path, value);
                component.setState({});
            }
        };
    }
    const duration = vnode.endTime - vnode.startTime;
    const children = getChildren(vnode);
    return {
        nodeType: getNodeType(vnode),
        type: vnode.type,
        name: getDisplayName(vnode),
        ref: vnode.ref || null,
        key: vnode.key || null,
        updater,
        text: vnode.text,
        state: component != null && component instanceof Component
            ? component.state
            : null,
        props: vnode.props,
        // The devtools inline text children if they are the only child
        children: vnode.text == null
            ? children != null && children.length === 1 && children[0].text != null
                ? children[0].text
                : children
            : null,
        publicInstance: getInstance(vnode),
        memoizedInteractions: [],
        // Profiler data
        actualDuration: duration,
        actualStartTime: vnode.startTime,
        treeBaseDuration: duration
    };
}

class Renderer {
    constructor(hook, rid) {
        this.rid = rid;
        this.hook = hook;
        this.pending = [];
        this.instMap = new WeakMap();
        this.connected = false;
    }
    markConnected() {
        this.connected = true;
        this.flushPendingEvents();
    }
    flushPendingEvents() {
        if (!this.connected) {
            return;
        }
        const events = this.pending;
        this.pending = [];
        for (let i = 0; i < events.length; i++) {
            const event = events[i];
            this.hook.emit(event.type, event);
        }
    }
    mount(vnode) {
        this.instMap.set(getInstance(vnode), vnode);
        const data = getData(vnode);
        const work = [
            {
                internalInstance: vnode,
                data,
                renderer: this.rid,
                type: 'mount'
            }
        ];
        // Children must be mounted first
        if (Array.isArray(data.children)) {
            const stack = data.children.slice();
            let item;
            while ((item = stack.pop()) != null) {
                const children = getChildren(item);
                stack.push(...children);
                this.instMap.set(getInstance(item), item);
                const itemData = getData(item);
                work.push({
                    internalInstance: item,
                    data: itemData,
                    renderer: this.rid,
                    type: 'mount'
                });
            }
        }
        for (let i = work.length; --i >= 0;) {
            this.pending.push(work[i]);
        }
        // Special event if we have a root
        if (isRoot(vnode)) {
            this.pending.push({
                internalInstance: vnode,
                data,
                renderer: this.rid,
                type: 'root'
            });
        }
    }
    update(vnode) {
        const data = getData(vnode);
        // Children must be updated first
        if (Array.isArray(data.children)) {
            for (let i = 0; i < data.children.length; i++) {
                const child = data.children[i];
                const inst = getInstance(child);
                const prevChild = this.instMap.get(inst);
                if (prevChild == null) {
                    this.mount(child);
                }
                else {
                    this.update(child);
                }
                // Mutate child to keep referential equality intact
                data.children[i] = this.instMap.get(inst);
            }
        }
        const prev = this.instMap.get(data.publicInstance);
        // The `updateProfileTimes` event is a faster version of `updated` and
        // is processed much quicker inside the devtools extension.
        if (!hasDataChanged(prev, vnode)) {
            // Always assume profiling data has changed. When we skip an event here
            // the devtools element picker will somehow break.
            this.pending.push({
                internalInstance: prev,
                data,
                renderer: this.rid,
                type: 'updateProfileTimes'
            });
            return;
        }
        this.pending.push({
            internalInstance: prev,
            data,
            renderer: this.rid,
            type: 'update'
        });
    }
    handleCommitFiberRoot(vnode) {
        const inst = getInstance(vnode);
        if (this.instMap.has(inst)) {
            this.update(vnode);
        }
        else {
            this.mount(vnode);
        }
        let root = null;
        if (isRoot(vnode)) {
            vnode.treeBaseDuration = 0;
            root = vnode;
        }
        else {
            // "rootCommitted" always needs the actual root node for the profiler
            // to be able to collect timings. The `_ancestorComponent` property will
            // point to a vnode for a root node.
            root = vnode.component;
            while (root._parentComponent != null) {
                root = root._parentComponent;
            }
        }
        this.pending.push({
            internalInstance: root,
            renderer: this.rid,
            data: getData(root),
            type: 'rootCommitted'
        });
        this.flushPendingEvents();
        return vnode;
    }
    handleCommitFiberUnmount(vnode) {
        const inst = getInstance(vnode);
        this.instMap.delete(inst);
        // Special case when unmounting a root (most prominently caused by webpack's
        // `hot-module-reloading`). If this happens we need to unmount the virtual
        // `Fragment` we're wrapping around each root just for the devtools.
        this.pending.push({
            internalInstance: vnode,
            renderer: this.rid,
            type: 'unmount'
        });
    }
    getNativeFromReactElement(vnode) {
        return vnode.dom;
    }
    getReactElementFromNative(dom) {
        return this.instMap.get(dom) || null;
    }
    // Unused, but devtools expects it to be there
    /* istanbul ignore next */
    // tslint:disable-next-line: no-empty
    walkTree() { }
    // Unused, but devtools expects it to be there
    /* istanbul ignore next */
    // tslint:disable-next-line: no-empty
    cleanup() { }
}

/**
 * Wrap function with generic error logging
 *
 * @param {*} fn
 * @returns
 */
function catchErrors(fn) {
    // tslint:disable-next-line: only-arrow-functions
    return function (arg) {
        try {
            return fn(arg);
        }
        catch (e) {
            /* istanbul ignore next */
            console.error('The react devtools encountered an error');
            /* istanbul ignore next */
            console.error(e); // eslint-disable-line no-console
        }
    };
}
/* istanbul ignore next */
const noop = () => undefined;
function initDevTools() {
    const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (hook == null) {
        return;
    }
    let onCommitRoot = noop;
    let onCommitUnmount = noop;
    // Initialize our custom renderer
    const rid = Math.random()
        .toString(16)
        .slice(2);
    const nervRenderer = new Renderer(hook, rid);
    catchErrors(() => {
        let isDev = false;
        try {
            isDev = process.env.NODE_ENV !== 'production';
        }
        catch (e) {
            //
        }
        // Tell devtools which bundle type we run in
        window.parent.postMessage({
            source: 'react-devtools-detector',
            reactBuildType: /* istanbul ignore next */ isDev
                ? 'development'
                : 'production'
        }, '*');
        const renderer = {
            bundleType: /* istanbul ignore next */ isDev ? 1 : 0,
            version: '16.5.2',
            rendererPackageName: 'nerv',
            // We don't need this, but the devtools `attachRenderer` function relys
            // it being there.
            findHostInstanceByFiber(vnode) {
                return vnode.dom;
            },
            // We don't need this, but the devtools `attachRenderer` function relys
            // it being there.
            findFiberByHostInstance(instance) {
                return nervRenderer.instMap.get(instance) || null;
            }
        };
        hook._renderers[rid] = renderer;
        // We can't bring our own `attachRenderer` function therefore we simply
        // prevent the devtools from overwriting our custom renderer by creating
        // a noop setter.
        Object.defineProperty(hook.helpers, rid, {
            get: () => nervRenderer,
            set: () => {
                if (!nervRenderer.connected) {
                    helpers.markConnected();
                }
            }
        });
        const helpers = hook.helpers[rid];
        // Tell the devtools that we are ready to start
        hook.emit('renderer-attached', {
            id: rid,
            renderer,
            helpers
        });
        onCommitRoot = catchErrors((root) => {
            // Empty (root)
            // if (root.type === Fragment && root._children.length == 0) return
            const roots = hook.getFiberRoots(rid);
            root = helpers.handleCommitFiberRoot(root);
            if (!roots.has(root)) {
                roots.add(root);
            }
        });
        onCommitUnmount = catchErrors((vnode) => {
            hook.onCommitFiberUnmount(rid, vnode);
        });
    })();
    // Store (possible) previous hooks so that we don't overwrite them
    // const prevVNodeHook = options.vnode
    // const prevBeforeDiff = options.diff
    // const prevAfterDiff = options.diffed
    const prevAfterMount = options.afterMount;
    const prevBeforeUnmount = options.beforeUnmount;
    const prevAfterUpdate = options.afterUpdate;
    const prevBeforeMount = options.beforeMount;
    const prevBeforeUpdate = options.beforeUpdate;
    const prevAfterCreate = options.afterCreate;
    options.afterCreate = (vnode) => {
        // Tiny performance improvement by initializing fields as doubles
        // from the start. `performance.now()` will always return a double.
        // See https://github.com/facebook/react/issues/14365
        // and https://slidr.io/bmeurer/javascript-engine-fundamentals-the-good-the-bad-and-the-ugly
        vnode.startTime = NaN;
        vnode.endTime = NaN;
        vnode.startTime = 0;
        vnode.endTime = -1;
        prevAfterCreate(vnode);
    };
    options.beforeMount = (vnode) => {
        vnode.startTime = now();
        prevBeforeMount(vnode);
    };
    options.beforeUpdate = (vnode) => {
        vnode.startTime = now();
        prevBeforeUpdate(vnode);
    };
    options.afterMount = catchErrors((vnode) => {
        prevAfterMount(vnode);
        // These cases are already handled by `unmount`
        if (vnode == null) {
            return;
        }
        onCommitRoot(vnode);
    });
    options.afterUpdate = catchErrors((vnode) => {
        prevAfterUpdate(vnode);
        // These cases are already handled by `unmount`
        if (vnode == null) {
            return;
        }
        vnode.endTime = now();
        onCommitRoot(vnode);
    });
    options.beforeUnmount = catchErrors((vnode) => {
        // Call previously defined hook
        if (prevBeforeUnmount != null) {
            prevBeforeUnmount(vnode);
        }
        onCommitUnmount(vnode);
    });
    // Inject tracking into setState
    // const setState = Component.prototype.setState
    // Component.prototype.setState = function (update, callback) {
    //   // Duplicated in setState() but doesn't matter due to the guard.
    //   const s =
    //     (this._nextState !== this.state && this._nextState) ||
    //     (this._nextState = {...this.state})
    //   // Needed in order to check if state has changed after the tree has been committed:
    //   this._prevState = {...s}
    //   return setState.call(this, update, callback)
    // }
}
/**
 * Get current timestamp in ms. Used for profiling.
 * @returns {number}
 */
let now = Date.now;
try {
    /* istanbul ignore else */
    now = performance.now.bind(performance);
}
catch (e) {
    //
}
initDevTools();

export { initDevTools, now };
//# sourceMappingURL=index.esm.js.map
