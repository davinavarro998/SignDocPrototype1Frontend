const DocumentSigner = artifacts.require("DocumentSigner");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(DocumentSigner);
};
