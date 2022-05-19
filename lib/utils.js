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
exports.execCommand = exports.compareVersion = exports.getOSPlatform4Buildx = exports.getOSArch4Buildx = exports.getOSPlatform = exports.getOSArch = exports.getOSType = exports.getRegionFromEndpoint = exports.checkParameterIsNull = exports.checkDockerfileExist = exports.checkPlatformSupport = exports.checkInputs = void 0;
const core = __importStar(require("@actions/core"));
const context = __importStar(require("./context"));
const os = __importStar(require("os"));
const cp = __importStar(require("child_process"));
const fs = __importStar(require("fs-extra"));
/**
 * 检查输入的各参数是否正常
 * @param inputs
 * @returns
 */
function checkInputs(inputs) {
    return __awaiter(this, void 0, void 0, function* () {
        let checkResult = true;
        if (checkParameterIsNull(inputs.imagetag)) {
            core.info('parameter imagetag is required');
            checkResult = false;
        }
        if (inputs.imagetag.startsWith('swr')) {
            const region = getRegionFromEndpoint(inputs.imagetag, 1, '.');
            if (!context.regionArray.includes(region)) {
                core.info('SWR not support in this region: ' + region);
                checkResult = false;
            }
        }
        if (inputs.platforms) {
            checkResult = checkPlatformSupport(inputs.platforms);
        }
        if (!inputs.file) {
            inputs.file = 'Dockerfile';
        }
        if (!checkDockerfileExist(inputs.file)) {
            core.info('Dockerfile not exit or file content is empty');
            checkResult = false;
        }
        return checkResult;
    });
}
exports.checkInputs = checkInputs;
/**
 * 检查用户配置的 platforms参数是否在支持的范围之内
 * @param platforms
 * @returns
 */
function checkPlatformSupport(platforms) {
    let isPlatformSupport = true;
    if (!platforms.includes(',')) {
        return context.dockerSupportPlatforms.includes(platforms);
    }
    const platformsArray = platforms.split(',');
    for (let i = 0; i < platformsArray.length; i++) {
        if (!context.dockerSupportPlatforms.includes(platformsArray[i])) {
            core.info('SWR not support platform ' + platformsArray[i]);
            isPlatformSupport = false;
        }
    }
    return isPlatformSupport;
}
exports.checkPlatformSupport = checkPlatformSupport;
/**
 * 检查文件是否存在，内容是否为空
 * @param file
 * @returns
 */
function checkDockerfileExist(file) {
    core.info('check local file ' + file + ' exist');
    try {
        const stat = fs.statSync(file);
        console.log(stat);
        if (stat.isFile() && stat.size > 0) {
            return true;
        }
        else {
            return false;
        }
    }
    catch (error) {
        console.log(error);
        return false;
    }
}
exports.checkDockerfileExist = checkDockerfileExist;
/**
 * 判断字符串是否为空
 * @param parameter
 * @returns
 */
function checkParameterIsNull(parameter) {
    return (parameter === undefined ||
        parameter === null ||
        parameter === '' ||
        parameter.trim().length == 0);
}
exports.checkParameterIsNull = checkParameterIsNull;
/**
 * 从指定的url中分离出region信息
 * @param url
 * @param index
 * @param regix
 * @returns
 */
function getRegionFromEndpoint(url, index, regix) {
    let region = '';
    const urlArray = url.split(regix);
    if (urlArray.length >= index + 1) {
        region = urlArray[index];
    }
    core.info('get currentRegion : ' + region);
    return region;
}
exports.getRegionFromEndpoint = getRegionFromEndpoint;
/**
 * 获取操作系统类型
 * @returns
 */
function getOSType() {
    const osType = os.type();
    core.info('Current system type is ' + osType);
    return osType;
}
exports.getOSType = getOSType;
function getOSArch() {
    const osArch = os.arch();
    core.info('Current system arch is ' + osArch);
    return osArch;
}
exports.getOSArch = getOSArch;
function getOSPlatform() {
    const osPlatform = os.platform();
    core.info('Current system platform is ' + osPlatform);
    return osPlatform;
}
exports.getOSPlatform = getOSPlatform;
function getOSArch4Buildx(osPlatform, osArch) {
    if ((osPlatform === 'linux' || osPlatform === 'darwin') && osArch === 'x64') {
        osArch = 'amd64';
    }
    if ((osPlatform === 'linux' || osPlatform === 'darwin') &&
        osArch === 'arm64') {
        osArch = 'arm64';
    }
    if (osPlatform === 'win32' && osArch === 'x64') {
        osArch = 'amd64.exe';
    }
    if (osPlatform === 'win32' && osArch === 'arm64') {
        osArch = 'arm64.exe';
    }
    if (osArch === 'ppc64') {
        osArch = 'ppc64le';
    }
    core.info('Current system arch is ' + osArch);
    return osArch;
}
exports.getOSArch4Buildx = getOSArch4Buildx;
function getOSPlatform4Buildx(osPlatform) {
    return osPlatform === 'win32' ? 'windows' : osPlatform;
}
exports.getOSPlatform4Buildx = getOSPlatform4Buildx;
/**
 * Docker version 20.10.14, build a224086
 * docker 版本为 20.10.14，x.y.z格式
 * @param {string} version1
 * @param {string} version2
 * @return {number}
 */
function compareVersion(version1, version2) {
    const [v1, v2] = [version1.split('.'), version2.split('.')];
    const len = Math.max(v1.length, v2.length);
    for (let i = 0; i < len; i++) {
        const num1 = v1[i] ? parseInt(v1[i]) : 0;
        const num2 = v2[i] ? parseInt(v2[i]) : 0;
        if (num1 > num2) {
            return 1 /* High */;
        }
        else if (num1 < num2) {
            return -1 /* Low */;
        }
    }
    return 0 /* Equre */;
}
exports.compareVersion = compareVersion;
/**
 * 执行传入的命令，返回执行结果
 * @param command
 */
function execCommand(command) {
    return __awaiter(this, void 0, void 0, function* () {
        const execCommandResult = yield (cp.execSync(command) || '').toString();
        core.info(execCommandResult);
        return execCommandResult;
    });
}
exports.execCommand = execCommand;
