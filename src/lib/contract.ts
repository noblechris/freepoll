import { ethers } from 'ethers';

// Replace this with your deployed contract address on Sepolia
export const CONTRACT_ADDRESS = "0x382aCDe3F3497FFa7a9D98c8481F9cdf7f02F69c";

export const CONTRACT_ABI = [
  "event PollCreated(uint256 indexed pollId, string title, address indexed creator, uint256 endTime)",
  "event VoteCast(uint256 indexed pollId, address indexed voter, uint256 optionIndex)",
  "function createPoll(string memory _title, string[] memory _options, uint256 _durationInMinutes) public returns (uint256)",
  "function vote(uint256 _pollId, uint256 _optionIndex) public",
  "function getWinner(uint256 _pollId) public view returns (string memory winningOption, uint256 winningVoteCount)",
  "function getPollDetails(uint256 _pollId) public view returns (string memory title, string[] memory options, uint256 endTime, address creator, bool isActive)",
  "function getVoteCount(uint256 _pollId, uint256 _optionIndex) public view returns (uint256)",
  "function hasUserVoted(uint256 _pollId, address _user) public view returns (bool)",
  "function getAllVoteCounts(uint256 _pollId) public view returns (uint256[] memory)",
  "function pollCount() public view returns (uint256)"
];

export interface PollDetails {
  title: string;
  options: string[];
  endTime: bigint;
  creator: string;
  isActive: boolean;
}

export interface PollWithId extends PollDetails {
  id: number;
  voteCounts: number[];
  hasVoted: boolean;
}

export const getProvider = () => {
  if (typeof window.ethereum !== 'undefined') {
    return new ethers.BrowserProvider(window.ethereum);
  }
  throw new Error('MetaMask not installed');
};

export const getContract = async (withSigner = false) => {
  const provider = getProvider();
  
  if (withSigner) {
    const signer = await provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  }
  
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
};
