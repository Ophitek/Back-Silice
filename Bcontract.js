const {
    Client,
    PrivateKey,
    AccountId,
    ContractExecuteTransaction,
    Hbar,
    TransferTransaction,
    ContractCallQuery,
    ContractInfoQuery
} = require("@hashgraph/sdk");

require('dotenv').config();
//ver cantidad de dinero en el contrato
async function contractBalanceCheckerFcn(contractId) {
    
    const client = Client.forTestnet();
    client.setOperator(AccountId.fromString(process.env.MY_ACCOUNT_ID), PrivateKey.fromStringECDSA(process.env.MY_PRIVATE_KEY));
	const contractQueryTx = new ContractCallQuery()
		.setContractId(contractId)
		.setGas(100000)
		.setFunction("getBalance");
	const contractQuerySubmit = await contractQueryTx.execute(client);
	const contractQueryResult = contractQuerySubmit.getUint256(0);

	const cCheck = await new ContractInfoQuery().setContractId(contractId).execute(client);
	return [contractQueryResult, cCheck];
}
// archivo con la función de ver balance
module.exports = { contractBalanceCheckerFcn };

