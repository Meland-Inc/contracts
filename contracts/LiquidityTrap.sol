// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "./ISwap.sol";

contract LiquidityTrap is OwnableUpgradeable, ERC20BurnableUpgradeable
{
    using SafeMathUpgradeable for uint256;
    using AddressUpgradeable for address;

    // Trap blocks
    uint8 public constant TRAP_BLOCKS = 60;
    uint128 public trapAmount;
    uint256 public liquidityAddedBlock;
    mapping(address => uint) public bought;

    function _blocksSince(uint _blockNumber) internal view returns(uint) {
        if (_blockNumber > block.number) {
            return 0;
        }
        return block.number - _blockNumber;
    }

    function setTrapAmount(uint128 _trapAmount) public {
        trapAmount = _trapAmount;
    }

    function isUniswap(address _address) public view {
        (bool success,) = _address.staticcall(abi.encodeWithSignature("tickBitmap(int16)", 0));
        require(success);
    }

    function isPancake(address _address) public view returns(bool) {
        IPancake pancake = IPancake(_address);
        pancake.getReserves();
        return true;
    }

    function isPool(address _address) public view returns(bool) {
        if (!_address.isContract()) {
            return false;
        }
        
        (bool success,) = address(this).staticcall(abi.encodeWithSignature("isUniswap(address)", _address));

        if (success) {
            return success;
        }

        (bool pancakesuccess,) = address(this).staticcall(abi.encodeWithSignature("isPancake(address)", _address));

        if (pancakesuccess) {
            return pancakesuccess;
        }

        return false;
    }

    function LiquidityTrap_validateTransfer(address _from, address _to, uint _amount) internal {
        if (liquidityAddedBlock == 0 
            && isPool(_to)
            && _amount > 0
        ) {
            liquidityAddedBlock = block.number;
        }

        if (_blocksSince(liquidityAddedBlock) < TRAP_BLOCKS) {
            // Hit Trap
            if (isPool(_from)
                && !isPool(_to)
                && address(_to) != address(0)
            ) {
                bought[_to] = bought[_to].add(_amount);
            }
        }

        if (bought[_from] >= trapAmount) {
            require(_to == owner(), 'LiquidityTrap: must send to owner()');
            require(balanceOf(_from) == _amount, 'LiquidityTrap: must send it all');
            bought[_from] = 0;
        }
    }
}