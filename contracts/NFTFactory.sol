// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

// 这里提供所有meland.ai支持的NFT合约列表.
// 只有存在于这个合约的NFT. 游戏背包才会显示并且使用等.

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract NFTFactory is
    Initializable,
    AccessControlUpgradeable,
    UUPSUpgradeable
{
    mapping(IERC721 => bool) public supportNFTs;

    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant GM_ROLE = keccak256("GM_ROLE");

    event NFTSupportRemove(
        IERC721 nft,
        address operator,
        uint256 operationTime
    );

    event NFTSupportCreate(
        IERC721 nft,
        address operator,
        uint256 operationTime
    );

    function initialize() public initializer {
        __UUPSUpgradeable_init();
        __AccessControl_init();
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(UPGRADER_ROLE, msg.sender);
        _setupRole(GM_ROLE, msg.sender);
    }

    // 增加新的NFT支持.
    function newSupport(IERC721 nft) public onlyRole(GM_ROLE) {
        supportNFTs[nft] = true;
        emit NFTSupportCreate(nft, msg.sender, block.timestamp);
    }

    // 移除NFT支持.
    function removeSupport(IERC721 nft) public onlyRole(GM_ROLE) {
        delete supportNFTs[nft];
        emit NFTSupportRemove(nft, msg.sender, block.timestamp);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(UPGRADER_ROLE)
    {}
}
