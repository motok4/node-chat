import { MessageService } from "./../services/MessageService";
import { Request, Response } from "express";

export class MessagesController {
  async create(request: Request, response: Response) {
    const { admin_id, text, user_id } = request.body;

    const messageService = new MessageService();
    try {
      const message = await messageService.create({
        admin_id,
        text,
        user_id,
      });
      return response.json(message);
    } catch (err) {
      return response.status(400).json({ message: err.message });
    }
  }

  async showByUsers(request: Request, response: Response) {
    const { id } = request.params;
    const messageService = new MessageService();

    const list = await messageService.listByUser(id);
    return response.json(list);


  }
}
