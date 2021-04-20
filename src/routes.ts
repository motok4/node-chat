import { SettingsController } from './controller/SettingsController';
import { Router } from 'express';

const routes = Router();

const settingsController = new SettingsController();

routes.post( '/settings', settingsController.create);

export {routes };