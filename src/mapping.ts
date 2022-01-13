import { near, log, BigInt, json, JSONValueKind } from "@graphprotocol/graph-ts";
import { Member, Guild } from "../generated/schema";

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
  if (functionCall.methodName == "join_guild") {
    const receiptId = receipt.id.toBase58();

      // Maps the formatted log to the LOG entity
      let members = new Member(`${receiptId}`);

      // Standard receipt properties
      members.blockTime = BigInt.fromU64(blockHeader.timestampNanosec/1000000)
      members.blockHeight = BigInt.fromU64(blockHeader.height)
      members.blockHash = blockHeader.hash.toBase58()
      members.predecessorId = receipt.predecessorId
      members.receiverId = receipt.receiverId
      members.signerId = receipt.signerId
      members.signerPublicKey = publicKey.bytes.toBase58()
      members.gasBurned = BigInt.fromU64(outcome.gasBurnt)
      members.tokensBurned = outcome.tokensBurnt
      members.outcomeId = outcome.id.toBase58()
      members.executorId = outcome.executorId
      members.outcomeBlockHash = outcome.blockHash.toBase58()

      // Log parsing
      if(outcome.logs != null && outcome.logs.length > 0){
        members.log = outcome.logs[0]
        let splitString = outcome.logs[0].split(' ')
        if(splitString != null){ 
          members.member = splitString[0].slice(1, -1)
          members.guild = splitString[3].slice(1, -2)
        }
      }

      members.save()
      
  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  // change the methodName here to the methodName emitting the log in the contract
  if (functionCall.methodName == "create_guild") {
    const receiptId = receipt.id.toBase58();

      // Maps the formatted log to the LOG entity
      let guilds = new Guild(`${receiptId}`);

      // Standard receipt properties
      guilds.blockTime = BigInt.fromU64(blockHeader.timestampNanosec/1000000)
      guilds.blockHeight = BigInt.fromU64(blockHeader.height)
      guilds.blockHash = blockHeader.hash.toBase58()
      guilds.predecessorId = receipt.predecessorId
      guilds.receiverId = receipt.receiverId
      guilds.signerId = receipt.signerId
      guilds.signerPublicKey = publicKey.bytes.toBase58()
      guilds.gasBurned = BigInt.fromU64(outcome.gasBurnt)
      guilds.tokensBurned = outcome.tokensBurnt
      guilds.outcomeId = outcome.id.toBase58()
      guilds.executorId = outcome.executorId
      guilds.outcomeBlockHash = outcome.blockHash.toBase58()

      // Log parsing
      if(outcome.logs != null && outcome.logs.length > 0){
        guilds.log = outcome.logs[0]
        let splitString = outcome.logs[0].split(' ')
          if(splitString != null){
            guilds.guild = splitString[2].slice(1, -1)
          }
      }

      guilds.save()
      
  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

}
