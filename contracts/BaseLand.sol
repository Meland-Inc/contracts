// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "./ILand.sol";
import "./IERC721MelandNFT.sol";

contract BaseLand is
    Initializable,
    ERC721Upgradeable,
    UUPSUpgradeable,
    AccessControlUpgradeable,
    ERC721EnumerableUpgradeable
{
    using StringsUpgradeable for uint256;

    // land mint role
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    uint16 public constant LAND_PADDING = 10000;

    // _baseURI
    string private baseURI;

    // other land contracts
    // 防止mint冲突造成无法挽回的损失.
    IERC721Land[] private otherLands;

    // safeMint
    function safeMint(address to, uint256 landId) public onlyRole(MINTER_ROLE) {
        require(landId > LAND_PADDING, "landId error");
        require(
            totalSupply() < getMintMax(),
            "Exceeding the maximum supply quantity"
        );
        require(checkExists(landId) == false, "Mint conflicted 1");
        for (uint8 i = 0; i < otherLands.length; i++) {
            require(
                otherLands[i].checkExists(landId) == false,
                "Mint conflicted 2"
            );
        }
        _safeMint(to, landId);
    }

    /**
     * @dev Base URI for computing {tokenURI}. If set, the resulting URI for each
     * token will be the concatenation of the `baseURI` and the `tokenId`. Empty
     * by default, can be overriden in child contracts.
     */
    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    // Check if the land id has been set to the contract
    function checkExists(uint256 tokenId) public view returns (bool) {
        return _exists(tokenId);
    }

    function getMintMax() public pure virtual returns (uint256) {
        return 10000;
    }

    // 根据tokenId返回坐标
    function rcCoordinates(uint256 tokenId)
        public
        pure
        returns (uint256 r, uint256 c)
    {
        c = tokenId % LAND_PADDING;
        r = (tokenId - c) / LAND_PADDING;
    }

    // 设置资源基础服务
    function setBaseURI(string memory baseURI_)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        baseURI = baseURI_;
    }

    function setOtherLands(IERC721Land[] memory otherLands_)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        otherLands = otherLands_;
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721Upgradeable)
    {
        super._burn(tokenId);
    }

    function name()
        public
        view
        virtual
        override(ERC721Upgradeable)
        returns (string memory)
    {
        return super.name();
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721Upgradeable)
        returns (string memory)
    {
        return string(abi.encodePacked(baseURI, tokenId.toString()));
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721Upgradeable, ERC721EnumerableUpgradeable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(
            ERC721Upgradeable,
            ERC721EnumerableUpgradeable,
            AccessControlUpgradeable
        )
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(UPGRADER_ROLE)
    {}
}
