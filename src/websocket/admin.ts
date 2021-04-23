import { MessageService } from './../services/MessageService';
import { ConnectionsService } from './../services/ConnectionsService';
import { Socket } from 'socket.io';
import {io} from '../http';
io.on( 'connect', async (socket: Socket) => {

  const connectionsService = new ConnectionsService();
  const messageService = new MessageService();

  const allConnectionsWithoutAdmin = await connectionsService.findAllWithoutAdmin();
  io.emit( 'admin_list_all_users', allConnectionsWithoutAdmin );
  socket.on( 'admin_list_messages_by_users', async (params, callback) => {
    const { user_id } = params;
    const messages = await messageService.listByUser(user_id);
    callback( messages ); 

  });

  socket.on( 'admin_send_message', async (params) =>{
    console.log( 'params: ', params )
    const { text, user_id } = params;
    await messageService.create({
      text,
      user_id,
      admin_id: socket.id
    });

    const { socket_id } = await connectionsService.findByUserId( user_id );

    io.to(socket_id).emit('admin_send_to_client', {
      text,
      socket_id: socket.id
    });
  });
  socket.on( 'admin_user_in_support', async( params) => {
    const { user_id } = params;
    await connectionsService.updateAdminID( user_id, socket.id );

    const allConnectionsWithoutAdmin = await connectionsService.findAllWithoutAdmin();
    io.emit( 'admin_list_all_users', allConnectionsWithoutAdmin );
  });
});