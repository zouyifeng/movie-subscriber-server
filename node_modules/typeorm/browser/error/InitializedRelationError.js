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
 * Thrown when relation has array initialized which is forbidden my ORM.
 *
 * @see https://github.com/typeorm/typeorm/issues/1319
 * @see http://typeorm.io/#/relations-faq/avoid-relation-property-initializers
 */
var InitializedRelationError = /** @class */ (function (_super) {
    __extends(InitializedRelationError, _super);
    function InitializedRelationError(relation) {
        var _this = _super.call(this) || this;
        Object.setPrototypeOf(_this, InitializedRelationError.prototype);
        _this.message = "Array initializations are not allowed in entity relations. " +
            ("Please remove array initialization (= []) from \"" + relation.entityMetadata.targetName + "#" + relation.propertyPath + "\". ") +
            "This is ORM requirement to make relations to work properly. Refer docs for more information.";
        return _this;
    }
    return InitializedRelationError;
}(Error));
export { InitializedRelationError };

//# sourceMappingURL=InitializedRelationError.js.map
