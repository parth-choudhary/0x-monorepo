pragma solidity ^0.4.19;

import "../Exchange/Exchange.sol";
import "../TokenTransferProxy/TokenTransferProxy.sol";
import { WETH9 as EtherToken } from "../../tokens/WETH9.sol";

contract Forwarder is SafeMath {

    Exchange exchange;
    TokenTransferProxy tokenProxy;
    EtherToken etherToken;
    Token zrxToken;

    uint256 constant MAX_UINT = 2 ** 256 - 1;

    function Forwarder(
        Exchange _exchange,
        TokenTransferProxy _tokenProxy,
        EtherToken _etherToken,
        Token _zrxToken)
        public
    {
        exchange = _exchange;
        tokenProxy = _tokenProxy;
        etherToken = _etherToken;
        etherToken.approve(address(tokenProxy), MAX_UINT);
        zrxToken.approve(address(zrxToken), MAX_UINT);
    }

    function fillOrder(
        address[5] orderAddresses,
        uint[6] orderValues,
        uint8 v,
        bytes32 r,
        bytes32 s)
        external
        payable
    {
        require(msg.value > 0);
        require(orderAddresses[3] == address(etherToken));  // takerToken must be etherToken
        
        uint256 takerTokenFillAmount = msg.value;
        etherToken.deposit.value(takerTokenFillAmount);

        require(exchange.fillOrder(
            orderAddresses,
            orderValues,
            takerTokenFillAmount,
            true,   // always throw on failed transfer
            v,
            r,
            s
        ) == takerTokenFillAmount);

        uint256 makerTokenFilledAmount = getPartialAmount(orderValues[0], orderValues[1], takerTokenFillAmount);    // makerTokenAmount * takerTokenFillAmount / takerTokenAmount
        require(Token(orderAddresses[0]).transfer(msg.sender, makerTokenFilledAmount));
    }

    function marketFillOrders(
        address[5][] orderAddresses,
        uint[6][] orderValues,
        uint8[] v,
        bytes32[] r,
        bytes32[] s)
        external
        payable
    {
        require(msg.value > 0);

        uint256 takerTokenFillAmount = msg.value;
        etherToken.deposit.value(takerTokenFillAmount);

        // Note: We assume that takerToken of all orders is EtherToken
        require(exchange.fillOrdersUpTo(
            orderAddresses,
            orderValues,
            takerTokenFillAmount,
            true,   // always throw on failed transfer
            v,
            r,
            s
        ) == takerTokenFillAmount);

        uint256 makerTokenFilledAmount = getPartialAmount(orderValues[0], orderValues[1], takerTokenFillAmount);    // makerTokenAmount * takerTokenFillAmount / takerTokenAmount
        require(Token(orderAddresses[0]).transfer(msg.sender, makerTokenFilledAmount));
    }

    function getPartialAmount(uint256 numerator, uint256 denominator, uint256 target)
        internal
        view
        returns (uint256)
    {
        return safeDiv(safeMul(numerator, target), denominator);
    }
}