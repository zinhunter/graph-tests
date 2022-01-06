import { near, log, BigInt, json, JSONValueKind } from "@graphprotocol/graph-ts";
import { Account, WithdrawCrop, Transfer } from "../generated/schema";

export function handleReceipt(receipt: near.ReceiptWithOutcome): void {
  const actions = receipt.receipt.actions;
  
  for (let i = 0; i < actions.length; i++) {
    handleAction(
      actions[i], 
      receipt.receipt, 
      receipt.block.header,
      receipt.outcome
      );
  }
}

function handleAction(
  action: near.ActionValue,
  receipt: near.ActionReceipt,
  blockHeader: near.BlockHeader,
  outcome: near.ExecutionOutcome
): void {
  
  if (action.kind != near.ActionKind.FUNCTION_CALL) {
    log.info("Early return: {}", ["Not a function call"]);
    return;
  }
  
  let accounts = new Account(receipt.signerId);
  const functionCall = action.toFunctionCall();

  // change the methodName here to the methodName emitting the log in the contract
  if (functionCall.methodName == "ft_mint") {
    const receiptId = receipt.id.toHexString();
      accounts.signerId = receipt.signerId;

      // Maps the JSON formatted log to the LOG entity
      let logs = new WithdrawCrop(`${receiptId}`);
      if(outcome.logs[0]!=null){
        logs.id = receipt.signerId;
        logs.output = outcome.logs[0]
        logs.blockTime = BigInt.fromU64(blockHeader.timestampNanosec/1000000)
        logs.blockHeight = BigInt.fromU64(blockHeader.height)
        logs.blockHash = blockHeader.hash.toHexString()
        let rawString = outcome.logs[0]
        let splitString = rawString.split(' ')
        logs.action = splitString[0].toString()
        logs.amount = BigInt.fromString(splitString[1])
        logs.token = splitString[2].toString()
        logs.receiverId = splitString[4].toString().slice(0, -1)
        let splitMemo = rawString.split(':')
        if(splitMemo[1]){
          logs.memo = splitMemo[1]
          } else {
            logs.memo = ''
          }

        logs.save()
      }

      accounts.withdrawCrop.push(logs.id);
      
  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

   // change the methodName here to the methodName emitting the log in the contract
   if (functionCall.methodName == "ft_transfer_call") {
    const receiptId = receipt.id.toHexString();
      accounts.signerId = receipt.signerId;

      // Maps the JSON formatted log to the LOG entity
      let transfers = new Transfer(`${receiptId}`);
      if(outcome.logs[0]!=null){
        transfers.id = receipt.signerId;
        transfers.output = outcome.logs[0]
        transfers.blockTime = BigInt.fromU64(blockHeader.timestampNanosec/1000000)
        transfers.blockHeight = BigInt.fromU64(blockHeader.height)
        transfers.blockHash = blockHeader.hash.toHexString()
        let rawString = outcome.logs[0]
        let splitString = rawString.split(' ')
        transfers.action = splitString[0].toString()
        transfers.amount = BigInt.fromString(splitString[1])
        transfers.transferFrom = splitString[3].toString()
        transfers.transferTo = splitString[5]
        let splitMemo = rawString.split(':')
        if(splitMemo[1]){
        transfers.memo = splitMemo[1]
        } else {
          transfers.memo = ''
        }

        transfers.save()
      }
      accounts.transfers.push(transfers.id);
  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  accounts.save();
}
