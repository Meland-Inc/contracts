// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "./MelandAccessRoles.sol";

contract NFTFactory is
    Initializable,
    MelandAccessRoles,
    UUPSUpgradeable
{
    struct ERC721Or1155 {
        IERC1155 erc1155;
        IERC721 erc721;
    }

    struct SupportNFT {
        ERC721Or1155 erc721or1155;
        bool support;
    }

    mapping(address => SupportNFT) public supportNFTs;

    mapping(address => RFC) public supportRFCs;

    event NFTSupportRemove(
        ERC721Or1155 nft,
        address operator,
        uint256 operationTime
    );

    event NFTSupportCreate(
        ERC721Or1155 nft,
        address operator,
        uint256 operationTime
    );

    event RFCCreated(address indexed nft, RFC rfc);
    event RFCApproved(address indexed nft, RFC rfc);

    struct RFC {
        address proposer;
        uint256 proposalTime;
        bool approved;
    }

    function initialize() public initializer {
        __UUPSUpgradeable_init();
        __MelandAccessRoles_init();
    }

    function newRFC(address nft) public {
        require(supportRFCs[nft].proposalTime == 0, "Already exists RFC");
        require(!supportNFTs[nft].support, "Already support");

        RFC memory rfc = RFC(_msgSender(), block.timestamp, false);

        supportRFCs[nft] = rfc;

        emit RFCCreated(nft, rfc);
    }

    function approveRFC(address nft) public {
        RFC memory rfc = supportRFCs[nft];
        require(rfc.proposalTime > 0, "Not found RFC");
        rfc.approved = true;

        supportRFCs[nft] = rfc;

        _newSupport(nft);

        emit RFCApproved(nft, rfc);
    }

    function _newSupport(address nft) private {
        require(!supportNFTs[nft].support, "Already supported");

        bytes4 erc1155Interface = type(IERC1155).interfaceId;
        bytes4 erc721Interface = type(IERC721).interfaceId;

        ERC721Or1155 memory erc721or1155;
        if (IERC165(nft).supportsInterface(erc1155Interface)) {
            erc721or1155.erc1155 = IERC1155(nft);
        } else if (IERC165(nft).supportsInterface(erc721Interface)) {
            erc721or1155.erc721 = IERC721(nft);
        } else {
            revert("Not support type");
        }
        
        supportNFTs[nft] = SupportNFT(
            erc721or1155,
            true
        );

        emit NFTSupportCreate(erc721or1155, msg.sender, block.timestamp);
    }

    function newSupport(address nft) public onlyRole(GM_ROLE) {
        _newSupport(nft);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(UPGRADER_ROLE)
    {}
}
