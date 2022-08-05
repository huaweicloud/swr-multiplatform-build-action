import * as core from '@actions/core'
import * as utils from './utils'


export interface Inputs {
  imagetag: string
  platforms: string
  uselatestbuildx: boolean
  push: boolean
  file: string
}

/**
 * 目前支持SWR功能的region列表
 */
export const regionArray = [
  'af-south-1',
  'cn-north-4',
  'cn-north-1',
  'cn-east-2',
  'cn-east-3',
  'cn-south-1',
  'la-south-2',
  'cn-southwest-2',
  'ap-southeast-2',
  'ap-southeast-3',
  'ap-southeast-1'
]

// 这里只罗列出来了buildx可以支持的平台，构建镜像时，要看当前镜像FROM的基础镜像是否支持改平台的构建，否则会报错
export const dockerSupportPlatforms = [
  'linux/amd64',
  'linux/arm64',
  'linux/ppc64le',
  'linux/s390x',
  'linux/386',
  'linux/arm/v5',
  'linux/arm/v7',
  'linux/arm/v6',
  'linux/arm64/v8',
  'linux/mips64le',
  'windows/amd64',
  'windows/arm64',
  'darwin/amd64',
  'darwin/arm64'
]

export const enum VersionCompare {
  High = 1,
  Equre = 0,
  Low = -1
}
export const osSupportArchs = ['x64', 'arm64', 's390x', 'ppc64', 'amd64']

/**
 * windows先不支持
 * export const osSupportPlatforms = ['darwin', 'linux', 'win32']
 * export const osSupportTypes = ['Darwin', 'Linux', 'Windows_NT']
 */
export const osSupportTypes = ['Darwin', 'Linux']

export const osSupportPlatforms = ['darwin', 'linux']

// 19.03是最迟buildx的最低版本
export const MINIMUM_DOCKER_VERSION = '19.03'

export const BUILDX_INIT_COMMAND =
  'docker buildx create --name multbuild --driver docker-container --use && docker buildx inspect multbuild --bootstrap'

export const BUILDX_RESULT_COMMAND = 'docker buildx ls'

export const DOCKER_BUILDX_RELEASE_API =
  'https://api.github.com/repos/docker/buildx/releases/latest'

/**
 *  buildx 已经不再支持32位平台了，支持的都是64位的平台,如当前最新的版本v0.8.2
 *  buildx-v0.8.2.darwin-amd64   https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.darwin-amd64
 *  buildx-v0.8.2.darwin-arm64   https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.darwin-arm64
 *  buildx-v0.8.2.linux-amd64    https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.linux-amd64
 *  buildx-v0.8.2.linux-arm-v6   https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.linux-arm-v6
 *  buildx-v0.8.2.linux-arm-v7   https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.linux-arm-v7
 *  buildx-v0.8.2.linux-arm64    https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.linux-arm64
 *  buildx-v0.8.2.linux-ppc64le  https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.linux-ppc64le
 *  buildx-v0.8.2.linux-riscv64  https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.linux-riscv64
 *  buildx-v0.8.2.linux-s390x    https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.linux-s390x
 *  buildx-v0.8.2.windows-amd64.exe    https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.windows-amd64.exe
 *  buildx-v0.8.2.windows-arm64.exe    https://github.com/docker/buildx/releases/download/v0.8.2/buildx-v0.8.2.windows-arm64.exe
 *  $tag, $tag,$platform,$arch
 */
export const DOCKER_BUILDX_RELEASE_DOWNLOAD_URL =
  'https://github.com/docker/buildx/releases/download/%s/buildx-%s.%s-%s'

// 开发此action时，最新的稳定版本
export const DOCKER_BUILDX_STABLE_TAG = 'v0.8.2'

export const DOCKER_BUILDX_INSTALL_PATH = '/usr/local/lib/docker/cli-plugins/'

export const DOCKER_BUILDX_INSTALL_NAME = 'docker-buildx'

export const DOCKER_BUILDX_MOD = '755'

export function getInputs(): Inputs {
  return {
    imagetag: utils.removeBlankString(core.getInput('image_tag', {required: true})),
    platforms: utils.removeBlankString(core.getInput('platforms', {required: false})),
    uselatestbuildx: core.getBooleanInput('use_latest_buildx', {
      required: false
    }),
    push: core.getBooleanInput('push', {required: false}),
    file: utils.removeBlankString(core.getInput('file', {required: false}))
  }
}
