const hre = require("hardhat");

async function main() {
  console.log("Deploying QuantumChain contracts...");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy QCN Token
  console.log("\n1. Deploying QCN Token...");
  const QCNToken = await hre.ethers.getContractFactory("QCNToken");
  const qcnToken = await QCNToken.deploy(deployer.address);
  await qcnToken.waitForDeployment();
  const qcnTokenAddress = await qcnToken.getAddress();
  console.log("QCN Token deployed to:", qcnTokenAddress);

  // Deploy QuantumDEX
  console.log("\n2. Deploying QuantumDEX...");
  const QuantumDEX = await hre.ethers.getContractFactory("QuantumDEX");
  const quantumDEX = await QuantumDEX.deploy(qcnTokenAddress, deployer.address);
  await quantumDEX.waitForDeployment();
  const quantumDEXAddress = await quantumDEX.getAddress();
  console.log("QuantumDEX deployed to:", quantumDEXAddress);

  // Display deployment summary
  console.log("\n=== Deployment Summary ===");
  console.log("QCN Token:", qcnTokenAddress);
  console.log("QuantumDEX:", quantumDEXAddress);
  console.log("Deployer:", deployer.address);

  // Save deployment info
  const fs = require('fs');
  const deploymentInfo = {
    network: hre.network.name,
    qcnToken: qcnTokenAddress,
    quantumDEX: quantumDEXAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString()
  };

  fs.writeFileSync(
    'deployment-info.json',
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("\nDeployment info saved to deployment-info.json");

  // Verification instructions
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\n=== Verification Commands ===");
    console.log(`npx hardhat verify --network ${hre.network.name} ${qcnTokenAddress} "${deployer.address}"`);
    console.log(`npx hardhat verify --network ${hre.network.name} ${quantumDEXAddress} "${qcnTokenAddress}" "${deployer.address}"`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
