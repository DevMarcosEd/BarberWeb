import { useState } from 'react';
import Head from 'next/head';
import {
    Button,
    Flex,
    Heading,
    Text,
    Link as ChakraLink,
    useMediaQuery,
    useDisclosure, // funcionalidade para saber quando o modal está aberto
} from '@chakra-ui/react';

import { IoMdPerson } from 'react-icons/io';

import { setupAPIClient } from '@/src/services/api';
import { canSSRAuth } from '../../utils/canSSRAuth';
import { Sidebar } from '../../components/sidebar';
// Component
import { ModalInfo } from '@/src/components/modal';

import Link from 'next/link';

export interface ScheduleItem {
    id: string;
    customer: string;
    haircut: {
        id: string;
        name: string;
        price: string | number;
        user_id: string;
    }
}

interface DashboardProps {
    schedule: ScheduleItem[];
}

export default function Dashboard({ schedule }: DashboardProps) {
    const [list, setList] = useState(schedule);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [service, setService] = useState<ScheduleItem>();

    const [isMobile] = useMediaQuery("max-width: 600px")

    function handleOpenModal(item: ScheduleItem) {
        setService(item)
        onOpen();
    }

    async function handleFinish(id: string) {
        try {
            const apiClient = setupAPIClient();
            await apiClient.delete('/schedule', {
                params: {
                    schedule_id: id
                }
            })

            const filterItem = list.filter(item => {
                return (item?.id !== id)
            })

            setList(filterItem);
            onClose();


        } catch (err) {
            console.log(err);
            onClose();
            alert('Erro ao finalizar este serviço')
        }
    }

    return (
        <>
            <Head>
                <title>BarberPRO - Minha barbearia</title>
            </Head>
            <Sidebar>
                <Flex direction="column" align="flex-start" justify="flex-start">
                    <Flex w="100%" direction="row" align="center" justify="flex-start">
                        <Heading fontSize="3xl" mt={4} mb={4} mr={4}>
                            Agenda
                        </Heading>
                        <Link href="/new">
                            <Button bg="barber.400" _hover={{ color: "#fff" }}>Registrar</Button>
                        </Link>
                    </Flex>

                    {list.map(item => (
                        <ChakraLink
                            onClick={() => handleOpenModal(item)}
                            key={item?.id}
                            w="100%"
                            m={0}
                            p={0}
                            mt={1}
                            background="transparent"
                            style={{ textDecoration: "none" }}
                        >
                            <Flex
                                w="100%"
                                direction={isMobile ? "column" : "row"}
                                p={4}
                                rounded={4}
                                mb={2}
                                bg="barber.400"
                                justify="space-between"
                                align={isMobile ? "flex-start" : "center"}
                            >
                                <Flex flexDirection="row" mb={isMobile ? 2 : 0} justify="center">
                                    <IoMdPerson size={28} color="#f1f1f1" />
                                    <Text fontWeight="bold" ml={4} noOfLines={1}>
                                        {item?.customer}
                                    </Text>
                                </Flex>

                                <Text fontWeight="bold" mb={isMobile ? 2 : 0}>
                                    {item?.haircut?.name}
                                </Text>
                                <Text fontWeight="bold" mb={isMobile ? 2 : 0}>R$ {item?.haircut?.price}</Text>

                            </Flex>
                        </ChakraLink>
                    ))}

                </Flex>
            </Sidebar>
            <ModalInfo
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={onClose}
                data={service}
                finishService={() => handleFinish(service?.id)}
            />
        </>
    )
}

// Antes de renderizar a rota, é carregado o serverSide que vai passar pela validadação do canSSRAuth
export const getServerSideProps = canSSRAuth(async (ctx) => {


    try {

        const apiClient = setupAPIClient(ctx);

        const response = await apiClient.get('/schedule',
            {
                params: {
                    status: true
                }
            })

        return {
            props: {
                schedule: response.data,
            }
        }

    } catch (err) {
        console.log(err)
        return {
            props: {
                schedule: []
            }
        }
    }
})