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
 * Thrown when user tries to build a query with RETURNING / OUTPUT statement,
 * but used database does not support it.
 */
var ReturningStatementNotSupportedError = /** @class */ (function (_super) {
    __extends(ReturningStatementNotSupportedError, _super);
    function ReturningStatementNotSupportedError() {
        var _this = _super.call(this) || this;
        _this.name = "ReturningStatementNotSupportedError";
        Object.setPrototypeOf(_this, ReturningStatementNotSupportedError.prototype);
        _this.message = "OUTPUT or RETURNING clause only supported by Microsoft SQL Server or PostgreSQL databases.";
        return _this;
    }
    return ReturningStatementNotSupportedError;
}(Error));
export { ReturningStatementNotSupportedError };

//# sourceMappingURL=ReturningStatementNotSupportedError.js.map
