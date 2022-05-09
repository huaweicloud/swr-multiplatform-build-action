# swr-multiplatform-build-action
允许用户构建跨平台镜像,如linux平台，windows平台或macos平台，并直接推送到SWR等Docker registry上
目前支持的平台列表如下,构建镜像具体支持的平台需要看FROM的基础镜像支持哪些平台
  'linux/amd64',
  'linux/arm64',
  'linux/ppc64le',
  'linux/s390x',
  'linux/386',
  'linux/arm/v7',
  'linux/arm/v6',
  'linux/arm64/v8',
  'windows/amd64',
  'windows/arm64',
  'darwin/amd64',
  'darwin/arm64'

## **前置工作**
(1).如果需要推送到SWR等Docker registry上，需要添加一个docker login的action，添加好登录账号密码等信息  
(2).需要确定基础镜像支持的平台
如19-jdk,支持windows/amd64,linux/amd64,linux/arm64/v8 这三个平台,
![image](/uploads/bafc1105-ead1-44ad-a921-a897f884eee3/1652086430654.jpeg '1652086430654.jpeg')

## **参数说明:**
imagetag:需要打包的docker镜像标签，如   swr.cn-north-4.myhuaweicloud.com/hcloudcli/jdkdemo:jdk19-v1.0.0.4
platforms: 当前需要打包支持的平台，用逗号隔开，如  linux/amd64,linux/arm64/v8,windows/amd64
file: Dockerfile路径，默认为Dockerfile,如果在其他目录，则填写相对路径,如 ./docker-v1.0.0.1/Dockerfile
uselatestbuildx: 是否需要使用最新版本的docker buildx来构建docker镜像
push: 是否需要将构建好的镜像推送到docker镜像仓库，如果填true，需要再前面增加一个docker login的action完成镜像仓库的登录

## **使用样例**
为docker镜像添加 linux/amd64,linux/arm64/v8,windows/amd64 平台支持
```yaml
      - uses: huaweicloud/swr-multiplatform-build-action@v1.0.0
        name: "build docker image for multiplatform"
        with:
         imagetag: swr.cn-north-4.myhuaweicloud.com/hcloudcli/jdkdemo:jdk19-v1.0.0.4
         platforms: linux/amd64,linux/arm64/v8,windows/amd64
         uselatestbuildx: false
         push: true
         file: ./Dockerfile
```