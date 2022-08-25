import * as utils from '../src/utils';
import {expect, test} from '@jest/globals';
import * as cp from 'child_process';
import * as core from '@actions/core';
import * as os from 'os';
import * as fs from 'fs-extra';
import {Stats} from 'fs-extra';

jest.mock('child_process');
jest.mock('os');
jest.mock('fs-extra');
jest.mock('@actions/core');

describe('check inputs', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const testCase = [
        {
            description: 'imagetag is null',
            inputs: {
                imagetag: '',
                platforms: '',
                uselatestbuildx: true,
                push: true,
                file: ''
            },
            result: false
        },
        {
            description: 'region from endpoint does not support',
            inputs: {
                imagetag: 'swr.cn-north-a',
                platforms: '',
                uselatestbuildx: true,
                push: true,
                file: ''
            },
            result: false
        },
        {
            description: 'region from endpoint does not support',
            inputs: {
                imagetag: 'swr.cn-north-4',
                platforms: 'linux/amd64',
                uselatestbuildx: true,
                push: true,
                file: ''
            },
            result: false
        }
    ];
    testCase.forEach(item => {
        const {description, inputs, result} = item;
        test(`${description}`, async () => {
            expect(await utils.checkInputs(inputs)).toBe(result);
        });
    });
});

describe('check whether platform support', () => {
    const testCase = [
        {description: '输入单个支持的平台', platforms: 'linux/amd64', result: true},
        {
            description: '输入单个不支持的平台',
            platforms: 'alinux/amd64',
            result: false
        },
        {
            description: '输入多个支持的平台',
            platforms: 'linux/amd64,darwin/amd64',
            result: true
        },
        {
            description: '输入多个存在不支持的平台',
            platforms: 'linux/amd64,ssdarwin/amd64',
            result: false
        }
    ];
    testCase.forEach(item => {
        const {description, platforms, result} = item;
        test(`${description}`, () => {
            expect(utils.checkPlatformSupport(platforms)).toBe(result);
        });
    });
});

describe('test dockerfile exist', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('test dockerfile exist when  is file and szie > 0', () => {
        jest.spyOn(fs, 'statSync').mockReturnValue({isFile: () => true, size: 1} as Stats);
        expect(utils.checkDockerfileExist('')).toBe(true);
    });
    test('test dockerfile exist when is file and size <= 0', () => {
        jest.spyOn(fs, 'statSync').mockReturnValue({isFile: () => true, size: 0} as Stats);
        expect(utils.checkDockerfileExist('')).toBe(false);
    });
    test('test dockerfile exist when is not file', () => {
        jest.spyOn(fs, 'statSync').mockReturnValue({isFile: () => false, size: 0} as Stats);
        expect(utils.checkDockerfileExist('')).toBe(false);
    });
    test('test dockerfile exist when file does not exist', () => {
        jest.spyOn(fs, 'statSync').mockImplementation(() => {
            throw new Error('Server Error.');
        });
        expect(utils.checkDockerfileExist('')).toBe(false);
        expect(core.setFailed).toHaveBeenNthCalledWith(
            1,
            'Get information about the given file failed.'
        );
    });
});

describe('test parameter is null', () => {
    const testCase = [
        {description: '字符为空', str: '', result: true},
        {description: '字符为空格', str: '  ', result: true}
    ];
    testCase.forEach(item => {
        const {description, str, result} = item;
        test(`${description}`, () => {
            expect(utils.checkParameterIsNull(str)).toBe(result);
        });
    });
});

describe('test get region from endpoint', () => {
    test('test get region from endpoint when region is cn-north-4', () => {
        expect(
            utils.getRegionFromEndpoint('swr.cn-north-4.xxx/hcloudcli/jdk19:v1.0.0.1', 1, '.')
        ).toEqual('cn-north-4');
    });
});

describe('test get OS type', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test('mock os type ', () => {
        jest.spyOn(os, 'type').mockReturnValue('x64');
        expect(utils.getOSType()).toBe('x64');
        expect(core.info).toHaveBeenNthCalledWith(1, 'Current system type is x64');
    });
});

describe('test get OS arch', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test('mock os arch ', () => {
        jest.spyOn(os, 'arch').mockReturnValue('x64');
        expect(utils.getOSArch()).toBe('x64');
        expect(core.info).toHaveBeenNthCalledWith(1, 'Current system arch is x64');
    });
});

describe('test get OS platform', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test('mock os platform ', () => {
        jest.spyOn(os, 'platform').mockReturnValue('linux');
        expect(utils.getOSPlatform()).toBe('linux');
        expect(core.info).toHaveBeenNthCalledWith(1, 'Current system platform is linux');
    });
});

describe('test get OSArch buildx', () => {
    const testCase = [
        {
            description: 'test get OSArch buildx when platform is linux and  OSArch is x64',
            osPlatform: 'linux',
            osArch: 'x64',
            result: 'amd64'
        },
        {
            description: 'test get OSArch buildx when platform is darwin and  OSArch is x64',
            osPlatform: 'darwin',
            osArch: 'x64',
            result: 'amd64'
        },
        {
            description: 'test get OSArch buildx when platform is linux and  OSArch is arm64',
            osPlatform: 'linux',
            osArch: 'arm64',
            result: 'arm64'
        },
        {
            description: 'test get OSArch buildx when platform is darwin and  OSArch is arm64',
            osPlatform: 'darwin',
            osArch: 'arm64',
            result: 'arm64'
        },
        {
            description: 'test get OSArch buildx when platform is win32 and  OSArch is x64',
            osPlatform: 'win32',
            osArch: 'x64',
            result: 'amd64.exe'
        },
        {
            description: 'test get OSArch buildx when platform is win32 and  OSArch is arm64',
            osPlatform: 'win32',
            osArch: 'arm64',
            result: 'arm64.exe'
        },
        {
            description: 'test get OSArch buildx when OSArch is ppc64',
            osPlatform: 'darwin',
            osArch: 'ppc64',
            result: 'ppc64le'
        }
    ];
    testCase.forEach(item => {
        const {description, osPlatform, osArch, result} = item;
        test(`${description}`, () => {
            expect(utils.getOSArch4Buildx(osPlatform, osArch)).toBe(result);
        });
    });
});

describe('test get OS platform buildx', () => {
    const testCase = [
        {
            description: 'test get OS platform buildx when platform is win32 ',
            osPlatform: 'win32',
            result: 'windows'
        },
        {
            description: 'test get OS platform buildx when platform is linux ',
            osPlatform: 'linux',
            result: 'linux'
        },
        {
            description: 'test get OS platform buildx when platform is darwin ',
            osPlatform: 'darwin',
            result: 'darwin'
        }
    ];
    testCase.forEach(item => {
        const {description, osPlatform, result} = item;
        test(`${description}`, () => {
            expect(utils.getOSPlatform4Buildx(osPlatform)).toBe(result);
        });
    });
});

describe('test compare version', () => {
    const testCase = [
        {
            description: 'version1 > version2',
            version1: '20.10.14',
            version2: '20.10.11',
            result: 1
        },
        {
            description: 'version1 = version2',
            version1: '20.10.14',
            version2: '20.10.14',
            result: 0
        },
        {
            description: 'version1 = version2',
            version1: '20.10.11',
            version2: '20.10.14',
            result: -1
        },
        {
            description: 'version1 < version2 and version1 lacks revison',
            version1: '20.10',
            version2: '20.10.14',
            result: -1
        },
        {
            description: 'version1 > version2 and version2 lacks revison',
            version1: '20.10.14',
            version2: '20.10',
            result: 1
        }
    ];
    testCase.forEach(item => {
        const {description, version1, version2, result} = item;
        test(`${description}`, () => {
            expect(utils.compareVersion(version1, version2)).toBe(result);
        });
    });
});

describe('test exec command', () => {
    test('mock execSync', async () => {
        jest.spyOn(cp, 'execSync').mockReturnValue('This is a test message.');
        expect(await utils.execCommand('test')).toBe('This is a test message.');
        expect(core.info).toHaveBeenNthCalledWith(1, 'This is a test message.');
    });
    test('mock execSync return null', async () => {
        jest.spyOn(cp, 'execSync').mockReturnValue('');
        expect(await utils.execCommand('test')).toBe('');
        expect(core.info).toHaveBeenNthCalledWith(1, '');
    });
});

describe('test remove blank string', () => {
    const testCase = [
        {description: '字符包含空格', str: 'test test', result: 'testtest'},
        {description: '字符包含制表符', str: 'test\ttest', result: 'testtest'},
        {description: '字符包含换行符', str: 'test\ntest', result: 'testtest'},
        {description: '字符包含换页符', str: 'test\ftest', result: 'testtest'}
    ];
    testCase.forEach(item => {
        const {description, str, result} = item;
        test(`${description}`, () => {
            expect(utils.removeBlankString(str)).toBe(result);
        });
    });
});
