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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
import { CannotAttachTreeChildrenEntityError } from "../../error/CannotAttachTreeChildrenEntityError";
/**
 * Executes subject operations for closure entities.
 */
var ClosureSubjectExecutor = /** @class */ (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function ClosureSubjectExecutor(queryRunner) {
        this.queryRunner = queryRunner;
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Removes all children of the given subject's entity.

    async deleteChildrenOf(subject: Subject) {
        // const relationValue = subject.metadata.treeParentRelation.getEntityValue(subject.databaseEntity);
        // console.log("relationValue: ", relationValue);
        // this.queryRunner.manager
        //     .createQueryBuilder()
        //     .from(subject.metadata.closureJunctionTable.target, "tree")
        //     .where("tree.");
    }*/
    /**
     * Executes operations when subject is being inserted.
     */
    ClosureSubjectExecutor.prototype.insert = function (subject) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var closureJunctionInsertMap, parent, escape_1, tableName, ancestorColumnNames, descendantColumnNames, firstQueryParameters_1, childEntityIdValues_1, childEntityIds1, whereCondition;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        closureJunctionInsertMap = {};
                        subject.metadata.closureJunctionTable.ancestorColumns.forEach(function (column) {
                            closureJunctionInsertMap[column.databaseName] = subject.identifier;
                        });
                        subject.metadata.closureJunctionTable.descendantColumns.forEach(function (column) {
                            closureJunctionInsertMap[column.databaseName] = subject.identifier;
                        });
                        // insert values into the closure junction table
                        return [4 /*yield*/, this.queryRunner
                                .manager
                                .createQueryBuilder()
                                .insert()
                                .into(subject.metadata.closureJunctionTable.tablePath)
                                .values(closureJunctionInsertMap)
                                .updateEntity(false)
                                .callListeners(false)
                                .execute()];
                    case 1:
                        // insert values into the closure junction table
                        _a.sent();
                        parent = subject.metadata.treeParentRelation.getEntityValue(subject.entity);
                        if (!parent && subject.parentSubject && subject.parentSubject.entity) // if entity was attached via children
                            parent = subject.parentSubject.insertedValueSet ? subject.parentSubject.insertedValueSet : subject.parentSubject.entity;
                        if (!parent) return [3 /*break*/, 3];
                        escape_1 = function (alias) { return _this.queryRunner.connection.driver.escape(alias); };
                        tableName = this.getTableName(subject.metadata.closureJunctionTable.tablePath);
                        ancestorColumnNames = subject.metadata.closureJunctionTable.ancestorColumns.map(function (column) {
                            return escape_1(column.databaseName);
                        });
                        descendantColumnNames = subject.metadata.closureJunctionTable.descendantColumns.map(function (column) {
                            return escape_1(column.databaseName);
                        });
                        firstQueryParameters_1 = [];
                        childEntityIdValues_1 = subject.metadata.primaryColumns.map(function (column) { return column.getEntityValue(subject.insertedValueSet); });
                        childEntityIds1 = subject.metadata.primaryColumns.map(function (column, index) {
                            firstQueryParameters_1.push(childEntityIdValues_1[index]);
                            return _this.queryRunner.connection.driver.createParameter("child_entity_" + column.databaseName, firstQueryParameters_1.length - 1);
                        });
                        whereCondition = subject.metadata.primaryColumns.map(function (column) {
                            var columnName = escape_1(column.databaseName + "_descendant");
                            var parentId = column.getEntityValue(parent);
                            if (!parentId)
                                throw new CannotAttachTreeChildrenEntityError(subject.metadata.name);
                            firstQueryParameters_1.push(parentId);
                            var parameterName = _this.queryRunner.connection.driver.createParameter("parent_entity_" + column.databaseName, firstQueryParameters_1.length - 1);
                            return columnName + " = " + parameterName;
                        }).join(", ");
                        return [4 /*yield*/, this.queryRunner.query("INSERT INTO " + tableName + " (" + __spread(ancestorColumnNames, descendantColumnNames).join(", ") + ") " +
                                ("SELECT " + ancestorColumnNames.join(", ") + ", " + childEntityIds1.join(", ") + " FROM " + tableName + " WHERE " + whereCondition), firstQueryParameters_1)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Gets escaped table name with schema name if SqlServer or Postgres driver used with custom
     * schema name, otherwise returns escaped table name.
     */
    ClosureSubjectExecutor.prototype.getTableName = function (tablePath) {
        var _this = this;
        return tablePath.split(".")
            .map(function (i) {
            // this condition need because in SQL Server driver when custom database name was specified and schema name was not, we got `dbName..tableName` string, and doesn't need to escape middle empty string
            if (i === "")
                return i;
            return _this.queryRunner.connection.driver.escape(i);
        }).join(".");
    };
    return ClosureSubjectExecutor;
}());
export { ClosureSubjectExecutor };

//# sourceMappingURL=ClosureSubjectExecutor.js.map
