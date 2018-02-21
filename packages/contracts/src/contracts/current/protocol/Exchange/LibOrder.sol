/*

  Copyright 2017 ZeroEx Intl.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.

*/

pragma solidity ^0.4.19;

pragma experimental ABIEncoderV2;

contract LibOrder {

    struct Order {
        address maker;
        address taker;
        address makerToken;
        address takerToken;
        address feeRecipient;
        uint256 makerTokenAmount;
        uint256 takerTokenAmount;
        uint256 makerFee;
        uint256 takerFee;
        uint256 expirationTimestampInSec;
        uint256 salt;
        uint8 v;
        bytes32 r;
        bytes32 s;
    }

    /// @dev Calculates Keccak-256 hash of order with specified parameters.
    /// @param order Order struct containing order specifications and signature.
    /// @return Keccak-256 hash of order.
    function getOrderHash(Order order)
        internal view
        returns (bytes32 orderHash)
    {
        orderHash = keccak256(
            address(this),
            order.maker,
            order.taker,
            order.makerToken,
            order.takerToken,
            order.feeRecipient,
            order.makerTokenAmount,
            order.takerTokenAmount,
            order.makerFee,
            order.takerFee,
            order.expirationTimestampInSec,
            order.salt
        );
        return orderHash;
    }
}
