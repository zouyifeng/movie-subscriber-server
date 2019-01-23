"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const typeorm_1 = require("typeorm");
const movie_1 = require("./entities/movie");
const user_1 = require("./entities/user");
class DBConnection {
    /**
     * createConnection
     */
    static createConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            const config = config_1.Config;
            return yield typeorm_1.createConnection({
                name: 'movie',
                type: config.DB_TYPE,
                host: config.DB_HOST,
                port: config.DB_PORT,
                username: config.DB_USERNAME,
                password: config.DB_PASSWORD,
                database: config.DB_DATABASE,
                entities: [
                    movie_1.Movie,
                    user_1.User
                ],
                synchronize: true,
                connectTimeout: 60 * 1000 * 1000,
                acquireTimeout: 60 * 1000 * 1000
            });
        });
    }
}
exports.DBConnection = DBConnection;
//# sourceMappingURL=DBConnection.js.map