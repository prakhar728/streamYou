import axios from "axios";

export const uploadLighthouse = async (files: File[]) => {
    const endpoint = 'https://node.lighthouse.storage/api/v0/add'
    const accessToken = process.env.NEXT_PUBLIC_LIGHTHOUSE_KEY
    let mimeType = null
    if (files.length === 1) {
        mimeType = files[0].type
    }

    const formData = new FormData()
    const boundary = Symbol()
    for (let i = 0; i < files.length; i++) {
        formData.append('file', files[i])
    }

    const token = 'Bearer ' + accessToken

    const response = await axios.post(endpoint, formData, {
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        headers: {
            'Content-type': `multipart/form-data; boundary= ${boundary.toString()}`,
            Encryption: `${false}`,
            'Mime-Type': mimeType,
            Authorization: token,
        },
    })

    if (typeof response.data === 'string') {
        const temp = response.data.split('\n')
        response.data = JSON.parse(temp[temp.length - 2])
    }
    return {data: response.data}
}