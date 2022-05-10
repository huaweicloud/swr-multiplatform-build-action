import * as utils from '../src/utils'
import {expect, test} from '@jest/globals'
import * as context from '../src/context'

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