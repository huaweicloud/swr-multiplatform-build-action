import * as core from '@actions/core'
import * as context from './context'
import * as os from 'os'
import * as cp from 'child_process'
import * as fs from 'fs-extra'

const BLANK_STRING_REG = new RegExp(/\s+/g);

/**
 * 检查输入的各参数是否正常
 * @param inputs
 * @returns
 */
export async function checkInputs(inputs: context.Inputs) {
  let checkResult = true
  if (checkParameterIsNull(inputs.imagetag)) {
    core.info('parameter imagetag is required')
    checkResult = false
  }

  if (inputs.imagetag.startsWith('swr')) {
    const region = getRegionFromEndpoint(inputs.imagetag, 1, '.')
    if (!context.regionArray.includes(region)) {
      core.info(`SWR not support in this region: ${region}`)
      checkResult = false
    }
  }

  if (inputs.platforms) {
    checkResult = checkPlatformSupport(inputs.platforms)
  }

  if (!inputs.file) {
    inputs.file = 'Dockerfile'
  }
  if (!checkDockerfileExist(inputs.file)) {
    core.info('Dockerfile not exit or file content is empty')
    checkResult = false
  }
  return checkResult
}

/**
 * 检查用户配置的 platforms参数是否在支持的范围之内
 * @param platforms
 * @returns
 */
export function checkPlatformSupport(platforms: string): boolean {
  let isPlatformSupport = true
  if (!platforms.includes(',')) {
    return context.dockerSupportPlatforms.includes(platforms)
  }
  const platformsArray = platforms.split(',')
  for (let i = 0; i < platformsArray.length; i++) {
    if (!context.dockerSupportPlatforms.includes(platformsArray[i])) {
      core.info(`SWR not support platform ${platformsArray[i]}`)
      isPlatformSupport = false
    }
  }
  return isPlatformSupport
}

/**
 * 检查文件是否存在，内容是否为空
 * @param file
 * @returns
 */
export function checkDockerfileExist(file: string): boolean {
  core.info(`Check whether the file ${file} exists.`)
  try {
    const stat = fs.statSync(file)
    if (stat.isFile() && stat.size > 0) {
      return true
    } else {
      return false
    }
  } catch (error) {
    core.setFailed('Get information about the given file failed.')
    return false
  }
}

/**
 * 判断字符串是否为空
 * @param parameter
 * @returns
 */
export function checkParameterIsNull(parameter: string): boolean {
  return (
    parameter === undefined ||
    parameter === null ||
    parameter === '' ||
    parameter.trim().length == 0
  )
}

/**
 * 从指定的url中分离出region信息
 * @param url
 * @param index
 * @param regix
 * @returns
 */
export function getRegionFromEndpoint(
  url: string,
  index: number,
  regix: string
): string {
  let region = ''
  const urlArray: string[] = url.split(regix)
  if (urlArray.length >= index + 1) {
    region = urlArray[index]
  }
  core.info(`get currentRegion : ${region}`)
  return region
}

/**
 * 获取操作系统类型
 * @returns
 */
export function getOSType(): string {
  const osType = os.type()
  core.info('Current system type is ' + osType)
  return osType
}

export function getOSArch(): string {
  const osArch = os.arch()
  core.info('Current system arch is ' + osArch)
  return osArch
}

export function getOSPlatform(): string {
  const osPlatform = os.platform()
  core.info('Current system platform is ' + osPlatform)
  return osPlatform
}

export function getOSArch4Buildx(osPlatform: string, osArch: string): string {
  if ((osPlatform === 'linux' || osPlatform === 'darwin') && osArch === 'x64') {
    osArch = 'amd64'
  }

  if (
    (osPlatform === 'linux' || osPlatform === 'darwin') &&
    osArch === 'arm64'
  ) {
    osArch = 'arm64'
  }

  if (osPlatform === 'win32' && osArch === 'x64') {
    osArch = 'amd64.exe'
  }

  if (osPlatform === 'win32' && osArch === 'arm64') {
    osArch = 'arm64.exe'
  }
  if (osArch === 'ppc64') {
    osArch = 'ppc64le'
  }
  core.info('Current system arch is ' + osArch)
  return osArch
}

export function getOSPlatform4Buildx(osPlatform: string): string {
  return osPlatform === 'win32' ? 'windows' : osPlatform
}

/**
 * Docker version 20.10.14, build a224086
 * docker 版本为 20.10.14，x.y.z格式
 * @param {string} version1
 * @param {string} version2
 * @return {number}
 */
export function compareVersion(version1: string, version2: string): number {
  const [v1, v2] = [version1.split('.'), version2.split('.')]
  const len = Math.max(v1.length, v2.length)
  for (let i = 0; i < len; i++) {
    const num1 = v1[i] ? parseInt(v1[i]) : 0
    const num2 = v2[i] ? parseInt(v2[i]) : 0
    if (num1 > num2) {
      return context.VersionCompare.High
    } else if (num1 < num2) {
      return context.VersionCompare.Low
    }
  }
  return context.VersionCompare.Equre
}

/**
 * 执行传入的命令，返回执行结果
 * @param command
 */
export async function execCommand(command: string): Promise<string> {
  const execCommandResult = await (cp.execSync(command) || '').toString()
  core.info(execCommandResult)
  return execCommandResult
}

/**
 * 去除空白字符，包括空格、制表符、换页符和换行符。
 * @param str
 */
 export function removeBlankString(str: string): string {
  return str.replace(BLANK_STRING_REG, '').trim();
}