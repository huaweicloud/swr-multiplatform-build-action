import {expect, test} from '@jest/globals'
import * as build from '../src/buildHelper'
import * as context from '../src/context'

const inputs1:context.Inputs ={
    imagetag: "swr.cn-north-4.xxx/ptworkflow/tomcat:maven-sample",
    platforms: "",
    uselatestbuildx: false,
    push: false,
    file: ""
}

const inputs2:context.Inputs ={
    imagetag: "swr.cn-north-4.xxx/ptworkflow/tomcat:maven-sample",
    platforms: "",
    uselatestbuildx: false,
    push: false,
    file: "./Dockerfile"
}



const inputs3:context.Inputs ={
    imagetag: "swr.cn-north-4.xxx/ptworkflow/tomcat:maven-sample",
    platforms: "linux/amd64,linux/arm64/v8,windows/amd64",
    uselatestbuildx: false,
    push: false,
    file: "./dockerfile/Dockerfile"
}

const inputs4:context.Inputs ={
    imagetag: "swr.cn-north-4.xxx/ptworkflow/tomcat:maven-sample",
    platforms: "linux/amd64,linux/arm64/v8,windows/amd64",
    uselatestbuildx: false,
    push: true,
    file: "./dockerfile/Dockerfile"
}

test("test version compare mimetype", async() => {
    expect(build.genDockerBuildCommand(inputs1)).toEqual("docker buildx build -t swr.cn-north-4.xxx/ptworkflow/tomcat:maven-sample .");

    expect(build.genDockerBuildCommand(inputs2)).toEqual("docker buildx build -f ./Dockerfile -t swr.cn-north-4.xxx/ptworkflow/tomcat:maven-sample .");

    expect(build.genDockerBuildCommand(inputs3)).toEqual("docker buildx build --platform linux/amd64,linux/arm64/v8,windows/amd64 -f ./dockerfile/Dockerfile -t swr.cn-north-4.xxx/ptworkflow/tomcat:maven-sample .");

    expect(build.genDockerBuildCommand(inputs4)).toEqual("docker buildx build --platform linux/amd64,linux/arm64/v8,windows/amd64 -f ./dockerfile/Dockerfile -t swr.cn-north-4.xxx/ptworkflow/tomcat:maven-sample --push .");
})