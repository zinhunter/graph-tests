import { near, log, BigInt, json, JSONValueKind } from "@graphprotocol/graph-ts";
import { Draw, WithdrawCrop, MintCallback, BuyMilkCheddar, BuyTokens } from "../generated/schema";

export function handleReceipt(receipt: near.ReceiptWithOutcome): void {
  const actions = receipt.receipt.actions;
  
  for (let i = 0; i < actions.length; i++) {
    handleAction(
      actions[i], 
      receipt.receipt, 
      receipt.block.header,
      receipt.outcome,
      receipt.receipt.signerPublicKey
      );
  }
}

function handleAction(
  action: near.ActionValue,
  receipt: near.ActionReceipt,
  blockHeader: near.BlockHeader,
  outcome: near.ExecutionOutcome,
  publicKey: near.PublicKey
): void {
  
  if (action.kind != near.ActionKind.FUNCTION_CALL) {
    log.info("Early return: {}", ["Not a function call"]);
    return;
  }
  
  const functionCall = action.toFunctionCall();

  // change the methodName here to the methodName emitting the log in the contract
  if (functionCall.methodName == "draw") {
    const receiptId = receipt.id.toBase58();

      // Maps the formatted log to the LOG entity
      let draws = new Draw(`${receiptId}`);

      // Standard receipt properties
      draws.blockTime = BigInt.fromU64(blockHeader.timestampNanosec/1000000)
      draws.blockHeight = BigInt.fromU64(blockHeader.height)
      draws.blockHash = blockHeader.hash.toBase58()
      draws.predecessorId = receipt.predecessorId
      draws.receiverId = receipt.receiverId
      draws.signerId = receipt.signerId
      draws.signerPublicKey = publicKey.bytes.toBase58()
      draws.gasBurned = BigInt.fromU64(outcome.gasBurnt)
      draws.tokensBurned = outcome.tokensBurnt
      draws.outcomeId = outcome.id.toBase58()
      draws.executorId = outcome.executorId
      draws.outcomeBlockHash = outcome.blockHash.toBase58()

      // Log parsing
      if(outcome.logs != null && outcome.logs.length > 0){
        draws.log = outcome.logs[0]
      }

      draws.save()
      
  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  // change the methodName here to the methodName emitting the log in the contract
  if (functionCall.methodName == "withdraw_crop") {
    const receiptId = receipt.id.toBase58();

      // Maps the formatted log to the LOG entity
      let crop = new WithdrawCrop(`${receiptId}`);

      // Standard receipt properties
      crop.blockTime = BigInt.fromU64(blockHeader.timestampNanosec/1000000)
      crop.blockHeight = BigInt.fromU64(blockHeader.height)
      crop.blockHash = blockHeader.hash.toBase58()
      crop.predecessorId = receipt.predecessorId
      crop.receiverId = receipt.receiverId
      crop.signerId = receipt.signerId
      crop.signerPublicKey = publicKey.bytes.toBase58()
      crop.gasBurned = BigInt.fromU64(outcome.gasBurnt)
      crop.tokensBurned = outcome.tokensBurnt
      crop.outcomeId = outcome.id.toBase58()
      crop.executorId = outcome.executorId
      crop.outcomeBlockHash = outcome.blockHash.toBase58()

      // Log parsing
      if(outcome.logs != null && outcome.logs.length > 0){
        crop.log = outcome.logs[0]
      }

      crop.save()
      
  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  // change the methodName here to the methodName emitting the log in the contract
  if (functionCall.methodName == "mint_callback") {
  const receiptId = receipt.id.toBase58();

    // Maps the formatted log to the LOG entity
    let callBack = new MintCallback(`${receiptId}`);

    // Standard receipt properties
    callBack.blockTime = BigInt.fromU64(blockHeader.timestampNanosec/1000000)
    callBack.blockHeight = BigInt.fromU64(blockHeader.height)
    callBack.blockHash = blockHeader.hash.toBase58()
    callBack.predecessorId = receipt.predecessorId
    callBack.receiverId = receipt.receiverId
    callBack.signerId = receipt.signerId
    callBack.signerPublicKey = publicKey.bytes.toBase58()
    callBack.gasBurned = BigInt.fromU64(outcome.gasBurnt)
    callBack.tokensBurned = outcome.tokensBurnt
    callBack.outcomeId = outcome.id.toBase58()
    callBack.executorId = outcome.executorId
    callBack.outcomeBlockHash = outcome.blockHash.toBase58()

    // Log parsing
    if(outcome.logs != null && outcome.logs.length > 0){
      callBack.log = outcome.logs[0]
      let splitString = outcome.logs[0].split(' ')
      // callBack.receiver not available - needs to be in logs
      callBack.amount = BigInt.fromString(splitString[3])
      callBack.memo = splitString[0] + ' ' + splitString[1] + ' ' + splitString[2]
    }

    callBack.save()
      
  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  // change the methodName here to the methodName emitting the log in the contract
  if (functionCall.methodName == "buy_milk_with_cheddar") {
    const receiptId = receipt.id.toBase58();
  
      // Maps the formatted log to the LOG entity
      let milk = new BuyMilkCheddar(`${receiptId}`);
  
      // Standard receipt properties
      milk.blockTime = BigInt.fromU64(blockHeader.timestampNanosec/1000000)
      milk.blockHeight = BigInt.fromU64(blockHeader.height)
      milk.blockHash = blockHeader.hash.toBase58()
      milk.predecessorId = receipt.predecessorId
      milk.receiverId = receipt.receiverId
      milk.signerId = receipt.signerId
      milk.signerPublicKey = publicKey.bytes.toBase58()
      milk.gasBurned = BigInt.fromU64(outcome.gasBurnt)
      milk.tokensBurned = outcome.tokensBurnt
      milk.outcomeId = outcome.id.toBase58()
      milk.executorId = outcome.executorId
      milk.outcomeBlockHash = outcome.blockHash.toBase58()
  
      // Log parsing
      if(outcome.logs != null && outcome.logs.length > 0){
        milk.log = outcome.logs[0]
        let splitString = outcome.logs[0].split(' ')
        milk.action = splitString[0]
        milk.purchaseAmount = splitString[1]
        milk.purchasedToken = splitString[2]
        milk.spentCheddar = BigInt.fromString(splitString[5])
        milk.spendingToken = splitString[6]
      }
  
      milk.save()
        
    } else {
      log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
    }

  // change the methodName here to the methodName emitting the log in the contract
  if (functionCall.methodName == "buy_tokens") {
    const receiptId = receipt.id.toBase58();
  
      // Maps the formatted log to the LOG entity
      let token = new BuyTokens(`${receiptId}`);
  
      // Standard receipt properties
      token.blockTime = BigInt.fromU64(blockHeader.timestampNanosec/1000000)
      token.blockHeight = BigInt.fromU64(blockHeader.height)
      token.blockHash = blockHeader.hash.toBase58()
      token.predecessorId = receipt.predecessorId
      token.receiverId = receipt.receiverId
      token.signerId = receipt.signerId
      token.signerPublicKey = publicKey.bytes.toBase58()
      token.gasBurned = BigInt.fromU64(outcome.gasBurnt)
      token.tokensBurned = outcome.tokensBurnt
      token.outcomeId = outcome.id.toBase58()
      token.executorId = outcome.executorId
      token.outcomeBlockHash = outcome.blockHash.toBase58()
  
      // Log parsing
      if(outcome.logs != null && outcome.logs.length > 0){
        token.log = outcome.logs[0]
        let splitString = outcome.logs[0].split(' ')
        token.action = splitString[0]
        token.purchaseAmount = splitString[1]
        token.purchasedToken = splitString[2]
        token.spentToken = BigInt.fromString(splitString[5])
        token.spendingToken = splitString[6]
      }
  
      token.save()
        
    } else {
      log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
    }

}
