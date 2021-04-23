const socket = io();
let connectionsUsers = [];

socket.on( 'admin_list_all_users', (connections) => {
  connectionsUsers = connections;
  let listUsersHTML = document.getElementById('list_users');
  listUsersHTML.innerHTML = '';

  let template = document.getElementById('template').innerHTML;

  connections.forEach( connection => {
    const rendered = Mustache.render( template, {
      email: connection.user.email,
      id: connection.socket_id
    })
    listUsersHTML.innerHTML += rendered;
  });
});

function call(id) {
  const connection = connectionsUsers.find( connection => connection.socket_id === id);
  const template = document.getElementById('admin_template').innerHTML;

  const rendered = Mustache.render( template, {
    email: connection.user.email,
    id: connection.user_id 
  });
  document.getElementById('supports').innerHTML += rendered;

  const params = {
    user_id: connection.user_id
  };
  socket.emit( 'admin_user_in_support', params);
  
  socket.emit( 'admin_list_messages_by_users', params, messages => {
    const divMessages = document.getElementById(`allMessages${connection.user_id}`);

    messages.forEach( message => {
      const createDiv = document.createElement('div');
      if ( message.admin_id === null ) {
        createDiv.className = 'admin_message_client';
        createDiv.innerHTML = `<span>${connection.user.email}</span>
              <span>${message.text}</span>`;
        createDiv.innerHTML += `<span class="admin_date">${dayjs(message.created_at).format( 'DD/MM/YYYY HH:mm:ss')} </span>`;

      } else {
        createDiv.className = 'admin_message_admin';
        createDiv.innerHTML = `Atendente: <span>${message.text}</span>`;
        createDiv.innerHTML += `<span class="admin_date">${dayjs(message.created_at).format( 'DD/MM/YYYY HH:mm:ss')} </span>`;
      }
      divMessages.appendChild( createDiv ); 
    });
  });
}

function sendMessage(id) {
  console.log( 'ID: ', id)
  const text = document.getElementById(`send_message_${id}`);

  const params = {
    user_id: id,
    text: text.value
  };

  socket.emit( 'admin_send_message', params);

  const divMessages = document.getElementById(`allMessages${id}`);
  const createDiv = document.createElement('div');
  createDiv.className = 'admin_message_admin';
  createDiv.innerHTML = `Atendente: <span>${params.text}</span>`;
  createDiv.innerHTML += `<span class="admin_date">${dayjs().format( 'DD/MM/YYYY HH:mm:ss')} </span>`;
  divMessages.appendChild( createDiv );
  text.value = '';
}

socket.on( 'admin_receive_message', data => {

  const connection = connectionsUsers.find( connection => connection.socket_id === data.socket_id);

  const user_id = data.message.user_id;
  const message = data.message;

  const divMessages = document.getElementById(`allMessages${user_id}`);
  const createDiv = document.createElement('div');

  createDiv.className = 'admin_message_client';
  createDiv.innerHTML = `<span>${connection.user.email}</span>
              <span>${message.text}</span>`;
  createDiv.innerHTML += `<span class="admin_date">${dayjs(message.created_at).format( 'DD/MM/YYYY HH:mm:ss')} </span>`;

  divMessages.appendChild( createDiv );

})