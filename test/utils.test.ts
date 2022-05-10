import * as utils from '../src/utils'
import {expect, test} from '@jest/globals'
import * as context from '../src/context'
import * as buildx from '../src/buildxHelper'

test('check os,platform,arch', async() => {
  /**
   * 
   当前系统测试，不能确定平台，先屏蔽
  const osArch = utils.getOSArch();
  const osPlatform = utils.getOSPlatform();
  const osType = utils.getOSType();
  console.log("osArch " + osArch)
  console.log("osPlatform " + osPlatform)
  console.log("osType " + osType)
  console.log(await getDownloadURL(osArch,osPlatform,osType));
  */
})


// * test macos platform download url

test("check MacOS x86-64 platform buildx download", async() => {
  const osArch = "x64";
  const osPlatform = "darwin";
  const osType = "Darwin";
  expect(await getDownloadURL(osArch,osPlatform,osType)).toEqual("https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.darwin-amd64");
})

test("check MacOS arm-64 platform buildx download", async() => {
  const osArch = "arm64";
  const osPlatform = "darwin";
  const osType = "Darwin";
  expect(await getDownloadURL(osArch,osPlatform,osType)).toEqual("https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.darwin-arm64");
})


// * test windows platform download url

test("check windows x86-64 platform buildx download", async() => {
  const osArch = "x64";
  const osPlatform = "win32";
  const osType = "Windows_NT";
  expect(await getDownloadURL(osArch,osPlatform,osType)).toEqual("https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.windows-amd64.exe");
})

test("check windows arm-64 platform buildx download", async() => {
  const osArch = "arm64";
  const osPlatform = "win32";
  const osType = "Windows_NT";
  expect(await getDownloadURL(osArch,osPlatform,osType)).toEqual("https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.windows-arm64.exe");
})


 // test unix platform download url

test("check Linux x86-64 platform buildx download", async() => {
  const osArch = "x64";
  const osPlatform = "linux";
  const osType = "Linux";
  expect(await getDownloadURL(osArch,osPlatform,osType)).toEqual("https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.linux-amd64");
})

test("check Linux arm-64 platform buildx download", async() => {
  const osArch = "arm64";
  const osPlatform = "linux";
  const osType = "Linux";
  expect(await getDownloadURL(osArch,osPlatform,osType)).toEqual("https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.linux-arm64");

})


//test other linux platform

test("check Linux arm-64 platform buildx download", async() => {
  const osArch = "s390x";
  const osPlatform = "linux";
  const osType = "Linux";
  expect(await getDownloadURL(osArch,osPlatform,osType)).toEqual("https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.linux-s390x");

})

test("check Linux arm-64 platform buildx download", async() => {
  const osArch = "ppc64";
  const osPlatform = "linux";
  const osType = "Linux";
  expect(await getDownloadURL(osArch,osPlatform,osType)).toEqual("https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.linux-ppc64le");

})

test("check Linux arm-64 platform buildx download", async() => {
  const osArch = "riscv64";
  const osPlatform = "linux";
  const osType = "Linux";
  expect(await getDownloadURL(osArch,osPlatform,osType)).toEqual("https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.linux-riscv64");

})

test("check Linux arm-64 platform buildx download", async() => {
  const osArch = "arm-v6";
  const osPlatform = "linux";
  const osType = "Linux";
  expect(await getDownloadURL(osArch,osPlatform,osType)).toEqual("https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.linux-arm-v6");

})

test("check Linux arm-64 platform buildx download", async() => {
  const osArch = "arm-v7";
  const osPlatform = "linux";
  const osType = "Linux";
  expect(await getDownloadURL(osArch,osPlatform,osType)).toEqual("https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.linux-arm-v7");

})

async function getDownloadURL(osArch:string,osPlatform:string,osType:string):Promise<string>{
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

test("test get region from swr image url", async() => {
  const swradd1 = "swr.cn-north-4.myhuaweicloud.com/hcloudcli/springbootdemo:9b3d1776f5358a7e0b4562e476fbec629b9baa14";
  expect(utils.getRegionFromEndpoint(swradd1,1,".")).toEqual("cn-north-4");

  const swradd2 = "swr.cn-north-4.myhuaweicloud.com/hcloudcli/springbootdemo:v1.1";
  expect(utils.getRegionFromEndpoint(swradd2,1,".")).toEqual("cn-north-4");

  const swradd3 = "swr.cn-north-2.myhuaweicloud.com/hcloudcli/jdk19:v1.0.0.1";
  expect(utils.getRegionFromEndpoint(swradd3,1,".")).toEqual("cn-north-2");

})

test("test version compare mimetype", async() => {
  const v1:string = "20.10.14"
  const v2:string = "20.10.11"
  expect(utils.compareVersion(v1,v2)).toEqual(context.VersionCompare.High);

  const v3:string = "20.10.14"
  const v4:string = "20.10.14"
  expect(utils.compareVersion(v3,v4)).toEqual(context.VersionCompare.Equre);

  const v5:string = "20.10.14"
  const v6:string = "20.20"
  expect(utils.compareVersion(v5,v6)).toEqual(context.VersionCompare.Low);

})