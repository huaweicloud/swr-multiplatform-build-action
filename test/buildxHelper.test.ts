import * as utils from '../src/utils'
import {expect, test} from '@jest/globals'
import * as buildx from '../src/buildxHelper'

 test('check buildx download', async() => {
    const testDownloadUrl = "https://github.com/huaweicloud/scp-remote-action/archive/refs/tags/v1.0.0.zip";
    const downloadPath = await buildx.getBuildXDownlodPath(testDownloadUrl);
    console.log("downloadPath " + downloadPath);
})

test('check os,platform,arch', async() => {
    const osArch = utils.getOSArch();
    const osPlatform = utils.getOSPlatform();
    const osType = utils.getOSType();
    console.log("osArch " + osArch)
    console.log("osPlatform " + osPlatform)
    console.log("osType " + osType)
    await getDownloadURL(osArch,osPlatform);
  })
  
  
  // test macos platform download url
  
  test("check MacOS x86-64 platform buildx download", async() => {
    const osArch = "x64";
    const osPlatform = "darwin";
 //    const osType = "Darwin";
    expect(await getDownloadURL(osArch,osPlatform)).toEqual("https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.darwin-amd64");
  })
  
  test("check MacOS arm-64 platform buildx download", async() => {
    const osArch = "arm64";
    const osPlatform = "darwin";
 //    const osType = "Darwin";
    expect(await getDownloadURL(osArch,osPlatform)).toEqual("https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.darwin-arm64");
  })
  
  
  // test windows platform download url
  
  test("check windows x86-64 platform buildx download", async() => {
    const osArch = "x64";
    const osPlatform = "win32";
 //    const osType = "Windows_NT";
    expect(await getDownloadURL(osArch,osPlatform)).toEqual("https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.windows-amd64.exe");
  })
  
  test("check windows arm-64 platform buildx download", async() => {
    const osArch = "arm64";
    const osPlatform = "win32";
 //    const osType = "Windows_NT";
    expect(await getDownloadURL(osArch,osPlatform)).toEqual("https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.windows-arm64.exe");
  })
  
  
   // test unix platform download url
  
  test("check Linux x86-64 platform buildx download", async() => {
    const osArch = "x64";
    const osPlatform = "linux";
 //    const osType = "Linux";
    expect(await getDownloadURL(osArch,osPlatform)).toEqual("https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.linux-amd64");
  })
  
  test("check Linux arm-64 platform buildx download", async() => {
    const osArch = "arm64";
    const osPlatform = "linux";
 //    const osType = "Linux";
    expect(await getDownloadURL(osArch,osPlatform)).toEqual("https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.linux-arm64");
  
  })
  
  
  // test other linux platform
  
  test("check Linux arm-64 platform buildx download", async() => {
    const osArch = "s390x";
    const osPlatform = "linux";
 //    const osType = "Linux";
    expect(await getDownloadURL(osArch,osPlatform)).toEqual("https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.linux-s390x");
  
  })
  
  test("check Linux arm-64 platform buildx download", async() => {
    const osArch = "ppc64";
    const osPlatform = "linux";
 //    const osType = "Linux";
    expect(await getDownloadURL(osArch,osPlatform)).toEqual("https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.linux-ppc64le");
  
  })
  
  test("check Linux arm-64 platform buildx download", async() => {
    const osArch = "riscv64";
    const osPlatform = "linux";
 //    const osType = "Linux";
    expect(await getDownloadURL(osArch,osPlatform)).toEqual("https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.linux-riscv64");
  
  })
  
  test("check Linux arm-64 platform buildx download", async() => {
    const osArch = "arm-v6";
    const osPlatform = "linux";
 //    const osType = "Linux";
    expect(await getDownloadURL(osArch,osPlatform)).toEqual("https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.linux-arm-v6");
  
  })
  
  test("check Linux arm-64 platform buildx download", async() => {
    const osArch = "arm-v7";
    const osPlatform = "linux";
  //  const osType = "Linux";
    expect(await getDownloadURL(osArch,osPlatform)).toEqual("https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.linux-arm-v7");
  
  })
  
  async function getDownloadURL(osArch:string,osPlatform:string):Promise<string>{
    const buildxOSArch = utils.getOSArch4Buildx(osPlatform,osArch);
    console.log("buildxOSArch " + buildxOSArch)
  
    const buildxOSPlatform = utils.getOSPlatform4Buildx(osPlatform);
    console.log("buildxOSPlatform " + buildxOSPlatform)
    const buildxTag = "v" + await buildx.getDockerBuildxVersion();
    console.log("buildxVersion " + buildxTag)
  
    const latestBuildxVersion = "v" + await buildx.getLatestBuildxTag();
    console.log("latestBuildxVersion " + latestBuildxVersion)
  
    const buildxDownloadUrl = buildx.getDockerBuildxDownloadUrl(latestBuildxVersion,buildxOSPlatform,buildxOSArch);
    console.log("buildxDownloadUrl " + buildxDownloadUrl)
    return buildxDownloadUrl;
  }
