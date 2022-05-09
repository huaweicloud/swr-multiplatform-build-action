import * as core from '@actions/core'
import * as io from '@actions/io'
import * as cp from 'child_process'
import * as context from './context'
import * as utils from './utils'

export function genDockerBuildCommand(inputs: context.Inputs): string {
  let buildCommand = 'docker buildx build'
  if (inputs.platforms) {
    buildCommand += ' --platform ' + inputs.platforms
  }
  if (inputs.file) {
    buildCommand += ' -f ' + inputs.file
  }
  buildCommand += ' -t ' + inputs.imagetag
  if (inputs.push) {
    buildCommand += ' --push'
  }
  buildCommand += ' . '
  return buildCommand
}

export function genInitBildxBootStrap(): string {
  return context.BUILDX_INIT_COMMAND
}

export function genBuildxResultCheckCommand(): string {
  return context.BUILDX_RESULT_COMMAND
}
