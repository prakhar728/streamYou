import React, {useEffect, useState} from 'react'
import Navbar from "../../../components/NavBar/NavBar";
import {
    Box,
    Center,
    Checkbox,
    FormControl,
    FormLabel,
    HStack,
    Image as ChakraImage,
    Input,
    Stack,
    Text,
    Textarea
} from '@chakra-ui/react';
import {AiOutlineCloseCircle} from 'react-icons/ai';
import Huddle from "../../../components/Huddle";
import HuddleLogo from "../../../assets/HuddleLogo.webp";
import Link from 'next/link';
import {Link as ChakraLink} from '@chakra-ui/react';
import LightHouseSDK from "../../../assets/lightHouseLogo.svg"
import Image from 'next/image';
import axios, {AxiosHeaderValue} from 'axios';
import {useAccount} from 'wagmi'
import {useRouter} from 'next/router';

export default function Index() {
    const [selectedFile, setSelectedFile] = useState()
    const {address} = useAccount()
    const [preview, setPreview] = useState<string | undefined>('');
    const router = useRouter();
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
    return (
        <Navbar>
            <Center w="100%" h="80vh" border={"1px"} borderColor={"black"}>
                <Stack flexDirection={"column"} border={"1px"} borderColor={"black"} borderRadius={"20px"} w="70%"
                       h="70%" p={"8px"} alignItems={"center"}>
                    <Stack flexDirection={"row"} justifyContent={"space-between"} h="30%" alignItems={"center"} w="80%">
                        <FormControl>
                            <FormLabel>Video Name</FormLabel>
                            <Input placeholder='My Fantasitc Rodeo' w="50%"/>
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
                                <Input placeholder='Upload your Images' type='file' h='80%' textAlign={'center'}
                                       onChange={onSelectFile}/>
                            </FormControl>
                        </>}
                    </Stack>
                    <Stack flexDirection={"row"} justifyContent={"space-between"} h="30%" alignItems={"center"} w="80%">
                        <FormControl w='60%'>
                            <FormLabel>Video Description</FormLabel>
                            <Textarea placeholder="The most awesome video of my First Rodeo"/>
                        </FormControl>
                        <FormControl w="fit-content" fontSize={"18px"}>
                            <Checkbox size='lg'>IsTokenGated?</Checkbox>
                        </FormControl>
                    </Stack>
                    <Stack flexDirection={"row"} justifyContent={"space-between"} h="50%" alignItems={"center"} w="80%">
                        <Box display={'flex'} flexDirection={'column'} justifyContent={'space-evenly'}
                             alignItems={'center'} _hover={{
                            cursor: "pointer",
                        }} onClick={() => {
                            getAndNavigateToRoom();
                        }}>
                            <Text>Record the Video Using Huddle01</Text>
                            <Image src={HuddleLogo} alt='Huddele Logo'/>
                        </Box>

                        <Box display={'flex'} flexDirection={'column'} justifyContent={'space-evenly'}
                             alignItems={'center'}>
                            <ChakraLink as={Link} href="/Lighthouse">
                                <Text> Store a pre-recorded video on Lighthouse!</Text>
                            </ChakraLink>
                            <Image src={LightHouseSDK} alt='Huddele Logo'/>
                        </Box>

                    </Stack>

                </Stack>
            </Center>
        </Navbar>
    )
}