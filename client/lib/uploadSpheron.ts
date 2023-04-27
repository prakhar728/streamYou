import {upload} from "@spheron/browser-upload";

export async function uploadSpheron(file: File) {
    try {
        const uploadToken = await fetch("/api/spheron").then((res) => res.json()).then((res) => res.uploadToken)
        const {uploadId, bucketId, protocolLink, dynamicLinks} = await upload([file], {
            token: uploadToken,
        })
        return {uploadId, bucketId, protocolLink, dynamicLinks}
    } catch (e) {
        console.log(e)
    }
}