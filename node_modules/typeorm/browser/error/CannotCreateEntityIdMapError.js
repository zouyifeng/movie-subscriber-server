var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Thrown when user tries to create entity id map from the mixed id value,
 * but id value is a single value when entity requires multiple values.
 */
var CannotCreateEntityIdMapError = /** @class */ (function (_super) {
    __extends(CannotCreateEntityIdMapError, _super);
    function CannotCreateEntityIdMapError(metadata, id) {
        var _this = _super.call(this) || this;
        _this.name = "CannotCreateEntityIdMapError";
        Object.setPrototypeOf(_this, CannotCreateEntityIdMapError.prototype);
        var objectExample = metadata.primaryColumns.reduce(function (object, column, index) {
            column.setEntityValue(object, index + 1);
            return object;
        }, {});
        _this.message = "Cannot use given entity id \"" + id + "\" because \"" + metadata.targetName + "\" contains multiple primary columns, you must provide object in following form: " + JSON.stringify(objectExample) + " as an id.";
        return _this;
    }
    return CannotCreateEntityIdMapError;
}(Error));
export { CannotCreateEntityIdMapError };

//# sourceMappingURL=CannotCreateEntityIdMapError.js.map
