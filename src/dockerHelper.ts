import * as core from '@actions/core'
import * as io from '@actions/io'
import * as context from './context'
import * as utils from './utils'

/**
 * 检查docker是否安装，且安装的版本是否适应buildx
 * docker 没有安装和版本不符合要求都将退出action
 * @returns
 */
export async function checkDockerSuitable(): Promise<boolean> {
  if (!checkDockerInstall()) {
    core.info('Docker not installed or not set to the path')
    return false
  }
  const localDockerVersion: string = await getVersion()
  if (
    utils.compareVersion(localDockerVersion, context.MINIMUM_DOCKER_VERSION) ===
    context.VersionCompare.Low
  ) {
    core.info(
      'the current installed docker version not suitable for multiplatform build,please install latest docker version'
    )
    return false
  }
  return true
}

/**
 * 检查sshpass是否已经在系统上完成安装，并输出版本
 * @returns
 */
export async function checkDockerInstall(): Promise<boolean> {
  const docker_path = await io.which('docker')
  if (!docker_path) {
    core.info('Docker not installed or not set to the path')
    return false
  }
  core.info('docker already installed and set to the path')
  const dockerVersion = await utils.execCommand(docker_path + ' -v')
  core.info(dockerVersion)
  return true
}

/**
 * 获取到docker的版本
 * @returns
 */
export async function getVersion(): Promise<string> {
  const dockerVersion = await utils.execCommand('docker -v')
  return parseDockerVersion(dockerVersion)
}

/**
 * 从docker 版本字符串中提取出来数字版本，如 Docker version 20.10.14, build a224086
 * @param dockerVersion
 * @returns
 */
export function parseDockerVersion(dockerVersion: string): string {
  let version = dockerVersion.split(',')[0].split(' ')[2]
  if (version.includes('-')) {
    version = version.substring(0, version.indexOf('-'))
  }
  core.info('docker version ' + version)
  return version
}
