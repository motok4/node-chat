import { Messages } from "./../entities/Messages";
import { MessageService } from "./../services/MessageService";
import { UserService } from "./../services/UserService";
import { ConnectionsService } from "./../services/ConnectionsService";
import { Socket } from "socket.io";
import { io } from "../http";

const connectionsService = new ConnectionsService();
const userService = new UserService();
const messageService = new MessageService();
io.on("connect", (socket: Socket) => {
  socket.on("client_first_access", async (params) => {
    const { email, text } = params;
    const socket_id = socket.id;
    let user_id;
    const userExists = await userService.findByEmail(email);
    let user = userExists;
    if (!userExists) {
      user = await userService.create(email);
      await connectionsService.create({
        socket_id,
        user_id: user.id
      });
      user_id = user.id;
    } else {
      user_id = user.id;
      console.log( '----', userExists  )
      user_id = userExists.id;
      let connection:any = await connectionsService.findByUserId(user_id);
      if (!connection) {
        await connectionsService.create({
          socket_id,
          user_id
        });
      } else {
        connection.socket_id = socket_id
        await connectionsService.create(connection);
      }
    }
    
    await messageService.create({ text, user_id });

    const allMessages = await messageService.listByUser(user_id);
    socket.emit("client_list_all_messages", allMessages);

    const allUsers = await connectionsService.findAllWithoutAdmin();
    io.emit( 'admin_list_all_users', allUsers);
  });
  socket.on("client_send_to_admin", async (params) => {
    const { text, socket_admin_id } = params;

    const socket_id = socket.id;
    const user:any = await connectionsService.findBySocketID(socket_id);
    console.log( 'socket_id: ', socket_id )
    console.log( 'user: ', user )
    const message = await messageService.create({ text, user_id: user.user_id });

    io.to(socket_admin_id).emit('admin_receive_message', {
      message,
      socket_id
    });

  });
});
