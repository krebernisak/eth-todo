const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "app/src/contracts"),
  networks: {
    develop: {
      host: "127.0.0.1",
      network_id: "*", // Match any network id
      port: 8545,
      websockets: true
    },
    ganache: {
      host: "127.0.0.1",
      network_id: 5777,
      port: 7545,
      websockets: true
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 500
    }
  }
};
