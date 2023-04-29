import {upload} from "@spheron/browser-upload";

export async function uploadSpheron(file: File) {
    try {
        const uploadToken = await fetch("/api/spheron").then((res) => res.json()).then((res) => res.uploadToken)
        console.log("uploading file...")
        const {uploadId, bucketId, protocolLink, dynamicLinks} = await upload([file], {
            token: uploadToken,
        })
        console.log("file uploaded")
        return {uploadId, bucketId, protocolLink, dynamicLinks}
    } catch (e) {
        console.log(e)
    }
}