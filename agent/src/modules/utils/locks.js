const { Mutex } = require('async-mutex');

const locks = {
  newsJson: new Mutex(),
  newsQueue: new Mutex(),
  pendingApproval: new Mutex(),
  reserveNews: new Mutex(),
  deploy: new Mutex(),
  newsCycle: new Mutex(),
};

module.exports = locks;
