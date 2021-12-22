// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "./MelandNFTFreeze.sol";
import "./MelandTierAddressStore.sol";
import "./MelandAccessRoles.sol";
import "./MelandTier.sol";

contract Meland1155Land is
    Initializable,
    ERC1155Upgradeable,
    MelandTierAddressStore,
    MelandAccessRoles,
    ERC1155BurnableUpgradeable,
    MelandNFTFreeze,
    UUPSUpgradeable
{

    mapping(string => bool) public supportLandtypes;
    mapping(uint256 => string) public landtypeById;
    mapping(bytes32 => uint256) public totalSupplyByLandtype;

    function initialize(string memory uri) public initializer {
        __ERC1155_init(uri);
        __ERC1155Burnable_init();
        __UUPSUpgradeable_init();
        __MelandNFTFreeze_init();
        __MelandAccessRoles_init();

        supportLandtypes["vipland"] = true;
        supportLandtypes["ticketland"] = true;
    }

    function setURI(string memory newuri) public onlyRole(GM_ROLE) {
        _setURI(newuri);
    }

    function isApprovedForAll(address _owner, address _operator)
        public
        view
        override(ERC1155Upgradeable, MelandTierAddressStore)
        returns (bool isOperator)
    {
        return super.isApprovedForAll(_owner, _operator);
    }

    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory landtype
    ) public onlyRole(MINTER_ROLE) {
        _mint(account, id, amount, landtype);
    }

    // Add or cancel freeze white list
    function setFreezeWhiteList(address _account, bool _bool) onlyRole(GM_ROLE) public {
        _setFreezeWhite(_account, _bool);
    }

    function setMelandTier(MelandTier _tierAddress) public onlyRole(GM_ROLE) {
        _setMelandTier(_tierAddress);
    }
    
    // Enable or Disable Freeze feature.
    function setFreezeEnabled(bool _bool) onlyRole(GM_ROLE) public {
        _setFreezeEnabled(_bool);
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory landtype
    ) public onlyRole(MINTER_ROLE) {
        _mintBatch(to, ids, amounts, landtype);
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
                supportLandtypes[string(maybelandtype)],
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

        super._beforeTokenTransfer(operator, from, to, ids, amounts, maybelandtype);
    }
}
