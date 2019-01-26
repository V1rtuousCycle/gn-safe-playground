var GnosisSafe = artifacts.require("GnosisSafe");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(GnosisSafe);
};
