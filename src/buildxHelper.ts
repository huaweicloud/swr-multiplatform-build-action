import * as exec from '@actions/exec'
import * as util from 'util'
import * as utils from './utils'
import * as core from '@actions/core'
import * as toolCache from '@actions/tool-cache'
import * as context from './context'
import * as fs from 'fs'
import {v4 as uuidv4} from 'uuid'

/**
 * 如果docker buildx不存在，或者用户要求使用最新的buildx版本且当前安装版本低于最新版本，则需要安装或者升级docker buildx
 * @returns
 */
export async function checkAndInstallDockerBuildx(
  inputs: context.Inputs
): Promise<boolean> {
  let installOrUpdateBuildx = false
  if (!(await isDockerBuildXAvailable())) {
    installOrUpdateBuildx = true
  }
  if (inputs.uselatestbuildx && (await checkBuildxNeedUpdate(inputs))) {
    installOrUpdateBuildx = true
  }
  if (installOrUpdateBuildx) {
    await installOrUpdateDockerBuildX()
  }
  if (!isDockerBuildXAvailable()) {
    return false
  }
  return true
}

/**
 * 当前安装的版本低于github上发布的最新版本，则需要升级
 * @param inputs
 * @returns
 */
export async function checkBuildxNeedUpdate(
  inputs: context.Inputs
): Promise<boolean> {
  if (inputs.uselatestbuildx) {
    const latestDockerBuildxVersion = (await getLatestBuildxTag()).replace(
      'v',
      ''
    )
    const currentVersion = await getDockerBuildxVersion()
    core.info(
      'current installed docker buildx version: ' +
        currentVersion +
        ',and the latest vesion is ' +
        latestDockerBuildxVersion
    )
    return (
      utils.compareVersion(currentVersion, latestDockerBuildxVersion) ===
      context.VersionCompare.Low
    )
  } else {
    return false
  }
}

/**
 * 根据当前平台计算出需要下载的buildx下载地址
 * 完成软件包下载到临时目录
 * 将软件包拷贝到 /usr/local/lib/docker/cli-plugins/docker-buildx
 * 将软件包的权限设置为755
 * 清理临时下载包
 */
export async function installOrUpdateDockerBuildX() {
  const osType = utils.getOSType()
  const osArch = utils.getOSArch()
  const osPlatform = utils.getOSPlatform()
  if (
    !context.osSupportArchs.includes(osArch) ||
    !context.osSupportTypes.includes(osType) ||
    !context.osSupportPlatforms.includes(osPlatform)
  ) {
    core.info('docker buildx not can not install on this platform or arch')
    return
  }
  const buildxOSArch = utils.getOSArch4Buildx(osPlatform, osArch)
  const buildxOSPlatform = utils.getOSPlatform4Buildx(osPlatform)
  const buildxTag = await getLatestBuildxTag()
  const buildxDownloadUrl = getDockerBuildxDownloadUrl(
    buildxTag,
    buildxOSPlatform,
    buildxOSArch
  )
  const buildxDownloadPath = await getBuildXDownlodPath(buildxDownloadUrl)
  if (utils.checkParameterIsNull(buildxDownloadPath)) {
    core.info('download docker buildx failed')
    return
  }
  await utils.execCommand('sudo mkdir -p ' + context.DOCKER_BUILDX_INSTALL_PATH)
  await utils.execCommand(
    'sudo cp ' +
      buildxDownloadPath +
      ' ' +
      context.DOCKER_BUILDX_INSTALL_PATH +
      '/' +
      context.DOCKER_BUILDX_INSTALL_NAME
  )
  await utils.execCommand(
    'sudo chmod ' +
      context.DOCKER_BUILDX_MOD +
      ' ' +
      context.DOCKER_BUILDX_INSTALL_PATH +
      '/' +
      context.DOCKER_BUILDX_INSTALL_NAME
  )
  fs.rmSync(buildxDownloadPath)
  core.info('install new buildx version : ' + (await getDockerBuildxVersion()))
}

/**
 * 下载最新版本的docker buildx
 * @param buildxDownloadUrl
 * @returns
 */
export async function getBuildXDownlodPath(
  buildxDownloadUrl: string
): Promise<string> {
  const tmpBuildDownloadDir = './temp/buildx'
  const tmpBuildDownloadPath =
    tmpBuildDownloadDir +
    '/' +
    buildxDownloadUrl.substring(buildxDownloadUrl.lastIndexOf('/') + 1)
  let buildxDownloadPath = ''
  try {
    core.info(
      'download docker buildx for install or update from ' + buildxDownloadUrl
    )
    buildxDownloadPath = await toolCache.downloadTool(
      buildxDownloadUrl,
      tmpBuildDownloadPath
    )
  } catch (error) {
    core.info(
      'Failed to download docker buildx from ' +
        buildxDownloadUrl +
        ' error info ' +
        error
    )
  }
  core.info(buildxDownloadPath)
  return buildxDownloadPath
}

/**
 * 到docker buildx的release页面获取release版本列表，拿到最新的版本
 * @returns
 */
export async function getLatestBuildxTag(): Promise<string> {
  core.info('latest tag api address ' + context.DOCKER_BUILDX_RELEASE_API)
  //const tmpTagDownloadDir = `${process.env['GITHUB_WORKSPACE']}/_temp/buildx/buildxtag`;
  const tmpTagDownloadDir = './tmp/buildx/buildxtag/' + uuidv4()
  return await toolCache
    .downloadTool(context.DOCKER_BUILDX_RELEASE_API, tmpTagDownloadDir)
    .then(
      buildxDownloadPath => {
        core.info('buildxTagTmpDownloadPath ' + buildxDownloadPath)
        const response = JSON.parse(
          fs
            .readFileSync(buildxDownloadPath, 'utf8')
            .toString()
            .trim()
        )
        if (!response.tag_name) {
          return context.DOCKER_BUILDX_STABLE_TAG
        }
        core.info('latest buildx tagname ' + response.tag_name)
        return response.tag_name
      },
      error => {
        core.info('error ' + error)
        core.warning(
          util.format(
            'Failed to read latest buildx verison from %s. Using default stable version %s',
            context.DOCKER_BUILDX_RELEASE_API,
            context.DOCKER_BUILDX_STABLE_TAG
          )
        )
        return context.DOCKER_BUILDX_STABLE_TAG
      }
    )
}

/**
 * 根据传入的参数，构造buildx下载链接
 * @param buildTag
 * @param osPlatform
 * @param osArch
 * @returns
 */
export function getDockerBuildxDownloadUrl(
  buildTag: string,
  osPlatform: string,
  osArch: string
): string {
  const buildxDownloadUrl = util.format(
    context.DOCKER_BUILDX_RELEASE_DOWNLOAD_URL,
    buildTag,
    buildTag,
    osPlatform,
    osArch
  )
  core.info(
    'download buildx version : ' +
      buildTag +
      ' for current ' +
      osArch +
      ' platform ' +
      osPlatform +
      ',download url ' +
      buildxDownloadUrl
  )
  return buildxDownloadUrl
}

/**
 * 检查当前系统上是否安装了 docker buildx工具
 * @returns
 */
export async function isDockerBuildXAvailable(): Promise<boolean> {
  return await exec
    .getExecOutput('docker', ['buildx'], {
      ignoreReturnCode: true,
      silent: true
    })
    .then(result => {
      if (utils.checkParameterIsNull(result.stderr) && result.exitCode != 0) {
        core.info('docker buildx not install')
        return false
      }
      return result.exitCode === 0
    })
}

/**
 * 获取当前安装的buildx版本
 * @returns
 */
export async function getDockerBuildxVersion(): Promise<string> {
  return await exec
    .getExecOutput('docker', ['buildx', 'version'], {
      ignoreReturnCode: true,
      silent: true
    })
    .then(result => {
      if (result.stderr.length > 0 && result.exitCode != 0) {
        throw new Error(result.stderr.trim())
      }
      return parseVersion(result.stdout.trim())
    })
}

/**
 * 解析当前 buildx version串中的buildx版本号
 * 如 github.com/docker/buildx v0.8.2 6224def4dd2c3d347eee19db595348c50d7cb491 提取出 0.8.2
 * @param buildxVersion
 * @returns
 */
export function parseVersion(buildxVersion: string): string {
  const matches = /\sv?([0-9a-f]{7}|[0-9.]+)/.exec(buildxVersion)
  if (!matches) {
    throw new Error('fail to parse docker buildx version')
  }
  return matches[1]
}
