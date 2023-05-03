import {ConnectButton} from '@rainbow-me/rainbowkit';
import React, {ReactNode, ReactText} from 'react';
import {
    IconButton,
    Box,
    CloseButton,
    Flex,
    HStack,
    Icon,
    useColorModeValue,
    Link,
    Drawer,
    DrawerContent,
    Text,
    useDisclosure,
    BoxProps,
    FlexProps, Image,
} from '@chakra-ui/react';
import {
    FiHome,
    FiCompass,
    FiStar,
    FiMenu,
    FiBell,
} from 'react-icons/fi';
import {AiOutlineDashboard} from "react-icons/ai";
import {BsCameraVideo} from "react-icons/bs";
import {IconType} from 'react-icons';
import {useCreatorContext} from "../../contexts/CreatorContext";

interface LinkItemProps {
    name: string;
    icon: IconType;
    path: string;
}

let LinkItems: Array<LinkItemProps> = [
    {name: 'Home', icon: FiHome, path: "/"},
    {name: 'Explore', icon: FiCompass, path: ""},
    {name: 'Favourites', icon: FiStar, path: ""},
    {name: 'Dashboard', icon: AiOutlineDashboard, path: "/app/onboarding"},
    // {name: 'Record!', icon: BsCameraVideo, path: "/app/videoupload"},
];

export default function SidebarWithHeader({children}: { children: ReactNode; }) {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const {isCreator, creatorId} = useCreatorContext()

    if (isCreator) {
        LinkItems = [
            {name: 'Home', icon: FiHome, path: "/"},
            {name: 'Explore', icon: FiCompass, path: ""},
            {name: 'Favourites', icon: FiStar, path: ""},
            {name: 'Dashboard', icon: AiOutlineDashboard, path: "/app/creator?channelId=" + creatorId},
            {name: 'Record!', icon: BsCameraVideo, path: "/app/videoupload"},
        ];
    }

    return (
        <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
            <SidebarContent
                onClose={() => onClose}
                display={{base: 'none', md: 'block'}}
            />
            <Drawer
                autoFocus={false}
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size="full">
                <DrawerContent>
                    <SidebarContent onClose={onClose}/>
                </DrawerContent>
            </Drawer>
            {/* mobilenav */}
            <MobileNav onOpen={onOpen}/>
            <Box ml={{base: 0, md: 60}} p="4">
                {children}
            </Box>
        </Box>
    );
}

interface SidebarProps extends BoxProps {
    onClose: () => void;
}

const SidebarContent = ({onClose, ...rest}: SidebarProps) => {
    return (
        <Box
            transition="3s ease"
            bg={useColorModeValue('white', 'gray.900')}
            borderRight="1px"
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            w={{base: 'full', md: 60}}
            pos="fixed"
            h="full"
            {...rest}>
            <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
                <Image src="/logo.png" boxSize='100%' fit={'contain'} alt="logo"/>
                {/*<Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">*/}
                {/*  Logo*/}
                {/*</Text>*/}
                <CloseButton display={{base: 'flex', md: 'none'}} onClick={onClose}/>
            </Flex>
            {LinkItems.map((link) => (
                <NavItem key={link.name} link={link.path} icon={link.icon}>
                    {link.name}
                </NavItem>
            ))}
        </Box>
    );
};

interface NavItemProps extends FlexProps {
    icon: IconType;
    link: string;
    children: ReactText;
}

const NavItem = ({icon, link, children, ...rest}: NavItemProps) => {
    return (
        <Link href={link} style={{textDecoration: 'none'}} _focus={{boxShadow: 'none'}}>
            <Flex
                align="center"
                p="4"
                mx="4"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                _hover={{
                    bg: 'cyan.400',
                    color: 'white',
                }}
                {...rest}>
                {icon && (
                    <Icon
                        mr="4"
                        fontSize="16"
                        _groupHover={{
                            color: 'white',
                        }}
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </Link>
    );
};

interface MobileProps extends FlexProps {
    onOpen: () => void;
}

const MobileNav = ({onOpen, ...rest}: MobileProps) => {
    return (
        <Flex
            ml={{base: 0, md: 60}}
            px={{base: 4, md: 4}}
            height="20"
            alignItems="center"
            bg={useColorModeValue('white', 'gray.900')}
            borderBottomWidth="1px"
            borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
            justifyContent={{base: 'space-between', md: 'flex-end'}}
            {...rest}>
            <IconButton
                display={{base: 'flex', md: 'none'}}
                onClick={onOpen}
                variant="outline"
                aria-label="open menu"
                icon={<FiMenu/>}
            />

            <Text
                display={{base: 'flex', md: 'none'}}
                fontSize="2xl"
                fontFamily="monospace"
                fontWeight="bold">
                Logo
            </Text>

            <HStack spacing={{base: '0', md: '6'}}>
                <IconButton
                    size="lg"
                    variant="ghost"
                    aria-label="open menu"
                    icon={<FiBell/>}
                />
                <ConnectButton accountStatus={{
                    smallScreen: 'avatar',
                    largeScreen: 'full',
                }}/>
            </HStack>
        </Flex>
    );
};