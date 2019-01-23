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
import { EntitySchema } from "../index";
/**
 * Thrown when no result could be found in methods which are not allowed to return undefined or an empty set.
 */
var EntityNotFoundError = /** @class */ (function (_super) {
    __extends(EntityNotFoundError, _super);
    function EntityNotFoundError(entityClass, criteria) {
        var _this = _super.call(this) || this;
        _this.name = "EntityNotFound";
        Object.setPrototypeOf(_this, EntityNotFoundError.prototype);
        var targetName;
        if (entityClass instanceof EntitySchema) {
            targetName = entityClass.options.name;
        }
        else if (typeof entityClass === "function") {
            targetName = entityClass.name;
        }
        else {
            targetName = entityClass;
        }
        var criteriaString = _this.stringifyCriteria(criteria);
        _this.message = "Could not find any entity of type \"" + targetName + "\" matching: " + criteriaString;
        return _this;
    }
    EntityNotFoundError.prototype.stringifyCriteria = function (criteria) {
        try {
            return JSON.stringify(criteria, null, 4);
        }
        catch (e) { }
        return "" + criteria;
    };
    return EntityNotFoundError;
}(Error));
export { EntityNotFoundError };

//# sourceMappingURL=EntityNotFoundError.js.map
