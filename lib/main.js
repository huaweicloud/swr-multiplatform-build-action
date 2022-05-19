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
exports.run = void 0;
const context = __importStar(require("./context"));
const dockerHelper = __importStar(require("./dockerHelper"));
const buildxHelper = __importStar(require("./buildxHelper"));
const buildHelper = __importStar(require("./buildHelper"));
const utils = __importStar(require("./utils"));
const core = __importStar(require("@actions/core"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const inputs = context.getInputs();
        if (!(yield dockerHelper.checkDockerSuitable())) {
            core.setFailed('check Docker failed');
            return;
        }
        if (!(yield utils.checkInputs(inputs))) {
            core.setFailed('verify input parameter failed');
            return;
        }
        if (!(yield buildxHelper.checkAndInstallDockerBuildx(inputs))) {
            core.setFailed('install or update docker buildx failed');
            return;
        }
        yield utils.execCommand(buildHelper.genInitBildxBootStrap());
        yield utils.execCommand(buildHelper.genDockerBuildCommand(inputs));
        yield utils.execCommand(buildHelper.genBuildxResultCheckCommand());
    });
}
exports.run = run;
run();
