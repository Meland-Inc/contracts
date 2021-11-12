const NFTStore = artifacts.require("NFTStore");
const TicketLand = artifacts.require("TicketLand");

const updateIdsPool = async (ids) => {
    const TicketLandInstance = await TicketLand.deployed();
    const NFTStoreInstance = await NFTStore.deployed();
    return NFTStoreInstance.updateTokenIdPool(
        TicketLandInstance.address,
        ids
    );
}

contract("TicketLand", accounts => {
    it("更新id池", async () => {
        await updateIdsPool([
            100001,
            100002,
            100003,
            100004,
            100005,
            100006,
            100007,
            100008,
            100009,
            1000010,
            1000011,
            1000012,
            1000013,
        ]);
    })

    it("购买一个ticket land", async () => {
        const TicketLandInstance = await TicketLand.deployed();
        const NFTStoreInstance = await NFTStore.deployed();
        await NFTStoreInstance.buyNFT(TicketLandInstance.address, process.env.ticketLandPriceInWei);
        const balance = await TicketLandInstance.balanceOf(accounts[0]);
        assert.equal(balance, 1);
    });

    it("限购", async () => {
        const TicketLandInstance = await TicketLand.deployed();
        const NFTStoreInstance = await NFTStore.deployed();
        await NFTStoreInstance.buyNFT(TicketLandInstance.address, process.env.ticketLandPriceInWei, { from: accounts[4] });

        try {
            await NFTStoreInstance.buyNFT(TicketLandInstance.address, process.env.ticketLandPriceInWei, { from: accounts[4] });
        } catch(error) {
            assert.equal(error.reason, "Trigger restriction");
        }

        const balance = await TicketLandInstance.balanceOf(accounts[4]);
        assert.equal(balance, 1);
    });

    it("ticket land卖完", async () => {
        await updateIdsPool([
            1000014,
            1000015,
            1000016,
        ]);
        const TicketLandInstance = await TicketLand.deployed();
        const NFTStoreInstance = await NFTStore.deployed();
        await NFTStoreInstance.buyNFT(TicketLandInstance.address, process.env.ticketLandPriceInWei, { from: accounts[3] });
        await NFTStoreInstance.buyNFT(TicketLandInstance.address, process.env.ticketLandPriceInWei, { from: accounts[1] });
        await NFTStoreInstance.buyNFT(TicketLandInstance.address, process.env.ticketLandPriceInWei, { from: accounts[2] });
        let balance = await TicketLandInstance.balanceOf(accounts[3]);
        assert.equal(balance, 1);
        balance = await TicketLandInstance.balanceOf(accounts[1]);
        assert.equal(balance, 1);
        balance = await TicketLandInstance.balanceOf(accounts[2]);
        assert.equal(balance, 1);

        // 第四次买应该报错
        let errmsg = '';
        try {
            await NFTStoreInstance.buyNFT(TicketLandInstance.address, process.env.ticketLandPriceInWei, { from: accounts[5] });
        } catch(error) {
            errmsg = error.reason;
        }
        assert.equal(errmsg, "nft Insufficient supply");
    });
});