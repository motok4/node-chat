import { UsersRepository } from "./../repositories/UsersRepository";
import { getCustomRepository } from "typeorm";

export class UserService {
  async create(email: string) {
    const userRepository = getCustomRepository(UsersRepository);

    const userAlreadyExists = await userRepository.findOne({ email });

    if (userAlreadyExists) {
      return userAlreadyExists;
    }
    const user = userRepository.create({ email });
    await userRepository.save(user);
    return user;
  }

  async findByEmail( email: string ) {
    const userRepository = getCustomRepository(UsersRepository);
    const user = await userRepository.findOne({email});
    return user;
  }
}
