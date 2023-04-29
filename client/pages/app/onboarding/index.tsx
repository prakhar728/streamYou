import React, {useEffect, useState} from 'react'
import Navbar from "../../../components/NavBar/NavBar";
import {
    Box,
    Button,
    Center,
    Checkbox,
    FormControl,
    FormLabel,
    HStack,
    Input,
    Stack,
    Textarea, useToast,
    VStack
} from '@chakra-ui/react';
import {Image} from '@chakra-ui/react';
import {AiOutlineCloseCircle} from "react-icons/ai";
import Head from "next/head";
import {uploadSpheron} from "../../../lib/uploadSpheron";
import {useContract} from "../../../hooks/useContract";
import {createCreator} from "../../../lib/polybase";
import {useAccount} from "wagmi";

export default function Index() {
    const toast = useToast()
    const {address} = useAccount()
    const {createChannel, getChainId, channelExists} = useContract()
    const [loading, setLoading] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File>()
    const [form, setForm] = useState({
        title: '',
        description: '',
        nft: true
    })

    const [preview, setPreview] = useState<string | undefined>('')
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

    const onSubmit = async (e: any) => {
        e.preventDefault()
        setLoading(true)
        if(!form.title || !form.description || !selectedFile) {
            toast({
                title: "Missing Fields",
                description: "Please fill out all fields",
                status: "error",
                duration: 9000,
                isClosable: true,
            })
            setLoading(false)
            return
        }
        const exists = await channelExists(form.title)
        if(exists) {
            toast({
                title: "Channel Exists",
                description: "A channel with this name already exists",
                status: "error",
                duration: 9000,
                isClosable: true,
            })
            setLoading(false)
            return
        }
        const uploadRes = await uploadSpheron(selectedFile)
        const imageLink = `${uploadRes!.protocolLink}/${selectedFile.name}`
        console.log(imageLink)
        try{
            await createChannel(form.title)
            const chainId = await getChainId()
            const polybaseRes = await createCreator({
                id: `${address!}-${chainId}`,
                name: form.title,
                description: form.description,
                image: imageLink,
            })
            console.log(polybaseRes)
            toast({
                title: "Success",
                description: "Your creator profile has been created",
                status: "success",
                duration: 9000,
                isClosable: true,
            })
        } catch (e){
            console.log(e)
            toast({
                title: "Error",
                description: "Something went wrong",
                status: "error",
                duration: 9000,
                isClosable: true
            })
        }
        setLoading(false)
    }

    return (
        <>
            <Head>
                <title>Onboarding</title>
            </Head>
            <div>
                <Navbar>
                    <Center h='80vh'>
                        <Box w={[600, 500, 900]} h={['80%']}>
                            {/*<form>*/}
                                <Stack direction='column' justifyContent={'space-evenly'} border='1px'
                                       borderColor='gray.400'
                                       h='100%' borderRadius={'24'}>
                                    <Stack direction='row' justifyContent={'space-evenly'} h='30%'>
                                        <Stack>
                                            <FormControl display="flex" flexDirection={'column'} h='100%'
                                                         justifyContent={'space-evenly'}>
                                                {selectedFile &&
                                                    <HStack boxSize='100%' fontSize={'4xl'}>
                                                        <Image src={preview} boxSize='100%' fit={'contain'}/>
                                                        <AiOutlineCloseCircle onClick={resetFile} fontSize={'4xl'}/>
                                                    </HStack>
                                                }
                                                {!selectedFile && <>
                                                    <FormLabel>Upload Image Here</FormLabel>
                                                    <Input required placeholder='Upload your Images' type='file' h='80%'
                                                           textAlign={'center'} onChange={onSelectFile}/>
                                                </>}

                                            </FormControl>
                                        </Stack>
                                        <VStack justifyContent={'space-between'}>
                                            <FormControl>
                                                <FormLabel>Channel Name</FormLabel>
                                                <Input required placeholder='Fantastic Rider' onChange={
                                                    (e) => setForm({...form, title: e.target.value})
                                                } />
                                            </FormControl>
                                            {/* ADD BOOLEAN CHECKBOX */}
                                            <FormControl>
                                                <FormLabel>Nft Contract Address</FormLabel>
                                                <Checkbox defaultChecked onChange={
                                                    (e) => setForm({...form, nft: e.target.checked})
                                                }>Create NFT to token gate your content</Checkbox>
                                            </FormControl>

                                        </VStack>
                                    </Stack>
                                    <Stack direction='row' justifyContent={'center'} h='40%'>
                                        <Box w='80%'>
                                            <FormLabel>Channel Description</FormLabel>
                                            <Textarea required placeholder='Channel Description' size='lg' h='80%'  onChange={
                                                (e) => setForm({...form, description: e.target.value})
                                            }/>
                                        </Box>
                                    </Stack>
                                    <Stack direction='row' justifyContent='center' h="7.5%">
                                        <Box w='80%'>
                                            <Button isLoading={loading} type="submit" colorScheme="teal" size="lg" fontSize={'2xl'}
                                                    h='80%' onClick={onSubmit}>
                                                Submit
                                            </Button>
                                        </Box>
                                    </Stack>
                                </Stack>
                            {/*</form>*/}
                        </Box>
                    </Center>
                </Navbar>
            </div>
        </>
    )
}