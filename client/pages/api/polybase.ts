// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from "next";
import {
    Collection,
    CollectionList,
    CollectionRecordResponse,
    Polybase,
} from "@polybase/client";
import {ethPersonalSign} from "@polybase/eth";
import {ethers} from "ethers";
import {v4 as uuidv4} from "uuid";
import cors from "cors"
import NextCors from "nextjs-cors";

type Data = {
    response: CollectionList<any> | CollectionRecordResponse<any> | string;
};

const schema = `
@public
collection Creator {
  id: string;
  name: string; 
  description:string;
  image:string;
  videos:Video[];
  
  constructor (id:string,name:string,description:string,image:string) {
    this.id = id;
    this.name=name;
    this.description=description;
    this.image=image;
    this.videos = [];
  }

  function addVideo(video:Video){
    this.videos.push(video);
  }
  
}

@public
collection Video{
  id:string;
  title:string;
  description:string;
  thumbnail:string;
  isTokenGated:boolean;
  tokenId: string;
  channelId:string;
  uploadDate:string;
  videoLink: string;
  comments: Comment[];

  constructor(id:string,title:string,description:string,thumbnail:string,isTokenGated:boolean,channelId:string,uploadDate:string, tokenId: string, videoLink:string){
    this.id = id;
    this.title=title;
    this.description=description;
    this.thumbnail=thumbnail;
    this.isTokenGated=isTokenGated;
    this.channelId=channelId;
    this.uploadDate=uploadDate;
    this.tokenId = tokenId;
    this.comments = [];
    this.videoLink = videoLink;
  }
  
  function addComment (comment: Comment){
    this.comments.push(comment);
  }
}
@public
    collection Comment {
        id: string;
        description: string;
        createdAt: string;
        creator: string;

        constructor (id: string, description: string, createdAt: string, creator: string) {
            this.id = id;
            this.description = description;
            this.createdAt = createdAt;
            this.creator = creator;
        }
    }
`

const signInPolybase = () => {
    const db = new Polybase({
        defaultNamespace: "streamYou-test-v1.0",
    });

    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY as string);

    // console.log("PRIVATE_KEY", wallet.privateKey);

    db.signer((data) => {
        return {
            h: "eth-personal-sign",
            sig: ethPersonalSign(wallet.privateKey as string, data),
        };
    });
    // console.log(db);
    return db;
};

async function handleGet(
    req: NextApiRequest,
    res: NextApiResponse<Data>,
    collection: Collection<any>
) {
    const {id} = req.query;
    if (!id) {
        const recordData = await collection.get();
        res.status(200).json({response: recordData});
        return;
    }
    // Get a record
    const recordData = await collection.record(id as string).get();
    res.status(200).json({response: recordData});
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    await NextCors(req, res, {
        // Options
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        origin: '*',
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    });
    res.setHeader('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_SPHERON_LINK!);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    const db = signInPolybase();

    // Create a collection
    // const createResponse = await db.applySchema(schema);
    // console.log(createResponse);

    const body = req.body;
    const params = req.query;

    //CHECK FOR BODY AND PARAMS
    if (req.method === "GET") {
        if (!params || Object.keys(params).length === 0) {
            res.status(400).json({response: "Missing query params"});
            return;
        }
    } else if (req.method === "POST" || req.method === "PATCH") {
        if (!body || Object.keys(body).length === 0) {
            res.status(400).json({response: "Missing body"});
            return;
        }
    }

    if (req.method === "GET") {
        const {collection} = params;
        if (!collection) {
            res.status(400).json({
                response: "Missing required field 'collection'",
            });
            return;
        }
        if (collection === "Creator") {
            const userCollection = db.collection("Creator");
            await handleGet(req, res, userCollection);
        } else if (collection === "Videos") {
            const postsCollection = db.collection("Video");
            await handleGet(req, res, postsCollection);
        } else if (collection === "Comment") {
            const commentCollection = db.collection("Comment");
            console.log(commentCollection)
            await handleGet(req, res, commentCollection);
        } else {
            res.status(400).json({response: "Invalid collection"});
        }
        return;
    }
    else if (req.method === "POST") {
        //ID WILL BE THE PUBLIC KEY OF THE CREATOR
        const {id} = body;
        if (!id) {
            res.status(400).json({response: "Missing required field 'id'"});
            return;
        }

        if (req.body.collection === "Creator") {
            // Create a record
            const {id, name, description, image} = req.body;
            if (
                !body.hasOwnProperty("name") || !body.hasOwnProperty("description") || !body.hasOwnProperty("image") || !body.hasOwnProperty || !body.hasOwnProperty("id")
            ) {
                res.status(400).json({response: "Missing Required Fields"});
                return;
            }
            const response = await db.collection("Creator").create([id, name, description, image]);
            res.status(200).json({response: response});
            return;
        } else if (req.body.collection === "Videos") {
            const {id, title, description, thumbnail, isTokenGated, channelId, uploadDate, creatorId, tokenId, videoLink} = req.body;
            if (
                !body.hasOwnProperty("id") ||
                !body.hasOwnProperty("title") || !body.hasOwnProperty("description") ||
                !body.hasOwnProperty("thumbnail") || !body.hasOwnProperty("isTokenGated") ||
                !body.hasOwnProperty("channelId") || !body.hasOwnProperty("uploadDate") || !body.hasOwnProperty("creatorId") || !body.hasOwnProperty("tokenId") || !body.hasOwnProperty("videoLink")
            ) {
                res.status(400).json({response: "Missing required fields"});
                return;
            }
            //Create a Video Record
            const uploadedVideo = await db
                .collection("Video")
                .create([id as string, title, description, thumbnail, isTokenGated == "true", channelId, uploadDate, tokenId, videoLink]);
            // Create a record
            const response = await db
                .collection("Creator")
                .record(creatorId)
                .call("addVideo", [db.collection("Video").record(id)]);
            console.log(response)
            res.status(200).json({response: response});
        } else {
            res.status(400).json({response: "Invalid collection"});
            return;
        }
        return;
    }
    else if (req.method === "PATCH") {
        const { id } = body;
        if (!id) {
            res.status(400).json({ response: "Missing required field 'id'" });
            return;
        }
        if (req.body.collection === "Video") {
            const {
                description,
                creator,
            } = req.body;
            if(!body.hasOwnProperty("description") || !body.hasOwnProperty("creator")) {
                res.status(400).json({ response: "Missing required fields" });
                return;
            }
            const commentId = uuidv4();
            const createdAt = Date.now(); // or (new Date()).getTime()
            const replyRecordData = await db
                .collection("Comment")
                .create([
                    commentId as string,
                    description,
                    createdAt.toString(),
                    creator,
                ]);

            const recordData = await db
                .collection("Video")
                .record(id as string)
                .call("addComment", [
                    await db.collection("Comment").record(commentId as string),
                ]);

            res.status(200).json({ response: recordData });
            return;
        } else {
            res.status(400).json({ response: "Invalid collection" });
            return;
        }
    }

    // invalid method
    return res.status(400).json({response: "Invalid method"});
}