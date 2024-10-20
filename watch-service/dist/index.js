"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const watch_routes_1 = __importDefault(require("./routes/watch.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8081;
app.use((0, cors_1.default)({
    allowedHeaders: ["*"],
    origin: "*"
}));
app.use(express_1.default.json({}));
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/watch', watch_routes_1.default);
app.get('/', (req, res) => {
    res.json('Hello World!');
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
