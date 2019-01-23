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
import { MustBeEntityError } from "../error/MustBeEntityError";
import { SubjectExecutor } from "./SubjectExecutor";
import { CannotDetermineEntityError } from "../error/CannotDetermineEntityError";
import { Subject } from "./Subject";
import { OneToManySubjectBuilder } from "./subject-builder/OneToManySubjectBuilder";
import { OneToOneInverseSideSubjectBuilder } from "./subject-builder/OneToOneInverseSideSubjectBuilder";
import { ManyToManySubjectBuilder } from "./subject-builder/ManyToManySubjectBuilder";
import { SubjectDatabaseEntityLoader } from "./SubjectDatabaseEntityLoader";
import { CascadesSubjectBuilder } from "./subject-builder/CascadesSubjectBuilder";
import { OrmUtils } from "../util/OrmUtils";
import { PromiseUtils } from "../util/PromiseUtils";
/**
 * Persists a single entity or multiple entities - saves or removes them.
 */
var EntityPersistExecutor = /** @class */ (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function EntityPersistExecutor(connection, queryRunner, mode, target, entity, options) {
        this.connection = connection;
        this.queryRunner = queryRunner;
        this.mode = mode;
        this.target = target;
        this.entity = entity;
        this.options = options;
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Executes persistence operation ob given entity or entities.
     */
    EntityPersistExecutor.prototype.execute = function () {
        var _this = this;
        // check if entity we are going to save is valid and is an object
        if (!this.entity || !(this.entity instanceof Object))
            return Promise.reject(new MustBeEntityError(this.mode, this.entity));
        // we MUST call "fake" resolve here to make sure all properties of lazily loaded relations are resolved
        return Promise.resolve().then(function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            var queryRunner, entities, entitiesInChunks, executors, executorsWithExecutableOperations, isTransactionStartedByUs, error_1, rollbackError_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queryRunner = this.queryRunner || this.connection.createQueryRunner("master");
                        // save data in the query runner - this is useful functionality to share data from outside of the world
                        // with third classes - like subscribers and listener methods
                        if (this.options && this.options.data)
                            queryRunner.data = this.options.data;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, , 15, 18]);
                        entities = this.entity instanceof Array ? this.entity : [this.entity];
                        entitiesInChunks = this.options && this.options.chunk && this.options.chunk > 0 ? OrmUtils.chunk(entities, this.options.chunk) : [entities];
                        return [4 /*yield*/, Promise.all(entitiesInChunks.map(function (entities) { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                var subjects, cascadesSubjectBuilder;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            subjects = [];
                                            // create subjects for all entities we received for the persistence
                                            entities.forEach(function (entity) {
                                                var entityTarget = _this.target ? _this.target : entity.constructor;
                                                if (entityTarget === Object)
                                                    throw new CannotDetermineEntityError(_this.mode);
                                                subjects.push(new Subject({
                                                    metadata: _this.connection.getMetadata(entityTarget),
                                                    entity: entity,
                                                    canBeInserted: _this.mode === "save",
                                                    canBeUpdated: _this.mode === "save",
                                                    mustBeRemoved: _this.mode === "remove"
                                                }));
                                            });
                                            cascadesSubjectBuilder = new CascadesSubjectBuilder(subjects);
                                            subjects.forEach(function (subject) {
                                                // next step we build list of subjects we will operate with
                                                // these subjects are subjects that we need to insert or update alongside with main persisted entity
                                                cascadesSubjectBuilder.build(subject);
                                            });
                                            // console.timeEnd("building cascades...");
                                            // load database entities for all subjects we have
                                            // next step is to load database entities for all operate subjects
                                            // console.time("loading...");
                                            return [4 /*yield*/, new SubjectDatabaseEntityLoader(queryRunner, subjects).load(this.mode)];
                                        case 1:
                                            // console.timeEnd("building cascades...");
                                            // load database entities for all subjects we have
                                            // next step is to load database entities for all operate subjects
                                            // console.time("loading...");
                                            _a.sent();
                                            // console.timeEnd("loading...");
                                            // console.time("other subjects...");
                                            // build all related subjects and change maps
                                            if (this.mode === "save") {
                                                new OneToManySubjectBuilder(subjects).build();
                                                new OneToOneInverseSideSubjectBuilder(subjects).build();
                                                new ManyToManySubjectBuilder(subjects).build();
                                            }
                                            else {
                                                subjects.forEach(function (subject) {
                                                    if (subject.mustBeRemoved) {
                                                        new ManyToManySubjectBuilder(subjects).buildForAllRemoval(subject);
                                                    }
                                                });
                                            }
                                            // console.timeEnd("other subjects...");
                                            // console.timeEnd("building subjects...");
                                            // console.log("subjects", subjects);
                                            // create a subject executor
                                            return [2 /*return*/, new SubjectExecutor(queryRunner, subjects, this.options)];
                                    }
                                });
                            }); }))];
                    case 2:
                        executors = _a.sent();
                        executorsWithExecutableOperations = executors.filter(function (executor) { return executor.hasExecutableOperations; });
                        if (executorsWithExecutableOperations.length === 0)
                            return [2 /*return*/];
                        isTransactionStartedByUs = false;
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 9, , 14]);
                        if (!!queryRunner.isTransactionActive) return [3 /*break*/, 5];
                        if (!(!this.options || this.options.transaction !== false)) return [3 /*break*/, 5];
                        isTransactionStartedByUs = true;
                        return [4 /*yield*/, queryRunner.startTransaction()];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: 
                    // execute all persistence operations for all entities we have
                    // console.time("executing subject executors...");
                    return [4 /*yield*/, PromiseUtils.runInSequence(executorsWithExecutableOperations, function (executor) { return executor.execute(); })];
                    case 6:
                        // execute all persistence operations for all entities we have
                        // console.time("executing subject executors...");
                        _a.sent();
                        if (!(isTransactionStartedByUs === true)) return [3 /*break*/, 8];
                        return [4 /*yield*/, queryRunner.commitTransaction()];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8: return [3 /*break*/, 14];
                    case 9:
                        error_1 = _a.sent();
                        if (!isTransactionStartedByUs) return [3 /*break*/, 13];
                        _a.label = 10;
                    case 10:
                        _a.trys.push([10, 12, , 13]);
                        return [4 /*yield*/, queryRunner.rollbackTransaction()];
                    case 11:
                        _a.sent();
                        return [3 /*break*/, 13];
                    case 12:
                        rollbackError_1 = _a.sent();
                        return [3 /*break*/, 13];
                    case 13: throw error_1;
                    case 14: return [3 /*break*/, 18];
                    case 15:
                        if (!!this.queryRunner) return [3 /*break*/, 17];
                        return [4 /*yield*/, queryRunner.release()];
                    case 16:
                        _a.sent();
                        _a.label = 17;
                    case 17: return [7 /*endfinally*/];
                    case 18: return [2 /*return*/];
                }
            });
        }); });
    };
    return EntityPersistExecutor;
}());
export { EntityPersistExecutor };

//# sourceMappingURL=EntityPersistExecutor.js.map
