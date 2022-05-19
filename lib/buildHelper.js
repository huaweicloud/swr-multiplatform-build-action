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
Object.defineProperty(exports, "__esModule", { value: true });
exports.genBuildxResultCheckCommand = exports.genInitBildxBootStrap = exports.genDockerBuildCommand = void 0;
const context = __importStar(require("./context"));
function genDockerBuildCommand(inputs) {
    let buildCommand = 'docker buildx build';
    if (inputs.platforms) {
        buildCommand += ' --platform ' + inputs.platforms;
    }
    if (inputs.file) {
        buildCommand += ' -f ' + inputs.file;
    }
    buildCommand += ' -t ' + inputs.imagetag;
    if (inputs.push) {
        buildCommand += ' --push';
    }
    buildCommand += ' . ';
    return buildCommand;
}
exports.genDockerBuildCommand = genDockerBuildCommand;
function genInitBildxBootStrap() {
    return context.BUILDX_INIT_COMMAND;
}
exports.genInitBildxBootStrap = genInitBildxBootStrap;
function genBuildxResultCheckCommand() {
    return context.BUILDX_RESULT_COMMAND;
}
exports.genBuildxResultCheckCommand = genBuildxResultCheckCommand;
