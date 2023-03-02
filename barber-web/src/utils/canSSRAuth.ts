// Arquivo de cofiguração onde somente usuarios autenticados pode ter acesso

import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next'; // Renderizar pela página do lado do servidor
import { destroyCookie, parseCookies } from 'nookies';
import { AuthTokenError } from '../services/errors/AuthTokenError';

// Função de verificação // Proteção de rotas
export function canSSRAuth<P>(fn: GetServerSideProps<P>) {
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
        const cookies = parseCookies(ctx);

        const token = cookies['@barber.token'];

        // Se não tiver token, redirecionado para o login
        if (!token) {
            return {
                redirect: {
                    destination: '/login',
                    permanent: false,
                }
            }
        }

        try {

            return await fn(ctx);

        } catch (err) {
            if (err instanceof AuthTokenError) {
                destroyCookie(ctx, '@barber.token', { path: '/' });

                return {
                    redirect: {
                        destination: '/',
                        permanent: false,
                    }
                }
            }
        }
    }
}