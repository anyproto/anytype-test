"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_util_1 = require("node:util");
const node_stream_1 = require("node:stream");
const html_formatter_1 = __importDefault(require("@cucumber/html-formatter"));
const resolve_pkg_1 = __importDefault(require("resolve-pkg"));
exports.default = {
    type: 'formatter',
    formatter({ on, write }) {
        const htmlStream = new html_formatter_1.default((0, resolve_pkg_1.default)('@cucumber/html-formatter', { cwd: __dirname }) +
            '/dist/main.css', (0, resolve_pkg_1.default)('@cucumber/html-formatter', { cwd: __dirname }) +
            '/dist/main.js');
        on('message', (message) => htmlStream.write(message));
        htmlStream.on('data', (chunk) => write(chunk));
        return async () => {
            htmlStream.end();
            await (0, node_util_1.promisify)(node_stream_1.finished)(htmlStream);
        };
    },
    documentation: 'Outputs a HTML report',
};
//# sourceMappingURL=html.js.map