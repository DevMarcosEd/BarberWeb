import prismaClient from '../../prisma';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

interface AuthUserRequest {
    email: string,
    password: string
}

class AuthUserService {
    async execute({ email, password }: AuthUserRequest) {

        const user = await prismaClient.user.findFirst({
            where: {
                email: email
            },
            include: {
                subscriptions: true,
            }
        })

        if (!user) {
            throw new Error('Email incorreto');
        }

        // Verificar senha
        const passwordMatch = await compare(password, user?.password);

        if (!passwordMatch) {
            throw new Error('Email/Senha incorreto!')
        }

        // Gerar TOKEN JWT
        const token = sign(
            { // Informações dentro do token que pode ser acessado
                name: user.name,
                email: user.email
            },
            process.env.JWT_SECRET, // Passado o secret
            {
                subject: user.id, // Passando id do usuario no subject
                expiresIn: '30d' // Tempo de expriração
            }
        )

        return {
            id: user?.id,
            name: user?.name,
            email: user?.email,
            edereco: user?.endereco,
            token: token,
            subscriptions: user.subscriptions ? {
                id: user?.subscriptions?.id,
                status: user?.subscriptions?.status
            } : null
        }
    }
}

export { AuthUserService }