/* eslint-disable no-undef */
// 上架商品
const fs = require('fs');
const path = require('path');
const csvtojson = require('csvtojson');
const { keccak256 } = require("web3-utils");
const { BigNumber } = require('ethers');
const { asciiToHex, encodePacked } = require("web3-utils");
const NFTStore = artifacts.require("NFTStore");
const Meland1155Wearable = artifacts.require("Meland1155Wearable");
const Meland1155Land = artifacts.require("Meland1155Land");
const Meland1155LandFuture = artifacts.require("Meland1155LandFuture");
const MelandTier = artifacts.require("MelandTier");

module.exports = async function (callback) {
    try {
        let network = config.network;
        if (![
            "matic",
            "mumbai",
            "develop",
            "rinkeby",
            "test"
        ].includes(network)) {
            console.log("Deploy only on polygon networks");
            callback()
            exit(0);
        }

        let accounts = await web3.eth.getAccounts();

        const Meland1155LandI = await Meland1155Land.deployed();
        const Meland1155WearableI = await Meland1155Wearable.deployed();
        const MelandTierI = await MelandTier.deployed();

        // common cid 89000001
        // rare cid 89000002
        // epic cid 89000003
        const map = {
            // 89000001: [
            //     {
            //         cids: [
            //             8900010,
            //             8900011,
            //             8900012,
            //             8900013,
            //         ],
            //         num: 48
            //     },
            //     {
            //         cids: [
            //             8900014,
            //             8900015,
            //             8900016,
            //             8900017,
            //         ],
            //         num: 48
            //     },
            //     {
            //         cids: [
            //             8900018,
            //             8900019,
            //             8900020,
            //             8900021,
            //         ],
            //         num: 48
            //     },
            //     {
            //         cids: [
            //             8900022,
            //             8900023,
            //             8900024,
            //             8900025,
            //         ],
            //         num: 26
            //     },
            //     {
            //         cids: [
            //             8900026,
            //             8900027,
            //             8900028,
            //             8900029,
            //         ],
            //         num: 25
            //     },
            //     {
            //         cids: [
            //             8900030,
            //             8900031,
            //             8900032,
            //             8900033,
            //         ],
            //         num: 10
            //     },
            // ],
            // 89000002: [
            //     {
            //         cids: [
            //             8900010,
            //             8900011,
            //             8900012,
            //             8900013
            //         ],
            //         num: 47
            //     },
            //     {
            //         cids: [
            //             8900014,
            //             8900015,
            //             8900016,
            //             8900017
            //         ],
            //         num: 47
            //     },
            //     {
            //         cids: [
            //             8900018,
            //             8900019,
            //             8900020,
            //             8900021
            //         ],
            //         num: 46
            //     },
            //     {
            //         cids: [
            //             8900022,
            //             8900023,
            //             8900024,
            //             8900025
            //         ],
            //         num: 49
            //     },
            //     {
            //         cids: [
            //             8900026,
            //             8900027,
            //             8900028,
            //             8900029
            //         ],
            //         num: 49
            //     },
            //     {
            //         cids: [
            //             8900030,
            //             8900031,
            //             8900032,
            //             8900033
            //         ],
            //         num: 42
            //     },
            // ],
            89000003: [
                {
                    cids: [
                        8900022,
                        8900023,
                        8900024,
                        8900025
                    ],
                    num: 20
                },
                {
                    cids: [
                        8900026,
                        8900027,
                        8900028,
                        8900029,
                    ],
                    num: 41
                },
                {
                    cids: [
                        8900030,
                        8900031,
                        8900032,
                        8900033,
                    ],
                    num: 45
                },
                {
                    cids: [
                        8900010,
                        8900011,
                        8900012,
                        8900013
                    ],
                    num: 18
                },
                {
                    cids: [
                        8900014,
                        8900015,
                        8900016,
                        8900017
                    ],
                    num: 18
                },
                {
                    cids: [
                        8900018,
                        8900019,
                        8900020,
                        8900021
                    ],
                    num: 18
                },
            ],
        };

        const ticketlandIdsStr = '7730450#7570555#7810380#8060420#7390450#8020462#7960468#6590581#7800420#7690566#7460456#7540384#7630408#8130392#7570402#8120533#7540537#8110469#7660420#7650489';
        // const ticketlandIdsStr = '7680470#7940476#7470525#7590569#8060515#7470537#7630561#7800585#7930559#7990396#7460450#7740383#8120476#7520432#7460438';
        const ticketLandIds = ticketlandIdsStr.split("#");

        console.debug("mint ticketland");
        let aj = 0;
        var i, j, temporary, chunk = 10;
        for (i = 0, j = ticketLandIds.length; i < j; i += chunk) {
            temporary = ticketLandIds.slice(i, i + chunk);

            console.debug("开始上架ticket land ids", temporary.length, '已经上传:', aj);

            await Meland1155LandI.mintBatch(accounts[0], temporary, temporary.map(() => 1), asciiToHex("ticketland"));

            aj += temporary.length;
            
        }
        console.debug("mint ticketland done.");

        const tierCids = Object.keys(map);

        console.debug("mint wearable");
        for (let i = 0; i < tierCids.length; i++) {
            const tierPoolId = tierCids[i];
            let count = 0;
            const options = map[tierPoolId];
            for (let j = 0; j < options.length; j++) {
                const op = options[j];
                let { cids, num } = op;
                const rewards = [];
                // for (let q = 0; q < cids.length; q++) {
                //     const cid = cids[q];
                //     const tokenIds = (await Meland1155WearableI.mint(accounts[0], cid, num)).logs.map(log => log.args.id.toString());
                //     console.debug("mint wearable", cid, num, rewards, tokenIds, tokenIds.length);
                //     rewards.push(tokenIds);
                // }

                while (num > 0) {
                    num--;
                    const tid = ticketLandIds.pop();

                    if (!tid) {
                        break;
                    }

                    await MelandTierI.fixed100PercentReward(tierPoolId, [
                        {
                            erc1155: Meland1155LandI.address,
                            tokenIds: [tid],
                            amounts: [1]
                        }
                    ], [], []);
                    count++;
                    console.debug("added ticket land reward", count, tierPoolId, tid, 1);

                    // const tokenIds = [
                    //     rewards[0].pop(),
                    //     rewards[1].pop(),
                    //     rewards[2].pop(),
                    //     rewards[3].pop(),
                    // ];
                    // const amounts = tokenIds.map(() => 1);
                    // console.debug("add option reward", tokenIds, amounts);
                }
            }
        }
        console.debug("mint wearable done...");

        callback();
    } catch (error) {
        console.error(error);
        console.log(JSON.stringify(ticketLandIds));
        callback();
    }
};