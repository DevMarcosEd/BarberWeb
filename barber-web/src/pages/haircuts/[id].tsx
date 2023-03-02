import Head from 'next/head';
import { useState, ChangeEvent } from 'react';
import { Sidebar } from '@/src/components/sidebar';

import {
    Flex,
    Text,
    Heading,
    Button,
    useMediaQuery,
    Input,
    Stack,
    Switch,
} from '@chakra-ui/react'

import Link from 'next/link'
import { FiChevronLeft } from 'react-icons/fi'

import { canSSRAuth } from '@/src/utils/canSSRAuth';
import { setupAPIClient } from '@/src/services/api';
import Router from 'next/router';

interface SubscriptionsProps {
    id: string;
    status: string;
}

interface HaircutProps {
    id: string;
    name: string;
    price: string | number;
    status: boolean;
    user_id: string;
}
interface editHaircutProps {
    haircut: HaircutProps;
    subscription: SubscriptionsProps | null;
}

export default function EditHaircut({ subscription, haircut }: editHaircutProps) {
    const [isMobile] = useMediaQuery("(max-width: 600px");

    const [name, setName] = useState(haircut?.name)
    const [price, setPrice] = useState(haircut?.price)
    const [status, setStatus] = useState(haircut?.status)

    const [disableHaircut, setDisableHaircut] = useState(haircut?.status ? "disabled" : "enabled")

    function handleChageStatus(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.value === 'disabled') {
            setDisableHaircut("enabled")
            setStatus(false);
        } else {
            setDisableHaircut("disabled")
            setStatus(true);
        }
    }

    async function handleUpdate() {

        if (name === '' || price === '') {
            return
        }

        try {
            const apiClient = setupAPIClient()
            await apiClient.put('/haircut', {
                name: name,
                price: Number(price),
                status: status,
                haircut_id: haircut?.id
            })

            alert('Corte atualizado com sucesso!')

        } catch (err) {
            console.log(err)
        }

    }

    return (
        <>
            <Head>
                <title>BarberPRO - Editando modelo de corte</title>
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
                            Editar modelo
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
                        <Heading mb={4} fontSize={isMobile ? "22px" : "3xl"} color="#fff">Editar modelo</Heading>

                        <Flex w="85%" direction="column">
                            <Input
                                placeholder="Nome do corte"
                                size="lg"
                                type="text"
                                w="100%"
                                bg="gray.900"
                                mb={3}
                                disabled={subscription?.status !== 'active'}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />

                            <Input
                                placeholder="Valor do corte ex: 59.90"
                                size="lg"
                                type="number"
                                w="100%"
                                bg="gray.900"
                                mb={4}
                                disabled={subscription?.status !== 'active'}
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />

                            <Stack mb={6} align="center" direction="row">
                                <Text fontWeight="bold">Desativar corte</Text>
                                <Switch
                                    size="lg"
                                    colorScheme="red"
                                    value={disableHaircut}
                                    isChecked={disableHaircut === 'disabled' ? false : true}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChageStatus(e)}
                                >

                                </Switch>

                            </Stack>

                            <Button
                                w="100%"
                                size="lg"
                                color="gray.900"
                                bg="button.cta"
                                mb={6}
                                _hover={{ bg: "#ffb13e" }}
                                disabled={subscription?.status !== 'active'}
                                onClick={handleUpdate}
                            >
                                Editar
                            </Button>

                            {subscription?.status !== 'active' && (
                                <Flex direction="row" align="center" justify="center">
                                    <Link href="/planos">
                                        Seja premium
                                    </Link>
                                    <Text cursor="pointer" fontWeight="bold" mr={1} color="#31fb6a">
                                        e tenha todos acessos liberados
                                    </Text>
                                </Flex>

                            )}
                        </Flex>

                    </Flex>

                </Flex>
            </Sidebar>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

    // Pegando o paramentro da url
    const { id } = ctx.params

    try {
        const apiClient = setupAPIClient(ctx);

        const check = await apiClient('/user/check');

        const response = await apiClient('/haircut/detail', {
            params: {
                haircut_id: id,
            }
        })

        return {
            props: {
                haircut: response.data,
                subscription: check.data?.subscriptions
            }
        }

    } catch (err) {
        console.log(err)

        return {
            redirect: {
                destination: '/haircuts',
                permanent: false
            }
        }
    }
})