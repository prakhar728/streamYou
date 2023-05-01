import React from 'react'
import Navbar from "../../../components/NavBar/NavBar";
import { Box, Button, ButtonGroup, Card, CardBody, CardFooter, Divider, HStack, Heading, Stack, Text, chakra } from '@chakra-ui/react';
import VideoThumbnail from "../../../assets/thumbnail.jpg";
import Image from 'next/image';
const ChakraImage = chakra(Image, {
    baseStyle: { maxH: 120, maxW: 120 },
    shouldForwardProp: (prop) =>
        [
            "width",
            "height",
            "src",
            "alt",
            "quality",
            "placeholder",
            "blurDataURL",
            "loader ",
            "borderRadius"
        ].includes(prop),
});
const index = () => {
    return (
        <Navbar>
            View the popular Videos Right here right now!
            <Box display={"flex"} flexDirection={"row"} flexWrap="wrap" border="1px" borderColor={"black"} height={"85vh"} p={"2"}>
                <Stack flexDirection={"row"} height="10vh" borderColor={"black"} border="1px" w="40vw" >
                    <Box border="1px" borderColor={"red"} h="100%" w={"50%"} display={"flex"} alignItems={"center"} sx={{position:"relative"}}>
                        <ChakraImage src={VideoThumbnail} alt="Video Thumbnail" fill={"contain"} />
                    </Box>
                    <Stack flexDirection={"column"} p={"3"} w="40%">
                        <Text fontSize={"lg"}>A long ass Video Title with these words</Text>
                        <Text>Creator</Text>
                    </Stack>
                </Stack>
            </Box>
        </Navbar>
    )
}

export default index