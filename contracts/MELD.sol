// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "./BPContract.sol";

contract MELD is
    Initializable,
    ERC20Upgradeable,
    OwnableUpgradeable,
    ERC20BurnableUpgradeable,
    UUPSUpgradeable
{
    using SafeMathUpgradeable for uint256;

    BPContract public BP;
    bool public bpEnabled;
    bool public BPDisabledForever;

    uint upgradeDelay;

    PrepareUpgradeImpl prepareUpgradeImpl;
    struct PrepareUpgradeImpl {
        address newImplementation;
        // Ready to upgrade creation time
        uint256 createdAt;
    }

    event NewUpgradeDelay(uint deplay);
    event NewPrepareUpgradeImpl(address _newImplementation, uint256 createdAt);

    function initialize() public initializer {
        __ERC20_init("Meland.ai", "MELD");
        __ERC20Burnable_init();
        __Ownable_init();
        __UUPSUpgradeable_init();
        BPDisabledForever = false;
        upgradeDelay = 14 days;
    }

    function setBPAddrss(address _bp) external onlyOwner {
        require(address(BP)== address(0), "Can only be initialized once");
        BP = BPContract(_bp);
    }

    function setBpEnabled(bool _enabled) external onlyOwner {
        bpEnabled = _enabled;
    }

    function setBotProtectionDisableForever() external onlyOwner{
        require(BPDisabledForever == false);
        BPDisabledForever = true;
    }

    function getMaxMints() public view returns (uint256) {
        return 2000000000 * 10 ** decimals();
    }

    function mint(uint256 amount) public onlyOwner {
        require(
            amount + totalSupply() <= getMaxMints(),
            "Exceeds the maximum number of mintable"
        );
        _mint(msg.sender, amount);
    }

    function _beforeTokenTransfer(address _from, address _to, uint _amount) internal override {
        if (bpEnabled && !BPDisabledForever) {
            BP.protect(_from, _to, _amount);
        }
        super._beforeTokenTransfer(_from, _to, _amount);
    }

    function setPrepareUpgrade(address _newImplementation) public onlyOwner {
        prepareUpgradeImpl = PrepareUpgradeImpl(
            _newImplementation,
            block.timestamp
        );
        emit NewPrepareUpgradeImpl(_newImplementation, block.timestamp);
    }

    function setUpgradeDelay(uint _delay) public onlyOwner {
        require(_delay >= 2 days, "Minimum time is 2 days");
        upgradeDelay = _delay;
        emit NewUpgradeDelay(_delay);
    }

    function _authorizeUpgrade(address _newImplementation)
        internal
        override
        view
        onlyOwner
    {
        require(_newImplementation == prepareUpgradeImpl.newImplementation, "Upgrade contracts are not in the ready queue");
        require(block.timestamp.sub(prepareUpgradeImpl.createdAt) > upgradeDelay, "Upgrade contracts must be prepared 2 days in advance");
    }
}
