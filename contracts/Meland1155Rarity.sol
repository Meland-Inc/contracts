// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/IERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "./Meland1155CID.sol";
import "./MelandTierAddressStore.sol";

/// Meland.ai Rarity Contract

abstract contract Meland1155Rarity is Meland1155CID, MelandTierAddressStore {
    using AddressUpgradeable for address;
    using SafeMathUpgradeable for uint256;

    // Maximum supply per rarity supported
    mapping(bytes32 => uint256) public mintMaxByRaritykeccak256;

    mapping(uint256 => bytes) private _rarityById;

    event RarityUpdate(
        bytes indexed rarity,
        uint256 mintMax
    );

    event FreezeEnabledUpdate(
        bool _freezeEnabled
    );

    function _mint(
        address to,
        uint256 cid,
        uint256 amount,
        bytes memory data
    ) internal override(Meland1155CID, ERC1155Upgradeable) {
        return Meland1155CID._mint(to, cid, amount, data);
    }

    function __Meland1155Rarity_init(string memory uri) internal {
        _setRarity("unique", 1);
        _setRarity("mythic", 10);
        _setRarity("epic", 100);
        _setRarity("rare", 1000);
        _setRarity("common", 10000);

        __ERC1155MelandCID_init(uri);
    }

    function getRarityById(uint256 id) public view returns(string memory) {
        return string(_rarityById[id]);
    }

    function _setRarity(bytes memory rarity, uint256 mintMax) internal {
        mintMaxByRaritykeccak256[keccak256(rarity)] = mintMax;
        emit RarityUpdate(rarity, mintMax);
    }

    function isApprovedForAll(address _owner, address _operator)
        public
        view
        override(ERC1155Upgradeable, MelandTierAddressStore)
        returns (bool isOperator)
    {
        return super.isApprovedForAll(_owner, _operator);
    }

    /**
     * @dev See {ERC1155-_beforeTokenTransfer}.
     */
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal virtual override(Meland1155CID, ERC1155Upgradeable) {
        if (from == address(0)) {
            for (uint256 i = 0; i < ids.length; i++) {
                uint256 id = ids[i];
                bytes memory rarity = data;
                uint256 mintMax = mintMaxByRaritykeccak256[keccak256(rarity)];
                // When mint, the rarity must be passed to
                require(totalSupply(id) < mintMax, string(abi.encodePacked(rarity, "rarity only totalSupply", mintMax)));

                _rarityById[id] = rarity;
            }
        }

        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}