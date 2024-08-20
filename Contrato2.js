const {
    Client,
    PrivateKey,
    AccountId,
    ContractCreateTransaction,
    FileCreateTransaction,
    Hbar,
    FileAppendTransaction,
    ContractFunctionParameters
} = require("@hashgraph/sdk");
const axios = require('axios');
const fs = require('fs');

require('dotenv').config();

async function deployContract(name, description, owner) {
    const client = Client.forTestnet();
    client.setOperator(AccountId.fromString(process.env.MY_ACCOUNT_ID), PrivateKey.fromStringECDSA(process.env.MY_PRIVATE_KEY));

    const contractBytecode = fs.readFileSync('v3_sol_DonationTracker.bin');

    const fileCreateTx = await new FileCreateTransaction()
        .setKeys([PrivateKey.fromStringECDSA(process.env.MY_PRIVATE_KEY)]) 
        .setContents(contractBytecode.slice(0, 5000)) 
        .setMaxTransactionFee(new Hbar(2))
        .execute(client);

    const fileReceipt = await fileCreateTx.getReceipt(client);
    const fileId = fileReceipt.fileId;
    console.log(`File created with ID: ${fileId}`);

    let bytecodeOffset = 5000;
    while (bytecodeOffset < contractBytecode.length) {
        const fileAppendTx = await new FileAppendTransaction()
            .setFileId(fileId)
            .setContents(contractBytecode.slice(bytecodeOffset, bytecodeOffset + 5000))
            .setMaxTransactionFee(new Hbar(2))
            .execute(client);

        await fileAppendTx.getReceipt(client);
        bytecodeOffset += 5000;
    }

    const contractCreateTx = await new ContractCreateTransaction()
        .setBytecodeFileId(fileId)
        .setGas(500000)
        .setConstructorParameters(new ContractFunctionParameters().addAddress("0x166511ced156a83d20427fe6f50127637827fa56")) 
        .setMaxTransactionFee(new Hbar(16))
        .execute(client);

    const contractReceipt = await contractCreateTx.getReceipt(client);
    const contractId = contractReceipt.contractId;

    console.log(`Contract deployed with ID: ${contractId}`);

    // Guardar el contrato en la base de datos
    await saveContract(name, contractId.toString(), description, owner);
}
//FUNCION PARA GUARDAR CONTRATOS        
async function saveContract(name, contractAddress, description, owner) {
    try {
        const response = await axios.post('http://localhost:5000/api/contracts', {
            name,
            contractAddress,
            description,
            owner
        });
        console.log('Contrato guardado en la base de datos:', response.data);
    } catch (error) {
        console.error('Error al guardar el contrato:', error);
    }
}

deployContract().catch(console.error);
module.exports= { "CrearContrato" : deployContract}
