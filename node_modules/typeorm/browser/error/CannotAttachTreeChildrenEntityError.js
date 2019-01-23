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
 * Thrown when user saves tree children entity but its parent is not saved yet.
*/
var CannotAttachTreeChildrenEntityError = /** @class */ (function (_super) {
    __extends(CannotAttachTreeChildrenEntityError, _super);
    function CannotAttachTreeChildrenEntityError(entityName) {
        var _this = _super.call(this) || this;
        _this.name = "CannotAttachTreeChildrenEntityError";
        Object.setPrototypeOf(_this, CannotAttachTreeChildrenEntityError.prototype);
        _this.message = "Cannot attach entity \"" + entityName + "\" to its parent. Please make sure parent is saved in the database before saving children nodes.";
        return _this;
    }
    return CannotAttachTreeChildrenEntityError;
}(Error));
export { CannotAttachTreeChildrenEntityError };

//# sourceMappingURL=CannotAttachTreeChildrenEntityError.js.map
