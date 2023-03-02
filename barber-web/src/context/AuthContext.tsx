import { createContext, ReactNode, useState, useEffect } from 'react';
import { destroyCookie, setCookie, parseCookies } from 'nookies'; // setCookie - Salvar dados no cookie
import Router from 'next/router';

// API 
import { api } from '../services/apiClient';


interface AuthContextData {
    user: UserProps;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
    signUp: (credentials: SignUpProps) => Promise<void> //Promise<void> - Não devolve nada
    logoutUser: () => Promise<void>
}

// Tipagem usuario autenticado
interface UserProps {
    id: string;
    name: string;
    email: string;
    endereco: string | null;
    subscriptions?: SubscriptionProps | null
}

// Tipagem subscription de usuário
interface SubscriptionProps {
    id: string;
    status: string;
}

type AuthProviderProps = {
    children: ReactNode;
}

interface SignInProps {
    email: string;
    password: string;
}

interface SignUpProps {
    name: string;
    email: string;
    password: string;
}

export const AuthContext = createContext({} as AuthContextData)

// Logout de usuário
export function signOut() {
    console.log('Error Logout');

    try {
        destroyCookie(null, '@barber.token', { path: '/' }) // Token destruido + Redirecionamento de rota
        Router.push('/login');

    } catch (err) {
        console.log('Error ao sair');
    }
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserProps>()
    const isAuthenticated = !!user;

    // Verificação de token válido
    useEffect(() => {
        const { '@barber.token': token } = parseCookies();

        if (token) {
            api.get('/me').then((response) => {
                const { id, name, endereco, email, subscriptions } = response.data;
                setUser({
                    id,
                    name,
                    email,
                    endereco,
                    subscriptions,
                })
            })
                .catch(() => {
                    signOut()
                })
        }
    }, [])

    // Autenticação de usuário
    async function signIn({ email, password }: SignInProps) {

        try {
            const response = await api.post("/session", {
                email,
                password,
            })

            const { id, name, token, subscriptions, endereco } = response.data;

            // Salvando token no cookie + propiedades
            setCookie(undefined, '@barber.token', token, {
                maxAge: 60 * 60 * 24 * 30, // Expirar em 1 mês
                path: '/'
            })

            // Passando informações para o usuário
            setUser({
                id,
                name,
                email,
                endereco,
                subscriptions
            })

            // Informando que o token será utilizado no headers das requisições
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            Router.push('/dashboard');

        } catch (err) {
            console.log("ERRO AO ENTRAR", err)
        }

    }

    // Registro de usuário
    async function signUp({ name, email, password }: SignUpProps) {
        try {

            const response = await api.post('/users', {
                name,
                email,
                password
            })

            Router.push('/login');

        } catch (err) {
            console.log(err);
        }
    }

    // Funcionalidade de logout
    async function logoutUser() {
        try {
            destroyCookie(null, '@barber.token', { path: '/' });
            Router.push('/login')
        } catch (err) {
            console.log('Erro ao sair');
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                signIn,
                signUp,
                logoutUser,
            }}>
            {children}
        </AuthContext.Provider>
    )
}