// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

// 官方商城合约
// 与marketplace的区别是. marketplace是用户和用户之间交易的合约.
// 交易的NFT是已经mint的.
// NFTStore 是官方和用户之间交易的合约.
// 交易的NFT是不存在的.准备mint的.

import "./IMELD.sol";
import "./IERC721MelandNFT.sol";

contract NFTStoreStorage {
    // MELD Token.
    IERC20MELD public acceptedToken;

    // 基金会钱包
    // 收取手续费中的40%
    address public foundationWallet;

    // 官方钱包
    // 收取手续费中的20%
    address public officialWallet;

    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant GM_ROLE = keccak256("GM_ROLE");

    // nft address -> (nft token id -> Order)
    mapping(IERC721MelandNFT => Item) public itemByNFT;

    // token id 池
    // 如果开启了tokenIdPool时
    // 用户购买则会在这里随机获取一个tokenid给到用户
    // 开启了这个的nft需要防止id池内的token id已经被mint
    // 否则会出现用户购买偶发出错的问题
    mapping(IERC721MelandNFT => uint256[]) public tokenIdsByNFT;

    // 记录cid
    // 防止同一个cid重复上架
    mapping(string => address) public nftByCid;

    // 限购池
    // 记录每个NFT当前用户已经购买了多少
    mapping(IERC721MelandNFT => mapping(address => uint256)) public limitPool;

    // 抽成比例
    uint256 public ownerCutPerMillion;

    struct Item {
        uint256 id;
        address seller;
        // 是否开启token id池售卖
        // 开启时, 卖出随机从token id池随机一个token id mint
        // 否则按序号叠加
        bool tokenIdPool;
        uint256 priceInWei;
        uint256 sellsCount;
        // 是否开启限量
        // 如果大于0则开启
        uint32 limit;
    }

    // EVENTS
    event NFTCreated(
        uint256 indexed id,
        address indexed seller,
        IERC721MelandNFT nftAddress,
        uint256 priceInWei
    );

    // EVENTS
    event NFTDelete(
        uint256 indexed id,
        address indexed seller, 
        IERC721MelandNFT nftAddress
    );

    event NFTBuyed(
        uint256 indexed id,
        address indexed buyer,
        IERC721MelandNFT nftAddress,
        uint256 tokenId,
        uint256 priceInWei
    );

    event NFTIdPoolUpdate(uint256 indexed id, IERC721MelandNFT indexed nft, uint256 length);

    event NFTItemUpdate(uint256 indexed id, IERC721MelandNFT nftAddress);

    event ChangedOwnerCutPerMillion(uint256 ownerCutPerMillion);
}
