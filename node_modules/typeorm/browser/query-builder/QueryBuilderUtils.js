var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
/**
 * Helper utility functions for QueryBuilder.
 */
var QueryBuilderUtils = /** @class */ (function () {
    function QueryBuilderUtils() {
    }
    /**
     * Checks if given value is a string representation of alias property,
     * e.g. "post.category" or "post.id".
     */
    QueryBuilderUtils.isAliasProperty = function (str) {
        // alias property must be a string and must have a dot separator
        if (typeof str !== "string" || str.indexOf(".") === -1)
            return false;
        // extra alias and its property relation
        var _a = __read(str.split("."), 2), aliasName = _a[0], propertyName = _a[1]; // todo: what about relations in embedded?
        if (!aliasName || !propertyName)
            return false;
        // alias and property must be represented in a special format
        // const aliasNameRegexp = /^[a-zA-Z0-9_-]+$/;
        // if (!aliasNameRegexp.test(aliasName) || !aliasNameRegexp.test(propertyName))
        //     return false;
        // make sure string is not a subquery
        if (str.indexOf("(") !== -1 || str.indexOf(")") !== -1)
            return false;
        return true;
    };
    return QueryBuilderUtils;
}());
export { QueryBuilderUtils };

//# sourceMappingURL=QueryBuilderUtils.js.map
