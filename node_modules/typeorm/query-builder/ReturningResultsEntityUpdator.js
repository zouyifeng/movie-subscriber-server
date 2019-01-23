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
var OrmUtils_1 = require("../util/OrmUtils");
var OracleDriver_1 = require("../driver/oracle/OracleDriver");
/**
 * Updates entity with returning results in the entity insert and update operations.
 */
var ReturningResultsEntityUpdator = /** @class */ (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function ReturningResultsEntityUpdator(queryRunner, expressionMap) {
        this.queryRunner = queryRunner;
        this.expressionMap = expressionMap;
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Updates entities with a special columns after updation query execution.
     */
    ReturningResultsEntityUpdator.prototype.update = function (updateResult, entities) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var metadata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        metadata = this.expressionMap.mainAlias.metadata;
                        return [4 /*yield*/, Promise.all(entities.map(function (entity, entityIndex) { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                var result, returningColumns, updationColumns, entityId, loadedReturningColumns;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!this.queryRunner.connection.driver.isReturningSqlSupported()) return [3 /*break*/, 1];
                                            if (this.queryRunner.connection.driver instanceof OracleDriver_1.OracleDriver && updateResult.raw instanceof Array && this.expressionMap.extraReturningColumns.length > 0) {
                                                updateResult.raw = updateResult.raw.reduce(function (newRaw, rawItem, rawItemIndex) {
                                                    newRaw[_this.expressionMap.extraReturningColumns[rawItemIndex].databaseName] = rawItem[0];
                                                    return newRaw;
                                                }, {});
                                            }
                                            result = updateResult.raw instanceof Array ? updateResult.raw[entityIndex] : updateResult.raw;
                                            returningColumns = this.queryRunner.connection.driver.createGeneratedMap(metadata, result);
                                            if (returningColumns) {
                                                this.queryRunner.manager.merge(metadata.target, entity, returningColumns);
                                                updateResult.generatedMaps.push(returningColumns);
                                            }
                                            return [3 /*break*/, 3];
                                        case 1:
                                            updationColumns = this.getUpdationReturningColumns();
                                            if (!(updationColumns.length > 0)) return [3 /*break*/, 3];
                                            entityId = this.expressionMap.mainAlias.metadata.getEntityIdMap(entity);
                                            if (!entityId)
                                                throw new Error("Cannot update entity because entity id is not set in the entity.");
                                            return [4 /*yield*/, this.queryRunner.manager
                                                    .createQueryBuilder()
                                                    .select(metadata.primaryColumns.map(function (column) { return metadata.targetName + "." + column.propertyPath; }))
                                                    .addSelect(this.getUpdationReturningColumns().map(function (column) { return metadata.targetName + "." + column.propertyPath; }))
                                                    .from(metadata.target, metadata.targetName)
                                                    .where(entityId)
                                                    .setOption("create-pojo") // use POJO because created object can contain default values, e.g. property = null and those properties maight be overridden by merge process
                                                    .getOne()];
                                        case 2:
                                            loadedReturningColumns = _a.sent();
                                            if (loadedReturningColumns) {
                                                this.queryRunner.manager.merge(metadata.target, entity, loadedReturningColumns);
                                                updateResult.generatedMaps.push(loadedReturningColumns);
                                            }
                                            _a.label = 3;
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Updates entities with a special columns after insertion query execution.
     */
    ReturningResultsEntityUpdator.prototype.insert = function (insertResult, entities) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var metadata, insertionColumns, generatedMaps;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        metadata = this.expressionMap.mainAlias.metadata;
                        insertionColumns = this.getInsertionReturningColumns();
                        generatedMaps = entities.map(function (entity, entityIndex) {
                            if (_this.queryRunner.connection.driver instanceof OracleDriver_1.OracleDriver && insertResult.raw instanceof Array && _this.expressionMap.extraReturningColumns.length > 0) {
                                insertResult.raw = insertResult.raw.reduce(function (newRaw, rawItem, rawItemIndex) {
                                    newRaw[_this.expressionMap.extraReturningColumns[rawItemIndex].databaseName] = rawItem[0];
                                    return newRaw;
                                }, {});
                            }
                            // get all values generated by a database for us
                            var result = insertResult.raw instanceof Array ? insertResult.raw[entityIndex] : insertResult.raw;
                            var generatedMap = _this.queryRunner.connection.driver.createGeneratedMap(metadata, result) || {};
                            // if database does not support uuid generation we need to get uuid values
                            // generated by orm and set them to the generatedMap
                            if (_this.queryRunner.connection.driver.isUUIDGenerationSupported() === false) {
                                metadata.generatedColumns.forEach(function (generatedColumn) {
                                    if (generatedColumn.generationStrategy === "uuid") {
                                        // uuid can be defined by user in a model, that's why first we get it
                                        var uuid = generatedColumn.getEntityValue(entity);
                                        if (!uuid) // if it was not defined by a user then InsertQueryBuilder generates it by its own, get this generated uuid value
                                            uuid = _this.expressionMap.nativeParameters["uuid_" + generatedColumn.databaseName + entityIndex];
                                        OrmUtils_1.OrmUtils.mergeDeep(generatedMap, generatedColumn.createValueMap(uuid));
                                    }
                                });
                            }
                            _this.queryRunner.manager.merge(metadata.target, entity, generatedMap); // todo: this should not be here, but problem with below line
                            return generatedMap;
                        });
                        if (!(this.queryRunner.connection.driver.isReturningSqlSupported() === false && insertionColumns.length > 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, Promise.all(entities.map(function (entity, entityIndex) { return __awaiter(_this, void 0, void 0, function () {
                                var entityId, returningResult;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            entityId = metadata.getEntityIdMap(entity);
                                            return [4 /*yield*/, this.queryRunner.manager
                                                    .createQueryBuilder()
                                                    .select(metadata.primaryColumns.map(function (column) { return metadata.targetName + "." + column.propertyPath; }))
                                                    .addSelect(insertionColumns.map(function (column) { return metadata.targetName + "." + column.propertyPath; }))
                                                    .from(metadata.target, metadata.targetName)
                                                    .where(entityId)
                                                    .setOption("create-pojo") // use POJO because created object can contain default values, e.g. property = null and those properties maight be overridden by merge process
                                                    .getOne()];
                                        case 1:
                                            returningResult = _a.sent();
                                            this.queryRunner.manager.merge(metadata.target, generatedMaps[entityIndex], returningResult);
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        entities.forEach(function (entity, entityIndex) {
                            var entityId = metadata.getEntityIdMap(entity);
                            insertResult.identifiers.push(entityId);
                            insertResult.generatedMaps.push(generatedMaps[entityIndex]);
                            _this.queryRunner.manager.merge(_this.expressionMap.mainAlias.metadata.target, entity, generatedMaps[entityIndex], generatedMaps[entityIndex]); // todo: why twice?!
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Columns we need to be returned from the database when we insert entity.
     */
    ReturningResultsEntityUpdator.prototype.getInsertionReturningColumns = function () {
        // for databases which support returning statement we need to return extra columns like id
        // for other databases we don't need to return id column since its returned by a driver already
        var needToCheckGenerated = this.queryRunner.connection.driver.isReturningSqlSupported();
        // filter out the columns of which we need database inserted values to update our entity
        return this.expressionMap.mainAlias.metadata.columns.filter(function (column) {
            return column.default !== undefined ||
                (needToCheckGenerated && column.isGenerated) ||
                column.isCreateDate ||
                column.isUpdateDate ||
                column.isVersion;
        });
    };
    /**
     * Columns we need to be returned from the database when we update entity.
     */
    ReturningResultsEntityUpdator.prototype.getUpdationReturningColumns = function () {
        return this.expressionMap.mainAlias.metadata.columns.filter(function (column) {
            return column.isUpdateDate || column.isVersion;
        });
    };
    return ReturningResultsEntityUpdator;
}());
exports.ReturningResultsEntityUpdator = ReturningResultsEntityUpdator;

//# sourceMappingURL=ReturningResultsEntityUpdator.js.map
