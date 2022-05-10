import {expect, test} from '@jest/globals'
import * as dockerHelper from '../src/dockerHelper'

 test('check docker install download', async() => {
    expect(await dockerHelper.parseDockerVersion("Docker version 20.10.14, build a224086")).toEqual("20.10.14");

    expect(await dockerHelper.getVersion()).toEqual("20.10.14");

    expect(await dockerHelper.checkDockerInstall()).toEqual(true);

    expect(await dockerHelper.checkDockerSuitable()).toEqual(true);
})

test("test get Docker Version", async() => {
    expect(dockerHelper.parseDockerVersion("Docker version 18.06.1-ce, build e68fc7a")).toEqual("18.06.1");

    expect(dockerHelper.parseDockerVersion("Docker version 17.09.0-ce, build afdb6d4")).toEqual("17.09.0");

    expect(dockerHelper.parseDockerVersion("Docker version 20.10.14, build a224086")).toEqual("20.10.14");
  })