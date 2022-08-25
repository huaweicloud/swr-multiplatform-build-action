import * as main from '../src/main';

import * as utils from '../src/utils';
import * as context from '../src/context';
import * as dockerHelper from '../src/dockerHelper';
import * as buildxHelper from '../src/buildxHelper';
import * as buildHelper from '../src/buildHelper';
import * as core from '@actions/core';

jest.mock('../src/context');
jest.mock('../src/dockerHelper');
jest.mock('@actions/core');

test('check docker suitable failed', async () => {
    jest.spyOn(dockerHelper, 'checkDockerSuitable').mockReturnValue(Promise.resolve(false));
    jest.spyOn(utils, 'checkInputs').mockReturnValue(Promise.resolve(false));
    jest.spyOn(buildxHelper, 'checkAndInstallDockerBuildx').mockReturnValue(Promise.resolve(false));
    jest.spyOn(utils, 'execCommand').mockReturnValue(Promise.resolve(''));
    jest.spyOn(buildHelper, 'genInitBildxBootStrap').mockReturnValue('');
    jest.spyOn(buildHelper, 'genDockerBuildCommand').mockReturnValue('');
    jest.spyOn(buildHelper, 'genBuildxResultCheckCommand').mockReturnValue('');

    await main.run();
    expect(context.getInputs).toHaveBeenCalledTimes(1);
    expect(core.setFailed).toHaveBeenNthCalledWith(1, 'check Docker failed');
    expect(utils.checkInputs).not.toHaveBeenCalled();
    expect(buildxHelper.checkAndInstallDockerBuildx).not.toHaveBeenCalled();
    expect(utils.execCommand).not.toHaveBeenCalled();
    expect(buildHelper.genInitBildxBootStrap).not.toHaveBeenCalled();
    expect(buildHelper.genDockerBuildCommand).not.toHaveBeenCalled();
    expect(buildHelper.genBuildxResultCheckCommand).not.toHaveBeenCalled();
});

test('check inputs failed', async () => {
    jest.spyOn(dockerHelper, 'checkDockerSuitable').mockReturnValue(Promise.resolve(true));
    jest.spyOn(utils, 'checkInputs').mockReturnValue(Promise.resolve(false));
    jest.spyOn(buildxHelper, 'checkAndInstallDockerBuildx').mockReturnValue(Promise.resolve(false));
    jest.spyOn(utils, 'execCommand').mockReturnValue(Promise.resolve(''));
    jest.spyOn(buildHelper, 'genInitBildxBootStrap').mockReturnValue('');
    jest.spyOn(buildHelper, 'genDockerBuildCommand').mockReturnValue('');
    jest.spyOn(buildHelper, 'genBuildxResultCheckCommand').mockReturnValue('');

    await main.run();
    expect(context.getInputs).toHaveBeenCalledTimes(1);
    expect(dockerHelper.checkDockerSuitable).toHaveBeenCalledTimes(1);
    expect(utils.checkInputs).toHaveBeenCalledTimes(1);
    expect(core.setFailed).toHaveBeenNthCalledWith(1, 'verify input parameter failed');
    expect(buildxHelper.checkAndInstallDockerBuildx).not.toHaveBeenCalled();
    expect(utils.execCommand).not.toHaveBeenCalled();
    expect(buildHelper.genInitBildxBootStrap).not.toHaveBeenCalled();
    expect(buildHelper.genDockerBuildCommand).not.toHaveBeenCalled();
    expect(buildHelper.genBuildxResultCheckCommand).not.toHaveBeenCalled();
});

test('check and install docker buildx failed', async () => {
    jest.spyOn(dockerHelper, 'checkDockerSuitable').mockReturnValue(Promise.resolve(true));
    jest.spyOn(utils, 'checkInputs').mockReturnValue(Promise.resolve(true));
    jest.spyOn(buildxHelper, 'checkAndInstallDockerBuildx').mockReturnValue(Promise.resolve(false));
    jest.spyOn(utils, 'execCommand').mockReturnValue(Promise.resolve(''));
    jest.spyOn(buildHelper, 'genInitBildxBootStrap').mockReturnValue('');
    jest.spyOn(buildHelper, 'genDockerBuildCommand').mockReturnValue('');
    jest.spyOn(buildHelper, 'genBuildxResultCheckCommand').mockReturnValue('');

    await main.run();
    expect(context.getInputs).toHaveBeenCalledTimes(1);
    expect(dockerHelper.checkDockerSuitable).toHaveBeenCalledTimes(1);
    expect(utils.checkInputs).toHaveBeenCalledTimes(1);
    expect(buildxHelper.checkAndInstallDockerBuildx).toHaveBeenCalledTimes(1);
    expect(core.setFailed).toHaveBeenNthCalledWith(1, 'install or update docker buildx failed');
    expect(utils.execCommand).not.toHaveBeenCalled();
    expect(buildHelper.genInitBildxBootStrap).not.toHaveBeenCalled();
    expect(buildHelper.genDockerBuildCommand).not.toHaveBeenCalled();
    expect(buildHelper.genBuildxResultCheckCommand).not.toHaveBeenCalled();
});

test('check and install docker buildx success', async () => {
    jest.spyOn(dockerHelper, 'checkDockerSuitable').mockReturnValue(Promise.resolve(true));
    jest.spyOn(utils, 'checkInputs').mockReturnValue(Promise.resolve(true));
    jest.spyOn(buildxHelper, 'checkAndInstallDockerBuildx').mockReturnValue(Promise.resolve(true));
    jest.spyOn(utils, 'execCommand').mockReturnValue(Promise.resolve(''));
    jest.spyOn(buildHelper, 'genInitBildxBootStrap').mockReturnValue('');
    jest.spyOn(buildHelper, 'genDockerBuildCommand').mockReturnValue('');
    jest.spyOn(buildHelper, 'genBuildxResultCheckCommand').mockReturnValue('');

    await main.run();
    expect(context.getInputs).toHaveBeenCalledTimes(1);
    expect(dockerHelper.checkDockerSuitable).toHaveBeenCalledTimes(1);
    expect(utils.checkInputs).toHaveBeenCalledTimes(1);
    expect(buildxHelper.checkAndInstallDockerBuildx).toHaveBeenCalledTimes(1);
    expect(utils.execCommand).toHaveBeenCalledTimes(3);
    expect(buildHelper.genInitBildxBootStrap).toHaveBeenCalledTimes(1);
    expect(buildHelper.genDockerBuildCommand).toHaveBeenCalledTimes(1);
    expect(buildHelper.genBuildxResultCheckCommand).toHaveBeenCalledTimes(1);
});
