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

import "./mixins/MExchangeCore.sol";
import "./LibPartialAmount.sol";

pragma experimental ABIEncoderV2;

/// @dev Consumes MExchangeCore
contract MixinWrapperFunctions is
    MExchangeCore,
    LibPartialAmount
{
  
    /// @dev Fills an order with specified parameters and ECDSA signature. Throws if specified amount not filled entirely.
    /// @param order Order struct containing order specifications and signature.
    /// @param takerTokenFillAmount Desired amount of takerToken to fill.
    function fillOrKillOrder(Order order, uint256 takerTokenFillAmount)
        public
    {
        require(fillOrder(order, takerTokenFillAmount) == takerTokenFillAmount);
    }

    /// @dev Fills an order with specified parameters and ECDSA signature. Returns false if the transaction would otherwise revert.
    /// @param order Order struct containing order specifications and signature.
    /// @param takerTokenFillAmount Desired amount of takerToken to fill.
    /// @return Total amount of takerToken filled in trade.
    function fillOrderNoThrow(Order order, uint256 takerTokenFillAmount)
        public
        returns (uint256 takerTokenFilledAmount)
    {
        bytes4 fillOrderFunctionSignature = bytes4(keccak256("fillOrder(Order,uint256)"));
        
        assembly {
            let x := mload(0x40)  // free memory pointer
            mstore(x, fillOrderFunctionSignature)

            mstore(add(x, 4), order)              // maker
            mstore(add(x, 36), add(order, 32))    // taker
            mstore(add(x, 68), add(order, 64))    // makerToken
            mstore(add(x, 100), add(order, 96))   // takerToken
            mstore(add(x, 132), add(order, 128))  // feeRecipient
            mstore(add(x, 164), add(order, 160))  // makerTokenAmount
            mstore(add(x, 196), add(order, 192))  // takerTokenAmount
            mstore(add(x, 228), add(order, 224))  // makerFee
            mstore(add(x, 260), add(order, 256))  // takerFee
            mstore(add(x, 292), add(order, 288))  // expirationTimestampInSec
            mstore(add(x, 324), add(order, 320))  // salt
            mstore(add(x, 388), add(order, 352))  // v
            mstore(add(x, 420), add(order, 384))  // r
            mstore(add(x, 452), add(order, 416))  // s
            mstore(add(x, 356), takerTokenFillAmount)

            let success := delegatecall(
                gas,      // TODO: don't send all gas, save some for returning is case of throw
                address,  // call this contract
                x,        // inputs start at x
                484,      // inputs are 484 bytes long (4 + 15 * 32)
                x,        // store output over input
                32        // output is 32 bytes
            )

            switch success
            case 0 {
                takerTokenFillAmount := 0
            }
            case 1 {
                takerTokenFilledAmount := mload(x)
            }
        }
        return takerTokenFilledAmount;
    }

    /// @dev Synchronously executes multiple calls of fillOrder in a single transaction.
    /// @param orders Array of order structs containing order specifications and signatures.
    /// @param takerTokenFillAmounts Array of desired amounts of takerToken to fill in orders.
    function batchFillOrders(Order[] orders, uint256[] takerTokenFillAmounts)
        public
    {
        for (uint256 i = 0; i < orders.length; i++) {
            fillOrder(orders[i], takerTokenFillAmounts[i]);
        }
    }

    /// @dev Synchronously executes multiple calls of fillOrKill in a single transaction.
    /// @param orders Array of order structs containing order specifications and signatures.
    /// @param takerTokenFillAmounts Array of desired amounts of takerToken to fill in orders.
    function batchFillOrKillOrders(Order[] orders, uint256[] takerTokenFillAmounts)
        public
    {
        for (uint256 i = 0; i < orders.length; i++) {
            fillOrKillOrder(orders[i], takerTokenFillAmounts[i]);
        }
    }

    /// @dev Synchronously executes multiple calls of fillOrderNoThrow in a single transaction.
    /// @param orders Array of order structs containing order specifications and signatures.
    /// @param takerTokenFillAmounts Array of desired amounts of takerToken to fill in orders.
    function batchFillOrdersNoThrow(Order[] orders, uint256[] takerTokenFillAmounts)
        public
    {
        for (uint256 i = 0; i < orders.length; i++) {
            fillOrderNoThrow(orders[i], takerTokenFillAmounts[i]);
        }
    }

    /// @dev Synchronously executes multiple fill orders in a single transaction until total takerTokenFillAmount filled.
    /// @param orders Array of order structs containing order specifications and signatures.
    /// @param takerTokenFillAmount Desired total amount of takerToken to fill in orders.
    function marketFillOrders(Order[] orders, uint256 takerTokenFillAmount)
        public
        returns (uint256 totalTakerTokenFilledAmount)
    {
        for (uint256 i = 0; i < orders.length; i++) {
            require(orders[i].takerToken == orders[0].takerToken);
            totalTakerTokenFilledAmount = safeAdd(
                totalTakerTokenFilledAmount,
                fillOrder(orders[i], safeSub(takerTokenFillAmount, totalTakerTokenFilledAmount))
            );
            if (totalTakerTokenFilledAmount == takerTokenFillAmount) {
                break;
            } 
        }
        return totalTakerTokenFilledAmount;
    }

    /// @dev Synchronously executes multiple calls of fillOrderNoThrow in a single transaction until total takerTokenFillAmount filled.
    /// @param orders Array of order structs containing order specifications and signatures.
    /// @param takerTokenFillAmount Desired total amount of takerToken to fill in orders.
    function marketFillOrdersNoThrow(Order[] orders, uint256 takerTokenFillAmount)
        public
        returns (uint256 totalTakerTokenFilledAmount)
    {
        for (uint256 i = 0; i < orders.length; i++) {
            require(orders[i].takerToken == orders[0].takerToken);
            totalTakerTokenFilledAmount = safeAdd(
                totalTakerTokenFilledAmount,
                fillOrderNoThrow(orders[i], safeSub(takerTokenFillAmount, totalTakerTokenFilledAmount))
            );
            if (totalTakerTokenFilledAmount == takerTokenFillAmount) {
                break;
            }
        }
        return totalTakerTokenFilledAmount;
    }

    /// @dev Synchronously cancels multiple orders in a single transaction.
    /// @param orders Array of order structs containing order specifications and signatures.
    /// @param takerTokenCancelAmounts Array of desired amounts of takerToken to cancel in orders.
    function batchCancelOrders(Order[] orders, uint256[] takerTokenCancelAmounts)
        public
    {
        for (uint256 i = 0; i < orders.length; i++) {
            cancelOrder(orders[i], takerTokenCancelAmounts[i]);
        }
    }
}
