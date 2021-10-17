/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { MELDSeedSale, MELDSeedSaleInterface } from "../MELDSeedSale";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "investor",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "beneficiary",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "weiAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokens",
        type: "uint256",
      },
    ],
    name: "TokenBuyed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    inputs: [],
    name: "ADD_VESTING_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MELDToken",
    outputs: [
      {
        internalType: "contract ERC20Upgradeable",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MELDVestingContract",
    outputs: [
      {
        internalType: "contract MELDVesting",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "beneficiary",
        type: "address",
      },
    ],
    name: "buyTokens",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleAdmin",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRole",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ERC20Upgradeable",
        name: "token",
        type: "address",
      },
      {
        internalType: "contract MELDVesting",
        name: "_MELDVestingContract",
        type: "address",
      },
      {
        internalType: "address",
        name: "_wallet",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_rate",
        type: "uint256",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "purchasable",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "rate",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "wallet",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506125f3806100206000396000f3fe6080604052600436106101095760003560e01c8063521eb2731161009557806391d148541161006457806391d1485414610335578063a217fddf14610372578063cf756fdf1461039d578063d547741f146103c6578063ec8ac4d8146103ef57610109565b8063521eb2731461029d5780635c975abb146102c85780638456cb59146102f35780638a909eae1461030a57610109565b80632c4e722e116100dc5780632c4e722e146101de5780632f2ff15d1461020957806336568abe146102325780633f3d83c31461025b5780633f4ba83a1461028657610109565b806301ffc9a71461010e5780630a3d9d901461014b57806313ea0d9814610176578063248a9ca3146101a1575b600080fd5b34801561011a57600080fd5b5061013560048036038101906101309190611a1d565b61040b565b6040516101429190611a65565b60405180910390f35b34801561015757600080fd5b50610160610485565b60405161016d9190611aff565b60405180910390f35b34801561018257600080fd5b5061018b6104ab565b6040516101989190611b3b565b60405180910390f35b3480156101ad57600080fd5b506101c860048036038101906101c39190611b8c565b6104d1565b6040516101d59190611bc8565b60405180910390f35b3480156101ea57600080fd5b506101f36104f1565b6040516102009190611bfc565b60405180910390f35b34801561021557600080fd5b50610230600480360381019061022b9190611c55565b6104f7565b005b34801561023e57600080fd5b5061025960048036038101906102549190611c55565b610520565b005b34801561026757600080fd5b506102706105a3565b60405161027d9190611bfc565b60405180910390f35b34801561029257600080fd5b5061029b610655565b005b3480156102a957600080fd5b506102b2610675565b6040516102bf9190611ca4565b60405180910390f35b3480156102d457600080fd5b506102dd61069b565b6040516102ea9190611a65565b60405180910390f35b3480156102ff57600080fd5b506103086106b2565b005b34801561031657600080fd5b5061031f6106d2565b60405161032c9190611bc8565b60405180910390f35b34801561034157600080fd5b5061035c60048036038101906103579190611c55565b6106f6565b6040516103699190611a65565b60405180910390f35b34801561037e57600080fd5b50610387610761565b6040516103949190611bc8565b60405180910390f35b3480156103a957600080fd5b506103c460048036038101906103bf9190611d67565b610768565b005b3480156103d257600080fd5b506103ed60048036038101906103e89190611c55565b610904565b005b61040960048036038101906104049190611dce565b61092d565b005b60007f7965db0b000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916148061047e575061047d82610a5a565b5b9050919050565b60ca60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60c960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600060976000838152602001908152602001600020600101549050919050565b60cc5481565b610500826104d1565b6105118161050c610ac4565b610acc565b61051b8383610b69565b505050565b610528610ac4565b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614610595576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161058c90611e7e565b60405180910390fd5b61059f8282610c4a565b5050565b600060c960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b81526004016106009190611ca4565b60206040518083038186803b15801561061857600080fd5b505afa15801561062c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106509190611eb3565b905090565b6000801b61066a81610665610ac4565b610acc565b610672610d2c565b50565b60cb60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000603360009054906101000a900460ff16905090565b6000801b6106c7816106c2610ac4565b610acc565b6106cf610dce565b50565b7f712b58b4b3d900895b18436de480d1cf1f1842ced619d56b6e6e8c1099dec56381565b60006097600084815260200190815260200160002060000160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905092915050565b6000801b81565b610770610e71565b610778610f5a565b6107856000801b3361104b565b8360c960006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508060cc819055508160cb60006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508260ca60006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060ca60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16632f2ff15d7f712b58b4b3d900895b18436de480d1cf1f1842ced619d56b6e6e8c1099dec563306040518363ffffffff1660e01b81526004016108cc929190611ee0565b600060405180830381600087803b1580156108e657600080fd5b505af11580156108fa573d6000803e3d6000fd5b5050505050505050565b61090d826104d1565b61091e81610919610ac4565b610acc565b6109288383610c4a565b505050565b61093561069b565b15610975576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161096c90611f55565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614156109af57600080fd5b60003414156109bd57600080fd5b60006109c76105a3565b116109d157600080fd5b60006109db611059565b90506109e78183611093565b6109ef61136e565b8173ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167ff64b3f0d4743549712850c11800cdc43fe8b1ccf20dcef83561e2e7d750a350b3484604051610a4e929190611f75565b60405180910390a35050565b60007f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b600033905090565b610ad682826106f6565b610b6557610afb8173ffffffffffffffffffffffffffffffffffffffff1660146113d9565b610b098360001c60206113d9565b604051602001610b1a9291906120b0565b6040516020818303038152906040526040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b5c9190612134565b60405180910390fd5b5050565b610b7382826106f6565b610c465760016097600084815260200190815260200160002060000160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550610beb610ac4565b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45b5050565b610c5482826106f6565b15610d285760006097600084815260200190815260200160002060000160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550610ccd610ac4565b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16837ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b60405160405180910390a45b5050565b610d3461069b565b610d73576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d6a906121a2565b60405180910390fd5b6000603360006101000a81548160ff0219169083151502179055507f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa610db7610ac4565b604051610dc49190611ca4565b60405180910390a1565b610dd661069b565b15610e16576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610e0d90611f55565b60405180910390fd5b6001603360006101000a81548160ff0219169083151502179055507f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258610e5a610ac4565b604051610e679190611ca4565b60405180910390a1565b600060019054906101000a900460ff1680610e97575060008054906101000a900460ff16155b610ed6576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ecd90612234565b60405180910390fd5b60008060019054906101000a900460ff161590508015610f26576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b610f2e611615565b610f366116ee565b8015610f575760008060016101000a81548160ff0219169083151502179055505b50565b600060019054906101000a900460ff1680610f80575060008054906101000a900460ff16155b610fbf576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610fb690612234565b60405180910390fd5b60008060019054906101000a900460ff16159050801561100f576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b611017611615565b61101f6117e2565b6110276118bb565b80156110485760008060016101000a81548160ff0219169083151502179055505b50565b6110558282610b69565b5050565b600080349050600061107660cc548361199490919063ffffffff16565b9050806110816105a3565b1161108b57600080fd5b809250505090565b6000600c9050600062278d0090506000600a905060006110cf60646110c1848961199490919063ffffffff16565b6119aa90919063ffffffff16565b9050600061110560646110f78560646110e89190612283565b8a61199490919063ffffffff16565b6119aa90919063ffffffff16565b9050600061111c86836119aa90919063ffffffff16565b90506000600190505b8681116111e1576000818761113a91906122b7565b905060ca60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16634691a9988a83866040518463ffffffff1660e01b815260040161119b93929190612311565b600060405180830381600087803b1580156111b557600080fd5b505af11580156111c9573d6000803e3d6000fd5b505050505080806111d990612348565b915050611125565b5060c960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb88856040518363ffffffff1660e01b815260040161123f929190612391565b602060405180830381600087803b15801561125957600080fd5b505af115801561126d573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061129191906123e6565b5060c960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb60ca60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16846040518363ffffffff1660e01b8152600401611311929190612391565b602060405180830381600087803b15801561132b57600080fd5b505af115801561133f573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061136391906123e6565b505050505050505050565b60cb60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc349081150290604051600060405180830381858888f193505050501580156113d6573d6000803e3d6000fd5b50565b6060600060028360026113ec91906122b7565b6113f69190612413565b67ffffffffffffffff81111561140f5761140e612469565b5b6040519080825280601f01601f1916602001820160405280156114415781602001600182028036833780820191505090505b5090507f30000000000000000000000000000000000000000000000000000000000000008160008151811061147957611478612498565b5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a9053507f7800000000000000000000000000000000000000000000000000000000000000816001815181106114dd576114dc612498565b5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a9053506000600184600261151d91906122b7565b6115279190612413565b90505b60018111156115c7577f3031323334353637383961626364656600000000000000000000000000000000600f86166010811061156957611568612498565b5b1a60f81b8282815181106115805761157f612498565b5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a905350600485901c9450806115c0906124c7565b905061152a565b506000841461160b576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016116029061253d565b60405180910390fd5b8091505092915050565b600060019054906101000a900460ff168061163b575060008054906101000a900460ff16155b61167a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161167190612234565b60405180910390fd5b60008060019054906101000a900460ff1615905080156116ca576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b80156116eb5760008060016101000a81548160ff0219169083151502179055505b50565b600060019054906101000a900460ff1680611714575060008054906101000a900460ff16155b611753576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161174a90612234565b60405180910390fd5b60008060019054906101000a900460ff1615905080156117a3576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b6000603360006101000a81548160ff02191690831515021790555080156117df5760008060016101000a81548160ff0219169083151502179055505b50565b600060019054906101000a900460ff1680611808575060008054906101000a900460ff16155b611847576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161183e90612234565b60405180910390fd5b60008060019054906101000a900460ff161590508015611897576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b80156118b85760008060016101000a81548160ff0219169083151502179055505b50565b600060019054906101000a900460ff16806118e1575060008054906101000a900460ff16155b611920576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161191790612234565b60405180910390fd5b60008060019054906101000a900460ff161590508015611970576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b80156119915760008060016101000a81548160ff0219169083151502179055505b50565b600081836119a291906122b7565b905092915050565b600081836119b8919061258c565b905092915050565b600080fd5b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b6119fa816119c5565b8114611a0557600080fd5b50565b600081359050611a17816119f1565b92915050565b600060208284031215611a3357611a326119c0565b5b6000611a4184828501611a08565b91505092915050565b60008115159050919050565b611a5f81611a4a565b82525050565b6000602082019050611a7a6000830184611a56565b92915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b6000611ac5611ac0611abb84611a80565b611aa0565b611a80565b9050919050565b6000611ad782611aaa565b9050919050565b6000611ae982611acc565b9050919050565b611af981611ade565b82525050565b6000602082019050611b146000830184611af0565b92915050565b6000611b2582611acc565b9050919050565b611b3581611b1a565b82525050565b6000602082019050611b506000830184611b2c565b92915050565b6000819050919050565b611b6981611b56565b8114611b7457600080fd5b50565b600081359050611b8681611b60565b92915050565b600060208284031215611ba257611ba16119c0565b5b6000611bb084828501611b77565b91505092915050565b611bc281611b56565b82525050565b6000602082019050611bdd6000830184611bb9565b92915050565b6000819050919050565b611bf681611be3565b82525050565b6000602082019050611c116000830184611bed565b92915050565b6000611c2282611a80565b9050919050565b611c3281611c17565b8114611c3d57600080fd5b50565b600081359050611c4f81611c29565b92915050565b60008060408385031215611c6c57611c6b6119c0565b5b6000611c7a85828601611b77565b9250506020611c8b85828601611c40565b9150509250929050565b611c9e81611c17565b82525050565b6000602082019050611cb96000830184611c95565b92915050565b6000611cca82611c17565b9050919050565b611cda81611cbf565b8114611ce557600080fd5b50565b600081359050611cf781611cd1565b92915050565b6000611d0882611c17565b9050919050565b611d1881611cfd565b8114611d2357600080fd5b50565b600081359050611d3581611d0f565b92915050565b611d4481611be3565b8114611d4f57600080fd5b50565b600081359050611d6181611d3b565b92915050565b60008060008060808587031215611d8157611d806119c0565b5b6000611d8f87828801611ce8565b9450506020611da087828801611d26565b9350506040611db187828801611c40565b9250506060611dc287828801611d52565b91505092959194509250565b600060208284031215611de457611de36119c0565b5b6000611df284828501611c40565b91505092915050565b600082825260208201905092915050565b7f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560008201527f20726f6c657320666f722073656c660000000000000000000000000000000000602082015250565b6000611e68602f83611dfb565b9150611e7382611e0c565b604082019050919050565b60006020820190508181036000830152611e9781611e5b565b9050919050565b600081519050611ead81611d3b565b92915050565b600060208284031215611ec957611ec86119c0565b5b6000611ed784828501611e9e565b91505092915050565b6000604082019050611ef56000830185611bb9565b611f026020830184611c95565b9392505050565b7f5061757361626c653a2070617573656400000000000000000000000000000000600082015250565b6000611f3f601083611dfb565b9150611f4a82611f09565b602082019050919050565b60006020820190508181036000830152611f6e81611f32565b9050919050565b6000604082019050611f8a6000830185611bed565b611f976020830184611bed565b9392505050565b600081905092915050565b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000600082015250565b6000611fdf601783611f9e565b9150611fea82611fa9565b601782019050919050565b600081519050919050565b60005b8381101561201e578082015181840152602081019050612003565b8381111561202d576000848401525b50505050565b600061203e82611ff5565b6120488185611f9e565b9350612058818560208601612000565b80840191505092915050565b7f206973206d697373696e6720726f6c6520000000000000000000000000000000600082015250565b600061209a601183611f9e565b91506120a582612064565b601182019050919050565b60006120bb82611fd2565b91506120c78285612033565b91506120d28261208d565b91506120de8284612033565b91508190509392505050565b6000601f19601f8301169050919050565b600061210682611ff5565b6121108185611dfb565b9350612120818560208601612000565b612129816120ea565b840191505092915050565b6000602082019050818103600083015261214e81846120fb565b905092915050565b7f5061757361626c653a206e6f7420706175736564000000000000000000000000600082015250565b600061218c601483611dfb565b915061219782612156565b602082019050919050565b600060208201905081810360008301526121bb8161217f565b9050919050565b7f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160008201527f647920696e697469616c697a6564000000000000000000000000000000000000602082015250565b600061221e602e83611dfb565b9150612229826121c2565b604082019050919050565b6000602082019050818103600083015261224d81612211565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061228e82611be3565b915061229983611be3565b9250828210156122ac576122ab612254565b5b828203905092915050565b60006122c282611be3565b91506122cd83611be3565b9250817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff048311821515161561230657612305612254565b5b828202905092915050565b60006060820190506123266000830186611c95565b6123336020830185611bed565b6123406040830184611bed565b949350505050565b600061235382611be3565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82141561238657612385612254565b5b600182019050919050565b60006040820190506123a66000830185611c95565b6123b36020830184611bed565b9392505050565b6123c381611a4a565b81146123ce57600080fd5b50565b6000815190506123e0816123ba565b92915050565b6000602082840312156123fc576123fb6119c0565b5b600061240a848285016123d1565b91505092915050565b600061241e82611be3565b915061242983611be3565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0382111561245e5761245d612254565b5b828201905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b60006124d282611be3565b915060008214156124e6576124e5612254565b5b600182039050919050565b7f537472696e67733a20686578206c656e67746820696e73756666696369656e74600082015250565b6000612527602083611dfb565b9150612532826124f1565b602082019050919050565b600060208201905081810360008301526125568161251a565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b600061259782611be3565b91506125a283611be3565b9250826125b2576125b161255d565b5b82820490509291505056fea264697066735822122004bc393202005610e684bf42ea3b5d625d393eb5a426060c647ff95435dc587c64736f6c63430008090033";

export class MELDSeedSale__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<MELDSeedSale> {
    return super.deploy(overrides || {}) as Promise<MELDSeedSale>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): MELDSeedSale {
    return super.attach(address) as MELDSeedSale;
  }
  connect(signer: Signer): MELDSeedSale__factory {
    return super.connect(signer) as MELDSeedSale__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MELDSeedSaleInterface {
    return new utils.Interface(_abi) as MELDSeedSaleInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MELDSeedSale {
    return new Contract(address, _abi, signerOrProvider) as MELDSeedSale;
  }
}
