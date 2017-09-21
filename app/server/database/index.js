const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const connect = (uri = 'mongodb://localhost:27017/rental') => (
  new Promise((resolve, reject) => {
    mongoose.connection
      .on('error', error => reject(error))
      .on('close', () => console.log('Database connection closed.'))
      .once('open', () => resolve(mongoose.connections[0]));
    mongoose.connect(uri, { server: { auto_reconnect: true } });
  })
);

const disconnect = () => {
  mongoose.connection.disconnect();
};

module.exports = {
  connect,
  disconnect,
};
