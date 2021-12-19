// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/IERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";

/// Store the association between Meland game prop CID and token id.

contract Meland1155CID is ERC1155Upgradeable, ERC1155BurnableUpgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;

    CountersUpgradeable.Counter private _tokenIdCounter;

    mapping(uint256 => uint256) private cidByTokenId;

    mapping(uint256 => uint256) private _totalSupplyByCid;

    function __ERC1155MelandCID_init(string memory uri) internal initializer {
        __ERC1155_init(uri);
        __ERC1155Burnable_init();
    }

    function __ERC1155MelandCID_init_unchained() internal initializer {
    }

    function genTokenIdByCid(uint256 cid) internal returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        cidByTokenId[tokenId] = cid;

        return tokenId;
    }

    function getCidByTokenId(uint256 id) view public returns(uint256) {
        return cidByTokenId[id];
    }

    function _mint(
        address to,
        uint256 cid,
        uint256 amount,
        bytes memory data
    ) internal virtual override {
        require(amount > 0, "The amount must be greater than 0");
        for (uint256 i = 0; i < amount; i ++) {
            uint256 tokenId = genTokenIdByCid(cid);

            // Each NFT is unique
            super._mint(to, tokenId, 1, data);
        }
    }

    function totalSupply(uint256 id) view internal returns(uint256) {
        uint256 cid = getCidByTokenId(id);

        if (cid == 0) {
            return 0;
        }

        return _totalSupplyByCid[cid];
    }

    /**
     * @dev See {ERC1155-_beforeTokenTransfer}.
     */
    function _beforeTokenTransfer(
        address,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory,
        bytes memory
    ) internal virtual override(ERC1155Upgradeable) {
        if (from == address(0)) {
            for (uint256 i = 0; i < ids.length; ++i) {
                uint256 cid = getCidByTokenId(ids[i]);
                _totalSupplyByCid[cid] += 1;
            }
        }

        if (to == address(0)) {
            for (uint256 i = 0; i < ids.length; ++i) {
                uint256 cid = getCidByTokenId(ids[i]);
                _totalSupplyByCid[cid] -= 1;
            }
        }
    }
}
