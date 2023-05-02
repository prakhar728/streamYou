import { Box, Heading, Image, SimpleGrid, Text } from '@chakra-ui/react'
import React from 'react'

const index = (array:any) => {
  return (
    // <Box p={4} display={"flex"} flexDirection={"row"}  border={"1px"} borderColor={"black"} columnGap={5}>
    <SimpleGrid p={4}  columns={6} spacing={2}   >
        <Box display={"flex"} flexDirection={"column"} w="10vw">
            <Image src={'https://www.wyzowl.com/wp-content/uploads/2019/09/YouTube-thumbnail-size-guide-best-practices-top-examples.png.webp'}  borderRadius={"20px"} />
            <Heading p={2} size={"md"}>Video Title</Heading>
        </Box>
        <Box display={"flex"} flexDirection={"column"} w="10vw">
            <Image src={'https://www.wyzowl.com/wp-content/uploads/2019/09/YouTube-thumbnail-size-guide-best-practices-top-examples.png.webp'}  borderRadius={"20px"} />
            <Heading p={2} size={"md"}>Video Title</Heading>
        </Box>
        <Box display={"flex"} flexDirection={"column"} w="10vw">
            <Image src={'https://www.wyzowl.com/wp-content/uploads/2019/09/YouTube-thumbnail-size-guide-best-practices-top-examples.png.webp'}  borderRadius={"20px"} />
            <Heading p={2} size={"md"}>Video Title</Heading>
        </Box>
        <Box display={"flex"} flexDirection={"column"} w="10vw">
            <Image src={'https://www.wyzowl.com/wp-content/uploads/2019/09/YouTube-thumbnail-size-guide-best-practices-top-examples.png.webp'}  borderRadius={"20px"} />
            <Heading p={2} size={"md"}>Video Title</Heading>
        </Box>
    </SimpleGrid>
  )
}

export default index