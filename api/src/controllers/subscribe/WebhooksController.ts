import { Request, Response } from "express";
import Stripe from "stripe";
import { stripe } from "../../utils/stripe";

class WebhooksController {
    async handle(request: Request, response: Response) {
        let event: Stripe.Event = request.body // Oq o stripe vai mandar no corpo da req e guardar na variavel event

        let endpointSecret: 'whsec_df173ea07c819d45b5893609a34372c05cedcd85e4306b1d42c1744f239167b3'

        if (endpointSecret) {
            const signature = request.headers['stripe-signature']
            try {
                event = stripe.webhooks.constructEvent(
                    request.body,
                    signature,
                    endpointSecret
                )
            } catch (err) {
                console.log('Webhook signature failed', err.message)
                return response.sendStatus(400);
            }
        }

        switch (event.type) {
            case 'customer.subscription.deletd':
                // caso cancele a assinatura vamos deletar a assinatura dele
                break;
            case 'custome.subscription.updated':
                // caso tenha alguma atualização na assinatura
                break;
            case 'checkout.session.completed':
                // criar a assinatura por que foi pago com sucesso
                break;
            default:
                console.log(`Evento desconhecido ${event.type}`)
        }

        response.send();

    }
}

export { WebhooksController }