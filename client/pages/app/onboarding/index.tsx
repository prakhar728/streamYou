import React, { useEffect, useState } from 'react'
import Navbar from "../../../components/NavBar/NavBar";
import { Box, Center, FormControl, FormLabel, HStack, Input, Stack, Textarea, VStack } from '@chakra-ui/react';
import { Image } from '@chakra-ui/react';
import {AiOutlineCloseCircle} from "react-icons/ai";
const index = () => {
    const [selectedFile, setSelectedFile] = useState()
    const [preview, setPreview] = useState<string|undefined>('')
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
     const resetFile = (e:any)=>{
        setSelectedFile(undefined)
     }
     const onSelectFile = (e:any) => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined)
            return
        }

        // I've kept this example simple by using the first image instead of multiple
        setSelectedFile(e.target.files[0])
    }

    return (
        <div>
            <Navbar>
                <Center  h='80vh'>
                    <Box w={[600, 500, 900]}  h={['80%']} >
                        <Stack direction='column' justifyContent={'space-evenly'}  border='1px' borderColor='gray.400'h='100%' borderRadius={'24'}   >
                            <Stack direction='row' justifyContent={'space-evenly'}    h='30%'>
                                <Stack >
                                    <FormControl display="flex" flexDirection={'column'}  h='100%'  justifyContent={'space-evenly'} >
                                    {selectedFile &&  
                                    <HStack boxSize='100%' fontSize={'4xl'}>
                                        <Image src={preview} boxSize='100%' fit={'contain'} /> 
                                        <AiOutlineCloseCircle onClick={resetFile} fontSize={'4xl'}/>
                                    </HStack>
                                    }
                                    {!selectedFile && <>
                                        <FormLabel>Upload Image Here</FormLabel>
                                        <Input placeholder='Upload your Images' type='file' h='80%'textAlign={'center'}  onChange={onSelectFile}/>
                                    </> }
                                        
                                    </FormControl>
                                </Stack>
                                <VStack justifyContent={'space-between'}>
                                    <FormControl>
                                        <FormLabel>Channel Name</FormLabel>
                                        <Input placeholder='Fantastic Rider' />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Nft Contract Address</FormLabel>
                                        <Input placeholder='0x000000' />
                                    </FormControl>

                                </VStack>
                            </Stack>
                            <Stack direction='row' justifyContent={'center'}  h='40%'>
                                <Box w='80%'>
                                    <FormLabel>Channel Description</FormLabel>
                                    <Textarea placeholder='Channel Description' size='lg' h='80%' />
                                </Box>
                            </Stack>
                        </Stack>
                    </Box>
                </Center>
            </Navbar>
        </div>
    )
}

export default index