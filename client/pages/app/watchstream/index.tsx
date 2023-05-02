import React, {useEffect, useState} from 'react'
import Navbar from "../../../components/NavBar/NavBar";
import {
    Avatar,
    Box,
    Button,
    Card,
    CardBody, Center,
    Flex,
    Heading,
    Input,
    InputGroup,
    InputRightElement,
    Skeleton,
    Stack,
    Text, useToast
} from '@chakra-ui/react';
import Head from "next/head";
import {useRouter} from "next/router";
import {useAccount, useSigner} from "wagmi";
import {useContract} from "../../../hooks/useContract";
import {useIsMounted} from "../../../hooks/useIsMounted";
import {addComment, getCreator, getVideo} from "../../../lib/polybase";
import axios from 'axios';
import Comment from "../../../components/Comment";
import {ethers} from "ethers";

export default function Watchstream() {
    const router = useRouter()
    const {address, isConnected} = useAccount()
    const {balanceOf, getTokenPrice, mintToken} = useContract()
    const mounted = useIsMounted()
    const toast = useToast()
    const {data: signer} = useSigner()

    const [loading, setLoading] = useState(false)
    const [creator, setCreator] = useState<any>({})
    const [videoDetails, setVideoDetails] = useState<any>({})
    const [comment, setComment] = useState<string>("")
    const [locked, setLocked] = useState<boolean>(true)
    const [purchased, setPurchased] = useState<boolean>(false)
    const [price, setPrice] = useState<number>(0)
    const [fetched, setFetched] = useState<boolean>(false)

    useEffect(() => {
        if (mounted && router.isReady) {
            if (!isConnected) {
                alert("Connect to Wallet to Continue!")
                router.push("/")
            }
            const {video} = router.query
            if (video && signer) {
                (async () => {
                    const videoRes = await getVideo(video as string)
                    console.log(videoRes)
                    setVideoDetails(videoRes.response.data)
                    setLocked(videoRes.response.data.isTokenGated)
                    const creatorRes = await getCreator(videoRes.response.data.channelId)
                    if (videoRes.response.data.isTokenGated) {
                        const hasPurchased = (await balanceOf(address as string, parseInt(videoRes.response.data.tokenId))).toString() !== "0"
                        setPurchased(hasPurchased)
                        if (!hasPurchased) {
                            const price = (await getTokenPrice(parseInt(videoRes.response.data.tokenId))).toString()
                            const priceInEth = ethers.utils.formatEther(price)
                            console.log(priceInEth)
                            setPrice(parseFloat(priceInEth))
                        }
                    }
                    console.log(creatorRes)
                    setCreator(creatorRes.response.data)
                    setFetched(true)
                })()
            }
        }
    }, [mounted, router.query, isConnected, signer])

    const postComment = async (e: any) => {
        console.log(comment);
        setLoading(true)
        const res = await addComment({
            id: router.query.video as string,
            creator: address as string,
            description: comment
        })
        setVideoDetails(res.response.data)
        setLoading(false)
        setComment("")
    }

    const handleBuy = async () => {
        try {
            await mintToken(price.toString(), videoDetails.tokenId)
            setPurchased(true)
            toast({
                title: "NFT Purchased!",
                description: "You can now watch the video!",
                status: "success",
                duration: 9000,
                isClosable: true,
            })
        } catch (e) {
            console.log(e)
            toast({
                title: "Error",
                description: "Something went wrong!",
                status: "error",
                duration: 9000,
                isClosable: true,
            })
        }
    }

    return (
        <>
            <Head>
                <title>Watch Stream</title>
            </Head>
            <Navbar>
                <Box display="flex" alignItems={"center"} flexDirection={"column"} minH={"90vh"}>
                    {
                        (locked && purchased) && videoDetails.videoLink &&
                        <video controls autoPlay id="videoPlayerWindow">
                            <source
                                src={videoDetails.videoLink}
                                type="video/webm"/>
                        </video>
                    }
                    {
                        !locked && videoDetails.videoLink &&
                        <video controls autoPlay id="videoPlayerWindow">
                            <source
                                src={videoDetails.videoLink}
                                type="video/webm"/>
                        </video>
                    }
                    {
                        locked && !purchased && (
                            <div style={{height: 250, paddingTop: 100}}>
                                <Heading>
                                    You need to purchase the NFT to watch this video!
                                </Heading>
                                <Center>
                                    <Button colorScheme={"teal"} onClick={handleBuy}>
                                        Purchase NFT for {price} TFIL
                                    </Button>
                                </Center>
                            </div>
                        )
                    }
                    {
                        !videoDetails.videoLink &&
                        <Skeleton height={500}/>
                    }

                    <Stack w="95%" my={7}>
                        <Flex justifyContent="space-between">
                            <Heading size={"md"} mx={5}>{videoDetails?.title || "Loading"}</Heading>
                            {mounted &&
                                <Text>{new Date(videoDetails?.uploadDate).toLocaleDateString(navigator.language, {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                })}</Text>
                            }
                        </Flex>
                        <Text mx={5} px={5}>{videoDetails?.description || "Loading"}</Text>
                        <Flex mx={5} px={5} mt={6}>
                            <Avatar src={creator?.image || ""} name={creator?.name}/>
                            <Heading size={"md"} ml={3} mt={2}>{creator?.name || "Loading"}</Heading>
                        </Flex>
                    </Stack>
                    <Stack w="95%">
                        <Card>
                            <CardBody>
                                <Text>Express your thoughts!</Text>
                                <InputGroup size='md'>
                                    <Input
                                        value={comment} onChange={(e) => {
                                        setComment(e.target.value)
                                    }}
                                        placeholder='Write something you felt or thought about while watching this video!'
                                    />
                                    <InputRightElement width={"fit-content"}>
                                        <Button onClick={postComment} isLoading={loading}>
                                            Post Comment
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                            </CardBody>
                        </Card>
                        {!videoDetails?.comments &&
                            <Card>
                                <CardBody>
                                    <Text>No Comments on this video yet</Text>
                                </CardBody>
                            </Card>
                        }
                        {fetched && videoDetails?.comments?.map((comment: any) => {
                            return (
                                <Comment key={comment.id} id={comment.id}/>
                            )
                        })}
                    </Stack>
                </Box>
            </Navbar>
        </>
    )
}