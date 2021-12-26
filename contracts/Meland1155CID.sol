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

    function __ERC1155MelandCID_init(string memory _uri) internal initializer {
        __ERC1155_init(_uri);
        __ERC1155Burnable_init();
    }

    function __ERC1155MelandCID_init_unchained() internal initializer {}

    function genTokenIdByCid(uint256 cid) internal returns (uint256) {
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        cidByTokenId[tokenId] = cid;
        return tokenId;
    }

    function getCidByTokenId(uint256 id) public view returns (uint256) {
        return cidByTokenId[id];
    }

    function _mint(
        address to,
        uint256 cid,
        uint256 amount,
        bytes memory data
    ) internal virtual override {
        require(amount > 0, "The amount must be greater than 0");
        for (uint256 i = 0; i < amount; i++) {
            uint256 tokenId = genTokenIdByCid(cid);

            // Each NFT is unique
            super._mint(to, tokenId, 1, data);
        }
    }

    function uint2str(uint256 _i)
        internal
        pure
        returns (string memory _uintAsString)
    {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - (_i / 10) * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

    function uri(uint256 id)
        public
        view
        virtual
        override
        returns (string memory)
    {
        uint256 cid = cidByTokenId[id];
        return string(abi.encodePacked(super.uri(id), "/", uint2str(cid), "/", uint2str(id)));
    }

    function _mintReturnTokenIds(
        address to,
        uint256 cid,
        uint256 amount,
        bytes memory data
    ) internal virtual returns (uint256[] memory) {
        uint256[] memory ids = new uint256[](amount);
        require(amount > 0, "The amount must be greater than 0");
        for (uint256 i = 0; i < amount; i++) {
            uint256 tokenId = genTokenIdByCid(cid);

            // Each NFT is unique
            super._mint(to, tokenId, 1, data);

            ids[i] = tokenId;
        }
        return ids;
    }

    function totalSupply(uint256 id) public view returns (uint256) {
        uint256 cid = getCidByTokenId(id);

        if (cid == 0) {
            return 0;
        }

        return _totalSupplyByCid[cid];
    }

    function totalSupplyByCId(uint256 cid) public view returns (uint256) {
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
