import { useState, useContext } from 'react'; // Consumir um contexto com useContext

import Head from 'next/head';
import Image from 'next/image';
import logoImg from '../../../public/images/logo.svg';
import { Button, Center, Flex, Input, Text } from '@chakra-ui/react';

import Link from 'next/link';

import { AuthContext } from '../../context/AuthContext';

import { canSSRGuest } from '../../utils/canSSRGuest'

export default function Login() {
    const { signIn } = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleLogin() {

        if (email === '' || password === '') {
            return;
        }

        await signIn({
            email,
            password,
        })
    }


    return (
        <>
            <Head>
                <title>BarberPRO - Faça seu login</title>
            </Head>

            <Flex background="barber.900" height="100vh" alignItems="center" justifyContent="center">

                <Flex width={640} direction="column" p={14} rounded={8}>
                    <Center p={4}>
                        <Image
                            src={logoImg}
                            quality={100}
                            width={240}
                            style={{ objectFit: "cover" }}
                            alt="logo barberpro"
                        />
                    </Center>

                    <Input
                        background="barber.400"
                        color="#fff"
                        variant="filled"
                        size="lg"
                        placeholder='email@email.com'
                        type="email"
                        mb={3}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Input
                        background="barber.400"
                        color="#fff"
                        variant="filled"
                        size="lg"
                        placeholder='************'
                        type="text"
                        mb={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Button
                        background="button.cta"
                        mb={6}
                        color="gray.900"
                        _hover={{ bg: "#ffb13e" }}
                        onClick={handleLogin}
                    >
                        Acessar
                    </Button>

                    <Center mt={2}>
                        <Link href="/register">
                            <Text
                                cursor="pointer"
                            >Não possui conta? <strong>Cadastre-se</strong></Text>
                        </Link>
                    </Center>

                </Flex>
            </Flex>
        </>
    )
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
    return {
        props: {}
    }
})