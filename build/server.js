"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _cors = _interopRequireDefault(require("cors"));

var _swaggerUiExpress = _interopRequireDefault(require("swagger-ui-express"));

var _path = _interopRequireDefault(require("path"));

var _index = _interopRequireDefault(require("./routes/index"));

var _epicmailDoc = _interopRequireDefault(require("../epicmail-doc.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv.default.config();

const app = (0, _express.default)();
app.use(_bodyParser.default.json());
app.use(_bodyParser.default.urlencoded({
  extended: false
}));
app.use('/api-docs', _swaggerUiExpress.default.serve, _swaggerUiExpress.default.setup(_epicmailDoc.default));
app.use((0, _cors.default)());
app.use(_index.default);
app.use('/uploads', _express.default.static(_path.default.join(__dirname, '/uploads')));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {// console.log(`App running at port ${PORT}`);
});
var _default = app;
exports.default = _default;
//# sourceMappingURL=server.js.map