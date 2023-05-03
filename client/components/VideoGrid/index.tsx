import {Box, Heading, Image, Link, SimpleGrid, Skeleton, Text} from '@chakra-ui/react'
import React, {useEffect, useState} from 'react'
import {getVideo} from "../../lib/polybase";
import {useRouter} from "next/router";

export default function VideoGrid({videos}: { videos: any[] }) {
    const [data, setData] = useState<any[]>([])
    // console.log("videos", videos)
    const router = useRouter()
    useEffect(() => {
        videos?.forEach(video => {
            // console.log("video", video)
            fetchVideo(video.id)
        })
    }, [videos])

    const fetchVideo = async (id: string) => {
        const res = await getVideo(id)
        // console.log("videoData",res.response.data, id)
        setData(prev => [...prev, res.response.data])
    }

    return (
        <SimpleGrid p={4} columns={3} spacing={2}>
            {
                data?.map((video, index) => {
                    return (
                        <Box display={"flex"} flexDirection={"column"} w="20vw" key={index} backgroundColor={"whiteAlpha.600"} borderRadius={"md"} cursor={"pointer"} onClick={() => router.push(`/app/watchstream?video=${video?.id}`)}>
                            <Image
                                src={video?.thumbnail}
                                borderRadius={"20px"}/>
                            <Heading p={2} size={"md"}>{video.title || "Loading..."}</Heading>
                            <Link href={`/app/creator?channelId=${video?.channelId}`} size={"sm"} color={"dimgrey"} px={2}>Creator</Link>
                            <Text p={2} color={"dimgray"}>{`${video?.description?.slice(0,15)}...`}</Text>
                        </Box>
                    )
                })
            }
            {data.length === 0 && <Text>No Videos Found</Text>}
            {!data && <Skeleton height={300} width={300}/>}
        </SimpleGrid>
    )
}