const { Show } = require("./Show");
const { User } = require("./User");

User.belongsToMany(Show, { through: "User_Show" });
Show.belongsToMany(User, { through: "User_Show" });

module.exports = { Show, User };
