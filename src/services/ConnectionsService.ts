import { Socket } from "socket.io";
import { Connections } from "./../entities/Connections";
import { ConnectionsRepository } from "./../repositories/ConnetionsRepository";
import { getCustomRepository } from "typeorm";

interface IConnectionCreate {
  socket_id: string;
  user_id: string;
  admin_id?: string;
  id?: string;
}
export class ConnectionsService {
  private _connectionsRepository: ConnectionsRepository;

  async create({ socket_id, user_id, admin_id, id }: IConnectionCreate) {
    this._connectionsRepository = getCustomRepository(ConnectionsRepository);
    const connection = await this._connectionsRepository.create({
      socket_id,
      user_id,
      admin_id,
      id,
    });
    await this._connectionsRepository.save(connection);
    return connection;
  }

  async findByUserId(user_id: string) {
    this._connectionsRepository = getCustomRepository(ConnectionsRepository);
    const connection = await this._connectionsRepository.findOne({ user_id });
    return connection;
  }

  async findAllWithoutAdmin() {
    this._connectionsRepository = getCustomRepository(ConnectionsRepository);
    const connections = await this._connectionsRepository.find({
      where: { admin_id: null },
      relations: ["user"],
    });
    return connections;
  }

  async findBySocketID(socket_id) {
    this._connectionsRepository = getCustomRepository(ConnectionsRepository);
    const connections = await this._connectionsRepository.findOne({
      socket_id,
    });
    return connections;
  }

  async updateAdminID(user_id: string, admin_id: string) {
    await this._connectionsRepository
      .createQueryBuilder()
      .update(Connections)
      .set({ admin_id })
      .where("user_id = :user_id", { user_id })
      .execute();
  }
}
