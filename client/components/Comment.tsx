import {Card, CardBody, Flex, Text} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {getComment} from "../lib/polybase";
import {useIsMounted} from "../hooks/useIsMounted";

export default function Comment({id}: { id: string }) {
    const mounted = useIsMounted()
    const [comment, setComment] = useState<any>({})
    useEffect(() => {
        if (id)
            getComment(id).then((res) => {
                setComment(res.response.data)
            })
    }, [id])
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
            </CardBody>
        </Card>
    )
}