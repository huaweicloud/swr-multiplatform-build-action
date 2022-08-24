import * as utils from '../src/utils'
import {expect, test} from '@jest/globals'
import * as buildx from '../src/buildxHelper'
import * as exec from '@actions/exec'
import * as core from '@actions/core';
import * as toolCache from '@actions/tool-cache'
import * as fs from 'fs-extra'

// test('check os,platform,arch', async() => {
//     const osArch = utils.getOSArch();
//     const osPlatform = utils.getOSPlatform();
//     await getDownloadURL(osArch,osPlatform);
//   })
    
//   test("check MacOS x86-64 platform buildx download", async() => {
//     const osArch = "x64";
//     const osPlatform = "darwin";
//     expect(await getDownloadURL(osArch,osPlatform)).toEqual("https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.darwin-amd64");
//   })
  
//   test("check MacOS arm-64 platform buildx download", async() => {
//     const osArch = "arm64";
//     const osPlatform = "darwin";
//     expect(await getDownloadURL(osArch,osPlatform)).toEqual("https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.darwin-arm64");
//   })
  
    
//   test("check windows x86-64 platform buildx download", async() => {
//     const osArch = "x64";
//     const osPlatform = "win32";
//     expect(await getDownloadURL(osArch,osPlatform)).toEqual("https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.windows-amd64.exe");
//   })
  
//   test("check windows arm-64 platform buildx download", async() => {
//     const osArch = "arm64";
//     const osPlatform = "win32";
//     expect(await getDownloadURL(osArch,osPlatform)).toEqual("https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.windows-arm64.exe");
//   })
  
  
  
//   test("check Linux x86-64 platform buildx download", async() => {
//     const osArch = "x64";
//     const osPlatform = "linux";
//     expect(await getDownloadURL(osArch,osPlatform)).toEqual("https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.linux-amd64");
//   })
  
//   test("check Linux arm-64 platform buildx download", async() => {
//     const osArch = "arm64";
//     const osPlatform = "linux";
//     expect(await getDownloadURL(osArch,osPlatform)).toEqual("https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.linux-arm64");
  
//   })
  
  
//   test("check Linux arm-64 platform buildx download", async() => {
//     const osArch = "s390x";
//     const osPlatform = "linux";
//     expect(await getDownloadURL(osArch,osPlatform)).toEqual("https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.linux-s390x");
  
//   })
  
//   test("check Linux arm-64 platform buildx download", async() => {
//     const osArch = "ppc64";
//     const osPlatform = "linux";
//     expect(await getDownloadURL(osArch,osPlatform)).toEqual("https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.linux-ppc64le");
  
//   })
  
//   test("check Linux arm-64 platform buildx download", async() => {
//     const osArch = "riscv64";
//     const osPlatform = "linux";
//     expect(await getDownloadURL(osArch,osPlatform)).toEqual("https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.linux-riscv64");
  
//   })
  
//   test("check Linux arm-64 platform buildx download", async() => {
//     const osArch = "arm-v6";
//     const osPlatform = "linux";
//     expect(await getDownloadURL(osArch,osPlatform)).toEqual("https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.linux-arm-v6");
  
//   })


jest.mock('@actions/exec');
jest.mock('@actions/core');
jest.mock('@actions/tool-cache');
jest.mock('fs-extra');

describe('check buildx need update', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('check buildx need update when uselatestbuildx is false', async () => {
    const inputs = {imagetag: '', platforms: '', uselatestbuildx: false, push: true, file: ''};
    expect(await buildx.checkBuildxNeedUpdate(inputs)).toBe(false);
  });

  test('check buildx need update when uselatestbuildx is true and compare version is low', async () => {
    jest.spyOn(toolCache, 'downloadTool').mockReturnValue( Promise.resolve('\{\n "tag_name": "v0.9.1",\n"target_commitish": "master",\n"name": "v0.9.1"\n}'));
    jest.spyOn(fs, 'readFileSync').mockReturnValue('\{\n "tag_name": "v0.9.1",\n"target_commitish": "master",\n"name": "v0.9.1"\n}');
    jest.spyOn(exec, 'getExecOutput').mockReturnValue( Promise.resolve(
      {exitCode: 0, stdout: 'github.com/docker/buildx v0.8.2 6224def4dd2c3d347eee19db595348c50d7cb491', stderr: ''}
    ));
    const inputs = {imagetag: '', platforms: '', uselatestbuildx: true, push: true, file: ''};
    expect(await buildx.checkBuildxNeedUpdate(inputs)).toBe(true);
  });


});

describe('test install or update docker buildx', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('check install or update docker buildx when os type is not support', async () => {
    jest.spyOn(utils, 'getOSType').mockReturnValue('Windows_NT');
    jest.spyOn(utils, 'getOSArch').mockReturnValue('Linux');
    jest.spyOn(utils, 'getOSPlatform').mockReturnValue('linux');
    await buildx.installOrUpdateDockerBuildX();
    expect(core.info).toHaveBeenNthCalledWith(1, 'docker buildx not can not install on this platform or arch');
  });

  test('check install or update docker buildx when os arch is not support', async () => {
    jest.spyOn(utils, 'getOSType').mockReturnValue('Linux');
    jest.spyOn(utils, 'getOSArch').mockReturnValue('x86');
    jest.spyOn(utils, 'getOSPlatform').mockReturnValue('linux');
    await buildx.installOrUpdateDockerBuildX();
    expect(core.info).toHaveBeenNthCalledWith(1, 'docker buildx not can not install on this platform or arch');
  });

  test('check install or update docker buildx when os platform is not support', async () => {
    jest.spyOn(utils, 'getOSType').mockReturnValue('Linux');
    jest.spyOn(utils, 'getOSArch').mockReturnValue('amd64');
    jest.spyOn(utils, 'getOSPlatform').mockReturnValue('win32');
    await buildx.installOrUpdateDockerBuildX();
    expect(core.info).toHaveBeenNthCalledWith(1, 'docker buildx not can not install on this platform or arch');
  });
  
  test('check install or update docker buildx when download docker buildx failed', async () => {
    jest.spyOn(utils, 'getOSType').mockReturnValue('Linux');
    jest.spyOn(utils, 'getOSArch').mockReturnValue('amd64');
    jest.spyOn(utils, 'getOSPlatform').mockReturnValue('linux');
    jest.spyOn(utils, 'getOSArch4Buildx').mockReturnValue('amd64');
    jest.spyOn(utils, 'getOSPlatform4Buildx').mockReturnValue('linux');
    jest.spyOn(toolCache, 'downloadTool')
      .mockReturnValue(Promise.resolve('\{\n "tag_name": "v0.9.1",\n"target_commitish": "master",\n"name": "v0.9.1"\n}'))
      .mockReturnValue(Promise.resolve(''));
    jest.spyOn(fs, 'readFileSync').mockReturnValue('\{\n "tag_name": "v0.9.1",\n"target_commitish": "master",\n"name": "v0.9.1"\n}');
    await buildx.installOrUpdateDockerBuildX();
    expect(core.info).toHaveBeenNthCalledWith(7, 'download docker buildx failed');
  });

  test('check install or update docker buildx when download docker buildx success', async () => {
    jest.spyOn(utils, 'getOSType').mockReturnValue('Linux');
    jest.spyOn(utils, 'getOSArch').mockReturnValue('amd64');
    jest.spyOn(utils, 'getOSPlatform').mockReturnValue('linux');
    jest.spyOn(utils, 'getOSArch4Buildx').mockReturnValue('amd64');
    jest.spyOn(utils, 'getOSPlatform4Buildx').mockReturnValue('linux');
    jest.spyOn(toolCache, 'downloadTool')
      .mockReturnValue(Promise.resolve('\{\n "tag_name": "v0.9.1",\n"target_commitish": "master",\n"name": "v0.9.1"\n}'))
      .mockReturnValue(Promise.resolve('/temp/buildx/v0.9.1'));
    jest.spyOn(fs, 'readFileSync').mockReturnValue('\{\n "tag_name": "v0.9.1",\n"target_commitish": "master",\n"name": "v0.9.1"\n}');
    jest.spyOn(utils, 'execCommand').mockReturnValue(Promise.resolve(''));
    jest.spyOn(fs, 'rmSync');
    jest.spyOn(exec, 'getExecOutput').mockReturnValue( Promise.resolve(
      {exitCode: 0, stdout: 'github.com/docker/buildx v0.9.1 6224def4dd2c3d347eee19db595348c50d7cb491', stderr: ''}
    ));
    await buildx.installOrUpdateDockerBuildX();
    expect(fs.rmSync).toHaveBeenCalledTimes(1);
  });
});

describe('test get buildx download path', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('check get buildx download path', async () => {
    jest.spyOn(toolCache, 'downloadTool').mockReturnValue(Promise.resolve('/temp/buildx/v0.9.1'));
    expect(await buildx.getBuildXDownlodPath('https://xxx.xxx.xxx/v0.9.1/buildx-v0.9.1.linux-amd64')).toBe('/temp/buildx/v0.9.1');
    expect(core.info).toHaveBeenNthCalledWith(1, 'download docker buildx for install or update from https://xxx.xxx.xxx/v0.9.1/buildx-v0.9.1.linux-amd64');
    expect(core.info).toHaveBeenNthCalledWith(2, '/temp/buildx/v0.9.1');
  });

  test('check get buildx download path when throw error', async () => {
    jest.spyOn(toolCache, 'downloadTool').mockImplementation(() => {
      throw new Error('Server Error.');
    });
    expect(await buildx.getBuildXDownlodPath('https://xxx.xxx.xxx/v0.9.1/buildx-v0.9.1.linux-amd64')).toBe('');
    expect(core.info).toHaveBeenNthCalledWith(1, 'download docker buildx for install or update from https://xxx.xxx.xxx/v0.9.1/buildx-v0.9.1.linux-amd64');
    expect(core.info).toHaveBeenNthCalledWith(2, 'Failed to download docker buildx from https://xxx.xxx.xxx/v0.9.1/buildx-v0.9.1.linux-amd64 error info Error: Server Error.');
    expect(core.info).toHaveBeenNthCalledWith(3, '');
  });
  
});

describe('test get latest buildx tag', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('check get latest buildx tag', async () => {
    jest.spyOn(toolCache, 'downloadTool').mockReturnValue( Promise.resolve('\{\n "tag_name": "v0.9.1",\n"target_commitish": "master",\n"name": "v0.9.1"\n}'));
    jest.spyOn(fs, 'readFileSync').mockReturnValue('\{\n "tag_name": "v0.9.1",\n"target_commitish": "master",\n"name": "v0.9.1"\n}');
    expect(await buildx.getLatestBuildxTag()).toBe('v0.9.1');
    expect(core.info).toHaveBeenNthCalledWith(3, 'latest buildx tagname v0.9.1');
  });

  test('check get latest buildx tag when tag_name does not exist', async () => {
    jest.spyOn(toolCache, 'downloadTool').mockReturnValue( Promise.resolve('\{\n "tag_name": "v0.9.1",\n"target_commitish": "master",\n"name": "v0.9.1"\n}'));
    jest.spyOn(fs, 'readFileSync').mockReturnValue('\{\n"target_commitish": "master",\n"name": "v0.9.1"\n}');
    expect(await buildx.getLatestBuildxTag()).toBe('v0.8.2');
  });
  
});

describe('test get docker buildx download url', () => {
  test('test get docker buildx download url', async () => {
    const buildTag = 'v0.9.1';
    const osPlatform = 'linux';
    const osArch = 'amd64';
    const result = 'https://github.com/docker/buildx/releases/download/v0.9.1/buildx-v0.9.1.linux-amd64'
    expect(buildx.getDockerBuildxDownloadUrl(buildTag, osPlatform, osArch)).toBe(result);
    expect(core.info).toHaveBeenNthCalledWith(1, `download buildx version : v0.9.1 for current amd64 platform linux,download url ${result}`);
  });
});

describe('test is docker buildx available', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('check is docker buildx available when docker buildx has been installed', async () => {
    jest.spyOn(exec, 'getExecOutput').mockReturnValue( Promise.resolve(
      {exitCode: 0, stdout: '', stderr: ''}
    ));
    expect(await buildx.isDockerBuildXAvailable()).toBe(true);
  });
  
  test('check is docker buildx available when docker buildx is not installed', async () => {
    jest.spyOn(exec, 'getExecOutput').mockReturnValue( Promise.resolve(
      {exitCode: -1, stdout: '', stderr: ''}
    ));
    expect(await buildx.isDockerBuildXAvailable()).toBe(false);
    expect(core.info).toHaveBeenNthCalledWith(1, 'docker buildx not install');
  });
});

describe('test get docker buildx version', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('check get docker buildx version', async () => {
    jest.spyOn(exec, 'getExecOutput').mockReturnValue( Promise.resolve(
      {exitCode: 0, stdout: 'github.com/docker/buildx v0.8.2 6224def4dd2c3d347eee19db595348c50d7cb491', stderr: ''}
    ));
    expect(await buildx.getDockerBuildxVersion()).toBe('0.8.2');
  });
  
  test('check get docker buildx version when throw error', async () => {
    jest.spyOn(exec, 'getExecOutput').mockReturnValue( Promise.resolve(
      {exitCode: -1, stdout: '', stderr: 'Command Error '}
    ));
    expect(() => buildx.getDockerBuildxVersion()).rejects.toEqual(new Error('Command Error'));
  });
});


describe('test parse version', () => {
  const testCase = [
      { description: 'buildx like x.y.z', buildxVersion: 'github.com/docker/buildx v0.8.2 6224def4dd2c3d347eee19db595348c50d7cb491', result: '0.8.2' },
      { description: 'buildx like xyz', buildxVersion: 'github.com/docker/buildx vabc1234 6224def4dd2c3d347eee19db595348c50d7cb491', result: 'abc1234' },
  ];
  testCase.forEach((item) => {
      const { description, buildxVersion, result } = item;
      test(`${description}`, () => {
          expect(buildx.parseVersion(buildxVersion)).toBe(result);
      });
  });

  test("test parse version when throw error", async() => {
    expect(() => buildx.parseVersion('6224def4dd2c3d347eee19db595348c50d7cb491')).toThrow('fail to parse docker buildx version');
  });
});