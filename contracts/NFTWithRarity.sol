// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// 带有稀有度的meland nft

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "./IERC721MelandNFTWithRarity.sol";

/// @title A title that should describe the contract/interface
/// @author The name of the author
/// @notice Explain to an end user what this does
/// @dev Explain to a developer any extra details
contract NFTWithRarity is
    Initializable,
    ERC721Upgradeable,
    ERC721URIStorageUpgradeable,
    UUPSUpgradeable,
    AccessControlUpgradeable,
    ERC721EnumerableUpgradeable
{
    // land mint role
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    // _baseURI
    string private baseURI;

    // game cid
    string private cid;
    string public rarity;

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

    /**
     * @dev Base URI for computing {tokenURI}. If set, the resulting URI for each
     * token will be the concatenation of the `baseURI` and the `tokenId`. Empty
     * by default, can be overriden in child contracts.
     */
    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function initialize(
        string memory name, 
        string memory _symbol,
        string memory _rarity,
        string memory _cid
    )
        public
        initializer
    {
        __ERC721_init(name, _symbol);
        __ERC721URIStorage_init();
        __AccessControl_init();
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
        _setupRole(UPGRADER_ROLE, msg.sender);
        cid = _cid;
        rarity = _rarity;
    }

    // safeMint
    function safeMint(address to, uint256 tokenId) public onlyRole(MINTER_ROLE) {
        require(
            totalSupply() < getMintMax(),
            "Exceeding the maximum supply quantity"
        );

        require(!_exists(tokenId), "Mint conflicted 1");
        _safeMint(to, tokenId);
    }

    function getMintMax() public view virtual returns (uint256) {
        if (keccak256(abi.encodePacked(rarity)) == keccak256("common")) {
            return 10000;
        }
        if (keccak256(abi.encodePacked(rarity)) == keccak256("rare")) {
            return 1000;
        }
        if (keccak256(abi.encodePacked(rarity)) == keccak256("epic")) {
            return 100;
        }
        if (keccak256(abi.encodePacked(rarity)) == keccak256("mythic")) {
            return 10;
        }
        return 1;
    }

    function getCid() public view returns(string memory) {
        return cid;
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
    {
        super._burn(tokenId);
    }

    // 设置资源基础服务
    function setBaseURI(string memory baseURI_)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        baseURI = baseURI_;
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        require(_tokenId > 0, "Wrong token id");
        return string(abi.encodePacked(baseURI, cid));
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(UPGRADER_ROLE)
    {}
}
