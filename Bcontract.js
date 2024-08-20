const {
    Client,
    PrivateKey,
    AccountId,
    ContractExecuteTransaction,
    Hbar,
    TransferTransaction,
    ContractCallQuery,
    ContractInfoQuery,
    AccountBalanceQuery
} = require("@hashgraph/sdk");

require('dotenv').config();
//ver cantidad de dinero en el contrato
async function contractBalanceCheckerFcn(contractId) {
    const client = Client.forTestnet();
    const query = new AccountBalanceQuery()
     .setContractId(contractId)
//Submit the query to a Hedera network
const accountBalance = await query.execute(client);
//Print the balance of hbars
console.log("The hbar account balance for this account is " +accountBalance.hbars);

return (accountBalance.hbars);
}
// archivo con la función de ver balance
module.exports = { contractBalanceCheckerFcn };

