// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "./Meland1155Rarity.sol";
import "./MelandAccessRoles.sol";
import "./MelandTier.sol";
import "./Meland1155StoreItem.sol";

contract Meland1155Placeable is
    Initializable,
    Meland1155Rarity,
    MelandAccessRoles,
    Meland1155StoreItem,
    UUPSUpgradeable
{
    function initialize(string memory uri) public initializer {
        __UUPSUpgradeable_init();
        __Meland1155Rarity_init(uri);
        __MelandAccessRoles_init();
    }

    function setURI(string memory newuri) public onlyRole(GM_ROLE) {
        _setURI(newuri);
    }

    function setMelandTier(MelandTier _tierAddress) public onlyRole(GM_ROLE) {
        _setMelandTier(_tierAddress);
    }

    function melandStoreItemURI(string memory symbol)
        external
        view
        returns (string memory)
    {
        return string(abi.encodePacked(super.uri(0), "/cid", "/", symbol));
    }

    function mint(
        address account,
        uint256 cid,
        uint256 amount
    ) public onlyRole(MINTER_ROLE) returns(uint256[] memory) {
        return _mintReturnTokenIds(account, cid, amount, '');
    }

    function setRarity(string memory _rarity, uint256 mintMax) onlyRole(GM_ROLE) public {
        bytes memory rarity = bytes(_rarity);
        _setRarity(rarity, mintMax);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(UPGRADER_ROLE)
    {}

    // The following functions are overrides required by Solidity.

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155Upgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }


    // store item impl ----
     function setAcceptedToken(IERC20Upgradeable token)
        external
        onlyRole(GM_ROLE)
    {
        _setAcceptedToken(token);
    }

    function setStore(NFTStore s) external onlyRole(GM_ROLE) {
        _setStore(s);
    }

    function setStoreItem(string memory symbol, uint256 price)
        external
        onlyRole(GM_ROLE)
    {
        _setStoreItem(symbol, price);
    }

    function delStoreItem(string memory symbol) external onlyRole(GM_ROLE) {
        _delStoreItem(symbol);
    }

    // If return ture, means that the mall will only have the specified id
    // Else otherwise it will be linear mint
    // The ids Must ensure that you can mint,
    // If multi-channel sales or mint, you need to filter out the ids that have been minted,
    // To prevent errors in the sales process
    function melandStoreItemsRestrictPurchaseNFTIds(string memory)
        external
        pure
        returns (bool, uint256[] memory)
    {
        uint256[] memory ids;
        return (false, ids);
    }

    // Store to pay NFT to the selling user by calling this function,
    // For security reasons, be sure to control the permissions to allow only MelandStore contracts to call
    // If melandStoreItemsRestrictPurchaseNFTIds return false, the id as zero.
    function melandStoreItemsMint(
        string memory symbol,
        uint256 id,
        address to
    ) external override returns(uint256) {
        super.checkMelandStoreItemsMint(symbol, id, to);
        uint256 cid = _bytestoUint256(symbol);
        uint256[] memory ids = mint(to, cid, 1);
        _dispatchItemInfoUpdate();
        return ids[0];
    }

    // If return false, Stores will suspend sales.
    function melandStoreSellStatus(string memory symbol)
        external
        view
        returns (bool isSelling)
    {
        uint256 cid = _bytestoUint256(symbol);
        uint256 mintMax = _getMintMaxByCId(cid);
        isSelling = totalSupplyByCId(cid) < mintMax;
    }

    // If return true, it means that each person can only buy a certain amount
    function melandStoreItemsRestrictedPurchase(string memory)
        external
        pure
        returns (bool restricted, uint256 restrictLimit)
    {
        restricted = false;
        restrictLimit = 0;
    }
}