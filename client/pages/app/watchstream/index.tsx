import React, { useEffect, useState } from 'react'
import Navbar from "../../../components/NavBar/NavBar";
import { Avatar, Box, Button, Card, CardBody, Flex, Heading, Input, InputGroup, InputRightElement, Stack, Text } from '@chakra-ui/react';
import Head from "next/head";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import { useContract } from "../../../hooks/useContract";
import { useIsMounted } from "../../../hooks/useIsMounted";
import { getCreator, getVideo } from "../../../lib/polybase";
import axios from 'axios';

export default function Watchstream() {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const { balanceOf, getChainId } = useContract()
  const mounted = useIsMounted()

  const [loading, setLoading] = useState(false)
  const [creator, setCreator] = useState<any>({})
  const [videoDetails, setVideoDetails] = useState<any>({})
  const [comment, setcomment] = useState<string>("")
  useEffect(() => {
    if (mounted && router.isReady) {
      if (!isConnected) {
        alert("Connect to Wallet to Continue!")
        router.back()
      }
      const { video } = router.query
      if (video) {
        getVideo(video as string).then((res) => {
          console.log(res)
          setVideoDetails(res.response.data)
          getCreator(res.response.data.channelId).then((res) => {
            console.log(res)
            setCreator(res.response.data)
          })
        })
      }
    }
  }, [mounted, router.query, isConnected])

  const postComment = (e:any)=>{
    console.log(e.target.value);
    
  } 

  return (
    <>
      <Head>
        <title>Watch Stream</title>
      </Head>
      <Navbar>
        <Box display="flex" alignItems={"center"} flexDirection={"column"} minH={"90vh"}>
          {
            videoDetails &&
            <video controls autoPlay id="videoPlayerWindow">
              <source
                src={videoDetails.videoLink}
                type="video/webm" />
            </video>
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
              <Avatar src={creator?.image || ""} name={creator?.name} />
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
                    setcomment(e.target.value)
                  }} placeholder='Write something you felt or thought about while watching this video!'
                  />
                  <InputRightElement width={"fit-content"} >
                    <Button onClick={postComment}>
                      Post Comment
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Text>User Name</Text>
                <Text>View a summary of all your customers over the last month.</Text>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Text>User Name</Text>
                <Text>View a summary of all your customers over the last month.</Text>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Text>User Name</Text>
                <Text>View a summary of all your customers over the last month.</Text>
              </CardBody>
            </Card>
          </Stack>
        </Box>
      </Navbar>
    </>
  )
}