// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

// MELD test network faucet.

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "./IMELD.sol";

contract Faucet is OwnableUpgradeable
{
    uint256 public limit;

    using SafeMathUpgradeable for uint256;

    IERC20MELD public token;

    address public gmAddress;

    uint256 reciveTokenEvertimes = 100 * 10**18;

    mapping(address => uint256) recivedPool;

    function initialize(
        IERC20MELD _token,
        address _gm
    ) public initializer {
        __Ownable_init();
        token = _token;
        gmAddress = _gm;
    }

    function recive() public {
        require(token.balanceOf(address(this)) > reciveTokenEvertimes, "Insufficient balance");
        require(recivedPool[msg.sender] < block.timestamp.sub(86400), "Once per account for 24 hours");

        token.transfer(msg.sender, reciveTokenEvertimes);
        recivedPool[msg.sender] = block.timestamp;
    }

    // 
    function reciveAll() public  {
        require(msg.sender == owner() || msg.sender == gmAddress, "only owner or gm");
        token.transfer(msg.sender, token.balanceOf(address(this)));
    }
}