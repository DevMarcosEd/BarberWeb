import Head from 'next/head';
import { useState, ChangeEvent } from 'react';
import { Sidebar } from '@/src/components/sidebar';
import Link from 'next/link';
import {
    Flex,
    Text,
    Heading,
    Button,
    Stack,
    Switch,
    useMediaQuery
} from '@chakra-ui/react';

import { IoMdPricetag } from 'react-icons/io'
import { canSSRAuth } from '@/src/utils/canSSRAuth';
import { setupAPIClient } from '@/src/services/api';

interface HaircutsItem {
    id: string;
    name: string;
    price: number | string;
    status: boolean;
    user_id: string;
}

interface HaircutsProps {
    haircuts: HaircutsItem[];
}

export default function HairCuts({ haircuts }: HaircutsProps) {

    const [isMobile] = useMediaQuery("(max-width: 600px)")

    const [haircutList, setHaircutList] = useState<HaircutsItem[]>(haircuts || [])
    const [disableHaircut, setDisableHaircut] = useState("enabled")

    async function handleDisabled(e: ChangeEvent<HTMLInputElement>) {
        const apiClient = setupAPIClient();

        if (e.target.value === 'disabled') {
            setDisableHaircut("enabled")

            const response = await apiClient.get('/haircuts', {
                params: {
                    status: true
                }
            })

            setHaircutList(response.data)
        } else {
            setDisableHaircut("disabled")

            const response = await apiClient.get('/haircuts', {
                params: {
                    status: false
                }
            })

            setHaircutList(response.data)
        }
    }

    return (
        <>
            <Head>
                <title>Modelos de Corte - Minha barbearia</title>
            </Head>
            <Sidebar>
                <Flex direction="column" alignItems="flex-start" justifyContent="flex-start">

                    <Flex
                        direction={isMobile ? 'column' : 'row'}
                        w="100%"
                        alignItems={isMobile ? 'flex-start' : 'center'}
                        justifyContent="flex-start"
                        mb={0}
                    >
                        <Heading
                            fontSize={isMobile ? '28px' : '3xl'}
                            mt={4}
                            mb={4}
                            mr={4}
                            color="orange.900"

                        >
                            Modelos de corte
                        </Heading>
                        <Link href="/haircuts/new">
                            <Button background="barber.400" _hover={{ color: "#fff" }}>
                                Cadastrar novo
                            </Button>
                        </Link>

                        <Stack ml="auto" mb={isMobile ? 5 : 0} align="center" direction="row">
                            <Text fontWeight="bold">ATIVOS</Text>
                            <Switch
                                colorScheme="green"
                                size="lg"
                                value={disableHaircut}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleDisabled(e)}
                                isChecked={disableHaircut === 'disabled' ? false : true}
                            >

                            </Switch>
                        </Stack>
                    </Flex>

                </Flex>

                {haircutList.map(haircut => (
                    <Link key={haircut.id} href={`/haircuts/${haircut.id}`} legacyBehavior>
                        <Flex
                            cursor="pointer"
                            w="100%"
                            p={4}
                            bg="barber.400"
                            direction={isMobile ? "column" : "row"}
                            align={isMobile ? "flex-start" : "center"}
                            rounded={4}
                            mb={2}
                            justifyContent="space-between"
                        >

                            <Flex mb={isMobile ? 2 : 0} direction="row" alignItems="center" justifyContent="center">
                                <IoMdPricetag size={28} color="#Fba931" />
                                <Text fontWeight="bold" color="#fff" ml={4} noOfLines={2}>
                                    {haircut.name}
                                </Text>
                            </Flex>

                            <Text>
                                Preço: R$  {haircut.price}
                            </Text>

                        </Flex>
                    </Link>
                ))}
            </Sidebar>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    try {

        const apiClient = setupAPIClient(ctx);

        const response = await apiClient.get('haircuts',
            {
                params: {
                    status: true
                }
            })

        if (response.data === null) {
            return {
                redirect: {
                    destination: '/dashboard',
                    permanent: false
                }
            }
        }

        return {
            props: {
                haircuts: response.data
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