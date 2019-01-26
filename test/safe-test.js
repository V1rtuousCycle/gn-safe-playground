const Safe = artifacts.require("GnosisSafe");

contract("GnosisSafe", function(accounts) {
    let safeInstance;
    let proxyFactory;

    
    before(async () => {
        safeInstance = await Safe.new();
        await safeInstance.setup([accounts[0], accounts[1]], 1, accounts[1], "0x00");
    });

    it("Should be able to fund the Gnosis Safe with money", async () => {
        await safeInstance.send(2e18 , {from: accounts[5]});
        assert.equal(await web3.eth.getBalance(safeInstance.address), 2e18);
        assert.equal(await web3.eth.getBalance(accounts[2]), 100e18);
    })

    it("Should work", async () => {
        assert.equal(await safeInstance.isOwner(accounts[0]), true);
        assert.equal(await safeInstance.nonce(), 0);

        let transactionHash = await safeInstance.getTransactionHash(
            accounts[2], /// @param to Destination address.
            1e9, /// @param value Ether value.
            '0x00', /// @param data Data payload
            0, /// @param operation Operation type.
            200000, /// @param safeTxGas Fas that should be used for the safe transaction.
            200000, /// @param dataGas Gas costs for data used to trigger the safe transaction.
            1e9, /// @param gasPrice`Maximum gas price that should be used for this transaction.
            '0x0000000000000000000000000000000000000000', /// @param gasToken Token address (or 0 if ETH) that is used for the payment.
            '0x0000000000000000000000000000000000000000', /// @param refundReceiver Address of receiver of gas payment (or 0 if tx.origin).
            0  /// @param _nonce Transaction nonce.
        );
        let signedStringTxHash = await web3.eth.sign(transactionHash, accounts[0]);

        await safeInstance.approveHash(transactionHash, { from: accounts[0] });
        assert.equal(await safeInstance.approvedHashes(accounts[0], transactionHash), 1);

        let sig = accounts[0] + '0000000000000000000000000000000000000000000000000000000000000000' + '01';
		console.log('​sig', sig)
        console.log(typeof accounts[0], accounts[0]);
        let safeTransaction = await safeInstance.execTransaction(
            accounts[2], /// @param to Destination address.
            1e9, /// @param value Ether value.
            '0x00', /// @param data Data payload
            0, /// @param operation Operation type.
            200000, /// @param safeTxGas Fas that should be used for the safe transaction.
            200000, /// @param dataGas Gas costs for data used to trigger the safe transaction.
            1e9, /// @param gasPrice`Maximum gas price that should be used for this transaction.
            '0x0000000000000000000000000000000000000000', /// @param gasToken Token address (or 0 if ETH) that is used for the payment.
            '0x0000000000000000000000000000000000000000', /// @param refundReceiver Address of receiver of gas payment (or 0 if tx.origin).
            sig  /// @param _nonce Transaction nonce.
        )
        console.log('​safeTransaction', safeTransaction)
        
    });
});
