"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addVideoToDB = addVideoToDB;
const db_1 = require("../db/db");
function addVideoToDB(originalUrl, title, description, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield db_1.db.video.create({
                data: {
                    userId: '271b0106-526c-4799-af1f-f78a1796c7d3',
                    title,
                    description,
                    url: originalUrl,
                },
            });
            return data.id;
        }
        catch (err) {
            console.error("Error adding video to DB:", err);
            return '';
        }
    });
}
