const {
  register,
  login,
  authGet,
  authPost,
  updateUserDocument,
} = require('../api/auth');

module.exports = (app) => {
  app.post('/register/', (req, res) => {
    const {
      username, password, firstName, lastName,
    } = req.body;
    register(username, password, firstName, lastName).then((status) => {
      res.json(status);
    }).catch((reason) => {
      console.error(`Failed to register a user due to an error: ${reason}`);
      res.json({});
    });
  });

  app.post('/login/', (req, res) => {
    const { username, password } = req.body;
    login(username, password).then((status) => {
      res.json(status);
    }).catch((reason) => {
      console.error(`Failed to login a user due to an error: ${reason}`);
      res.json({});
    });
  });

  authGet(app, '/login_info', (req, res, user) => {
    if (user) {
      // Only send basic properties
      res.json({
        userId: user.userId,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      });
    } else {
      // Not logged in, send null info
      res.json(null);
    }
  }, false);

  authPost(app, '/login_info', (req, res, user) => {
    const newInfo = {};

    // Only update these hard-coded properties
    if (req.body.firstName) {
      newInfo.firstName = req.body.firstName;
    }
    if (req.body.lastName) {
      newInfo.lastName = req.body.lastName;
    }

    updateUserDocument(user.userId, newInfo);
  }, true);
};
