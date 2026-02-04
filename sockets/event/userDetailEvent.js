module.exports = (socket, io, user) => {
    socket.join(`institute_${user.role === 'institute' ? user.id : user.instituteId}`);
    console.log(user.name, ' is connected');
  
    io.to(`institute_${user.role === 'institute' ? user.id : user.instituteId}`).emit('newUserJoined', user);
  
    socket.on('newMessage', (comments) => {
      console.log('comment', comments);
      io.emit('addChat', comments);
    });
  
    socket.on('disconnect', () => {
      console.log(`${user.name} is disconnected`);
      io.to(`institute_${user.role === 'institute' ? user.id : user.instituteId}`).emit('userLeave', user);
    });
  };