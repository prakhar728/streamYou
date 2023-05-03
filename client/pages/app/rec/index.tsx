import React, {useEffect, useRef, useState} from "react";

import {Audio, Video} from "@huddle01/react/components";

import {usePeers} from "@huddle01/react/hooks";
import {useRecorder} from "@huddle01/react/app-utils";
import {useRouter} from "next/router";
import { Box, Center } from "@chakra-ui/react";

const App = () => {
    const router = useRouter();

    const [roomId, setRoomId] = useState(router.query.roomId?.toString() || "");
    console.log(router.query);

    const {peers} = usePeers();

    useEffect(() => {
        setRoomId(router.query.roomId?.toString() || "");
    }, [router.query.roomId?.toString()]);

    useRecorder(roomId, process.env.NEXT_PUBLIC_PROJECT_ID || "");

    return (
        <Center w="100vw" >
            <Center >
                <Center>
                    {Object.values(peers)
                        .filter((peer) => peer.cam)
                        .map((peer) => (
                            <Video
                                key={peer.peerId}
                                peerId={peer.peerId}
                                track={peer.cam}
                                // debug
                                id="videoStreamBot"
                            />
                        ))}
                    {Object.values(peers)
                        .filter((peer) => peer.mic)
                        .map((peer) => (
                            <Audio key={peer.peerId} peerId={peer.peerId} track={peer.mic}/>
                        ))}
                </Center>
            </Center>
        </Center>
    );
};

export default App;
