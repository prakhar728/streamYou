import axios from "axios";

interface Creator {
    id: `0x${string}`;
    name: string;
    description: string;
    image: string;
}

interface Video {
    id: `0x${string}`;
    title: string;
    description: string;
    thumbnail: string;
    isTokenGated: string;
    channelId: string;
    uploadDate: string;
    creatorId: string;
}

interface Comment {
    description: string;
    creator: string;
    id: string;
    collection: "Comment";
}

export const createCreator = async (creator: Creator) => {
    const {id, name, description, image} = creator;
    const response = await axios.post(`/api/polybase`, {
        id, name, description, image, collection: "Creator"
    })
    if (response.status !== 200) {
        throw new Error("Error creating profile");
    }
    return response.data;

}

export const addVideo = async (video: Video) => {
    const {id, title, description, thumbnail, isTokenGated, channelId, uploadDate, creatorId} = video;

    const response = await axios.post(`/api/polybase`, {
        id, title, description, thumbnail, isTokenGated, channelId, uploadDate, creatorId, collection: "Videos"
    })
    if (response.status !== 200) {
        throw new Error("Error creating profile");
    }
    return response.data();
}

export const addComment = async ({id, creator, description, collection}: Comment) => {
    const response = await axios.patch(`/api/polybase`, {
        collection: collection,
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
    const response = await axios.get(`/api/polybase`,
        {
            params: {
                collection: "Creator",
            }
        });
    if (response.status !== 200) {
        throw new Error("Error creating profile");
    }
    return response.data();
}

export const getCreator = async (id: String) => {
    const response = await axios.get(`/api/polybase`, {
        params: {
            id,
            collection: "Creator"
        }
    });
    if (response.status !== 200) {
        throw new Error("Error creating profile");
    }
    return response.data();
}
export const getAllVideos = async () => {
    const response = await axios.get(`/api/polybase`,
        {
            params: {
                collection: "Videos",
            }
        });
    if (response.status !== 200) {
        throw new Error("Error creating profile");
    }
    return response.data();
}

export const getVideo = async (id: String) => {
    const response = await axios.get(`/api/polybase`, {
        params: {
            id,
            collection: "Videos"
        }
    });
    if (response.status !== 200) {
        throw new Error("Error creating profile");
    }
    return response.data();
}

export const getComment = async (id: string) => {
    const response = await axios.get(`/api/polybase`, {
        params: {
            id,
            collection: "Comment",
        },
    });
    if (response.status !== 200) {
        throw new Error("Error getting comment");
    }
    return response.data;
};