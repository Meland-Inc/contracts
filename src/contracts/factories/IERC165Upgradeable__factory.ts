/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer } from "ethers";
import { Provider } from "ethers/providers";

import { IERC165Upgradeable } from "../IERC165Upgradeable";

export class IERC165Upgradeable__factory {
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IERC165Upgradeable {
    return new Contract(address, _abi, signerOrProvider) as IERC165Upgradeable;
  }
}

const _abi = [
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
];
