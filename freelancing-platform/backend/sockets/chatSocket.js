const Message = require('../models/Message');

module.exports = (io) => {
  const nsp = io.of('/chat');

  nsp.on('connection', (socket) => {
    socket.on('join', ({ projectId }) => {
      const room = `project_${projectId}`;
      socket.join(room);
    });

    socket.on('message', async ({ projectId, fromUserId, content }) => {
      try {
        const msg = await Message.create({ project: projectId, from: fromUserId, content });
        const room = `project_${projectId}`;
        nsp.to(room).emit('message', { id: msg._id, project: msg.project, from: msg.from, content: msg.content, createdAt: msg.createdAt });
      } catch (err) { console.error(err); }
    });

    socket.on('disconnect', () => {});
  });
};
