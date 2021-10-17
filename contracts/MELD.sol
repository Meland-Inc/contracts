// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";

contract MELD is
    Initializable,
    ERC20Upgradeable,
    PausableUpgradeable,
    AccessControlUpgradeable,
    UUPSUpgradeable
{
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    // MeLand seed sale contracts address
    address public SeedSaleAddress;

    // MeLand private sale contracts address
    address public PrivateSaleAddress;

    // MeLand public sale contracts address
    address public PublicSaleAddress;

    // MeLand foundation pool contracts address
    address public FoundationPoolAddress;

    // MeLand liquidity contracts address
    address public LiquidityPoolAddress;

    // MeLand advisor contracts address
    address public AdvisorPoolAddress;

    // MeLand founders team vesting contracts address
    address public FoundersTeamPoolAddress;

    bool public initSale;

    bool public initPool;

    using SafeMathUpgradeable for uint256;

    function initialize() public initializer {
        __ERC20_init("MELD", "MELD");
        __Pausable_init();
        __UUPSUpgradeable_init();
        __AccessControl_init();

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);

        initSale = false;
        initPool = false;
    }

    //
    function mint2MELDSale(
        address _SeedSaleAddress,
        address _PrivateSaleAddress,
        address _PublicSaleAddress
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(initSale == false);

        SeedSaleAddress = _SeedSaleAddress;
        PrivateSaleAddress = _PrivateSaleAddress;
        PublicSaleAddress = _PublicSaleAddress;
        // Reduce gas fee expenses by minting a fixed percentage of tokens into specific vesting contracts during initialization.
        // Normal circumstances, no further coinage is allowed
        _mint(SeedSaleAddress, 10000000 * 10**decimals());
        _mint(PrivateSaleAddress, 32000000 * 10**decimals());
        _mint(PublicSaleAddress, 8000000 * 10**decimals());

        initSale = true;
    }

    function mint2MELDPool(
        address _FoundationPoolAddress,
        address _LiquidityPoolAddress,
        address _AdvisorPoolAddress,
        address _FoundersTeamPoolAddress
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(initPool == false);

        FoundationPoolAddress = _FoundationPoolAddress;
        LiquidityPoolAddress = _LiquidityPoolAddress;
        AdvisorPoolAddress = _AdvisorPoolAddress;
        FoundersTeamPoolAddress = _FoundersTeamPoolAddress;

        _mint(FoundationPoolAddress, 80000000 * 10**decimals());
        _mint(LiquidityPoolAddress, 10000000 * 10**decimals());
        _mint(AdvisorPoolAddress, 10000000 * 10**decimals());
        _mint(FoundersTeamPoolAddress, 50000000 * 10**decimals());

        initPool = true;
    }

    function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }

    function setMinterRole(address minter) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _setupRole(MINTER_ROLE, minter);
    }

    function safeMint(uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(msg.sender, amount);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(DEFAULT_ADMIN_ROLE)
    {}
}