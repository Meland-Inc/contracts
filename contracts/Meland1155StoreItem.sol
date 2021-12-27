// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/IERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "./IMelandStoreItems.sol";
import "./NFTStore.sol";

abstract contract Meland1155StoreItem is IMelandStoreItems, ContextUpgradeable {
    using AddressUpgradeable for address;
    using SafeMathUpgradeable for uint256;

    NFTStore private _store;
    IERC20Upgradeable private _acceptedToken;

    string[] private _storeSymbols;
    uint256[] private _prices;

    function safeParseInt(string memory _a) public pure returns (uint _parsedInt) {
        return safeParseInt(_a, 0);
    }

    function safeParseInt(string memory _a, uint _b) public pure returns (uint _parsedInt) {
        bytes memory bresult = bytes(_a);
        uint mint = 0;
        bool decimals = false;
        for (uint i = 0; i < bresult.length; i++) {
            if ((uint(uint8(bresult[i])) >= 48) && (uint(uint8(bresult[i])) <= 57)) {
                if (decimals) {
                   if (_b == 0) break;
                    else _b--;
                }
                mint *= 10;
                mint += uint(uint8(bresult[i])) - 48;
            } else if (uint(uint8(bresult[i])) == 46) {
                require(!decimals, 'More than one decimal encountered in string!');
                decimals = true;
            } else {
                revert("Non-numeral character encountered in string!");
            }
        }
        if (_b > 0) {
            mint *= 10 ** _b;
        }
        return mint;
    }

    function parseInt(string memory _a) public pure returns (uint _parsedInt) {
        return parseInt(_a, 0);
    }

    function parseInt(string memory _a, uint _b) public pure returns (uint _parsedInt) {
        bytes memory bresult = bytes(_a);
        uint mint = 0;
        bool decimals = false;
        for (uint i = 0; i < bresult.length; i++) {
            if ((uint(uint8(bresult[i])) >= 48) && (uint(uint8(bresult[i])) <= 57)) {
                if (decimals) {
                   if (_b == 0) {
                       break;
                   } else {
                       _b--;
                   }
                }
                mint *= 10;
                mint += uint(uint8(bresult[i])) - 48;
            } else if (uint(uint8(bresult[i])) == 46) {
                decimals = true;
            }
        }
        if (_b > 0) {
            mint *= 10 ** _b;
        }
        return mint;
    }

    function _bytestoUint256(string memory _bytes)
        internal
        pure
        returns (uint256)
    {
        return parseInt(_bytes);
    }

    function _setAcceptedToken(IERC20Upgradeable token) internal {
        _acceptedToken = token;
        _dispatchItemInfoUpdate();
    }

    function _setStore(NFTStore s) internal {
        _store = s;
        _dispatchItemInfoUpdate();
    }

    function _dispatchItemInfoUpdate() internal {
        if (address(_store) != address(0)) {
            _store.updateNFTItemInfo(this);
        }
    }

    function _setStoreItem(string memory symbol, uint256 price) internal {
        uint256 index;
        for (uint256 i = 0; i < _storeSymbols.length; i++) {
            if (keccak256(bytes(symbol)) == keccak256(bytes(_storeSymbols[i]))) {
                index = i;
            }
        }

        // find it.
        // update.
        if (index > 0) {
            _prices[index] = price;
        } else if (
            _storeSymbols.length > 0 &&
            keccak256(bytes(_storeSymbols[0])) == keccak256(bytes(symbol))
        ) {
            _prices[0] = price;
        } else {
            _storeSymbols.push(symbol);
            _prices.push(price);
        }

        _dispatchItemInfoUpdate();
    }

    function _delStoreItem(string memory symbol) internal {
        uint256 index;
        for (uint256 i = 0; i < _storeSymbols.length; i++) {
            if (keccak256(bytes(_storeSymbols[i])) == keccak256(bytes(symbol))) {
                index = i;
            }
        }

        string memory lastS = _storeSymbols[_storeSymbols.length - 1];
        uint256 lastP = _prices[_storeSymbols.length - 1];

        // save gas
        _storeSymbols[index] = lastS;
        _storeSymbols.pop();

        _prices[index] = lastP;
        _prices.pop();

        _dispatchItemInfoUpdate();
    }

    function acceptedToken(string memory)
        external
        view
        returns (IERC20Upgradeable)
    {
        return _acceptedToken;
    }

    // Returns all supported symbols and prices,
    // Symbols will be returned by melandStoreItemMint when purchased
    function melandStoreItems()
        external
        view
        returns (string[] memory, uint256[] memory)
    {
        return (_storeSymbols, _prices);
    }

    function melandStoreReceipt(string memory)
        external
        pure
        returns (address receipt)
    {
        return address(0xFCED262E4949b7b5C4177B4e0aD8e974CC7493bF);
    }

    // Store to pay NFT to the selling user by calling this function,
    // For security reasons, be sure to control the permissions to allow only MelandStore contracts to call
    // If melandStoreItemsRestrictPurchaseNFTIds return false, the id as zero.
    function checkMelandStoreItemsMint(
        string memory,
        uint256,
        address
    ) internal view {
        require(
            _msgSender() == address(_store),
            "Allow only Meland.ai mall calls"
        );
    }
}
