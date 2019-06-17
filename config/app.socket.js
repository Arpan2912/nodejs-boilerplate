/* eslint-disable no-console */
module.exports = class AppSocket {
  static init(io) {
    io.on("connection", client => {
      console.log("connection established");
      client.on("log", data => {
        console.log("event called", data);
      });
      client.on("disconnect", () => {});
    });
  }
};
