const {
    Client,
    PrivateKey,
    AccountId,
    ContractExecuteTransaction,
    Hbar,
    TransferTransaction
} = require("@hashgraph/sdk");
require('dotenv').config();
async function hbarTransferFcn(sender, idContract, amount, privateKey) {
    const client = Client.forTestnet();
    client.setOperator(sender, privateKey);

	const transferTx = new TransferTransaction()
		.addHbarTransfer(sender, -amount)
		.addHbarTransfer(idContract, amount)
		.freezeWith(client);
	const transferSign = await transferTx.sign(PrivateKey.fromStringECDSA(privateKey)); // Corrección
	const transferSubmit = await transferSign.execute(client);
	const transferRx = await transferSubmit.getReceipt(client);
	return transferRx;
}
/*
async function main() {
    const transferRx = await hbarTransferFcn("0.0.4668379", "0.0.4708300", 10, "0xbe19bf1ae3919749fb2dc630fe4be85d19b3ee4ea855b20e44bfda278cd2782b");
    console.log(`\n- Transfer ${"10"} HBAR from You to contract: ${transferRx.status}`);
}
main()
*/
module.exports = { hbarTransferFcn };
