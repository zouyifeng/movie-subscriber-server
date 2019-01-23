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
 * Thrown when some option is not set in the connection options.
 */
var NoConnectionOptionError = /** @class */ (function (_super) {
    __extends(NoConnectionOptionError, _super);
    function NoConnectionOptionError(optionName) {
        var _this = _super.call(this) || this;
        Object.setPrototypeOf(_this, NoConnectionOptionError.prototype);
        _this.message = "Option \"" + optionName + "\" is not set in your connection options, please define \"" + optionName + "\" option in your connection options or ormconfig.json";
        return _this;
    }
    return NoConnectionOptionError;
}(Error));
export { NoConnectionOptionError };

//# sourceMappingURL=NoConnectionOptionError.js.map
