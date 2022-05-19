"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.parseDockerVersion = exports.getVersion = exports.checkDockerInstall = exports.checkDockerSuitable = void 0;
const core = __importStar(require("@actions/core"));
const io = __importStar(require("@actions/io"));
const context = __importStar(require("./context"));
const utils = __importStar(require("./utils"));
/**
 * 检查docker是否安装，且安装的版本是否适应buildx
 * docker 没有安装和版本不符合要求都将退出action
 * @returns
 */
function checkDockerSuitable() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!checkDockerInstall()) {
            core.info('Docker not installed or not set to the path');
            return false;
        }
        const localDockerVersion = yield getVersion();
        if (utils.compareVersion(localDockerVersion, context.MINIMUM_DOCKER_VERSION) === -1 /* Low */) {
            core.info('the current installed docker version not suitable for multiplatform build,please install latest docker version');
            return false;
        }
        return true;
    });
}
exports.checkDockerSuitable = checkDockerSuitable;
/**
 * 检查sshpass是否已经在系统上完成安装，并输出版本
 * @returns
 */
function checkDockerInstall() {
    return __awaiter(this, void 0, void 0, function* () {
        const docker_path = yield io.which('docker');
        if (!docker_path) {
            core.info('Docker not installed or not set to the path');
            return false;
        }
        core.info('docker already installed and set to the path');
        const dockerVersion = yield utils.execCommand(docker_path + ' -v');
        core.info(dockerVersion);
        return true;
    });
}
exports.checkDockerInstall = checkDockerInstall;
/**
 * 获取到docker的版本
 * @returns
 */
function getVersion() {
    return __awaiter(this, void 0, void 0, function* () {
        const dockerVersion = yield utils.execCommand('docker -v');
        return parseDockerVersion(dockerVersion);
    });
}
exports.getVersion = getVersion;
/**
 * 从docker 版本字符串中提取出来数字版本，
 * 如 Docker version 20.10.14, build a224086         提取:20.10.14
 *    Docker version 17.09.0-ce, build afdb6d4       提取:17.09.0
 *    Docker version 18.06.1-ce, build e68fc7a 等    提取:18.06.1
 * @param dockerVersion
 * @returns
 */
function parseDockerVersion(dockerVersion) {
    let version = dockerVersion.split(',')[0].split(' ')[2];
    if (version.includes("-")) {
        version = version.substring(0, version.indexOf("-"));
    }
    core.info('docker version ' + version);
    return version;
}
exports.parseDockerVersion = parseDockerVersion;
