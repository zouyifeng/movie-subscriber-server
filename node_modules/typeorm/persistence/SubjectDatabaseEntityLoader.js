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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Loads database entities for all operate subjects which do not have database entity set.
 * All entities that we load database entities for are marked as updated or inserted.
 * To understand which of them really needs to be inserted or updated we need to load
 * their original representations from the database.
 */
var SubjectDatabaseEntityLoader = /** @class */ (function () {
    // ---------------------------------------------------------------------
    // Constructor
    // ---------------------------------------------------------------------
    function SubjectDatabaseEntityLoader(queryRunner, subjects) {
        this.queryRunner = queryRunner;
        this.subjects = subjects;
    }
    // ---------------------------------------------------------------------
    // Public Methods
    // ---------------------------------------------------------------------
    /**
     * Loads database entities for all subjects.
     *
     * loadAllRelations flag is used to load all relation ids of the object, no matter if they present in subject entity or not.
     * This option is used for deletion.
     */
    SubjectDatabaseEntityLoader.prototype.load = function (operationType) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var promises;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promises = this.groupByEntityTargets().map(function (subjectGroup) { return __awaiter(_this, void 0, void 0, function () {
                            var _this = this;
                            var allIds, loadRelationPropertyPaths, findOptions, entities;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        allIds = [];
                                        subjectGroup.subjects.forEach(function (subject) {
                                            // we don't load if subject already has a database entity loaded
                                            if (subject.databaseEntity || !subject.identifier)
                                                return;
                                            allIds.push(subject.identifier);
                                        });
                                        // if there no ids found (means all entities are new and have generated ids) - then nothing to load there
                                        if (!allIds.length)
                                            return [2 /*return*/];
                                        loadRelationPropertyPaths = [];
                                        // for the save operation
                                        // extract all property paths of the relations we need to load relation ids for
                                        // this is for optimization purpose - this way we don't load relation ids for entities
                                        // whose relations are undefined, and since they are undefined its really pointless to
                                        // load something for them, since undefined properties are skipped by the orm
                                        if (operationType === "save") {
                                            subjectGroup.subjects.forEach(function (subject) {
                                                // gets all relation property paths that exist in the persisted entity.
                                                subject.metadata.relations.forEach(function (relation) {
                                                    var value = relation.getEntityValue(subject.entityWithFulfilledIds);
                                                    if (value === undefined)
                                                        return;
                                                    if (loadRelationPropertyPaths.indexOf(relation.propertyPath) === -1)
                                                        loadRelationPropertyPaths.push(relation.propertyPath);
                                                });
                                            });
                                        }
                                        else { // remove
                                            // for remove operation
                                            // we only need to load junction relation ids since only they are removed by cascades
                                            loadRelationPropertyPaths.push.apply(// remove
                                            loadRelationPropertyPaths, __spread(subjectGroup.subjects[0].metadata.manyToManyRelations.map(function (relation) { return relation.propertyPath; })));
                                        }
                                        findOptions = {
                                            loadEagerRelations: false,
                                            loadRelationIds: {
                                                relations: loadRelationPropertyPaths,
                                                disableMixedMap: true
                                            }
                                        };
                                        return [4 /*yield*/, this.queryRunner.manager
                                                .getRepository(subjectGroup.target)
                                                .findByIds(allIds, findOptions)];
                                    case 1:
                                        entities = _a.sent();
                                        // now when we have entities we need to find subject of each entity
                                        // and insert that entity into database entity of the found subjects
                                        entities.forEach(function (entity) {
                                            var subjects = _this.findByPersistEntityLike(subjectGroup.target, entity);
                                            subjects.forEach(function (subject) {
                                                subject.databaseEntity = entity;
                                                if (!subject.identifier)
                                                    subject.identifier = subject.metadata.hasAllPrimaryKeys(entity) ? subject.metadata.getEntityIdMap(entity) : undefined;
                                            });
                                        });
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // ---------------------------------------------------------------------
    // Protected Methods
    // ---------------------------------------------------------------------
    /**
     * Finds subjects where entity like given subject's entity.
     * Comparision made by entity id.
     * Multiple subjects may be returned if duplicates are present in the subject array.
     * This will likely result in the same row being updated multiple times during a transaction.
     */
    SubjectDatabaseEntityLoader.prototype.findByPersistEntityLike = function (entityTarget, entity) {
        return this.subjects.filter(function (subject) {
            if (!subject.entity)
                return false;
            if (subject.entity === entity)
                return true;
            return subject.metadata.target === entityTarget && subject.metadata.compareEntities(subject.entityWithFulfilledIds, entity);
        });
    };
    /**
     * Groups given Subject objects into groups separated by entity targets.
     */
    SubjectDatabaseEntityLoader.prototype.groupByEntityTargets = function () {
        return this.subjects.reduce(function (groups, operatedEntity) {
            var group = groups.find(function (group) { return group.target === operatedEntity.metadata.target; });
            if (!group) {
                group = { target: operatedEntity.metadata.target, subjects: [] };
                groups.push(group);
            }
            group.subjects.push(operatedEntity);
            return groups;
        }, []);
    };
    return SubjectDatabaseEntityLoader;
}());
exports.SubjectDatabaseEntityLoader = SubjectDatabaseEntityLoader;

//# sourceMappingURL=SubjectDatabaseEntityLoader.js.map
