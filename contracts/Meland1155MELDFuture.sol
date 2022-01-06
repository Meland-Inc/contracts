// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "./MelandTierAddressStore.sol";
import "./MelandAccessRoles.sol";
import "./MelandTier.sol";

// Support arbitrary erc20 token packaging
// MELD Futures

contract Meland1155MELDFuture is
    Initializable,
    ERC1155Upgradeable,
    MelandAccessRoles,
    MelandTierAddressStore,
    ERC1155BurnableUpgradeable,
    UUPSUpgradeable
{
    using SafeMathUpgradeable for uint256;
    using CountersUpgradeable for CountersUpgradeable.Counter;

    CountersUpgradeable.Counter private _tokenIdCounter;

    struct ERC20Future {
        IERC20Upgradeable token;
        uint256 unlockAt;
        uint256 amount;
    }

    event Claim(
        uint256 indexed id,
        address indexed beneficiary,
        uint256 amount
    );

    // Records the current number of tokens left for each type of token
    mapping(IERC20Upgradeable => uint256) public totalSupplyByERC20;
    mapping(uint256 => ERC20Future) public futureById;

    function initialize(string memory _uri) public initializer {
        __ERC1155_init(_uri);
        __ERC1155Burnable_init();
        __UUPSUpgradeable_init();
        __MelandAccessRoles_init();
    }

    function isApprovedForAll(address _owner, address _operator)
        public
        view
        override(ERC1155Upgradeable, MelandTierAddressStore)
        returns (bool isOperator)
    {
        return super.isApprovedForAll(_owner, _operator);
    }

    function setURI(string memory newuri) public onlyRole(GM_ROLE) {
        _setURI(newuri);
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
        ERC20Future memory future = futureById[id];
        return
            string(
                abi.encodePacked(
                    super.uri(id),
                    "/",
                    uint2str(future.amount),
                    "/",
                    uint2str(future.unlockAt),
                    "/",
                    uint2str(id)
                )
            );
    }

    // Anyone can mint futures as long as they have money.
    function mintBatch(
        IERC20Upgradeable token,
        address to,
        uint256 amount,
        uint8 count,
        uint256 lockseconds
    ) public {
        address sender = _msgSender();

        uint256 allowanceAmount = token.allowance(sender, address(this));

        uint256 totalAmount = amount.mul(count);
        require(
            allowanceAmount > totalAmount,
            "The approved amount is less than the required amount"
        );
        require(count > 0, "Quantity must be greater than 0");

        token.transferFrom(sender, address(this), totalAmount);

        uint256[] memory ids = new uint256[](count);
        uint256[] memory amounts = new uint256[](count);

        for (uint8 i = 0; i < count; i++) {
            _tokenIdCounter.increment();
            uint256 tokenId = _tokenIdCounter.current();

            futureById[tokenId] = ERC20Future(
                token,
                block.timestamp.add(lockseconds),
                amount
            );

            ids[i] = tokenId;
            amounts[i] = 1;

        }
        totalSupplyByERC20[token] = totalSupplyByERC20[token] + totalAmount;
        _mintBatch(to, ids, amounts, "");
    }

    function setMelandTier(MelandTier _tierAddress) public onlyRole(GM_ROLE) {
        _setMelandTier(_tierAddress);
    }

    // Converting futures into corresponding token
    function claim(uint256 id) public {
        address sender = _msgSender();
        ERC20Future memory future = futureById[id];
        require(future.unlockAt > 0, "future not found");
        require(future.unlockAt < block.timestamp, "future not unlocked");
        _burn(sender, id, 1);
        future.token.transfer(sender, future.amount);
        emit Claim(id, sender, future.amount);
    }

    function totalSupply(uint256 id) internal view returns (uint256) {
        ERC20Future memory future = futureById[id];
        if (address(future.token) == address(0)) {
            return 0;
        }
        return totalSupplyByERC20[future.token];
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

    // The following functions are overrides required by Solidity.
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory landtype
    ) internal override(ERC1155Upgradeable) {
        for (uint256 i = 0; i < amounts.length; i++) {
            require(
                amounts[i] == 1,
                "Each futures is unique, So there is no transfer greater than 1"
            );
        }

        for (uint256 i = 0; i < ids.length; ++i) {
            uint256 id = ids[i];
            ERC20Future memory future = futureById[id];

            // sub totalSupply when burn token
            if (to == address(0)) {
                // clear when burn
                delete futureById[id];
                unchecked {
                    totalSupplyByERC20[future.token] -= future.amount;
                }
            } else {
                require(
                    future.unlockAt > block.timestamp,
                    "Transfers are not allowed for unlocked futures"
                );
            }
        }

        super._beforeTokenTransfer(operator, from, to, ids, amounts, landtype);
    }
}
