"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _pg = require("pg");

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv.default.config();

const pool = new _pg.Pool({
  connectionString: process.env.DATABASE_URL
});
pool.on('connect', () => console.log('connected to the db'));
var _default = {
  query(text, params) {
    return pool.query(text, params);
  }

};
exports.default = _default;
//# sourceMappingURL=index.js.map