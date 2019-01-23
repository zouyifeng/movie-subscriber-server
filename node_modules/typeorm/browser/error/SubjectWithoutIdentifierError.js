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
 * Thrown when operation is going to be executed on a subject without identifier.
 * This error should never be thrown, however it still presents to prevent user from updation or removing the whole table.
 * If this error occurs still, it most probably is an ORM internal problem which must be reported and fixed.
 */
var SubjectWithoutIdentifierError = /** @class */ (function (_super) {
    __extends(SubjectWithoutIdentifierError, _super);
    function SubjectWithoutIdentifierError(subject) {
        var _this = _super.call(this) || this;
        _this.name = "SubjectWithoutIdentifierError";
        Object.setPrototypeOf(_this, SubjectWithoutIdentifierError.prototype);
        _this.message = "Internal error. Subject " + subject.metadata.targetName + " must have an identifier to perform operation. " +
            "Please report a github issue if you face this error.";
        return _this;
    }
    return SubjectWithoutIdentifierError;
}(Error));
export { SubjectWithoutIdentifierError };

//# sourceMappingURL=SubjectWithoutIdentifierError.js.map
