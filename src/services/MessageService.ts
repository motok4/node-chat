import { MessagesRepository } from "./../repositories/MessagesRepository";
import { getCustomRepository } from "typeorm";

interface IMessageCreate {
  admin_id?: string;
  text: string;
  user_id: string;
}
export class MessageService {
  private _messageRepository;
  constructor() {
    this._messageRepository = getCustomRepository(MessagesRepository);
  }
  async create({ admin_id, text, user_id }: IMessageCreate) {

    const message = await this._messageRepository.create({
      admin_id,
      text,
      user_id,
    });

    await this._messageRepository.save(message);
    return message;
  }
  async listByUser(user_id: string) {

    const messages = await this._messageRepository.find({
      where: {user_id},
      relations: ["user"]
    });

    return messages;
  }
}
