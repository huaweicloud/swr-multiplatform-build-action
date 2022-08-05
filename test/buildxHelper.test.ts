import * as utils from '../src/utils'
import {expect, test} from '@jest/globals'
import * as buildx from '../src/buildxHelper'

test('check os,platform,arch', async() => {
    const osArch = utils.getOSArch();
    const osPlatform = utils.getOSPlatform();
    await getDownloadURL(osArch,osPlatform);
  })
    
  test("check MacOS x86-64 platform buildx download", async() => {
    const osArch = "x64";
    const osPlatform = "darwin";
    expect(await getDownloadURL(osArch,osPlatform)).toEqual("https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.darwin-amd64");
  })
  
  test("check MacOS arm-64 platform buildx download", async() => {
    const osArch = "arm64";
    const osPlatform = "darwin";
    expect(await getDownloadURL(osArch,osPlatform)).toEqual("https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.darwin-arm64");
  })
  
    
  test("check windows x86-64 platform buildx download", async() => {
    const osArch = "x64";
    const osPlatform = "win32";
    expect(await getDownloadURL(osArch,osPlatform)).toEqual("https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.windows-amd64.exe");
  })
  
  test("check windows arm-64 platform buildx download", async() => {
    const osArch = "arm64";
    const osPlatform = "win32";
    expect(await getDownloadURL(osArch,osPlatform)).toEqual("https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.windows-arm64.exe");
  })
  
  
  
  test("check Linux x86-64 platform buildx download", async() => {
    const osArch = "x64";
    const osPlatform = "linux";
    expect(await getDownloadURL(osArch,osPlatform)).toEqual("https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.linux-amd64");
  })
  
  test("check Linux arm-64 platform buildx download", async() => {
    const osArch = "arm64";
    const osPlatform = "linux";
    expect(await getDownloadURL(osArch,osPlatform)).toEqual("https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.linux-arm64");
  
  })
  
  
  test("check Linux arm-64 platform buildx download", async() => {
    const osArch = "s390x";
    const osPlatform = "linux";
    expect(await getDownloadURL(osArch,osPlatform)).toEqual("https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.linux-s390x");
  
  })
  
  test("check Linux arm-64 platform buildx download", async() => {
    const osArch = "ppc64";
    const osPlatform = "linux";
    expect(await getDownloadURL(osArch,osPlatform)).toEqual("https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.linux-ppc64le");
  
  })
  
  test("check Linux arm-64 platform buildx download", async() => {
    const osArch = "riscv64";
    const osPlatform = "linux";
    expect(await getDownloadURL(osArch,osPlatform)).toEqual("https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.linux-riscv64");
  
  })
  
  test("check Linux arm-64 platform buildx download", async() => {
    const osArch = "arm-v6";
    const osPlatform = "linux";
    expect(await getDownloadURL(osArch,osPlatform)).toEqual("https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.linux-arm-v6");
  
  })
  
  test("check Linux arm-64 platform buildx download", async() => {
    const osArch = "arm-v7";
    const osPlatform = "linux";
    expect(await getDownloadURL(osArch,osPlatform)).toEqual("https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.linux-arm-v7");
  
  })
  
  async function getDownloadURL(osArch:string,osPlatform:string):Promise<string>{
    const buildxOSArch = utils.getOSArch4Buildx(osPlatform,osArch);
  
    const buildxOSPlatform = utils.getOSPlatform4Buildx(osPlatform);
  
    const latestBuildxVersion = "v" + await buildx.getLatestBuildxTag();
  
    const buildxDownloadUrl = buildx.getDockerBuildxDownloadUrl(latestBuildxVersion,buildxOSPlatform,buildxOSArch);
    return buildxDownloadUrl;
  }
