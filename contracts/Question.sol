// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

// 答题合约.
// 控制题目的创建以及每个用户的答题.
// 用户可以通过答题来获取一定数量的MELD.
// 具体获取MELD的算法规则TODO待策划(产品)提供.
// 当然这里也可以获取其他NFT之类的奖品. 算法规则也需要提供.

// 当前版本简单实现了管理员创建题目
// 用户支付体力随机答题
// 用户的体力也是通过合约控制. 但是由于不涉及二级市场买卖. 所以暂时不实现 ERC20.

// 后续版本如果增加自适应答题
// 可以使用Chainlink来利用外部算力来注入每个用户接下来应该作答的题目.

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "./Incentives.sol";

contract Question is Initializable, ERC721Upgradeable, AccessControlUpgradeable, UUPSUpgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;

    // 权限控制
    // 允许那些人铸造题目.
    // 设计思路.
    // 可能支付了某些MELD保证金或者通过了审核.
    // 才能将一些用户授权允许为社区贡献题目.
    // 防止太多用户乱铸造导致审核团工作量太大.
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    // 审核权限
    bytes32 public constant AUDIT_ROLE = keccak256("AUDIT_ROLE");

    // 权限控制
    // 允许哪些人升级合约.
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    // 单选题
    struct QuestionOnlyChoice {
        uint256 qid;
        // 题干
        string title;
        string option1;
        string option2;
        string option3;
        string option4;
    }

    // 存储单选题的答案
    // TODO
    // 如何防止答案泄漏?
    // 如何确保类似审题团的存在来校验题目的合法性?
    mapping (uint256 => mapping(uint8 => bool)) private questionOnlyChoiceAnswerMapping;

    // 方便实现类似答题收益分成的问题.
    // 分别给拥有者和作者转账之类的.
    // 这里不需要区分题目类型.
    // 只要确保所有类型的题目共用一个id即可.
    // 当前ownser ERC721Upgradeable 已经帮助我们实现.
    // 这里我们自己维护作者即可.
    // 作者
    mapping (uint256 => address) private questionAutherMapping;

    // 存储所有的题目
    // TODO 如何支持更多类型的题目?
    mapping (uint256 => QuestionOnlyChoice) private allQuestionOnlyChoices;

    // 所有待审核的题目.
    // 方便审核团审核.
    uint256[] unReadyQuestionOnlyChoiceIds;

    // TODO
    // 探索从外部获取题库的可能性
    // 因为如果纯合约实现题库. 后期几乎没法实现 自适应学习.
    // 已经审核了的题目.
    // 用户基于此获取题目做题.
    uint256[] readyQuestionOnlyChoiceIds;

    // 奖励的MELD货币合约地址地址
    address MELDAddress;
    
    CountersUpgradeable.Counter private _tokenIdCounter;

    // as constructor
    // use openzeppelin upgradeable
    function initialize(address _MELDAddress) initializer public {
        __ERC721_init("Question", "MELQ");
        __AccessControl_init();
        __UUPSUpgradeable_init();

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
        _setupRole(UPGRADER_ROLE, msg.sender);

        MELDAddress = _MELDAddress;
    }

    /// 构造单选题.
    /// title 题干.
    /// option1.
    /// option2.
    /// option3.
    /// option4.
    /// answer.
    /// 构造的题目都将进入unready区域.
    /// 当审批团完成审批后. 才会进入 ready 区域给到用户答题.
    function safeMintOnlyChoice(
        string memory _title,
        string memory _option1,
        string memory _option2,
        string memory _option3,
        string memory _option4,
        uint8 answerIndex,
        address to
    ) public onlyRole(MINTER_ROLE) {
        // 生成自增id
        uint256 qid = _tokenIdCounter.current();
        QuestionOnlyChoice memory _question = QuestionOnlyChoice({
            qid: qid,
            title: _title,
            option1: _option1,
            option2: _option2,
            option3: _option3,
            option4: _option4
        });

        // 存储题目答案.
        questionOnlyChoiceAnswerMapping[qid][answerIndex] = true;

        // 存储所有题目.
        allQuestionOnlyChoices[qid] = _question;

        // 初使创建的题目.
        // 归并到未审核题库.
        // TODO 待讨论.
        // unReadyQuestionOnlyChoiceIds.push(qid);

        readyQuestionOnlyChoiceIds.push(qid);

        _safeMint(to, qid);

        _tokenIdCounter.increment();
    }

    // 审核题目
    // 通过的题目将进入正常的题目池以便用户答题
    // TODO 未来可能有的功能
    // 前期总部提供所有内容所以不需要
    function audit() public onlyRole(AUDIT_ROLE) {
        // TODO
    }

    // 普通的显示
    function detail() public view {

    }

    function safeMint(address to) public onlyRole(MINTER_ROLE) {
        _safeMint(to, _tokenIdCounter.current());
        _tokenIdCounter.increment();
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyRole(UPGRADER_ROLE)
        override
    {}

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Upgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}