import {NextApiRequest, NextApiResponse} from "next";
import {SpheronClient, ProtocolEnum} from "@spheron/storage"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "GET"){
        try {
            const bucketName = "stream-you"
            const protocol = ProtocolEnum.FILECOIN
            const client = new SpheronClient({
                token: process.env.SPHERON_TOKEN!,
            })

            const {uploadToken} = await client.createSingleUploadToken({
                name: bucketName,
                protocol,
            })

            res.status(200).json({uploadToken})
        } catch (e: any){
            res.status(500).json({error: e.message})
        }
    }
}