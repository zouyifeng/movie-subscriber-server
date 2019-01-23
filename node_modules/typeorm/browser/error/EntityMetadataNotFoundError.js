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
 */
var EntityMetadataNotFoundError = /** @class */ (function (_super) {
    __extends(EntityMetadataNotFoundError, _super);
    function EntityMetadataNotFoundError(target) {
        var _this = _super.call(this) || this;
        _this.name = "EntityMetadataNotFound";
        Object.setPrototypeOf(_this, EntityMetadataNotFoundError.prototype);
        var targetName;
        if (target instanceof EntitySchema) {
            targetName = target.options.name;
        }
        else if (typeof target === "function") {
            targetName = target.name;
        }
        else {
            targetName = target;
        }
        _this.message = "No metadata for \"" + targetName + "\" was found.";
        return _this;
    }
    return EntityMetadataNotFoundError;
}(Error));
export { EntityMetadataNotFoundError };

//# sourceMappingURL=EntityMetadataNotFoundError.js.map
