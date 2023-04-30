import {NextApiRequest, NextApiResponse} from "next";
import {SpheronClient, ProtocolEnum} from "@spheron/storage"
import NextCors from 'nextjs-cors';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await NextCors(req, res, {
        // Options
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        origin: '*',
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    });
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
            console.log("upload token generated")

            res.status(200).json({uploadToken})
        } catch (e: any){
            res.status(500).json({error: e.message})
        }
    }
}