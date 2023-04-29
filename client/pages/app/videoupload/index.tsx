import React, { useEffect, useState } from 'react'
import Navbar from "../../../components/NavBar/NavBar";
import { Box, Center, Checkbox, FormControl, FormLabel, HStack, Image as ChakraImage, Input, Stack, Text, Textarea } from '@chakra-ui/react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import HuddleLogo from "../../../assets/HuddleLogo.webp";
import Image from 'next/image';
import axios, { AxiosHeaderValue } from 'axios';
import { useAccount } from 'wagmi'
import { useRouter } from 'next/router';
import lighthouseUpload from '../../../lib/lightHouseUploadFile';
import { Progress } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';

const index = () => {
  const [selectedFile, setSelectedFile] = useState()
  const { address } = useAccount()
  const [preview, setPreview] = useState<string | undefined>('');
  const router = useRouter();
  const [progressBarValue, setprogressBarValue] = useState(0);
  const toast = useToast()
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
    
    if(progressBarValue==100)
    {
      toast({
        title: 'Video Upload Succesfull.',
          description: "Your Video is Now Uploaded Succesfully!",
          status: 'success',
          duration: 3000,
          isClosable: true,
      })
    }
  
  
  }, [progressBarValue])
  
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

  // const uploadFile = async(e:any) =>{
  //   console.log(e.target.files[0]);

  //   // Push file to lighthouse node
  //   // Both file and folder are supported by upload function
  //   const output = await lighthouse.upload(e.target.files[0].name, "6e121ef8.fbd921bfe33a44ad85a633064ac18ed5", progressCallback);
  //   console.log('File Status:', output);
  //   /*
  //     output:
  //       data: {
  //         Name: "filename.txt",
  //         Size: 88000,
  //         Hash: "QmWNmn2gr4ZihNPqaC5oTeePsHvFtkWNpjY3cD6Fd5am1w"
  //       }
  //     Note: Hash in response is CID.
  //   */

  //     console.log('Visit at https://gateway.lighthouse.storage/ipfs/' + output.data.Hash);
  // }
  const uploadFile = async (e: any) => {
    e.persist()

    if (process.env.NEXT_PUBLIC_LIGHTHOUSE_KEY) {
      const output = await lighthouseUpload(e, process.env.NEXT_PUBLIC_LIGHTHOUSE_KEY, progressCallback);
      console.log('File Status:', output);
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
    }
    catch (error: any) {
      console.log(error);

    }
  }
  return (
    <Navbar>
      <Center w="100%" h="80vh" border={"1px"} borderColor={"black"} >
        <Stack flexDirection={"column"} border={"1px"} borderColor={"black"} borderRadius={"20px"} w="70%" h="70%" p={"8px"} alignItems={"center"} >
          <Stack flexDirection={"row"} justifyContent={"space-between"} h="30%" alignItems={"center"} w="80%">
            <FormControl>
              <FormLabel>Video Name</FormLabel>
              <Input placeholder='My Fantasitc Rodeo' w="50%" />
            </FormControl>
            {selectedFile &&
              <HStack boxSize='100%' fontSize={'4xl'} justifyContent={"space-evenly"} >
                <AiOutlineCloseCircle onClick={resetFile} fontSize={'4xl'} />
                <ChakraImage src={preview} boxSize='90%' fit={'contain'} />
              </HStack>
            }
            {!selectedFile && <>
              <FormControl>
                <FormLabel>Upload Image Here</FormLabel>
                <Input placeholder='Upload your Images' type='file' h='80%' textAlign={'center'} onChange={onSelectFile} />
              </FormControl>
            </>}
          </Stack>

          <Stack flexDirection={"row"} justifyContent={"space-between"} h="30%" alignItems={"center"} w="80%">
            <FormControl w='60%'>
              <FormLabel>Video Description</FormLabel>
              <Textarea placeholder="The most awesome video of my First Rodeo" />
            </FormControl>
            <FormControl w="fit-content" fontSize={"18px"}>
              <Checkbox size='lg'  >IsTokenGated?</Checkbox>
            </FormControl>
          </Stack>
          <Stack flexDirection={"row"} justifyContent={"space-between"} h="50%" alignItems={"center"} w="80%" >
            <Box display={'flex'} flexDirection={'column'} justifyContent={'space-evenly'} alignItems={'center'} _hover={{
              cursor: "pointer",
            }} onClick={() => {
              getAndNavigateToRoom();
            }}>
              <Text>Record the Video Using Huddle01</Text>
              <Image src={HuddleLogo} alt='Huddele Logo' />
            </Box>

            <Box display={'flex'} flexDirection={'column'} justifyContent={'space-evenly'} alignItems={'center'} rowGap={"1vh"}>
              <Text> Store a pre-recorded video on Lighthouse!</Text>
              <Input placeholder='My Video' type="file" onChange={e => uploadFile(e)} />
              <Progress value={progressBarValue} colorScheme='green' size={"md"} w="100%" />
              {progressBarValue==100 && <Text>File Upload Succesfull!</Text> }
            </Box>

          </Stack>

        </Stack>
      </Center>
    </Navbar>
  )
}

export default index