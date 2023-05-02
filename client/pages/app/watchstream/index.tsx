import React, { useState } from 'react'
import Navbar from "../../../components/NavBar/NavBar";
import { Box, Card, CardBody, Heading, Stack, Text } from '@chakra-ui/react';
const index = () => {
  const [videoURL, setvideoURL] = useState("")
  return (
    <Navbar>
      <Box display="flex" alignItems={"center"} flexDirection={"column"} minH={"90vh"} >
        <video controls autoPlay id="videoPlayerWindow" >
          <source src="https://gateway.lighthouse.storage/ipfs/QmWHvmzaVyaUpt2E6jRUC8Apzk3U9KuXJhmhoigXDFHip7" type="video/webm" />
        </video>
        <Stack  w="95%">
          <Heading size={"md"}>This is the Video Title!</Heading>
          <Heading size={"sm"}>Creator Name</Heading>
        </Stack>
        <Stack  w="95%">
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
  )
}

export default index