import { Router, Request, Response } from 'express';

// Controller User
import { CreateUserController } from './controllers/user/CreateUserController';
import { AuthUserController } from './controllers/user/AuthUserController';
import { DetailUserController } from './controllers/user/DetailUserController';
import { UpdateUserController } from './controllers/user/UpdateUserController';

// Subscription
import { CheckSubscriptionController } from './controllers/subscriptions/CheckSubscriptionController';

// Controller HairCut
import { CreateHaircutController } from './controllers/haircut/CreateHaircutController';
import { ListHaircutController } from './controllers/haircut/ListHaircutController';
import { UpdateHaircutController } from './controllers/haircut/UpdateHaircutController';
import { CountHaircutsController } from './controllers/haircut/CountHaircutsController';
import { DetailHaircutController } from './controllers/haircut/DetailHaircutController';

// Controller Schadule
import { NewScheduleController } from './controllers/schedule/NewScheduleController';
import { ListScheduleController } from './controllers/schedule/ListScheduleController';
import { FinishScheduleController } from './controllers/schedule/FinishScheduleController';

import { isAuthenticated } from './middlewares/isAuthenticated';
import { SubscribeController } from './controllers/subscribe/SubscribeController';

const router = Router();

// --- Users routes --- //

// User registration
router.post('/users', new CreateUserController().handle)
// User login
router.post('/session', new AuthUserController().handle)
// Fetching user details
router.get('/me', isAuthenticated, new DetailUserController().handle)
// Updating user data logged
router.put('/users', isAuthenticated, new UpdateUserController().handle)


// --- Subscription --- //

// Check Subscription
router.get('/user/check', isAuthenticated, new CheckSubscriptionController().handle)


// --- Haircuts routes --- //

// Haircut registration
router.post('/haircut', isAuthenticated, new CreateHaircutController().handle)
// List Haircut
router.get('/haircuts', isAuthenticated, new ListHaircutController().handle)
// Updating haircut
router.put('/haircut', isAuthenticated, new UpdateHaircutController().handle)
// Count haircuts
router.get('/haircut/count', isAuthenticated, new CountHaircutsController().handle)
// Detail HairCut
router.get('/haircut/detail', isAuthenticated, new DetailHaircutController().handle)


// --- Schadule routes --- //

// Schadule registration
router.post('/schedule', isAuthenticated, new NewScheduleController().handle)
// Schadule List
router.get('/schedule', isAuthenticated, new ListScheduleController().handle)
// Delete Schedule
router.delete('/schedule', isAuthenticated, new FinishScheduleController().handle)

// --- ROUTES PAYMENTS --- //
router.post('/subscribe', isAuthenticated, new SubscribeController().handle)

export { router };