import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

interface IERC20MELD is IERC20Upgradeable {
  function ping() external;

  function safeMint(uint256 amount) external;
}