import prismaClient from '../../prisma';

interface userRequest {
    user_id: string;
    name: string;
    endereco: string;
}

class UpdateUserService {
    async execute({ user_id, name, endereco }: userRequest) {

        try {
            const userAlreadyExist = await prismaClient.user.findFirst({
                where: {
                    id: user_id,
                }
            })

            if (!userAlreadyExist) {
                throw new Error('Usuário inexistente');
            }

            const userUpdated = await prismaClient.user.update({
                where: {
                    id: user_id,
                },
                data: {
                    name,
                    endereco,
                },
                select: {
                    name: true,
                    email: true,
                    endereco: true
                }
            })

            return userUpdated;

        } catch (err) {
            console.log(err)
            throw new Error('Erro ao atualizar usuário');
        }

    }
}

export { UpdateUserService }