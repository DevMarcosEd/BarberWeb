import Head from 'next/head';
import { useState } from 'react';
import { Sidebar } from '@/src/components/sidebar';

import {
    Flex,
    Text,
    Heading,
    Button,
    useMediaQuery,
    Input,
} from '@chakra-ui/react'

import Link from 'next/link'
import { FiChevronLeft } from 'react-icons/fi'

import { canSSRAuth } from '../../../utils/canSSRAuth';
import { setupAPIClient } from '@/src/services/api';
import Router from 'next/router';

interface NewHaircutsProps {
    subscriptions: boolean;
    count: number;
}

export default function NewHaircut({ subscriptions, count }: NewHaircutsProps) {
    const [isMobile] = useMediaQuery("(max-width: 600px");

    const [name, setName] = useState('')
    const [price, setPrice] = useState('')

    async function handleRegister() {

        if (name === '' || price === '') {
            return;
        }

        try {
            const apiClient = setupAPIClient();
            await apiClient.post('/haircut', {
                name: name,
                price: Number(price)
            })

            Router.push("/haircuts")

        } catch (err) {
            console.log(err)
            alert('Erro ao cadastrar esse modelo.')
        }

    }

    return (
        <>
            <Head>
                <title>BarberPRO - Novo modelo de corte</title>
            </Head>
            <Sidebar>
                <Flex direction="column" alignItems="flex-start" justifyContent="flex-start">
                    <Flex
                        direction={isMobile ? "column" : "row"}
                        w="100%"
                        align={isMobile ? "flex-start" : "center"}
                        mb={isMobile ? 4 : 0}
                    >
                        <Link href="/haircuts">
                            <Button
                                bg="barber.400"
                                p={4}
                                alignItems="center"
                                justifyContent="center"
                                mr={4}
                            >
                                <FiChevronLeft size={24} color="#FFF" />
                                Voltar
                            </Button>
                        </Link>
                        <Heading
                            color="orange.900"
                            mt={4}
                            mb={4}
                            mr={4}
                            fontSize={isMobile ? "27px" : "3xl"}
                        >
                            Modelos de corte
                        </Heading>
                    </Flex>

                    <Flex
                        maxW="700px"
                        bg="barber.400"
                        w="100% "
                        alignItems="center"
                        justify="center"
                        pt={8}
                        pb={8}
                        direction="column"
                    >
                        <Heading mb={4} fontSize={isMobile ? "22px" : "3xl"} color="#fff">Cadastrar modelo</Heading>

                        <Input
                            placeholder="Nome do corte"
                            size="lg"
                            type="text"
                            w="85%"
                            bg="gray.900"
                            mb={3}
                            disabled={!subscriptions && count >= 3}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <Input
                            placeholder="Valor do corte ex: 59.90"
                            size="lg"
                            type="text"
                            w="85%"
                            bg="gray.900"
                            mb={4}
                            disabled={!subscriptions && count >= 3}
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />

                        <Button
                            w="85%"
                            size="lg"
                            color="gray.900"
                            bg="button.cta"
                            mb={6}
                            _hover={{ bg: "#ffb13e" }}
                            disabled={!subscriptions && count >= 3}
                            onClick={handleRegister}
                        >
                            Cadastrar
                        </Button>

                        {!subscriptions && count >= 3 && (
                            <Flex direction="row" align="center" justifyContent="center">
                                <Text>
                                    Você atingiu seu limite de corte.
                                </Text>
                                <Link href="/planos">
                                    <Text fontWeight="bold" color="#31fb69" ml={1}>
                                        Seja premium
                                    </Text>
                                </Link>
                            </Flex>
                        )}

                    </Flex>
                </Flex>
            </Sidebar>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    try {

        const apiClient = setupAPIClient(ctx);

        const response = await apiClient.get('/user/check')
        const count = await apiClient.get('/haircut/count')


        return {
            props: {
                subscriptions: response.data?.subscriptions?.status === 'active' ? true : false,
                count: count.data
            }
        }

    } catch (err) {
        console.log(err)

        return {
            redirect: {
                destination: '/dashboard',
                permanent: false
            }
        }
    }
})