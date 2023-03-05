import Head from 'next/head';
import {
    Button,
    Flex,
    Heading,
    Text,
    useMediaQuery
} from '@chakra-ui/react';

import { Sidebar } from '@/src/components/sidebar';
import { canSSRAuth } from '../../utils/canSSRAuth';
import { setupAPIClient } from '@/src/services/api';
import { getStripeJs } from '@/src/services/stripe-js';

interface PlanosProps {
    premium: boolean;
}

export default function Planos({ premium }: PlanosProps) {
    const [isMobile] = useMediaQuery('(max-width: 500px)')

    const handleSubscribe = async () => {

        if (premium) { // Se o usuário já for premium, pare a operação
            return;
        }

        try {
            const apiClient = setupAPIClient();
            const response = await apiClient.post('/subscribe') // Acessando a rota de pagamentro e dentro dela e salvo o stripe || // salvando o id do stripe na tbl de usuario

            const { sessionId } = response.data; // pegando o session id do response.data que é devolvido no back-end

            const stripe = await getStripeJs();
            await stripe.redirectToCheckout({ sessionId: sessionId }) // redirecionando usuario para essa session
        } catch (err) {
            console.log(err)
        }
    }
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

                            <Text fontWeight="medium" ml={4} mb={2}>Registrar cortes.</Text>
                            <Text fontWeight="medium" ml={4} mb={2}>Criar apenas 3 modelos de corte.</Text>
                            <Text fontWeight="medium" ml={4} mb={2}>Editar dados do perfil</Text>
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

                            <Text fontWeight="medium" ml={4} mb={2}>Registrar cortes ilimitados.</Text>
                            <Text fontWeight="medium" ml={4} mb={2}>Criar modelos ilimitados.</Text>
                            <Text fontWeight="medium" ml={4} mb={2}>Editar modelos de corte.</Text>
                            <Text fontWeight="medium" ml={4} mb={2}>Editar dados do perfil.</Text>
                            <Text fontWeight="medium" ml={4} mb={2}>Receber todas as atualizações.</Text>
                            <Text fontWeight="bold" ml={4} mb={2} fontSize="2xl" color="#31fb6a">R$ 9.99</Text>

                            <Button
                                bg={premium ? "gray" : "button.cta"}
                                m={2}
                                color="white"
                                onClick={handleSubscribe}
                                _hover={{ bg: "gray" }}
                                disabled={premium}
                            >
                                {premium ? (
                                    "VOCÊ JÁ É PREMIUM"
                                ) : (
                                    "VIRAR PREMIUM"
                                )}
                            </Button>

                            {premium && (
                                <Button
                                    m={2}
                                    bg="white"
                                    color="barber.900"
                                    fontWeight="bold"
                                    onClick={() => { }}
                                >
                                    ALTERAR ASSINATURA
                                </Button>
                            )}

                        </Flex>

                    </Flex>
                </Flex>
            </Sidebar>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

    try {

        const apiClient = setupAPIClient(ctx)
        const response = await apiClient.get('/me')

        return {
            props: {
                premium: response.data?.subscriptions?.status === 'active' ? true : false
            }
        }

    } catch (err) {
        console.log(err);

        return {
            redirect: {
                destination: '/dashboard',
                permanent: false
            }
        }
    }
})