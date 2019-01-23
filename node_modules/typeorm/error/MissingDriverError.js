"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Thrown when consumer specifies driver type that does not exist or supported.
 */
var MissingDriverError = /** @class */ (function (_super) {
    __extends(MissingDriverError, _super);
    function MissingDriverError(driverType) {
        var _this = _super.call(this) || this;
        _this.name = "MissingDriverError";
        Object.setPrototypeOf(_this, MissingDriverError.prototype);
        _this.message = "Wrong driver: \"" + driverType + "\" given. Supported drivers are: \"cordova\", \"expo\", \"mariadb\", \"mongodb\", \"mssql\", \"mysql\", \"oracle\", \"postgres\", \"sqlite\", \"sqljs\", \"react-native\".";
        return _this;
    }
    return MissingDriverError;
}(Error));
exports.MissingDriverError = MissingDriverError;

//# sourceMappingURL=MissingDriverError.js.map
