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
exports.parseVersion = exports.getDockerBuildxVersion = exports.isDockerBuildXAvailable = exports.getDockerBuildxDownloadUrl = exports.getLatestBuildxTag = exports.getBuildXDownlodPath = exports.installOrUpdateDockerBuildX = exports.checkBuildxNeedUpdate = exports.checkAndInstallDockerBuildx = void 0;
const exec = __importStar(require("@actions/exec"));
const util = __importStar(require("util"));
const utils = __importStar(require("./utils"));
const core = __importStar(require("@actions/core"));
const toolCache = __importStar(require("@actions/tool-cache"));
const context = __importStar(require("./context"));
const fs = __importStar(require("fs"));
const uuid_1 = require("uuid");
/**
 * 如果docker buildx不存在，或者用户要求使用最新的buildx版本且当前安装版本低于最新版本，则需要安装或者升级docker buildx
 * @returns
 */
function checkAndInstallDockerBuildx(inputs) {
    return __awaiter(this, void 0, void 0, function* () {
        let installOrUpdateBuildx = false;
        if (!(yield isDockerBuildXAvailable())) {
            installOrUpdateBuildx = true;
        }
        if (inputs.uselatestbuildx && (yield checkBuildxNeedUpdate(inputs))) {
            installOrUpdateBuildx = true;
        }
        if (installOrUpdateBuildx) {
            yield installOrUpdateDockerBuildX();
        }
        if (!isDockerBuildXAvailable()) {
            return false;
        }
        return true;
    });
}
exports.checkAndInstallDockerBuildx = checkAndInstallDockerBuildx;
/**
 * 当前安装的版本低于github上发布的最新版本，则需要升级
 * @param inputs
 * @returns
 */
function checkBuildxNeedUpdate(inputs) {
    return __awaiter(this, void 0, void 0, function* () {
        if (inputs.uselatestbuildx) {
            const latestDockerBuildxVersion = (yield getLatestBuildxTag()).replace('v', '');
            const currentVersion = yield getDockerBuildxVersion();
            core.info('current installed docker buildx version: ' +
                currentVersion +
                ',and the latest vesion is ' +
                latestDockerBuildxVersion);
            return (utils.compareVersion(currentVersion, latestDockerBuildxVersion) ===
                -1 /* Low */);
        }
        else {
            return false;
        }
    });
}
exports.checkBuildxNeedUpdate = checkBuildxNeedUpdate;
/**
 * 根据当前平台计算出需要下载的buildx下载地址
 * 完成软件包下载到临时目录
 * 将软件包拷贝到 /usr/local/lib/docker/cli-plugins/docker-buildx
 * 将软件包的权限设置为755
 * 清理临时下载包
 */
function installOrUpdateDockerBuildX() {
    return __awaiter(this, void 0, void 0, function* () {
        const osType = utils.getOSType();
        const osArch = utils.getOSArch();
        const osPlatform = utils.getOSPlatform();
        if (!context.osSupportArchs.includes(osArch) ||
            !context.osSupportTypes.includes(osType) ||
            !context.osSupportPlatforms.includes(osPlatform)) {
            core.info('docker buildx not can not install on this platform or arch');
            return;
        }
        const buildxOSArch = utils.getOSArch4Buildx(osPlatform, osArch);
        const buildxOSPlatform = utils.getOSPlatform4Buildx(osPlatform);
        const buildxTag = yield getLatestBuildxTag();
        const buildxDownloadUrl = getDockerBuildxDownloadUrl(buildxTag, buildxOSPlatform, buildxOSArch);
        const buildxDownloadPath = yield getBuildXDownlodPath(buildxDownloadUrl);
        if (utils.checkParameterIsNull(buildxDownloadPath)) {
            core.info('download docker buildx failed');
            return;
        }
        yield utils.execCommand('sudo mkdir -p ' + context.DOCKER_BUILDX_INSTALL_PATH);
        yield utils.execCommand('sudo cp ' +
            buildxDownloadPath +
            ' ' +
            context.DOCKER_BUILDX_INSTALL_PATH +
            '/' +
            context.DOCKER_BUILDX_INSTALL_NAME);
        yield utils.execCommand('sudo chmod ' +
            context.DOCKER_BUILDX_MOD +
            ' ' +
            context.DOCKER_BUILDX_INSTALL_PATH +
            '/' +
            context.DOCKER_BUILDX_INSTALL_NAME);
        fs.rmSync(buildxDownloadPath);
        core.info('install new buildx version : ' + (yield getDockerBuildxVersion()));
    });
}
exports.installOrUpdateDockerBuildX = installOrUpdateDockerBuildX;
/**
 * 下载最新版本的docker buildx
 * @param buildxDownloadUrl
 * @returns
 */
function getBuildXDownlodPath(buildxDownloadUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const tmpBuildDownloadDir = './temp/buildx';
        const tmpBuildDownloadPath = tmpBuildDownloadDir +
            '/' +
            buildxDownloadUrl.substring(buildxDownloadUrl.lastIndexOf('/') + 1);
        let buildxDownloadPath = '';
        try {
            core.info('download docker buildx for install or update from ' + buildxDownloadUrl);
            buildxDownloadPath = yield toolCache.downloadTool(buildxDownloadUrl, tmpBuildDownloadPath);
        }
        catch (error) {
            core.info('Failed to download docker buildx from ' +
                buildxDownloadUrl +
                ' error info ' +
                error);
        }
        core.info(buildxDownloadPath);
        return buildxDownloadPath;
    });
}
exports.getBuildXDownlodPath = getBuildXDownlodPath;
/**
 * 到docker buildx的release页面获取release版本列表，拿到最新的版本
 * @returns
 */
function getLatestBuildxTag() {
    return __awaiter(this, void 0, void 0, function* () {
        core.info('latest tag api address ' + context.DOCKER_BUILDX_RELEASE_API);
        const tmpTagDownloadDir = './tmp/buildx/buildxtag/' + uuid_1.v4();
        return yield toolCache
            .downloadTool(context.DOCKER_BUILDX_RELEASE_API, tmpTagDownloadDir)
            .then(buildxDownloadPath => {
            core.info('buildxTagTmpDownloadPath ' + buildxDownloadPath);
            const response = JSON.parse(fs
                .readFileSync(buildxDownloadPath, 'utf8')
                .toString()
                .trim());
            if (!response.tag_name) {
                return context.DOCKER_BUILDX_STABLE_TAG;
            }
            core.info('latest buildx tagname ' + response.tag_name);
            return response.tag_name;
        }, error => {
            core.info('error ' + error);
            core.warning(util.format('Failed to read latest buildx verison from %s. Using default stable version %s', context.DOCKER_BUILDX_RELEASE_API, context.DOCKER_BUILDX_STABLE_TAG));
            return context.DOCKER_BUILDX_STABLE_TAG;
        });
    });
}
exports.getLatestBuildxTag = getLatestBuildxTag;
/**
 * 根据传入的参数，构造buildx下载链接
 * @param buildTag
 * @param osPlatform
 * @param osArch
 * @returns
 */
function getDockerBuildxDownloadUrl(buildTag, osPlatform, osArch) {
    const buildxDownloadUrl = util.format(context.DOCKER_BUILDX_RELEASE_DOWNLOAD_URL, buildTag, buildTag, osPlatform, osArch);
    core.info('download buildx version : ' +
        buildTag +
        ' for current ' +
        osArch +
        ' platform ' +
        osPlatform +
        ',download url ' +
        buildxDownloadUrl);
    return buildxDownloadUrl;
}
exports.getDockerBuildxDownloadUrl = getDockerBuildxDownloadUrl;
/**
 * 检查当前系统上是否安装了 docker buildx工具
 * @returns
 */
function isDockerBuildXAvailable() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exec
            .getExecOutput('docker', ['buildx'], {
            ignoreReturnCode: true,
            silent: true
        })
            .then(result => {
            if (utils.checkParameterIsNull(result.stderr) && result.exitCode !== 0) {
                core.info('docker buildx not install');
                return false;
            }
            return result.exitCode === 0;
        });
    });
}
exports.isDockerBuildXAvailable = isDockerBuildXAvailable;
/**
 * 获取当前安装的buildx版本
 * @returns
 */
function getDockerBuildxVersion() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exec
            .getExecOutput('docker', ['buildx', 'version'], {
            ignoreReturnCode: true,
            silent: true
        })
            .then(result => {
            if (result.stderr.length > 0 && result.exitCode !== 0) {
                throw new Error(result.stderr.trim());
            }
            return parseVersion(result.stdout.trim());
        });
    });
}
exports.getDockerBuildxVersion = getDockerBuildxVersion;
/**
 * 解析当前 buildx version串中的buildx版本号
 * 如 github.com/docker/buildx v0.8.2 6224def4dd2c3d347eee19db595348c50d7cb491 提取出 0.8.2
 * @param buildxVersion
 * @returns
 */
function parseVersion(buildxVersion) {
    const matches = /\sv?([0-9a-f]{7}|[0-9.]+)/.exec(buildxVersion);
    if (!matches) {
        throw new Error('fail to parse docker buildx version');
    }
    return matches[1];
}
exports.parseVersion = parseVersion;
