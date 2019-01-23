"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var OrmUtils_1 = require("../../util/OrmUtils");
/**
 * Executes subject operations for nested set tree entities.
 */
var NestedSetSubjectExecutor = /** @class */ (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function NestedSetSubjectExecutor(queryRunner) {
        this.queryRunner = queryRunner;
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Executes operations when subject is being inserted.
     */
    NestedSetSubjectExecutor.prototype.insert = function (subject) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var escape, tableName, leftColumnName, rightColumnName, parent, parentId, parentNsRight;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        escape = function (alias) { return _this.queryRunner.connection.driver.escape(alias); };
                        tableName = escape(subject.metadata.tablePath);
                        leftColumnName = escape(subject.metadata.nestedSetLeftColumn.databaseName);
                        rightColumnName = escape(subject.metadata.nestedSetRightColumn.databaseName);
                        parent = subject.metadata.treeParentRelation.getEntityValue(subject.entity);
                        if (!parent && subject.parentSubject && subject.parentSubject.entity) // if entity was attached via children
                            parent = subject.parentSubject.insertedValueSet ? subject.parentSubject.insertedValueSet : subject.parentSubject.entity;
                        parentId = subject.metadata.getEntityIdMap(parent);
                        parentNsRight = undefined;
                        if (!parentId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.queryRunner.manager
                                .createQueryBuilder()
                                .select(subject.metadata.targetName + "." + subject.metadata.nestedSetRightColumn.propertyPath, "right")
                                .from(subject.metadata.target, subject.metadata.targetName)
                                .whereInIds(parentId)
                                .getRawOne()
                                .then(function (result) { return result ? result["right"] : undefined; })];
                    case 1:
                        parentNsRight = _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!(parentNsRight !== undefined)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.queryRunner.query("UPDATE " + tableName + " SET " +
                                (leftColumnName + " = CASE WHEN " + leftColumnName + " > " + parentNsRight + " THEN " + leftColumnName + " + 2 ELSE " + leftColumnName + " END,") +
                                (rightColumnName + " = " + rightColumnName + " + 2 ") +
                                ("WHERE " + rightColumnName + " >= " + parentNsRight))];
                    case 3:
                        _a.sent();
                        OrmUtils_1.OrmUtils.mergeDeep(subject.insertedValueSet, subject.metadata.nestedSetLeftColumn.createValueMap(parentNsRight), subject.metadata.nestedSetRightColumn.createValueMap(parentNsRight + 1));
                        return [3 /*break*/, 5];
                    case 4:
                        OrmUtils_1.OrmUtils.mergeDeep(subject.insertedValueSet, subject.metadata.nestedSetLeftColumn.createValueMap(1), subject.metadata.nestedSetRightColumn.createValueMap(2));
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return NestedSetSubjectExecutor;
}());
exports.NestedSetSubjectExecutor = NestedSetSubjectExecutor;

//# sourceMappingURL=NestedSetSubjectExecutor.js.map
