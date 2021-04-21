import { SettingsService } from './../services/SettingsService';
import { Request, Response } from 'express';

export class SettingsController {

  async create( request: Request, response: Response) {
    const { username, chat } = request.body;
    try {
      const settingsService =  new SettingsService();
      const settings =  await settingsService.create( {chat, username});
      
      return response.json( settings );

    } catch( err ) {
      return response.status(400).json({ message: err.message });
    }
  }
}