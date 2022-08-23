import {expect, test} from '@jest/globals'
import * as dockerHelper from '../src/dockerHelper'
import * as utils from '../src/utils';
import * as io from '@actions/io'
import * as core from '@actions/core';

jest.mock('@actions/io');
jest.mock('@actions/core');

describe('test check docker suitable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("test docker not installed", async() => {
    jest.spyOn(io, 'which').mockReturnValue(Promise.resolve(''));
    expect(await dockerHelper.checkDockerSuitable()).toBe(false);
    expect(core.info).toHaveBeenNthCalledWith(1, 'Docker not installed or not set to the path');
  });

  test("test docker already installed and version is not less than MINIMUM_DOCKER_VERSION(19.03) ", async() => {
    jest.spyOn(io, 'which').mockReturnValue(Promise.resolve('Docker'));
    jest.spyOn(utils, 'execCommand').mockReturnValue(Promise.resolve('Docker version 20.10.14, build a224086'));
    expect(await dockerHelper.checkDockerSuitable()).toBe(true);
    expect(core.info).toHaveBeenNthCalledWith(1, 'docker already installed and set to the path');
    expect(core.info).toHaveBeenNthCalledWith(2, 'Docker version 20.10.14, build a224086');
  });

  test("test docker already installed and version is less than MINIMUM_DOCKER_VERSION(19.03) ", async() => {
    jest.spyOn(io, 'which').mockReturnValue(Promise.resolve('Docker'));
    jest.spyOn(utils, 'execCommand').mockReturnValue(Promise.resolve('Docker version 19.00.14, build a224086'));
    expect(await dockerHelper.checkDockerSuitable()).toBe(false);
    expect(core.info).toHaveBeenNthCalledWith(1, 'docker already installed and set to the path');
    expect(core.info).toHaveBeenNthCalledWith(2, 'Docker version 19.00.14, build a224086');
    expect(core.info).toHaveBeenNthCalledWith(3, 'docker version 19.00.14');
    expect(core.info).toHaveBeenNthCalledWith(4, 'the current installed docker version not suitable for multiplatform build,please install latest docker version');
  });
});

describe('test check docker install', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("test docker not installed", async() => {
    jest.spyOn(io, 'which').mockReturnValue(Promise.resolve(''));
    expect(await dockerHelper.checkDockerInstall()).toBe(false);
    expect(core.info).toHaveBeenNthCalledWith(1, 'Docker not installed or not set to the path');
  })

  test("test docker already installed", async() => {
    jest.spyOn(io, 'which').mockReturnValue(Promise.resolve('Docker'));
    jest.spyOn(utils, 'execCommand').mockReturnValue(Promise.resolve('Docker version 20.10.14, build a224086'));
    expect(await dockerHelper.checkDockerInstall()).toBe(true);
    expect(core.info).toHaveBeenNthCalledWith(1, 'docker already installed and set to the path');
    expect(core.info).toHaveBeenNthCalledWith(2, 'Docker version 20.10.14, build a224086');
  })
});

describe('test get Version', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("test get Version", async() => {
    jest.spyOn(utils, 'execCommand').mockReturnValue(Promise.resolve('Docker version 22.22.22, build a224086'));
    expect(await dockerHelper.getVersion()).toBe('22.22.22');
  })
});


describe('test parse docker version', () => {
    test("test parse docker version like x.y.z", async() => {
      expect(dockerHelper.parseDockerVersion("Docker version 20.10.14, build a224086")).toEqual("20.10.14");
    })
    test("test parse docker version like x.y.z-q", async() => {
      expect(dockerHelper.parseDockerVersion("Docker version 18.06.1-ce, build e68fc7a")).toEqual("18.06.1");
      expect(dockerHelper.parseDockerVersion("Docker version 17.09.0-ce, build afdb6d4")).toEqual("17.09.0");
    })
});
