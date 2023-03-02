import Head from 'next/head';
import {
    Button,
    Flex,
    Heading,
    Text,
    useMediaQuery
} from '@chakra-ui/react';

import { Sidebar } from '@/src/components/sidebar';

export default function Planos() {
    const [isMobile] = useMediaQuery('(max-width: 500px)')
    return (
        <>
            <Head>
                <title>Barber Pro - Sua assinatura Premium</title>
            </Head>
            <Sidebar>
                <Flex w="100%" direction="column" align="flex-start" justify="flex-start">
                    <Heading fontSize="3xl" mt={4} mb={4}>
                        Planos
                    </Heading>
                </Flex>

                <Flex pb={8} maxW="780px" w="100%" direction="column" align="flex-start" justify="flex-start">

                    <Flex w="100%" gap={4} flexDirection={isMobile ? "column" : "row"}>

                        <Flex rounded={4} p={2} flex={1} bg="barber.400" flexDirection="column">
                            <Heading
                                textAlign="center"
                                fontSize="2xl"
                                mt={2} mb={4}
                                color="gray.100"
                            >
                                Plano Grátis
                            </Heading>

                            <Text fontWeight="bold" ml={4} mb={2}>Registrar cortes.</Text>
                            <Text fontWeight="bold" ml={4} mb={2}>Criar apenas 3 modelos de corte.</Text>
                            <Text fontWeight="bold" ml={4} mb={2}>Editar dados do perfil</Text>
                        </Flex>

                        <Flex rounded={4} p={2} flex={1} bg="barber.400" flexDirection="column">
                            <Heading
                                textAlign="center"
                                fontSize="2xl"
                                mt={2} mb={4}
                                color="#31fb6a"
                            >
                                Premium
                            </Heading>

                            <Text fontWeight="bold" ml={4} mb={2}>Registrar cortes ilimitados.</Text>
                            <Text fontWeight="bold" ml={4} mb={2}>Criar apenas 3 modelos de corte.</Text>
                            <Text fontWeight="bold" ml={4} mb={2}>Editar dados do perfil</Text>
                        </Flex>

                    </Flex>
                </Flex>
            </Sidebar>
        </>
    )
}