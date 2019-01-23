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
 * Thrown if custom repository inherits Repository class however entity is not set in @EntityRepository decorator.
 */
var CustomRepositoryCannotInheritRepositoryError = /** @class */ (function (_super) {
    __extends(CustomRepositoryCannotInheritRepositoryError, _super);
    function CustomRepositoryCannotInheritRepositoryError(repository) {
        var _this = _super.call(this) || this;
        _this.name = "CustomRepositoryCannotInheritRepositoryError";
        Object.setPrototypeOf(_this, CustomRepositoryCannotInheritRepositoryError.prototype);
        _this.message = "Custom entity repository " + (repository instanceof Function ? repository.name : repository.constructor.name) + " " +
            " cannot inherit Repository class without entity being set in the @EntityRepository decorator.";
        return _this;
    }
    return CustomRepositoryCannotInheritRepositoryError;
}(Error));
exports.CustomRepositoryCannotInheritRepositoryError = CustomRepositoryCannotInheritRepositoryError;

//# sourceMappingURL=CustomRepositoryCannotInheritRepositoryError.js.map
