// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "./NFTStoreStorage.sol";
import "./MelandAccessRoles.sol";
import "./IMELD.sol";

contract NFTStore is
    Initializable,
    MelandAccessRoles,
    UUPSUpgradeable,
    NFTStoreStorage
{
    using SafeMathUpgradeable for uint256;
    using CountersUpgradeable for CountersUpgradeable.Counter;
    CountersUpgradeable.Counter private itemIdCounters;

    function initialize(
        address _officialWallet,
        address _foundationWallet,
        address _bidbackWallet,
        uint256 _ownerCutPerMillion
    ) public initializer {
        __UUPSUpgradeable_init();
        __MelandAccessRoles_init();
        officialWallet = _officialWallet;
        foundationWallet = _foundationWallet;
        bidbackWallet = _bidbackWallet;
        ownerCutPerMillion = _ownerCutPerMillion;
    }

    // Uploaded new NFT sale
    function createNFT(IMelandStoreItems nft) public {
        _checkStoreItems(nft);
        require(!itemUploadedMap[nft], "Already exists");
        itemUploadedMap[nft] = true;
        emit NFTCreated(nft);
    }

    // 下架NFT
    function removedNFT(IMelandStoreItems nft) external onlyRole(GM_ROLE) {
        require(!itemUploadedMap[nft], "NFT not uplaoded");
        itemUploadedMap[nft] = false;
        emit NFTDelete(nft);
    }

    function updateNFTItemInfo(IMelandStoreItems nft) external {
        if (itemUploadedMap[nft]) {
            emit NFTItemUpdate(nft, _tryCheckStoreItems(nft));
        }
    }

    // 设置抽成
    // 50000 = 5%
    // 500000 = 50%
    function setOwnerCutPerMillion(uint256 _ownerCutPerMillion)
        public
        onlyRole(GM_ROLE)
    {
        require(
            _ownerCutPerMillion < 1000000,
            "The owner cut should be between 0 and 999,999"
        );

        ownerCutPerMillion = _ownerCutPerMillion;
        emit ChangedOwnerCutPerMillion(ownerCutPerMillion);
    }

    function _tryCheckStoreItems(IMelandStoreItems nft)
        private
        view
        returns (bool)
    {
        (string[] memory symbols, uint256[] memory prices) = nft
            .melandStoreItems();
        return symbols.length == prices.length;
    }

    function _checkStoreItems(IMelandStoreItems nft) private view {
        require(_tryCheckStoreItems(nft), "Product calibration error");
    }

    function stringEq(string memory s1, string memory s2) internal pure returns(bool) {
        return keccak256(bytes(s1)) == keccak256(bytes(s2));
    }

    function buyNFT(
        IMelandStoreItems nft,
        string memory symbol,
        uint256 priceInWei
    ) public {
        address buyer = _msgSender();
        require(itemUploadedMap[nft], "NFT not uploaded");
        _checkStoreItems(nft);

        uint256 buySymbolIndex = 0;
        {
            (string[] memory symbols, uint256[] memory prices) = nft.melandStoreItems();

            for (uint256 i = 0; i < symbols.length; i++) {
                if (stringEq(symbols[i], symbol)) {
                    buySymbolIndex = i;
                    break;
                }
            }

            require(
                nft.melandStoreSellStatus(symbol),
                "Merchandise has been suspended from sale"
            );

            require(
                buySymbolIndex > 0 || stringEq(symbols[0], symbol),
                "symbol is not sale"
            );

            require(
                prices[buySymbolIndex] == priceInWei,
                "The price is not correct"
            );
        }

        {
            (bool restricted, uint256 restrictLimit) = nft
                .melandStoreItemsRestrictedPurchase(symbol);
            if (restricted) {
                require(
                    _getItemSymbolSales(nft, symbol, buyer) < restrictLimit,
                    string(
                        abi.encodePacked(
                            "Exceeded the maximum limit that each person can purchase (",
                            restrictLimit
                        )
                    )
                );

                _addItemSymbolSales(nft, symbol, buyer);
            }
        }

        address seller = nft.melandStoreReceipt(symbol);
        uint256 tokenId = 0;
        (bool idsRestricted, uint256[] memory ids) = nft
            .melandStoreItemsRestrictPurchaseNFTIds(symbol);
        if (idsRestricted) {
            require(
                ids.length > 0,
                "Insufficient quantity of saleable inventory"
            );
            tokenId = ids[0];
        }

        IERC20Upgradeable acceptedToken = nft.acceptedToken(symbol);

        uint256 saleShareAmount = 0;

        if (ownerCutPerMillion > 0) {
            // Calculate sale share
            saleShareAmount = priceInWei.mul(ownerCutPerMillion).div(1000000);

            // 40% burn in handling fee
            uint256 burnAmount = saleShareAmount.mul(40).div(100);

            // The other 40% is held by the Foundation
            uint256 foundationAmount = saleShareAmount.mul(40).div(100);

            // The last 20% are official earnings
            uint256 officialAmount = saleShareAmount.mul(20).div(100);

            {
                IERC20MELD mabyeMELD = IERC20MELD(address(acceptedToken));
                try mabyeMELD.burnFrom(buyer, burnAmount) {

                } catch(bytes memory) {

                    // transfer to bidback wallet when burn failed.
                    acceptedToken.transferFrom(
                        buyer,
                        bidbackWallet,
                        burnAmount
                    );
                }
            }

            require(
                acceptedToken.transferFrom(
                    buyer,
                    foundationWallet,
                    foundationAmount
                ),
                "Handling fee transfer to foundationWallet failure"
            );
            require(
                acceptedToken.transferFrom(
                    buyer,
                    officialWallet,
                    officialAmount
                ),
                "Handling fee transfer to officialWallet to off failure"
            );
        }

        // Transfer sale amount to seller
        require(
            acceptedToken.transferFrom(
                buyer,
                seller,
                priceInWei.sub(saleShareAmount)
            ),
            "Transfering the sale amount to the seller failed"
        );

        nft.melandStoreItemsMint(symbol, tokenId, buyer);

        emit NFTBuyed(buyer, nft, symbol, tokenId, priceInWei);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(UPGRADER_ROLE)
    {}
}
