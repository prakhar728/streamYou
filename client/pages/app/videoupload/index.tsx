import React, {useEffect, useState} from 'react'
import Navbar from "../../../components/NavBar/NavBar";
import {
    Box, Button,
    Center,
    Checkbox,
    FormControl,
    FormLabel,
    HStack,
    Image as ChakraImage,
    Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField,
    NumberInputStepper,
    Stack,
    Text,
    Textarea
} from '@chakra-ui/react';
import {AiOutlineCloseCircle} from 'react-icons/ai';
import HuddleLogo from "../../../assets/HuddleLogo.webp";
import Link from 'next/link';
import {Link as ChakraLink} from '@chakra-ui/react';
import LightHouseSDK from "../../../assets/lightHouseLogo.svg"
import Image from 'next/image';
import axios, {AxiosHeaderValue} from 'axios';
import {useAccount} from 'wagmi'
import {useRouter} from 'next/router';
import lighthouseUpload from '../../../lib/lightHouseUploadFile';
import {Progress} from '@chakra-ui/react';
import {useToast} from '@chakra-ui/react';
import {useContract} from "../../../hooks/useContract";
import {addVideo, getCreator} from "../../../lib/polybase";
import Head from "next/head";
import {uploadLighthouse} from "../../../lib/uploadLighthouse";
import {jsonToFile} from "../../../lib/jsonToFile";
import {useCreatorContext} from "../../../contexts/CreatorContext";

export default function Index() {
    const {address} = useAccount()
    const router = useRouter();
    const toast = useToast()
    const {createToken, getChainId, getCurrentToken} = useContract()
    const {creatorId, isCreator} = useCreatorContext()

    const [selectedFile, setSelectedFile] = useState()
    const [preview, setPreview] = useState<string | undefined>('');
    const [progressBarValue, setprogressBarValue] = useState(0)
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        title: '',
        description: '',
        isTokenGated: false,
        price: "0",
    })
    const [lightHouseLink, setLightHouseLink] = useState<string>('')
    const [huddleExists, setHuddleExists] = useState<boolean>(false)
    const [count, setCount] = useState(0)

    useEffect(() => {
        if (!isCreator) {
            alert("You are not a creator. Please create a creator account to upload videos.")
            router.push("/app/onboarding")
        }
    }, [isCreator])

    useEffect(() => {
        if (!selectedFile) {
            setPreview(undefined)
            return
        }
        // create the preview
        const objectUrl = URL.createObjectURL(selectedFile)
        setPreview(objectUrl)
        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])

    useEffect(() => {
        if (localStorage.getItem("recordingData") !== null) {
            // @ts-ignore
            const recordingData = JSON.parse(localStorage.getItem("recordingData"))
            setLightHouseLink(recordingData.s3link)
            setHuddleExists(true)
        }
    }, [localStorage])

    useEffect(() => {
        if (progressBarValue == 100) {
            toast({
                title: 'Video Upload Succesfull.',
                description: "Your Video is Now Uploaded Succesfully!",
                status: 'success',
                duration: 3000,
                isClosable: true,
            })
        }
    }, [progressBarValue])

    useEffect(() => {
        console.log(lightHouseLink)
        console.log(count)
    }, [count])

    const resetFile = (e: any) => {
        setSelectedFile(undefined)
    }

    const onSelectFile = (e: any) => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined)
            return
        }
        setSelectedFile(e.target.files[0])
    }
    const progressCallback = (progressData: any) => {
        let completedTillNow = (progressData?.total / progressData?.uploaded)?.toFixed(2);
        console.log(completedTillNow);

        let percentageDone =
            100 - parseInt(completedTillNow);
        setprogressBarValue(percentageDone);
        console.log(percentageDone);
    };

    const uploadFile = async (e: any) => {
        e.persist()

        if (process.env.NEXT_PUBLIC_LIGHTHOUSE_KEY) {
            const output = await lighthouseUpload(e, process.env.NEXT_PUBLIC_LIGHTHOUSE_KEY, progressCallback);
            console.log('File Status:', output);
            setLightHouseLink(`https://gateway.lighthouse.storage/ipfs/${output.data.Hash}`);
            setCount(prev => prev + 1)
        }
    }
    const getAndNavigateToRoom = async () => {

        try {
            if (process.env.NEXT_PUBLIC_HUDDLE_KEY) {
                const HUDDLE_KEY: AxiosHeaderValue | undefined = process.env.NEXT_PUBLIC_HUDDLE_KEY;

                const response = await axios.post(
                    'https://iriko.testing.huddle01.com/api/v1/create-room',
                    {
                        title: 'Personal Cam',
                        hostWallets: [address],
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'x-api-key': HUDDLE_KEY,
                        },
                    }
                );
                // console.log(response.data.data.roomId);

                const roomId = response.data.data.roomId;
                router.push(`/app/video?roomid=${roomId}`)
            }
        } catch (error: any) {
            console.log(error);

        }
    }

    const onSubmit = async (e: any) => {
        e.preventDefault()
        setLoading(true)
        if (!selectedFile) {
            toast({
                title: 'Image Upload Failed.',
                description: "Please Select an Image to Upload",
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            return
        }
        if (!form.title || !form.description || !lightHouseLink) {
            toast({
                title: 'Form Submission Failed.',
                description: "Please Fill all the Fields",
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            return
        }
        let channelName = ""
        try {
            const creator = await getCreator(creatorId)
            console.log(creator);
            channelName = creator.response.data.name
            console.log(channelName, creatorId)
        } catch (error: any) {
            console.log(error);
            toast({
                title: 'Form Submission Failed.',
                description: "Make sure you have registered as a creator",
            })
            return
        }
        const thumbnail = await uploadLighthouse([selectedFile])
        const thumbnailLink = `https://gateway.lighthouse.storage/ipfs/${thumbnail.data.Hash}`
        console.log({thumbnailLink, lightHouseLink})
        let polybaseData = {
            id: `${channelName}-${form.title}`,
            title: form.title,
            description: form.description,
            thumbnail: thumbnailLink,
            isTokenGated: form.isTokenGated.toString(),
            creatorId: creatorId,
            channelId: creatorId,
            uploadDate: new Date().toISOString(),
            tokenId: "-1",
            videoLink: lightHouseLink,
        }
        if (form.isTokenGated) {
            const metadata = {
                name: form.title,
                description: form.description,
                image: thumbnailLink,
                external_url: lightHouseLink,
            }
            const metadataFile = jsonToFile(metadata, 'metadata.json')
            const metadataHash = await uploadLighthouse([metadataFile])
            const metadataLink = `https://gateway.lighthouse.storage/ipfs/${metadataHash.data.Hash}`
            console.log(metadataLink)
            await createToken(channelName, metadataLink, form.price)
            const token = await getCurrentToken()
            polybaseData.tokenId = token.toString()
        }
        try {
            const polybaseRes = await addVideo(polybaseData)
            console.log(polybaseRes)
        } catch (e) {
            console.log(e)
        }
        toast({
            title: 'Form Submission Successful.',
            description: "Your Video is Now Uploaded Succesfully!",
            status: 'success',
            duration: 3000,
            isClosable: true,
        })
        localStorage.removeItem("recordingData")
        setLoading(false)
    }
    return (
        <>
            <Head>
                <title>Upload Video</title>
            </Head>
            <Navbar>
                <Center w="100%" h="80vh">
                    <Stack flexDirection={"column"} border={"1px"} borderColor={"black"} borderRadius={"20px"} w="70%"
                           h="70%" p={"8px"} alignItems={"center"}>
                        <Stack flexDirection={"row"} justifyContent={"space-between"} h="30%" alignItems={"center"}
                               w="80%">
                            <FormControl>
                                <FormLabel>Video Name</FormLabel>
                                <Input placeholder='My Fantasitc Rodeo' w="50%" onChange={
                                    (e) => setForm({...form, title: e.target.value})
                                }/>
                            </FormControl>
                            {selectedFile &&
                                <HStack boxSize='100%' fontSize={'4xl'} justifyContent={"space-evenly"}>
                                    <AiOutlineCloseCircle onClick={resetFile} fontSize={'4xl'}/>
                                    <ChakraImage src={preview} boxSize='90%' fit={'contain'}/>
                                </HStack>
                            }
                            {!selectedFile && <>
                                <FormControl>
                                    <FormLabel>Upload Image Here</FormLabel>
                                    <Input placeholder='Upload your Images' type='file' accept="image/*" h='80%'
                                           textAlign={'center'}
                                           onChange={onSelectFile}/>
                                </FormControl>
                            </>}
                        </Stack>

                        <Stack flexDirection={"row"} justifyContent={"space-between"} h="30%" alignItems={"center"}
                               w="80%">
                            <FormControl w='60%'>
                                <FormLabel>Video Description</FormLabel>
                                <Textarea placeholder="The most awesome video of my First Rodeo" required onChange={
                                    (e) => setForm({...form, description: e.target.value})
                                }/>
                            </FormControl>
                            <Stack>
                                <FormControl w="fit-content" fontSize={"18px"}>
                                    <Checkbox size='lg' required onChange={
                                        (e) => setForm({...form, isTokenGated: e.target.checked})
                                    }>IsTokenGated?</Checkbox>
                                </FormControl>
                                {form.isTokenGated &&
                                    <FormControl w="fit-content" fontSize={"18px"}>
                                        <FormLabel>Token Price</FormLabel>
                                        <NumberInput size='sm' maxW={90} precision={2} placeholder="Token Price"
                                                     defaultValue={1.2} min={0} onChange={
                                            (e) => setForm({...form, price: e})
                                        }>
                                            <NumberInputField/>
                                            <NumberInputStepper>
                                                <NumberIncrementStepper/>
                                                <NumberDecrementStepper/>
                                            </NumberInputStepper>
                                        </NumberInput>
                                    </FormControl>}
                            </Stack>
                        </Stack>
                        <Stack flexDirection={"row"} justifyContent={"space-between"} h="50%" alignItems={"center"}
                               w="80%">
                            {!huddleExists &&
                                <>
                                    <Box display={'flex'} flexDirection={'column'}
                                         justifyContent={'space-evenly'} alignItems={'center'}
                                         _hover={{cursor: "pointer"}} onClick={() => {
                                        getAndNavigateToRoom();
                                    }}>
                                        <Text>Record the Video Using Huddle01</Text>
                                        <Image src={HuddleLogo} alt='Huddele Logo'/>
                                    </Box>

                                    <Box display={'flex'} flexDirection={'column'} justifyContent={'space-evenly'}
                                         alignItems={'center'} rowGap={"1vh"}>
                                        <Text> Store a pre-recorded video on Lighthouse!</Text>
                                        <Input placeholder='My Video' type="file" accept="video/*"
                                               onChange={e => uploadFile(e)}/>
                                        {progressBarValue != 99 &&
                                            <Progress value={progressBarValue} colorScheme='green' size={"md"}
                                                      w="100%"/>}
                                        {progressBarValue == 99 && <Text>File Upload Successful!</Text>}
                                    </Box>
                                </>
                            }
                            {huddleExists &&
                                <Text>Huddle Recording Link: {lightHouseLink}</Text>
                            }

                        </Stack>
                        <Stack direction='row' justifyContent='center' h="8.5%">
                            <Box w='80%'>
                                <Button isLoading={loading} type="submit" colorScheme="telegram" p={4} size="lg"
                                        fontSize={'2xl'}
                                        h='80%' onClick={onSubmit}>
                                    Submit
                                </Button>
                            </Box>
                        </Stack>

                    </Stack>
                </Center>
            </Navbar>
        </>
    )
}