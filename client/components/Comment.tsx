import {Button, Card, CardBody, Flex, Text} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {getComment} from "../lib/polybase";
import {useIsMounted} from "../hooks/useIsMounted";

export default function Comment({id}: { id: string }) {
    const mounted = useIsMounted()
    const [comment, setComment] = useState<any>({})
    const [fetching, setFetching] = useState<boolean>(false)
    useEffect(() => {
        console.log(fetching, mounted)
        if (!fetching && mounted) {
            setFetching(true)
            handleGet(id)
        }
    }, [id, mounted])
    const handleGet = async (id: string) => {
        const res = await getComment(id)
        setComment(res.response.data)
    }

    return (
        <Card>
            <CardBody>
                <Flex justifyContent={"space-between"}>
                    <Text color={"dimgray"}>{comment?.creator}</Text>
                    {mounted &&
                        <Text>{new Date(parseInt(comment?.createdAt)).toLocaleDateString(navigator.language, {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        })}</Text>
                    }
                </Flex>
                <Text>{comment?.description}</Text>
                {/*<Button onClick={handleGet}>Get Details</Button>*/}
            </CardBody>
        </Card>
    )
}