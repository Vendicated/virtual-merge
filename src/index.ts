/*!
 * virtual-merge
 * Copyright (c) 2023 Vendicated
 * SPDX-License-Identifier: MIT
 */

type UnionToIntersection<U> =
    (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

type ExtractObjectType<O extends object[]> = O extends Array<infer T> ? UnionToIntersection<T> : never;

function virtualMerge<O extends object[]>(...objects: O): ExtractObjectType<O> {
    const fallback = {};

    function findObjectByProp(prop: PropertyKey) {
        for (let i = objects.length - 1; i >= 0; i--) {
            if (prop in objects[i]) return objects[i];
        }
        return fallback;
    }

    const handler: ProxyHandler<ExtractObjectType<O>> = {
        ownKeys() {
            return objects.reduce<Array<string | symbol>>((acc, obj) => {
                acc.push(...Reflect.ownKeys(obj));
                return acc;
            }, Reflect.ownKeys(fallback));
        }
    };

    for (const method of ["defineProperty", "deleteProperty", "get", "getOwnPropertyDescriptor", "has", "set"]) {
        handler[method] = function (_: unknown, ...args: unknown[]) {
            return Reflect[method](findObjectByProp(args[0] as PropertyKey), ...args);
        } as any;
    }
    return new Proxy(fallback, handler) as ExtractObjectType<O>;
}

export default virtualMerge;
if (typeof module !== "undefined") module.exports = virtualMerge;
