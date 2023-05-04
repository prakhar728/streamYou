import React, {useEffect, useRef, useState} from 'react'
import {useRouter} from 'next/router'
import Navbar from "../../../components/NavBar/NavBar";
import {Box, Button, Center, Stack} from '@chakra-ui/react';
import {useEventListener, useHuddle01} from '@huddle01/react';
import {useAudio, useLobby, useRecording, useRoom, useVideo} from '@huddle01/react/hooks';
import {Audio, Video} from '@huddle01/react/components';
import {useToast} from '@chakra-ui/react'

export default function Room() {
    const toast = useToast();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [camOn, setcamOn] = useState(false);
    const {initialize, isInitialized} = useHuddle01();
    useEffect(() => {
        // its preferable to use env vars to store projectId
        console.log(process.env.NEXT_PUBLIC_PROJECT_ID);

        if (process.env.NEXT_PUBLIC_PROJECT_ID)
            initialize(process.env.NEXT_PUBLIC_PROJECT_ID);
    }, []);


    const router = useRouter();
    const {roomid} = router.query;
    console.log();

    const {joinLobby, leaveLobby} = useLobby();
    const {
        startRecording,
        stopRecording,
        isStarting,
        inProgress,
        isStopping,
        error: RecordingError,
        data: recordingData,
    } = useRecording();
    const {
        fetchAudioStream,
        stopAudioStream,
        error: micError,
        produceAudio,
        stopProducingAudio,
        stream: audioStream
    } = useAudio();
    const {
        fetchVideoStream,
        stopVideoStream,
        error: camError,
        produceVideo,
        stopProducingVideo,
        stream: videoStream
    } = useVideo();
    const {joinRoom, leaveRoom, isLoading, isRoomJoined, error} = useRoom();

    //ALL THE EVENT LISTENERS


    useEventListener("lobby:joined", () => {
        toast({
            title: 'LOBBY JOINED!',
            description: "Connected to Room Lobby",
            status: 'success',
            duration: 4000,
            isClosable: true,
        })
    });

    useEventListener("lobby:failed", () => {
        toast({
            title: 'FAILED JOINING!',
            description: "Failed to Connect to Lobby",
            status: 'error',
            duration: 4000,
            isClosable: true,
        })
    });

    useEventListener("lobby:cam-on", () => {
        if (videoStream && videoRef.current) {
            toast({
                title: 'CAMERA ON',
                description: "Your Camera is now On!",
                status: 'success',
                duration: 4000,
                isClosable: true,
            })
            setcamOn(true)
            videoRef.current.srcObject = videoStream;
        }
    });

    useEventListener("lobby:cam-off", () => {
        toast({
            title: 'CAMERA OFF',
            description: "Your Camera is now OFF!",
            status: 'success',
            duration: 4000,
            isClosable: true,
        })
        setcamOn(false)

    });

    useEventListener("lobby:mic-on", () => {
        toast({
            title: 'MIC ON',
            description: "Your Mic is now ON!",
            status: 'success',
            duration: 4000,
            isClosable: true,
        })
    });
    useEventListener("lobby:mic-off", () => {
        toast({
            title: 'MIC OFF',
            description: "Your Mic is now OFF!",
            status: 'success',
            duration: 4000,
            isClosable: true,
        })
    });
    useEventListener("room:joined", () => {
        toast({
            title: 'ROOM JOINED',
            description: "You are now connected to the ROOM!",
            status: 'success',
            duration: 4000,
            isClosable: true,
        })
    });
    useEventListener("room:failed", () => {
        toast({
            title: 'ROOM FAILED',
            description: "Failed to Join the Room",
            status: 'error',
            duration: 4000,
            isClosable: true,
        })
    });

    useEventListener("room:recording-started", () => {
        toast({
            title: 'RECORDING STARTED',
            description: "Room Recording has Started",
            status: 'success',
            duration: 4000,
            isClosable: true,
        })
    });

    useEventListener("room:recording-stopped", () => {
        console.log(recordingData);
        localStorage.setItem("recordingData", JSON.stringify(recordingData));
        toast({
            title: 'RECORDING STOPPED',
            description: "Room Recording is Stopped",
            status: 'success',
            duration: 4000,
            isClosable: true,
        })
        setTimeout(() => {
            router.push("/app/videoupload")
        }, 4000)
    });

    useEventListener("room:failed", () => {
        toast({
            title: 'ROOM FAILED',
            description: "Failed to Join the Room",
            status: 'error',
            duration: 4000,
            isClosable: true,
        })
    });
    if (roomid && typeof (roomid) == "string")
        return (
            <Navbar>
                <Box border="1px" borderColor={"black"} h='85vh'>
                    <Box h='100%' border="1px" borderColor={"black"} display={"flex"} flexDirection={"column"}
                         alignItems={"center"}>
                        {/* {(joinLobby.isCallable && fetchVideoStream.isCallable)  && <Center w="40vw" border="1px" borderColor={"black"} h="60vh">
                            Your Video is off!
                        </Center>}
                        {!fetchVideoStream.isCallable && !joinLobby.isCallable && <video ref={videoRef} autoPlay muted id="videoStream"></video>} */}
                        {!fetchVideoStream.isCallable && !joinLobby.isCallable ?
                            <video ref={videoRef} autoPlay muted id="videoStream"></video> :
                            <Center w="40vw" border="1px" borderColor={"black"} h="60vh">
                                Your Video is off!
                            </Center>}
                        <Stack h='20%' columnGap={"2vw"} flexDirection={'row'}
                               alignItems={'center'} justifyContent={'space-evenly'} flexWrap={'wrap'} w="80%">
                            <Button isDisabled={!joinLobby.isCallable}
                                    onClick={() => joinLobby(roomid)} colorScheme='blue'>
                                Join Lobby
                            </Button>
                            <Button isDisabled={joinLobby.isCallable}
                                    onClick={() => leaveLobby()} colorScheme='blue'>
                                Leave Lobby
                            </Button>
                            <Button isDisabled={!joinRoom.isCallable} onClick={joinRoom} colorScheme='blue'>
                                JOIN_ROOM
                            </Button>


                            <Button isDisabled={!leaveRoom.isCallable} onClick={leaveRoom} colorScheme='blue'>
                                LEAVE_ROOM
                            </Button>
                            <Button isDisabled={!fetchAudioStream.isCallable} onClick={fetchAudioStream}
                                    colorScheme='blue'>
                                FETCH_AUDIO_STREAM
                            </Button>

                            <Button isDisabled={fetchAudioStream.isCallable} onClick={stopAudioStream}
                                    colorScheme='blue'>
                                STOP AUDIO STREAM
                            </Button>
                            {/* Webcam */}
                            <Button isDisabled={!fetchVideoStream.isCallable} onClick={fetchVideoStream}
                                    colorScheme='blue'>
                                FETCH_VIDEO_STREAM
                            </Button>
                            <Button isDisabled={!stopVideoStream.isCallable} onClick={stopVideoStream}
                                    colorScheme='blue'>
                                STOP VIDEO STREAM
                            </Button>
                            <Button colorScheme='blue' isDisabled={!produceVideo.isCallable}
                                    onClick={() => produceVideo(videoStream)}>
                                Produce Cam
                            </Button>

                            <Button colorScheme='blue' isDisabled={!produceAudio.isCallable}
                                    onClick={() => produceAudio(audioStream)}>
                                Produce Mic
                            </Button>

                            <Button colorScheme='blue' isDisabled={!stopProducingVideo.isCallable}
                                    onClick={stopProducingVideo}>
                                Stop Producing Cam
                            </Button>

                            <Button colorScheme='blue' isDisabled={!stopProducingAudio.isCallable}
                                    onClick={stopProducingAudio}>
                                Stop Producing Mic
                            </Button>

                            <Button disabled={!startRecording.isCallable} onClick={() => {
                                console.log(`${process.env.NEXT_PUBLIC_BASE_URL}app/rec?roomId=${roomid}`);
                                startRecording(`${process.env.NEXT_PUBLIC_BASE_URL}app/rec?roomId=${roomid}`)
                            }}
                                    colorScheme='blue'>
                                START_RECORDING
                            </Button>

                            <Button disabled={stopRecording.isCallable} onClick={stopRecording} colorScheme='blue'>
                                STOP_RECORDING
                            </Button>
                        </Stack>
                    </Box>
                </Box>
            </Navbar>
        )
}