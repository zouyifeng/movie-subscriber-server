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
 * Thrown when method expects entity but instead something else is given.
 */
var MustBeEntityError = /** @class */ (function (_super) {
    __extends(MustBeEntityError, _super);
    function MustBeEntityError(operation, wrongValue) {
        var _this = _super.call(this) || this;
        _this.name = "MustBeEntityError";
        Object.setPrototypeOf(_this, MustBeEntityError.prototype);
        _this.message = "Cannot " + operation + ", given value must be an entity, instead \"" + wrongValue + "\" is given.";
        return _this;
    }
    return MustBeEntityError;
}(Error));
export { MustBeEntityError };

//# sourceMappingURL=MustBeEntityError.js.map
