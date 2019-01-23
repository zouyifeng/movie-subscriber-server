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
 * Thrown when user tries to insert using QueryBuilder but do not specify what to insert.
 */
var InsertValuesMissingError = /** @class */ (function (_super) {
    __extends(InsertValuesMissingError, _super);
    function InsertValuesMissingError() {
        var _this = _super.call(this) || this;
        _this.name = "InsertValuesMissingError";
        Object.setPrototypeOf(_this, InsertValuesMissingError.prototype);
        _this.message = "Cannot perform insert query because values are not defined. Call \"qb.values(...)\" method to specify inserted values.";
        return _this;
    }
    return InsertValuesMissingError;
}(Error));
export { InsertValuesMissingError };

//# sourceMappingURL=InsertValuesMissingError.js.map
