import { SettingsRepository } from "./../repositories/SettingsRepository";
import { getCustomRepository } from "typeorm";

interface ISettingsCreate {
  chat: boolean;
  username: string;
}
export class SettingsService {

  private _settingsRepository: SettingsRepository;

  constructor(){
    this._settingsRepository = getCustomRepository(SettingsRepository);
  }
  async create({ chat, username }: ISettingsCreate) {

    const userAlreadyExists = await this._settingsRepository.findOne({ username });

    if (userAlreadyExists) {
      throw new Error("User already exist.");
    }
    const settings = this._settingsRepository.create({
      chat,
      username,
    });
    await this._settingsRepository.save(settings);
    return settings;
  }
}
