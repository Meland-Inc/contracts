// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

interface IUniswap {
    function _blockTimestamp() view external returns (uint32);
}

interface IPancake {
    function getReserves() view external returns (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast);
}