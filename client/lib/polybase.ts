import axios from "axios";

interface Creator {
    id: `0x${string}`;
    name: string;
    description: string;
    image: string;
}

interface Video {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    isTokenGated: string;
    channelId: string;
    uploadDate: string;
    creatorId: string;
    tokenId: string;
    videoLink: string;
}

interface Comment {
    description: string;
    creator: string;
    id: string;
}

export const createCreator = async (creator: Creator) => {
    const {id, name, description, image} = creator;
    const response = await axios.post(`https://stream-you.vercel.app/api/polybase`, {
        id, name, description, image, collection: "Creator"
    })
    if (response.status !== 200) {
        throw new Error("Error creating profile");
    }
    return response.data;

}

export const addVideo = async (video: Video) => {
    const {id, title, description, thumbnail, isTokenGated, channelId, uploadDate, creatorId, tokenId, videoLink} = video;

    const response = await axios.post(`https://stream-you.vercel.app/api/polybase`, {
        id, title, description, thumbnail, isTokenGated, channelId, uploadDate, creatorId, tokenId, videoLink, collection: "Videos"
    })
    if (response.status !== 200) {
        throw new Error("Error adding video");
    }
    return response.data;
}

export const addComment = async ({id, creator, description}: Comment) => {
    const response = await axios.patch(`https://stream-you.vercel.app/api/polybase`, {
        collection: "Video",
        id,
        creator,
        description,
    })
    if (response.status !== 200) {
        throw new Error("Error adding comment")
    }
    return response.data
};

export const getAllCreators = async () => {
    const response = await axios.get(`https://stream-you.vercel.app/api/polybase`,
        {
            params: {
                collection: "Creator",
            }
        });
    if (response.status !== 200) {
        throw new Error("Error creating profile");
    }
    return response.data;
}

export const getCreator = async (id: String) => {
    const response = await axios.get(`https://stream-you.vercel.app/api/polybase`, {
        params: {
            id,
            collection: "Creator"
        }
    });
    if (response.status !== 200) {
        throw new Error("Error creating profile");
    }
    return response.data;
}
export const getAllVideos = async () => {
    const response = await axios.get(`https://stream-you.vercel.app/api/polybase`,
        {
            params: {
                collection: "Videos",
            }
        });
    if (response.status !== 200) {
        throw new Error("Error creating profile");
    }
    return response.data;
}

export const getVideo = async (id: String) => {
    const response = await axios.get(`https://stream-you.vercel.app/api/polybase`, {
        params: {
            id,
            collection: "Videos"
        }
    });
    if (response.status !== 200) {
        throw new Error("Error creating profile");
    }
    return response.data;
}

export const getComment = async (id: string) => {
    console.log("getComment", id);
    const response = await axios.get(`https://stream-you.vercel.app/api/polybase`, {
        params: {
            id,
            collection: "Comment",
        },
    });
    console.log(response)
    if (response.status !== 200) {
        throw new Error("Error getting comment");
    }
    return response.data;
};