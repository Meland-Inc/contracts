/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, ContractTransaction, EventFilter, Signer } from "ethers";
import { Listener, Provider } from "ethers/providers";
import { Arrayish, BigNumber, BigNumberish, Interface } from "ethers/utils";
import { UnsignedTransaction } from "ethers/utils/transaction";
import { TypedEventDescription, TypedFunctionDescription } from ".";

interface ERC721URIStorageUpgradeableInterface extends Interface {
  functions: {
    approve: TypedFunctionDescription<{
      encode([to, tokenId]: [string, BigNumberish]): string;
    }>;

    balanceOf: TypedFunctionDescription<{ encode([owner]: [string]): string }>;

    getApproved: TypedFunctionDescription<{
      encode([tokenId]: [BigNumberish]): string;
    }>;

    isApprovedForAll: TypedFunctionDescription<{
      encode([owner, operator]: [string, string]): string;
    }>;

    name: TypedFunctionDescription<{ encode([]: []): string }>;

    ownerOf: TypedFunctionDescription<{
      encode([tokenId]: [BigNumberish]): string;
    }>;

    safeTransferFrom: TypedFunctionDescription<{
      encode([from, to, tokenId]: [string, string, BigNumberish]): string;
    }>;

    setApprovalForAll: TypedFunctionDescription<{
      encode([operator, approved]: [string, boolean]): string;
    }>;

    supportsInterface: TypedFunctionDescription<{
      encode([interfaceId]: [Arrayish]): string;
    }>;

    symbol: TypedFunctionDescription<{ encode([]: []): string }>;

    transferFrom: TypedFunctionDescription<{
      encode([from, to, tokenId]: [string, string, BigNumberish]): string;
    }>;

    tokenURI: TypedFunctionDescription<{
      encode([tokenId]: [BigNumberish]): string;
    }>;
  };

  events: {
    Approval: TypedEventDescription<{
      encodeTopics([owner, approved, tokenId]: [
        string | null,
        string | null,
        BigNumberish | null
      ]): string[];
    }>;

    ApprovalForAll: TypedEventDescription<{
      encodeTopics([owner, operator, approved]: [
        string | null,
        string | null,
        null
      ]): string[];
    }>;

    Transfer: TypedEventDescription<{
      encodeTopics([from, to, tokenId]: [
        string | null,
        string | null,
        BigNumberish | null
      ]): string[];
    }>;
  };
}

export class ERC721URIStorageUpgradeable extends Contract {
  connect(
    signerOrProvider: Signer | Provider | string
  ): ERC721URIStorageUpgradeable;
  attach(addressOrName: string): ERC721URIStorageUpgradeable;
  deployed(): Promise<ERC721URIStorageUpgradeable>;

  on(
    event: EventFilter | string,
    listener: Listener
  ): ERC721URIStorageUpgradeable;
  once(
    event: EventFilter | string,
    listener: Listener
  ): ERC721URIStorageUpgradeable;
  addListener(
    eventName: EventFilter | string,
    listener: Listener
  ): ERC721URIStorageUpgradeable;
  removeAllListeners(
    eventName: EventFilter | string
  ): ERC721URIStorageUpgradeable;
  removeListener(
    eventName: any,
    listener: Listener
  ): ERC721URIStorageUpgradeable;

  interface: ERC721URIStorageUpgradeableInterface;

  functions: {
    /**
     * See {IERC721-approve}.
     */
    approve(
      to: string,
      tokenId: BigNumberish,
      overrides?: UnsignedTransaction
    ): Promise<ContractTransaction>;

    /**
     * See {IERC721-approve}.
     */
    "approve(address,uint256)"(
      to: string,
      tokenId: BigNumberish,
      overrides?: UnsignedTransaction
    ): Promise<ContractTransaction>;

    /**
     * See {IERC721-balanceOf}.
     */
    balanceOf(
      owner: string,
      overrides?: UnsignedTransaction
    ): Promise<BigNumber>;

    /**
     * See {IERC721-balanceOf}.
     */
    "balanceOf(address)"(
      owner: string,
      overrides?: UnsignedTransaction
    ): Promise<BigNumber>;

    /**
     * See {IERC721-getApproved}.
     */
    getApproved(
      tokenId: BigNumberish,
      overrides?: UnsignedTransaction
    ): Promise<string>;

    /**
     * See {IERC721-getApproved}.
     */
    "getApproved(uint256)"(
      tokenId: BigNumberish,
      overrides?: UnsignedTransaction
    ): Promise<string>;

    /**
     * See {IERC721-isApprovedForAll}.
     */
    isApprovedForAll(
      owner: string,
      operator: string,
      overrides?: UnsignedTransaction
    ): Promise<boolean>;

    /**
     * See {IERC721-isApprovedForAll}.
     */
    "isApprovedForAll(address,address)"(
      owner: string,
      operator: string,
      overrides?: UnsignedTransaction
    ): Promise<boolean>;

    /**
     * See {IERC721Metadata-name}.
     */
    name(overrides?: UnsignedTransaction): Promise<string>;

    /**
     * See {IERC721Metadata-name}.
     */
    "name()"(overrides?: UnsignedTransaction): Promise<string>;

    /**
     * See {IERC721-ownerOf}.
     */
    ownerOf(
      tokenId: BigNumberish,
      overrides?: UnsignedTransaction
    ): Promise<string>;

    /**
     * See {IERC721-ownerOf}.
     */
    "ownerOf(uint256)"(
      tokenId: BigNumberish,
      overrides?: UnsignedTransaction
    ): Promise<string>;

    /**
     * See {IERC721-safeTransferFrom}.
     */
    safeTransferFrom(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: UnsignedTransaction
    ): Promise<ContractTransaction>;

    /**
     * See {IERC721-safeTransferFrom}.
     */
    "safeTransferFrom(address,address,uint256)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: UnsignedTransaction
    ): Promise<ContractTransaction>;

    /**
     * See {IERC721-safeTransferFrom}.
     */
    "safeTransferFrom(address,address,uint256,bytes)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      _data: Arrayish,
      overrides?: UnsignedTransaction
    ): Promise<ContractTransaction>;

    /**
     * See {IERC721-setApprovalForAll}.
     */
    setApprovalForAll(
      operator: string,
      approved: boolean,
      overrides?: UnsignedTransaction
    ): Promise<ContractTransaction>;

    /**
     * See {IERC721-setApprovalForAll}.
     */
    "setApprovalForAll(address,bool)"(
      operator: string,
      approved: boolean,
      overrides?: UnsignedTransaction
    ): Promise<ContractTransaction>;

    /**
     * See {IERC165-supportsInterface}.
     */
    supportsInterface(
      interfaceId: Arrayish,
      overrides?: UnsignedTransaction
    ): Promise<boolean>;

    /**
     * See {IERC165-supportsInterface}.
     */
    "supportsInterface(bytes4)"(
      interfaceId: Arrayish,
      overrides?: UnsignedTransaction
    ): Promise<boolean>;

    /**
     * See {IERC721Metadata-symbol}.
     */
    symbol(overrides?: UnsignedTransaction): Promise<string>;

    /**
     * See {IERC721Metadata-symbol}.
     */
    "symbol()"(overrides?: UnsignedTransaction): Promise<string>;

    /**
     * See {IERC721-transferFrom}.
     */
    transferFrom(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: UnsignedTransaction
    ): Promise<ContractTransaction>;

    /**
     * See {IERC721-transferFrom}.
     */
    "transferFrom(address,address,uint256)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: UnsignedTransaction
    ): Promise<ContractTransaction>;

    /**
     * See {IERC721Metadata-tokenURI}.
     */
    tokenURI(
      tokenId: BigNumberish,
      overrides?: UnsignedTransaction
    ): Promise<string>;

    /**
     * See {IERC721Metadata-tokenURI}.
     */
    "tokenURI(uint256)"(
      tokenId: BigNumberish,
      overrides?: UnsignedTransaction
    ): Promise<string>;
  };

  /**
   * See {IERC721-approve}.
   */
  approve(
    to: string,
    tokenId: BigNumberish,
    overrides?: UnsignedTransaction
  ): Promise<ContractTransaction>;

  /**
   * See {IERC721-approve}.
   */
  "approve(address,uint256)"(
    to: string,
    tokenId: BigNumberish,
    overrides?: UnsignedTransaction
  ): Promise<ContractTransaction>;

  /**
   * See {IERC721-balanceOf}.
   */
  balanceOf(owner: string, overrides?: UnsignedTransaction): Promise<BigNumber>;

  /**
   * See {IERC721-balanceOf}.
   */
  "balanceOf(address)"(
    owner: string,
    overrides?: UnsignedTransaction
  ): Promise<BigNumber>;

  /**
   * See {IERC721-getApproved}.
   */
  getApproved(
    tokenId: BigNumberish,
    overrides?: UnsignedTransaction
  ): Promise<string>;

  /**
   * See {IERC721-getApproved}.
   */
  "getApproved(uint256)"(
    tokenId: BigNumberish,
    overrides?: UnsignedTransaction
  ): Promise<string>;

  /**
   * See {IERC721-isApprovedForAll}.
   */
  isApprovedForAll(
    owner: string,
    operator: string,
    overrides?: UnsignedTransaction
  ): Promise<boolean>;

  /**
   * See {IERC721-isApprovedForAll}.
   */
  "isApprovedForAll(address,address)"(
    owner: string,
    operator: string,
    overrides?: UnsignedTransaction
  ): Promise<boolean>;

  /**
   * See {IERC721Metadata-name}.
   */
  name(overrides?: UnsignedTransaction): Promise<string>;

  /**
   * See {IERC721Metadata-name}.
   */
  "name()"(overrides?: UnsignedTransaction): Promise<string>;

  /**
   * See {IERC721-ownerOf}.
   */
  ownerOf(
    tokenId: BigNumberish,
    overrides?: UnsignedTransaction
  ): Promise<string>;

  /**
   * See {IERC721-ownerOf}.
   */
  "ownerOf(uint256)"(
    tokenId: BigNumberish,
    overrides?: UnsignedTransaction
  ): Promise<string>;

  /**
   * See {IERC721-safeTransferFrom}.
   */
  safeTransferFrom(
    from: string,
    to: string,
    tokenId: BigNumberish,
    overrides?: UnsignedTransaction
  ): Promise<ContractTransaction>;

  /**
   * See {IERC721-safeTransferFrom}.
   */
  "safeTransferFrom(address,address,uint256)"(
    from: string,
    to: string,
    tokenId: BigNumberish,
    overrides?: UnsignedTransaction
  ): Promise<ContractTransaction>;

  /**
   * See {IERC721-safeTransferFrom}.
   */
  "safeTransferFrom(address,address,uint256,bytes)"(
    from: string,
    to: string,
    tokenId: BigNumberish,
    _data: Arrayish,
    overrides?: UnsignedTransaction
  ): Promise<ContractTransaction>;

  /**
   * See {IERC721-setApprovalForAll}.
   */
  setApprovalForAll(
    operator: string,
    approved: boolean,
    overrides?: UnsignedTransaction
  ): Promise<ContractTransaction>;

  /**
   * See {IERC721-setApprovalForAll}.
   */
  "setApprovalForAll(address,bool)"(
    operator: string,
    approved: boolean,
    overrides?: UnsignedTransaction
  ): Promise<ContractTransaction>;

  /**
   * See {IERC165-supportsInterface}.
   */
  supportsInterface(
    interfaceId: Arrayish,
    overrides?: UnsignedTransaction
  ): Promise<boolean>;

  /**
   * See {IERC165-supportsInterface}.
   */
  "supportsInterface(bytes4)"(
    interfaceId: Arrayish,
    overrides?: UnsignedTransaction
  ): Promise<boolean>;

  /**
   * See {IERC721Metadata-symbol}.
   */
  symbol(overrides?: UnsignedTransaction): Promise<string>;

  /**
   * See {IERC721Metadata-symbol}.
   */
  "symbol()"(overrides?: UnsignedTransaction): Promise<string>;

  /**
   * See {IERC721-transferFrom}.
   */
  transferFrom(
    from: string,
    to: string,
    tokenId: BigNumberish,
    overrides?: UnsignedTransaction
  ): Promise<ContractTransaction>;

  /**
   * See {IERC721-transferFrom}.
   */
  "transferFrom(address,address,uint256)"(
    from: string,
    to: string,
    tokenId: BigNumberish,
    overrides?: UnsignedTransaction
  ): Promise<ContractTransaction>;

  /**
   * See {IERC721Metadata-tokenURI}.
   */
  tokenURI(
    tokenId: BigNumberish,
    overrides?: UnsignedTransaction
  ): Promise<string>;

  /**
   * See {IERC721Metadata-tokenURI}.
   */
  "tokenURI(uint256)"(
    tokenId: BigNumberish,
    overrides?: UnsignedTransaction
  ): Promise<string>;

  filters: {
    Approval(
      owner: string | null,
      approved: string | null,
      tokenId: BigNumberish | null
    ): EventFilter;

    ApprovalForAll(
      owner: string | null,
      operator: string | null,
      approved: null
    ): EventFilter;

    Transfer(
      from: string | null,
      to: string | null,
      tokenId: BigNumberish | null
    ): EventFilter;
  };

  estimate: {
    /**
     * See {IERC721-approve}.
     */
    approve(
      to: string,
      tokenId: BigNumberish,
      overrides?: UnsignedTransaction
    ): Promise<BigNumber>;

    /**
     * See {IERC721-approve}.
     */
    "approve(address,uint256)"(
      to: string,
      tokenId: BigNumberish,
      overrides?: UnsignedTransaction
    ): Promise<BigNumber>;

    /**
     * See {IERC721-balanceOf}.
     */
    balanceOf(
      owner: string,
      overrides?: UnsignedTransaction
    ): Promise<BigNumber>;

    /**
     * See {IERC721-balanceOf}.
     */
    "balanceOf(address)"(
      owner: string,
      overrides?: UnsignedTransaction
    ): Promise<BigNumber>;

    /**
     * See {IERC721-getApproved}.
     */
    getApproved(
      tokenId: BigNumberish,
      overrides?: UnsignedTransaction
    ): Promise<BigNumber>;

    /**
     * See {IERC721-getApproved}.
     */
    "getApproved(uint256)"(
      tokenId: BigNumberish,
      overrides?: UnsignedTransaction
    ): Promise<BigNumber>;

    /**
     * See {IERC721-isApprovedForAll}.
     */
    isApprovedForAll(
      owner: string,
      operator: string,
      overrides?: UnsignedTransaction
    ): Promise<BigNumber>;

    /**
     * See {IERC721-isApprovedForAll}.
     */
    "isApprovedForAll(address,address)"(
      owner: string,
      operator: string,
      overrides?: UnsignedTransaction
    ): Promise<BigNumber>;

    /**
     * See {IERC721Metadata-name}.
     */
    name(overrides?: UnsignedTransaction): Promise<BigNumber>;

    /**
     * See {IERC721Metadata-name}.
     */
    "name()"(overrides?: UnsignedTransaction): Promise<BigNumber>;

    /**
     * See {IERC721-ownerOf}.
     */
    ownerOf(
      tokenId: BigNumberish,
      overrides?: UnsignedTransaction
    ): Promise<BigNumber>;

    /**
     * See {IERC721-ownerOf}.
     */
    "ownerOf(uint256)"(
      tokenId: BigNumberish,
      overrides?: UnsignedTransaction
    ): Promise<BigNumber>;

    /**
     * See {IERC721-safeTransferFrom}.
     */
    safeTransferFrom(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: UnsignedTransaction
    ): Promise<BigNumber>;

    /**
     * See {IERC721-safeTransferFrom}.
     */
    "safeTransferFrom(address,address,uint256)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: UnsignedTransaction
    ): Promise<BigNumber>;

    /**
     * See {IERC721-safeTransferFrom}.
     */
    "safeTransferFrom(address,address,uint256,bytes)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      _data: Arrayish,
      overrides?: UnsignedTransaction
    ): Promise<BigNumber>;

    /**
     * See {IERC721-setApprovalForAll}.
     */
    setApprovalForAll(
      operator: string,
      approved: boolean,
      overrides?: UnsignedTransaction
    ): Promise<BigNumber>;

    /**
     * See {IERC721-setApprovalForAll}.
     */
    "setApprovalForAll(address,bool)"(
      operator: string,
      approved: boolean,
      overrides?: UnsignedTransaction
    ): Promise<BigNumber>;

    /**
     * See {IERC165-supportsInterface}.
     */
    supportsInterface(
      interfaceId: Arrayish,
      overrides?: UnsignedTransaction
    ): Promise<BigNumber>;

    /**
     * See {IERC165-supportsInterface}.
     */
    "supportsInterface(bytes4)"(
      interfaceId: Arrayish,
      overrides?: UnsignedTransaction
    ): Promise<BigNumber>;

    /**
     * See {IERC721Metadata-symbol}.
     */
    symbol(overrides?: UnsignedTransaction): Promise<BigNumber>;

    /**
     * See {IERC721Metadata-symbol}.
     */
    "symbol()"(overrides?: UnsignedTransaction): Promise<BigNumber>;

    /**
     * See {IERC721-transferFrom}.
     */
    transferFrom(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: UnsignedTransaction
    ): Promise<BigNumber>;

    /**
     * See {IERC721-transferFrom}.
     */
    "transferFrom(address,address,uint256)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: UnsignedTransaction
    ): Promise<BigNumber>;

    /**
     * See {IERC721Metadata-tokenURI}.
     */
    tokenURI(
      tokenId: BigNumberish,
      overrides?: UnsignedTransaction
    ): Promise<BigNumber>;

    /**
     * See {IERC721Metadata-tokenURI}.
     */
    "tokenURI(uint256)"(
      tokenId: BigNumberish,
      overrides?: UnsignedTransaction
    ): Promise<BigNumber>;
  };
}
