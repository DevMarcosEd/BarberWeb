import { Request, Response } from 'express';
import { CheckSubscriptionService } from '../../services/subscription/CheckSubscriptionService';

class CheckSubscriptionController {
    async handle(request: Request, response: Response) {
        const user_id = request.user_id;

        const checkSubscription = new CheckSubscriptionService();

        const status = await checkSubscription.execute({
            user_id
        })

        return response.json(status)
    }
}

export { CheckSubscriptionController }