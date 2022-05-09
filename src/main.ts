import * as context from './context'
import * as dockerHelper from './dockerHelper'
import * as buildxHelper from './buildxHelper'
import * as buildHelper from './buildHelper'
import * as utils from './utils'
import * as core from '@actions/core'

export async function run() {
  const inputs: context.Inputs = context.getInputs()

  if (!(await dockerHelper.checkDockerSuitable())) {
    core.setFailed('check Docker failed')
    return
  }

  if (!(await utils.checkInputs(inputs))) {
    core.setFailed('verify input parameter failed')
    return
  }

  if (!(await buildxHelper.checkAndInstallDockerBuildx(inputs))) {
    core.setFailed('install or update docker buildx failed')
    return
  }

  await utils.execCommand(buildHelper.genInitBildxBootStrap())

  await utils.execCommand(buildHelper.genDockerBuildCommand(inputs))

  await utils.execCommand(buildHelper.genBuildxResultCheckCommand())
}

run()
