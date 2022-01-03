// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "./MelandNFTFreeze.sol";
import "./MelandTierAddressStore.sol";
import "./MelandAccessRoles.sol";
import "./MelandTier.sol";
import "./Meland1155StoreItem.sol";

contract Meland1155LandFuture is
    Initializable,
    MelandTierAddressStore,
    MelandAccessRoles,
    ERC1155BurnableUpgradeable,
    MelandNFTFreeze,
    Meland1155StoreItem,
    UUPSUpgradeable
{
    using CountersUpgradeable for CountersUpgradeable.Counter;

    CountersUpgradeable.Counter private _tokenIdCounter;
    bytes public constant vipland1x1 = "vipland1x1";
    bytes public constant vipland2x2 = "vipland2x2";
    bytes public constant vipland4x4 = "vipland4x4";
    bytes public constant vipland4x4fixed = "vipland4x4-fixed";
    mapping(bytes => bool) public supportLandtypes;
    mapping(uint256 => string) public landtypeById;
    mapping(bytes32 => uint256) public totalSupplyByLandtype;
    mapping(address => bool) public canBuyListByAddress;

    function initialize(string memory _uri) public initializer {
        __ERC1155_init(_uri);
        __ERC1155Burnable_init();
        __UUPSUpgradeable_init();
        __MelandNFTFreeze_init();
        __MelandAccessRoles_init();

        supportLandtypes[vipland1x1] = true;
        supportLandtypes[vipland2x2] = true;
        supportLandtypes[vipland4x4] = true;
    }

    function setURI(string memory newuri) public onlyRole(GM_ROLE) {
        _setURI(newuri);
    }

    function fixedtype() public onlyRole(GM_ROLE) {
        supportLandtypes[vipland4x4fixed] = true;
    }

    function uri(uint256 id)
        public
        view
        virtual
        override
        returns (string memory)
    {
        string memory landtype = landtypeById[id];
        return string(abi.encodePacked(super.uri(id), "/", landtype, "/", uint2str(id)));
    }

    function setCanBuyListByAddress(address _address, bool _b) public onlyRole(GM_ROLE) {
        canBuyListByAddress[_address] = _b;
    }

    function melandStoreItemURI(string memory symbol)
        external
        view
        returns (string memory)
    {
        return string(abi.encodePacked(ERC1155Upgradeable.uri(0), "/", symbol, "/"));
    }

    function isApprovedForAll(address _owner, address _operator)
        public
        view
        override(MelandTierAddressStore, ERC1155Upgradeable)
        returns (bool isOperator)
    {
        return super.isApprovedForAll(_owner, _operator);
    }

    function mint(
        address account,
        uint256 amount,
        bytes memory landtype
    ) public onlyRole(MINTER_ROLE) {
        require(canBuyListByAddress[account], "Not eligible to buy");
        _tokenIdCounter.increment();
        uint256 id = _tokenIdCounter.current();
        _mint(account, id, amount, landtype);
    }

    // Add or cancel freeze white list
    function setFreezeWhiteList(address _account, bool _bool)
        public
        onlyRole(GM_ROLE)
    {
        _setFreezeWhite(_account, _bool);
    }

    function setMelandTier(MelandTier _tierAddress) public onlyRole(GM_ROLE) {
        _setMelandTier(_tierAddress);
    }

    // Enable or Disable Freeze feature.
    function setFreezeEnabled(bool _bool) public onlyRole(GM_ROLE) {
        _setFreezeEnabled(_bool);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(UPGRADER_ROLE)
    {}

    function totalSupply(uint256 id) internal view returns (uint256) {
        string memory lantype = landtypeById[id];
        return totalSupplyByLandtype[keccak256(bytes(lantype))];
    }

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
        bytes memory maybelandtype
    ) internal override(ERC1155Upgradeable) {
        for (uint256 i = 0; i < amounts.length; i++) {
            require(
                amounts[i] == 1,
                "Each land is unique, So there is no transfer greater than 1"
            );
        }

        for (uint256 i = 0; i < ids.length; i++) {
            uint256 id = ids[i];

            // check freeze
            string memory landtype = landtypeById[id];

            if (keccak256(bytes(landtype)) == keccak256("ticketland")) {
                _freezeProtect(from, to, id);
            }

            // sub totalSupply when burn token
            if (to == address(0)) {
                // clear lantyoe when burn
                delete landtypeById[id];
                totalSupplyByLandtype[keccak256(bytes(landtype))] -= 1;
            }
        }

        // if is mint
        // check land type is support
        if (from == address(0)) {
            require(
                supportLandtypes[maybelandtype],
                string(abi.encodePacked(maybelandtype, "is not support"))
            );

            for (uint256 i = 0; i < ids.length; i++) {
                require(
                    bytes(landtypeById[ids[i]]).length == 0,
                    "Make sure each land is unique"
                );
                landtypeById[ids[i]] = string(maybelandtype);
            }

            totalSupplyByLandtype[keccak256(maybelandtype)] += ids.length;
        }

        super._beforeTokenTransfer(
            operator,
            from,
            to,
            ids,
            amounts,
            maybelandtype
        );
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

    function setStoreItem(string memory symbol, uint256 p)
        external
        onlyRole(GM_ROLE)
    {
        _setStoreItem(symbol, p);
    }

    function delStoreItem(string memory symbol) external onlyRole(GM_ROLE) {
        _delStoreItem(symbol);
    }

    // If return ture, means that the mall will only have the specified id
    // Else otherwise it will be linear mint
    // The ids Must ensure that you can mint
    // If multi-channel sales or mint, you need to filter out the ids that have been minted
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
        require(canBuyListByAddress[to], "Not eligible to buy");
        super.checkMelandStoreItemsMint(symbol, id, to);
        _tokenIdCounter.increment();
        id = _tokenIdCounter.current();
        _mint(to, id, 1, bytes(symbol));
        _dispatchItemInfoUpdate();
        return id;
    }

    // If return false, Stores will suspend sales.
    function melandStoreSellStatus(string memory)
        external
        pure
        returns (bool)
    {
        return true;
    }

    // If return true, it means that each person can only buy a certain amount
    function melandStoreItemsRestrictedPurchase(string memory)
        external
        pure
        returns (bool restricted, uint256 restrictLimit)
    {
        restricted = false;
        restrictLimit = 1;
    }
}
