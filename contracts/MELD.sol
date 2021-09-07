// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";

contract MELD is Initializable, ERC20Upgradeable, PausableUpgradeable, AccessControlUpgradeable, UUPSUpgradeable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    // 保留MELD数量.
    // 预防banks的MELD被兑换完毕.
    // 或者其他需求.
    // 可以紧急铸造维稳市场的数量.
    uint256 public premint;

    using SafeMathUpgradeable for uint256;

    function initialize(
        // MeLand Banks
        address MeLandBanksAdress,
        // ICO/IEO contracts address
        address ContinuousSaleAddress,
        // developer 
        address RDAdress
    ) initializer public {
        __ERC20_init("MELD", "MELD");
        __Pausable_init();
        __UUPSUpgradeable_init();

        __AccessControl_init(); 

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);

        // 合约发布时
        // 给开发者总账号铸造 20%
        // ICO 合约铸造 5%
        // BANRK 铸造 65%
        // 预留10%未来铸造.

        // 总量
        uint256 total = 150000000;

        // 20%
        _mint(RDAdress, total.mul(20).div(100).mul(10 **  decimals()));

        // 5%
        _mint(ContinuousSaleAddress, total.mul(5).div(100).mul(10 **  decimals()));

        // 65%
        _mint(MeLandBanksAdress, total.mul(65).div(100).mul(10 **  decimals()));

        // 保留10%
        premint = total.mul(65).div(100).mul(10 **  decimals());
    }

    function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(from, to, amount);
    }

    // 设置minter权限
    function setMinterRole(address minter) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _setupRole(MINTER_ROLE, minter);
    }

    // 允许minter权限账号铸造最后的 premint 数量的MELD.
    function safeMint(uint256 amount) public onlyRole(MINTER_ROLE) {
        require(premint > amount, "Can be cast in insufficient quantities");
        _mint(msg.sender, amount);
        premint -= amount;
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyRole(DEFAULT_ADMIN_ROLE)
        override
    {
        
    }
}