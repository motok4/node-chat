import { MessagesController } from './controller/MessagesController';
import { SettingsController } from './controller/SettingsController';
import { Router } from 'express';
import { UsersController } from './controller/UsersController';

const routes = Router();

const settingsController = new SettingsController();
const usersController = new UsersController();
const messagesController = new MessagesController();

routes.post( '/settings', settingsController.create);
routes.post( '/users', usersController.create);
routes.post( '/messages', messagesController.create);
routes.get( '/messages/:id', messagesController.showByUsers);

export {routes };