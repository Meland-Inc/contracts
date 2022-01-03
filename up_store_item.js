/* eslint-disable no-undef */
// 上架商品
const fs = require('fs');
const path = require('path');
const csvtojson = require('csvtojson');
const { keccak256 } = require("web3-utils");
const { BigNumber } = require('ethers');
const { asciiToHex, hexToAscii, encodePacked, toAscii, hexToUtf8, hexToString } = require("web3-utils");
const NFTStore = artifacts.require("NFTStore");

const Meland1155Wearable = artifacts.require("Meland1155Wearable");
const Meland1155Land = artifacts.require("Meland1155Land");
const Meland1155LandFuture = artifacts.require("Meland1155LandFuture");


const promiseTimeout = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, 1000);
    });
}

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

        const NFTStoreI = await NFTStore.deployed();
        const Meland1155LandI = await Meland1155Land.deployed();
        const Meland1155LandFutureI = await Meland1155LandFuture.deployed();
        const Meland1155WearableI = await Meland1155Wearable.deployed();

        // console.debug(hexToString("0x156e29f6000000000000000000000000714df076992f95e452a345cd8289882cec6ab82f000000000000000000000000000000000000000000000000000000000087cdab0000000000000000000000000000000000000000000000000000000000000030"));

        // const vcsBuffer = fs.readFileSync(path.join((__dirname), "WearableNFT.csv"));
        // let wearableNFTs = (await csvtojson({}).fromString(vcsBuffer.toString())).slice(2);

        // for (let i = 0; i < wearableNFTs.length; i++) {
        //     const w = wearableNFTs[i];
        //     const cid = w['关联物品id'];
        //     const name = w['物品名称'];
        //     const price = w['销售价格（不要改）'];
        //     console.debug(cid, price, name, 0);
        //     await Meland1155WearableI.setStoreItem(cid, price);
        // }

        // callback()
        // return;
        // const ll = {
        //   "data": {
        //     "stakes": [
        //       {
        //         "staker": "0xcdf97dc99fb0af704c47c9143fa5f6b9f7fe0926"
        //       },
        //       {
        //         "staker": "0x019ef6357b8554350cd0f9fc3b7e138b7fd6b860"
        //       },
        //       {
        //         "staker": "0xc5a9e5080c097f85400aacc924adf0523ffa6715"
        //       },
        //       {
        //         "staker": "0x58ea850ed4e342f8bb44c6a6023505259c9c6b31"
        //       },
        //       {
        //         "staker": "0x821172f8b84c3f359c4621c42e8a74979a0514c8"
        //       },
        //       {
        //         "staker": "0x6644063e97d4f999c394f9d405ec00577257a9c0"
        //       },
        //       {
        //         "staker": "0xd560b22344f57052bfba8a3f1b3f714575112366"
        //       },
        //       {
        //         "staker": "0xd4b0a0f20f99fcd2ef9c5d7c122d5596c01e02b5"
        //       },
        //       {
        //         "staker": "0x806bd48765079dbb43fc5aea4be782ef5c65f8d4"
        //       },
        //       {
        //         "staker": "0xae0708c7805427b2b21244b18fb3b711b11097cd"
        //       },
        //       {
        //         "staker": "0xbec0b0c77e1db8cdd2d7367e6b925706f961ccdc"
        //       },
        //       {
        //         "staker": "0xe9aadf1cf9efbfcb770b613a41aaa0f76677ab96"
        //       },
        //       {
        //         "staker": "0x09c41efc1c7e2c2a11bb153ef39affeaff2cedcd"
        //       },
        //       {
        //         "staker": "0xf6b1152426018c9ddb29f861fcb3bceeee61f635"
        //       },
        //       {
        //         "staker": "0x2baf7562ed83f02b4d4b8a377c681f61d5c375ef"
        //       },
        //       {
        //         "staker": "0x17eef3ea956e40a3531cb16f47f11305aaa39f3d"
        //       },
        //       {
        //         "staker": "0x2bbd2569af3bc18f308bd1b6265759bb0d84c318"
        //       },
        //       {
        //         "staker": "0xcb5f5c8b41b9a18599dbdf01e0f5750e29f3a04f"
        //       },
        //       {
        //         "staker": "0xfdcd137e82f64e662986c65f9df3bfc5c5464046"
        //       },
        //       {
        //         "staker": "0x1468a1c03d3d3f9d2221201b5d52409fb4198532"
        //       },
        //       {
        //         "staker": "0x95bf59b7c60affc6fe29e6d1db852be408f3d085"
        //       },
        //       {
        //         "staker": "0x019ef6357b8554350cd0f9fc3b7e138b7fd6b860"
        //       },
        //       {
        //         "staker": "0xb0228fbe00a019d5dead1966db6378b611f19267"
        //       },
        //       {
        //         "staker": "0x3a46cfb96804d5708b39499da7ea79db284d572b"
        //       },
        //       {
        //         "staker": "0x6e45b41dd91cb3f4723cc1113455bce406a5ae05"
        //       },
        //       {
        //         "staker": "0x1779b883c83635e3f7c2dfe3b5002fdd1d963256"
        //       },
        //       {
        //         "staker": "0x51df1bab5540809e9e01adf66e034aac87b196b0"
        //       },
        //       {
        //         "staker": "0x738d0a1e54117bbb813edf4a9d9c564f65c31828"
        //       },
        //       {
        //         "staker": "0x1d2757dfab15e813811af9af7e2449f00dfa7a5f"
        //       },
        //       {
        //         "staker": "0xe8d0806fc923b64e6c917ee7f9f7732cd78fabcd"
        //       },
        //       {
        //         "staker": "0x4e276aea526864953dcd27394fd313b515f6e501"
        //       },
        //       {
        //         "staker": "0x019ef6357b8554350cd0f9fc3b7e138b7fd6b860"
        //       },
        //       {
        //         "staker": "0x2bf9e1d21b5b14a0b2d163e7ae3581aae2fe6f7e"
        //       },
        //       {
        //         "staker": "0x8b95c58daf11dfc1af6b7db32ff9950eeeda05f9"
        //       },
        //       {
        //         "staker": "0x1af6c19e962eeadc08193f174763994ce9b9da6b"
        //       },
        //       {
        //         "staker": "0xe7c69d5ac9f3cb694c0c6356fbac87bb7346b150"
        //       },
        //       {
        //         "staker": "0x3938d79aa4b847430894a31c2179bc7705b50337"
        //       },
        //       {
        //         "staker": "0xf1da72abd0c83f4ce3529f59499c2207c8b4773d"
        //       },
        //       {
        //         "staker": "0xa9bdfb2f3dc148caf61b564b1b65dd28c293e668"
        //       },
        //       {
        //         "staker": "0x72088318518ead3119311f5a824a1e770d8ec39a"
        //       },
        //       {
        //         "staker": "0xf4ba8e97d59284ebfc7ab33a509bb8938748d492"
        //       },
        //       {
        //         "staker": "0x0e0b117e3a30b247c7c408cd2a82724a56e6fead"
        //       },
        //       {
        //         "staker": "0x2468099f6c403f21b45b4c43bde8e83de80616c9"
        //       },
        //       {
        //         "staker": "0x9cf4f22c9e0180255bc1046f590447058ccd0f62"
        //       },
        //       {
        //         "staker": "0xbebd2c953151213d9ddd8b406f31de91077fbbdd"
        //       },
        //       {
        //         "staker": "0xed2326b9107399fcf04e264b07beccf3d8d35347"
        //       },
        //       {
        //         "staker": "0xb57d32e148dd976e3b79747fd3c72443df732828"
        //       },
        //       {
        //         "staker": "0x2754922425517116313d89a8394b45756ae536c3"
        //       },
        //       {
        //         "staker": "0x9e17858f28f0e493b2023b5662c442bbda1aa4d2"
        //       },
        //       {
        //         "staker": "0x084c424c6b424136a84dcabe9456abfaec360eaa"
        //       },
        //       {
        //         "staker": "0xf84ef2c059e1d0b3d70bcde04859abba8b192045"
        //       },
        //       {
        //         "staker": "0x46f9a1dc80df2e5d1cc0efd24f4ec341523753d3"
        //       },
        //       {
        //         "staker": "0x099e8537b90803e600d65888467742d31787db32"
        //       },
        //       {
        //         "staker": "0x15239ebf4490ba6672faa5ad2386711bb70cb0ae"
        //       },
        //       {
        //         "staker": "0xc7c5d2815ab8b1113dc0a89b0610edb29eea5c60"
        //       },
        //       {
        //         "staker": "0x8dfdd6b98ab0935f06986dde0528091ecdb39f57"
        //       },
        //       {
        //         "staker": "0x1468a1c03d3d3f9d2221201b5d52409fb4198532"
        //       },
        //       {
        //         "staker": "0x770d71b87474081b245197c08aff33038082c249"
        //       },
        //       {
        //         "staker": "0x4442a6bbf9f450668a372228e84696791b66e91b"
        //       },
        //       {
        //         "staker": "0xd47207e00afe8a07225a1fa5047432ec7cc4e859"
        //       },
        //       {
        //         "staker": "0xcb5f5c8b41b9a18599dbdf01e0f5750e29f3a04f"
        //       },
        //       {
        //         "staker": "0xc6081e74b54f890ccbc09d9ce0e4e1fed27bf0fb"
        //       },
        //       {
        //         "staker": "0x6655d0c8583edf2929185038ccb32b1a4b7cf4c7"
        //       },
        //       {
        //         "staker": "0x7804137befc39980e5ae602f535e3a627b32e451"
        //       },
        //       {
        //         "staker": "0xd2476b7b7bf75377fb2519c3b3a71c64c6e11b93"
        //       },
        //       {
        //         "staker": "0x4d82db9dd6641fc28256b004f30cde380ca84ecf"
        //       },
        //       {
        //         "staker": "0x88acb5964cc41e484bf832d37076d8a8aa385fb1"
        //       },
        //       {
        //         "staker": "0x959316ddb7788b3d0c7319336279a1d68db5ab96"
        //       },
        //       {
        //         "staker": "0x084c424c6b424136a84dcabe9456abfaec360eaa"
        //       },
        //       {
        //         "staker": "0xea8aba0e2072306a53273381b1a50bcb21b85eb1"
        //       },
        //       {
        //         "staker": "0xd47207e00afe8a07225a1fa5047432ec7cc4e859"
        //       },
        //       {
        //         "staker": "0x2bbd2569af3bc18f308bd1b6265759bb0d84c318"
        //       },
        //       {
        //         "staker": "0xd57f23544e601c4e40e5d06a7e480b28d833c616"
        //       },
        //       {
        //         "staker": "0x5bb3ddfe1b88e93d93cef8b7c050e19d131cbfdf"
        //       },
        //       {
        //         "staker": "0xac4e1d65b0796eca268251ad18e61935be2e3e8a"
        //       },
        //       {
        //         "staker": "0x27d196e66fdaf05f669f011486dcf50eb7beeb8d"
        //       },
        //       {
        //         "staker": "0x377c5a1e6371beb5d653e09351673dcab771eb0a"
        //       },
        //       {
        //         "staker": "0xa9799f75317a71de2e2e06c6c6ab477664d68ebf"
        //       },
        //       {
        //         "staker": "0xeb8d6b06d30b01d31af92e8a5698b5770672f6ce"
        //       },
        //       {
        //         "staker": "0x748cbab7e4524c39142018b7d6c7f05f9544f609"
        //       },
        //       {
        //         "staker": "0xc5be8536fef5b01d3bfe29031529f0796c4e263b"
        //       },
        //       {
        //         "staker": "0xed2326b9107399fcf04e264b07beccf3d8d35347"
        //       },
        //       {
        //         "staker": "0xb069a99baa247b3b9e789b988462469e365913af"
        //       },
        //       {
        //         "staker": "0x62889db71e7a0ee4058fd9cc631549da197f4856"
        //       },
        //       {
        //         "staker": "0x8c99bf516ae468506770d65662433f23ec8a713d"
        //       },
        //       {
        //         "staker": "0xf2553c34e1f62ac1ddb8b7d1e697bc3ace90080c"
        //       },
        //       {
        //         "staker": "0x3fd5c56123ff7ff5828cbcb96681dd1a3a46c9f5"
        //       },
        //       {
        //         "staker": "0xd47207e00afe8a07225a1fa5047432ec7cc4e859"
        //       },
        //       {
        //         "staker": "0x4e0dc773a347b8407a0ad0535ec6124c138e68c7"
        //       },
        //       {
        //         "staker": "0xafaacf6f1a13244958f5abcac3638711f6f508cb"
        //       },
        //       {
        //         "staker": "0xf7953d58d0ae11e514ec5555dad09f7546ff8610"
        //       },
        //       {
        //         "staker": "0x3d2e42865dcb8642d46a76be0d00b0699a584078"
        //       },
        //       {
        //         "staker": "0xc5a9e5080c097f85400aacc924adf0523ffa6715"
        //       },
        //       {
        //         "staker": "0x21a5e313da5006e4bb388185b554f4d079f9af59"
        //       },
        //       {
        //         "staker": "0xc275d47aa668a37ee8008109f4c62e0fc3281006"
        //       },
        //       {
        //         "staker": "0xb805f4f675752ba0abe36f46e4b5939981e116c7"
        //       },
        //       {
        //         "staker": "0xb64f7aa88a4cd5169b92fc02616b206f0907fe91"
        //       },
        //       {
        //         "staker": "0xafaacf6f1a13244958f5abcac3638711f6f508cb"
        //       },
        //       {
        //         "staker": "0x3af7fac2f5d02d4008b0d44e050759f17e14119f"
        //       },
        //       {
        //         "staker": "0x72088318518ead3119311f5a824a1e770d8ec39a"
        //       },
        //       {
        //         "staker": "0x53bde099ca2dd9e371d9692828052d4ffaafc045"
        //       },
        //       {
        //         "staker": "0x6e8c9d4b10d2c95f61e5457634272339acd68860"
        //       },
        //       {
        //         "staker": "0xa83f1f96b63d37fc078e1bc17301b027646c22d2"
        //       },
        //       {
        //         "staker": "0x05c45fb8eb618b98318af660215d731b2a3675a4"
        //       },
        //       {
        //         "staker": "0xf6745d4eaba33c133cb6fa385572dc3a19da7acf"
        //       },
        //       {
        //         "staker": "0x0478ece025cd680c648ec9448c112e6f70f0cd1c"
        //       },
        //       {
        //         "staker": "0x9c95dd197822444eeadf9907a904bbe4dd0fe2af"
        //       },
        //       {
        //         "staker": "0xe62709343ed6ba0babe6d60f225025cab897d0f8"
        //       },
        //       {
        //         "staker": "0x113b254e4835613d2a9f8b74427ccf115317cd04"
        //       },
        //       {
        //         "staker": "0xcb5f5c8b41b9a18599dbdf01e0f5750e29f3a04f"
        //       },
        //       {
        //         "staker": "0x3d166ab0757f1f263e942254d000fd03d90dbbb2"
        //       },
        //       {
        //         "staker": "0xb72e2142911d91fb1bc7efd79c95dfec5787ced6"
        //       },
        //       {
        //         "staker": "0x882688dc809fec3268a5afa4768cfefc02e8ddca"
        //       },
        //       {
        //         "staker": "0xfdcd137e82f64e662986c65f9df3bfc5c5464046"
        //       },
        //       {
        //         "staker": "0xa9f529c203994886bd36c6c23a97405bbab099f5"
        //       },
        //       {
        //         "staker": "0x377c5a1e6371beb5d653e09351673dcab771eb0a"
        //       },
        //       {
        //         "staker": "0x60f840c62f443fad8c99664f61335dc1397f36c8"
        //       },
        //       {
        //         "staker": "0x8dfdd6b98ab0935f06986dde0528091ecdb39f57"
        //       },
        //       {
        //         "staker": "0xfa58020c3f9e2e319d4b2798bd4b7237bfcb0d70"
        //       },
        //       {
        //         "staker": "0xd2af9431b051d6058d11670235de57f5cf2a6766"
        //       },
        //       {
        //         "staker": "0x0ea342e8b02468847f858257b815e620f4b33b57"
        //       },
        //       {
        //         "staker": "0x7e04eea8191ac56a65dc86e6a16cb54c6198f4dc"
        //       },
        //       {
        //         "staker": "0x5bfc27641ba1e54c2acf53320559f116fb43e1b3"
        //       },
        //       {
        //         "staker": "0xccd0f0c2f88a5817f0e73851899e2d63b5a9a53b"
        //       },
        //       {
        //         "staker": "0xc5a9e5080c097f85400aacc924adf0523ffa6715"
        //       },
        //       {
        //         "staker": "0xf72cfbef2813e2893a961d8b2727ad7f46326ba1"
        //       },
        //       {
        //         "staker": "0x801f5f5a2163961bd7168e31737b0cec866c7c95"
        //       },
        //       {
        //         "staker": "0x46d537a40175d2f62a0ecad779b3df5d34e25211"
        //       },
        //       {
        //         "staker": "0x550786441d5dc21963c3fc005dc2e358db1c1105"
        //       },
        //       {
        //         "staker": "0xed2326b9107399fcf04e264b07beccf3d8d35347"
        //       },
        //       {
        //         "staker": "0x820dd4879e702f49a03fe072729daa8a42c961b4"
        //       },
        //       {
        //         "staker": "0xeb8d6b06d30b01d31af92e8a5698b5770672f6ce"
        //       },
        //       {
        //         "staker": "0xfdcd137e82f64e662986c65f9df3bfc5c5464046"
        //       },
        //       {
        //         "staker": "0xd5f4bcab3e3ed70ec1e533fe5f2ec801dc718ce8"
        //       },
        //       {
        //         "staker": "0xeb8d6b06d30b01d31af92e8a5698b5770672f6ce"
        //       },
        //       {
        //         "staker": "0xa7f4987dc5ef380feb4bab278a8da282979f5ba9"
        //       },
        //       {
        //         "staker": "0x8f627b89a89a470541baf8c8a628088a943e2b70"
        //       },
        //       {
        //         "staker": "0x5bfc27641ba1e54c2acf53320559f116fb43e1b3"
        //       },
        //       {
        //         "staker": "0x2a5049cd1ef1d16756cfc622eefc4ee9b6718f34"
        //       },
        //       {
        //         "staker": "0xef9ff03aeb2ba2ebce2bcc193a6700e6ac57f4ae"
        //       },
        //       {
        //         "staker": "0x8dfdd6b98ab0935f06986dde0528091ecdb39f57"
        //       },
        //       {
        //         "staker": "0xc8afd9b7d46d4a875803df9696dfdcba32a29f90"
        //       },
        //       {
        //         "staker": "0x2bbd2569af3bc18f308bd1b6265759bb0d84c318"
        //       },
        //       {
        //         "staker": "0x4e0dc773a347b8407a0ad0535ec6124c138e68c7"
        //       },
        //       {
        //         "staker": "0x64483ee480b0a7712cc8c67541fc8a68ea5662d3"
        //       },
        //       {
        //         "staker": "0x09c41efc1c7e2c2a11bb153ef39affeaff2cedcd"
        //       },
        //       {
        //         "staker": "0x2754922425517116313d89a8394b45756ae536c3"
        //       },
        //       {
        //         "staker": "0x8a62e6e072a1d2f6fbdc6b00b9e9f71bd8a12972"
        //       },
        //       {
        //         "staker": "0x084c424c6b424136a84dcabe9456abfaec360eaa"
        //       },
        //       {
        //         "staker": "0x5a9691c40abb115ec4d5a6bdb838dfe85204cd6e"
        //       },
        //       {
        //         "staker": "0x9949441e8fe498fecf5877a6cd7a2fd8888d2e5e"
        //       },
        //       {
        //         "staker": "0x9a840064937cea79df59b2725b59a4bc1ce2b821"
        //       },
        //       {
        //         "staker": "0xc275d47aa668a37ee8008109f4c62e0fc3281006"
        //       },
        //       {
        //         "staker": "0x897d5fdf3864cf7688d80d6841d6db68ad5cb316"
        //       },
        //       {
        //         "staker": "0x2754922425517116313d89a8394b45756ae536c3"
        //       },
        //       {
        //         "staker": "0x8d4b9cec4ac67116bfad96baff8f7486cc1dc666"
        //       },
        //       {
        //         "staker": "0x53590222635aade6a294e55b9a9ecd6d5bddf001"
        //       },
        //       {
        //         "staker": "0x7999f292f6b0c0de9aa379b99db7bdcd466885f1"
        //       },
        //       {
        //         "staker": "0x717402e669910c51144982e346693e9ed8e9fc07"
        //       },
        //       {
        //         "staker": "0xf1c5dd0fac1005092380cc6c5234274d8ae1f717"
        //       },
        //       {
        //         "staker": "0x50167fed7166949abb061eb5b51efe310f1ca739"
        //       },
        //       {
        //         "staker": "0xa95b765adbe1af94b902497584baedbe8ccdd3f5"
        //       },
        //       {
        //         "staker": "0x3a46cfb96804d5708b39499da7ea79db284d572b"
        //       },
        //       {
        //         "staker": "0xfbf577b8ec55215eb00926c2a4bb8236c514e9f0"
        //       },
        //       {
        //         "staker": "0x4052ce6d23c1f3c0cda3e55e28b2198e6d9852fd"
        //       },
        //       {
        //         "staker": "0x09abc1c2b18afbe6d39e366efd7198e92995e3eb"
        //       },
        //       {
        //         "staker": "0x3af7fac2f5d02d4008b0d44e050759f17e14119f"
        //       },
        //       {
        //         "staker": "0x820dd4879e702f49a03fe072729daa8a42c961b4"
        //       },
        //       {
        //         "staker": "0xfafa2ecc3f942f4645a905b88044d44cacf88888"
        //       },
        //       {
        //         "staker": "0xfccb9e2ac294c7a6e8b710d9376d7c77c9092a95"
        //       },
        //       {
        //         "staker": "0x9cf4f22c9e0180255bc1046f590447058ccd0f62"
        //       },
        //       {
        //         "staker": "0x2a5049cd1ef1d16756cfc622eefc4ee9b6718f34"
        //       },
        //       {
        //         "staker": "0x6644063e97d4f999c394f9d405ec00577257a9c0"
        //       },
        //       {
        //         "staker": "0x8b95c58daf11dfc1af6b7db32ff9950eeeda05f9"
        //       },
        //       {
        //         "staker": "0x484c3dcd2311ba0e018b3d57c572790865275ae1"
        //       },
        //       {
        //         "staker": "0x51df1bab5540809e9e01adf66e034aac87b196b0"
        //       },
        //       {
        //         "staker": "0x3d166ab0757f1f263e942254d000fd03d90dbbb2"
        //       },
        //       {
        //         "staker": "0x643d2e9b93430e453a5328c32020fca201d23f0e"
        //       },
        //       {
        //         "staker": "0xf1c5dd0fac1005092380cc6c5234274d8ae1f717"
        //       },
        //       {
        //         "staker": "0xd1db9ab9dbde811020f2a001df92e547391ba97a"
        //       },
        //       {
        //         "staker": "0xb805f4f675752ba0abe36f46e4b5939981e116c7"
        //       },
        //       {
        //         "staker": "0x9c25e082f06fac6f46fb5564a574254e3d746973"
        //       },
        //       {
        //         "staker": "0x9a840064937cea79df59b2725b59a4bc1ce2b821"
        //       },
        //       {
        //         "staker": "0x567d64f191d815b2acf52b124936d99e6643457c"
        //       },
        //       {
        //         "staker": "0x83e39a8d6fb9f515358882c5d3c58116e180f8d7"
        //       },
        //       {
        //         "staker": "0x292a2dd3bf880401f4ba243f026546b322e9eb94"
        //       },
        //       {
        //         "staker": "0x37a37f9b6f84e1e821d60bb636cbd6a65bcb0241"
        //       },
        //       {
        //         "staker": "0xe681dec6e5f8bfabafee524953531fb1ab67e364"
        //       },
        //       {
        //         "staker": "0x6e45b41dd91cb3f4723cc1113455bce406a5ae05"
        //       },
        //       {
        //         "staker": "0xef9ff03aeb2ba2ebce2bcc193a6700e6ac57f4ae"
        //       },
        //       {
        //         "staker": "0xf72cfbef2813e2893a961d8b2727ad7f46326ba1"
        //       },
        //       {
        //         "staker": "0xee5ac5c1acedbe528cac0e0f10d2690335c874fd"
        //       },
        //       {
        //         "staker": "0x33243e0e08c73ad524b7ce751eb0105f63a7d154"
        //       },
        //       {
        //         "staker": "0x0e0b117e3a30b247c7c408cd2a82724a56e6fead"
        //       },
        //       {
        //         "staker": "0x6838aeb8daed5a5cf97d167272526d1672c61ef4"
        //       },
        //       {
        //         "staker": "0x567d64f191d815b2acf52b124936d99e6643457c"
        //       },
        //       {
        //         "staker": "0xde252d4859e14368cd28541c1bd04f83adf8bc7a"
        //       },
        //       {
        //         "staker": "0x9e2626f985ea2c44948480825cabf0cf7873feaa"
        //       },
        //       {
        //         "staker": "0xde252d4859e14368cd28541c1bd04f83adf8bc7a"
        //       },
        //       {
        //         "staker": "0x50827c038824e6e91d3651b6cf3913557f0a5942"
        //       },
        //       {
        //         "staker": "0x8f627b89a89a470541baf8c8a628088a943e2b70"
        //       },
        //       {
        //         "staker": "0xbec0b0c77e1db8cdd2d7367e6b925706f961ccdc"
        //       },
        //       {
        //         "staker": "0x51df1bab5540809e9e01adf66e034aac87b196b0"
        //       },
        //       {
        //         "staker": "0xf7f12a7359722206977a06260fac146c03766b78"
        //       },
        //       {
        //         "staker": "0x054930b8cec5ba127cf9f08b9f0f73ef5b73d533"
        //       },
        //       {
        //         "staker": "0xaaa935d0e6337ac5b5ea80128a6e053985e88888"
        //       },
        //       {
        //         "staker": "0xdaca9f1a1e036ac832809f784c2277e86327c7fc"
        //       },
        //       {
        //         "staker": "0x7e04eea8191ac56a65dc86e6a16cb54c6198f4dc"
        //       },
        //       {
        //         "staker": "0x9e2626f985ea2c44948480825cabf0cf7873feaa"
        //       },
        //       {
        //         "staker": "0xcba8fbd8e9d07f12de38b8b832500b2ffc2eac97"
        //       },
        //       {
        //         "staker": "0x550786441d5dc21963c3fc005dc2e358db1c1105"
        //       },
        //       {
        //         "staker": "0xf6f13d09bc7c0898a03dca56ee6cecfa5ceb6599"
        //       },
        //       {
        //         "staker": "0xa0c417620ad6c5ea1a9c182c9ed8da406bfe46b0"
        //       },
        //       {
        //         "staker": "0xd2476b7b7bf75377fb2519c3b3a71c64c6e11b93"
        //       },
        //       {
        //         "staker": "0x33243e0e08c73ad524b7ce751eb0105f63a7d154"
        //       },
        //       {
        //         "staker": "0x09c41efc1c7e2c2a11bb153ef39affeaff2cedcd"
        //       },
        //       {
        //         "staker": "0xde252d4859e14368cd28541c1bd04f83adf8bc7a"
        //       },
        //       {
        //         "staker": "0xfb0e5ef2199c78549ce256096eb4d77e39446b96"
        //       },
        //       {
        //         "staker": "0xd57f23544e601c4e40e5d06a7e480b28d833c616"
        //       },
        //       {
        //         "staker": "0x141735938b24d807ed516dfb0a3711091256b6fd"
        //       },
        //       {
        //         "staker": "0x9d48e5baf01917da499c84ba48e4179a48814ca2"
        //       },
        //       {
        //         "staker": "0x567d64f191d815b2acf52b124936d99e6643457c"
        //       },
        //       {
        //         "staker": "0xfb5d79330f4654a3d50c88021524c1a68acff4c7"
        //       },
        //       {
        //         "staker": "0xfed6df10d53c4c253525e97517127ffed031d886"
        //       },
        //       {
        //         "staker": "0x17909ebf22c8c6201761d2802908f687416b8cc8"
        //       },
        //       {
        //         "staker": "0xb510053f66cf659ee1242fa6e903cd7807a4a0c0"
        //       },
        //       {
        //         "staker": "0x1779b883c83635e3f7c2dfe3b5002fdd1d963256"
        //       },
        //       {
        //         "staker": "0xd8bf31db52948892751d3d4bac17f05898a343cb"
        //       },
        //       {
        //         "staker": "0x2a5049cd1ef1d16756cfc622eefc4ee9b6718f34"
        //       },
        //       {
        //         "staker": "0x661b4e7cdfb46058badbb0b301e59f1568af20f7"
        //       },
        //       {
        //         "staker": "0xe3027017b648a67a422cbd1d78b7396d2bdca98e"
        //       },
        //       {
        //         "staker": "0x3c61b4b56b7ed78cfa4096ea37003ddc4d2e67e0"
        //       },
        //       {
        //         "staker": "0xb510053f66cf659ee1242fa6e903cd7807a4a0c0"
        //       },
        //       {
        //         "staker": "0x8a7f83aea32eb551a8e7f23779f6e9e2e6b1ca42"
        //       },
        //       {
        //         "staker": "0x2771df12644f5b916b4eef2dddf1a42254a50203"
        //       },
        //       {
        //         "staker": "0xf61e6b82e77e85d664b5cbf5d1bac6f91beb25fe"
        //       },
        //       {
        //         "staker": "0x8c34d6edd97f29a3dd97f678b2d9e8ccbfda6e6e"
        //       },
        //       {
        //         "staker": "0x60bb37a934d057cf0ae06f409ca9fc953d2ea07e"
        //       },
        //       {
        //         "staker": "0x1b76c06640b87955e713bf9218d196da7fb9aa6f"
        //       },
        //       {
        //         "staker": "0x3fd5c56123ff7ff5828cbcb96681dd1a3a46c9f5"
        //       },
        //       {
        //         "staker": "0xed53e5f50c2b6015ed6547eb5c0b837649d66168"
        //       },
        //       {
        //         "staker": "0xe0c1b8f425d8873ebc30233d5cfb55763808b613"
        //       },
        //       {
        //         "staker": "0xfccb9e2ac294c7a6e8b710d9376d7c77c9092a95"
        //       },
        //       {
        //         "staker": "0x1769cfd24aa438b787f96874d9e1f8a73adb5134"
        //       },
        //       {
        //         "staker": "0x341d073d941e6a36000f9789846ffaec54577e27"
        //       },
        //       {
        //         "staker": "0x10dfa5355f10956d0c580797adec0582252ba789"
        //       },
        //       {
        //         "staker": "0x904f2662c8cd1550782998927545c96e3a7a307f"
        //       },
        //       {
        //         "staker": "0xf07af95a7cd5c0e799a2e47cff78b66924a146e9"
        //       },
        //       {
        //         "staker": "0xfd022195062d0e593f866058f6b532bd2af92d55"
        //       },
        //       {
        //         "staker": "0x820dd4879e702f49a03fe072729daa8a42c961b4"
        //       },
        //       {
        //         "staker": "0x0e0b117e3a30b247c7c408cd2a82724a56e6fead"
        //       },
        //       {
        //         "staker": "0x1156e40675b1db1e4fecedb0c65f83ec33d4f477"
        //       },
        //       {
        //         "staker": "0x3fd5c56123ff7ff5828cbcb96681dd1a3a46c9f5"
        //       },
        //       {
        //         "staker": "0x862530377296d473ebc6044886d43dcd4274ab1a"
        //       },
        //       {
        //         "staker": "0x88acb5964cc41e484bf832d37076d8a8aa385fb1"
        //       },
        //       {
        //         "staker": "0x9a840064937cea79df59b2725b59a4bc1ce2b821"
        //       },
        //       {
        //         "staker": "0xd560b22344f57052bfba8a3f1b3f714575112366"
        //       },
        //       {
        //         "staker": "0xb1383885b9acd25161a44ed6cf04ff04fda824c2"
        //       },
        //       {
        //         "staker": "0xa9bdfb2f3dc148caf61b564b1b65dd28c293e668"
        //       },
        //       {
        //         "staker": "0xf529ebe70c603204507af7625e2263d5e12fcef8"
        //       },
        //       {
        //         "staker": "0x874ce467e99c003a8ac165cf41d4cc8bc69e75e9"
        //       },
        //       {
        //         "staker": "0x2c2c010151cfd66b80f6e67b56b10e5efa8928b9"
        //       },
        //       {
        //         "staker": "0x1b76c06640b87955e713bf9218d196da7fb9aa6f"
        //       },
        //       {
        //         "staker": "0x0c50db96755c180a626d5b3f57fcffeead0bbb03"
        //       },
        //       {
        //         "staker": "0x661b4e7cdfb46058badbb0b301e59f1568af20f7"
        //       },
        //       {
        //         "staker": "0x88acb5964cc41e484bf832d37076d8a8aa385fb1"
        //       },
        //       {
        //         "staker": "0x52bca9e61c3ecfc0deeb5ebde2fb69da25f0c6c0"
        //       },
        //       {
        //         "staker": "0xc275d47aa668a37ee8008109f4c62e0fc3281006"
        //       },
        //       {
        //         "staker": "0x8f627b89a89a470541baf8c8a628088a943e2b70"
        //       },
        //       {
        //         "staker": "0x3281e726a03e1d46909b32291d7b2abd8dbf41d4"
        //       },
        //       {
        //         "staker": "0xb510053f66cf659ee1242fa6e903cd7807a4a0c0"
        //       },
        //       {
        //         "staker": "0x9535ea176eb6447110a3bd9261a164fbfc889333"
        //       },
        //       {
        //         "staker": "0xcd1f98be5b5a41709c6e0d84bd0d2753b6911476"
        //       },
        //       {
        //         "staker": "0x09c624d5271a1f7e6a2588e778a4d48bb90a6952"
        //       },
        //       {
        //         "staker": "0xee5ac5c1acedbe528cac0e0f10d2690335c874fd"
        //       },
        //       {
        //         "staker": "0xabbe47859b1578eda2e16078d135184e65dc484b"
        //       },
        //       {
        //         "staker": "0xcd29bad1a0c9c5ab18acb59bece1ce0c5229e782"
        //       },
        //       {
        //         "staker": "0xd57f23544e601c4e40e5d06a7e480b28d833c616"
        //       },
        //       {
        //         "staker": "0xcfd50690cfaa8653fca1a2bb64310f5cfa6aff8b"
        //       },
        //       {
        //         "staker": "0x904f2662c8cd1550782998927545c96e3a7a307f"
        //       },
        //       {
        //         "staker": "0xc8470c90994843ec7d3a211fadb43bc3ad8f14c6"
        //       },
        //       {
        //         "staker": "0xe1d0cc323fc0c8b16441c3a6d7ee0d030f840cda"
        //       },
        //       {
        //         "staker": "0x7f3f7cd66185488a655ccd0c1d22c167c9810765"
        //       },
        //       {
        //         "staker": "0x6644063e97d4f999c394f9d405ec00577257a9c0"
        //       },
        //       {
        //         "staker": "0x93e07dd7893f781117d7bf0d7765feb6726f830a"
        //       },
        //       {
        //         "staker": "0x6e45b41dd91cb3f4723cc1113455bce406a5ae05"
        //       },
        //       {
        //         "staker": "0xafaacf6f1a13244958f5abcac3638711f6f508cb"
        //       },
        //       {
        //         "staker": "0xd560b22344f57052bfba8a3f1b3f714575112366"
        //       },
        //       {
        //         "staker": "0x4f4b2e23f53a75ce7c466d1cf91c066a405e06c9"
        //       },
        //       {
        //         "staker": "0xbec0b0c77e1db8cdd2d7367e6b925706f961ccdc"
        //       },
        //       {
        //         "staker": "0x290dc3fb9af4b79bfcdc90a6b07d19d8d0e8e710"
        //       },
        //       {
        //         "staker": "0x3a46cfb96804d5708b39499da7ea79db284d572b"
        //       },
        //       {
        //         "staker": "0xcc270d76b1739bd12869640fb740d36ba23158a6"
        //       },
        //       {
        //         "staker": "0xee5ac5c1acedbe528cac0e0f10d2690335c874fd"
        //       },
        //       {
        //         "staker": "0x748cbab7e4524c39142018b7d6c7f05f9544f609"
        //       },
        //       {
        //         "staker": "0xb64f7aa88a4cd5169b92fc02616b206f0907fe91"
        //       },
        //       {
        //         "staker": "0x377c5a1e6371beb5d653e09351673dcab771eb0a"
        //       },
        //       {
        //         "staker": "0xb64f7aa88a4cd5169b92fc02616b206f0907fe91"
        //       },
        //       {
        //         "staker": "0x52c920665b159fb498a7e067d4693268544972f8"
        //       },
        //       {
        //         "staker": "0xc1e648b58e69d566fe57a9b00b507f584c0f8c09"
        //       },
        //       {
        //         "staker": "0x550786441d5dc21963c3fc005dc2e358db1c1105"
        //       },
        //       {
        //         "staker": "0x661b4e7cdfb46058badbb0b301e59f1568af20f7"
        //       },
        //       {
        //         "staker": "0x1769cfd24aa438b787f96874d9e1f8a73adb5134"
        //       },
        //       {
        //         "staker": "0x20792b1ed7223974569ec1436b9ab439a68a2d38"
        //       },
        //       {
        //         "staker": "0x4befa8fec4682d15124ca0597b97b42930ca94aa"
        //       },
        //       {
        //         "staker": "0x1468a1c03d3d3f9d2221201b5d52409fb4198532"
        //       },
        //       {
        //         "staker": "0x9e2626f985ea2c44948480825cabf0cf7873feaa"
        //       },
        //       {
        //         "staker": "0x739fd28392a4694b1a244b259d170f293322e7b8"
        //       },
        //       {
        //         "staker": "0x5a9691c40abb115ec4d5a6bdb838dfe85204cd6e"
        //       },
        //       {
        //         "staker": "0xfccb9e2ac294c7a6e8b710d9376d7c77c9092a95"
        //       },
        //       {
        //         "staker": "0x8b95c58daf11dfc1af6b7db32ff9950eeeda05f9"
        //       },
        //       {
        //         "staker": "0x84fa51a3eea1a6edc5db001a5a08d949f20ebc4d"
        //       },
        //       {
        //         "staker": "0x3af7fac2f5d02d4008b0d44e050759f17e14119f"
        //       },
        //       {
        //         "staker": "0x56d0d3405b04217c2e218cfb735887da5533fd78"
        //       },
        //       {
        //         "staker": "0x54d7afcaf140fa45ff5387f0f2954bc913c0796f"
        //       },
        //       {
        //         "staker": "0xb805f4f675752ba0abe36f46e4b5939981e116c7"
        //       },
        //       {
        //         "staker": "0xf1c5dd0fac1005092380cc6c5234274d8ae1f717"
        //       },
        //       {
        //         "staker": "0x4442a6bbf9f450668a372228e84696791b66e91b"
        //       }
        //     ]
        //   }
        // };


        // await Meland1155LandFutureI.setCanBuyListByAddress("0x3281e726a03E1d46909B32291D7b2aBD8dbf41d4", true);

        // await Meland1155LandFutureI.fixedtype();
        // await Meland1155LandFutureI.setStoreItem(("vipland4x4-fixed"), BigNumber.from(304).mul(BigNumber.from(10).pow(16)));

        // const stakers = ll.data.stakes;
        // for (let i = 0; i < stakers.length; i ++) {
        //     const stake = stakers[i];
        //     const b = await Meland1155LandFutureI.canBuyListByAddress(stake.staker)
        //     console.debug(b);
        //     if (!b) {
        //         console.debug("add list", stake.staker);
        //         await Meland1155LandFutureI.setCanBuyListByAddress(stake.staker, true);
        //     }
        // }



        // console.debug(await Meland1155LandFutureI.canBuyListByAddress("0x714df076992f95E452A345cD8289882CEc6ab82F"));

        // await Meland1155LandI.delStoreItem(asciiToHex("ticketland"));
        await Meland1155LandFutureI.delStoreItem(("vipland1x1"));
        await Meland1155LandFutureI.delStoreItem(("vipland2x2"));
        await Meland1155LandFutureI.setStoreItem(("vipland4x4-fixed"));

        // await Meland1155LandI.setStoreItem(("ticketland"), BigNumber.from(2000).mul(BigNumber.from(10).pow(18)));
        // await Meland1155LandFutureI.setStoreItem(("vipland1x1"), BigNumber.from(25).mul(BigNumber.from(10).pow(16)));
        // await Meland1155LandFutureI.setStoreItem(("vipland2x2"), BigNumber.from(88).mul(BigNumber.from(10).pow(16)));


        callback();
    } catch (error) {
        console.error(error);
        callback();
    }
};