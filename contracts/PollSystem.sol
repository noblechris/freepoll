// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title PollSystem
 * @dev A decentralized polling system with time-based voting restrictions
 */
contract PollSystem {
    struct Poll {
        string title;
        string[] options;
        uint256 endTime;
        mapping(uint256 => uint256) voteCounts;
        mapping(address => bool) hasVoted;
        address creator;
        bool exists;
    }
    
    mapping(uint256 => Poll) public polls;
    uint256 public pollCount;
    
    event PollCreated(uint256 indexed pollId, string title, address indexed creator, uint256 endTime);
    event VoteCast(uint256 indexed pollId, address indexed voter, uint256 optionIndex);
    
    /**
     * @dev Creates a new poll with specified options and deadline
     * @param _title The title of the poll
     * @param _options Array of voting options
     * @param _durationInMinutes Duration of the poll in minutes
     */
    function createPoll(
        string memory _title, 
        string[] memory _options, 
        uint256 _durationInMinutes
    ) public returns (uint256) {
        require(_options.length >= 2, "Poll must have at least 2 options");
        require(_options.length <= 10, "Poll cannot have more than 10 options");
        require(_durationInMinutes > 0, "Duration must be greater than 0");
        
        uint256 pollId = pollCount++;
        Poll storage newPoll = polls[pollId];
        
        newPoll.title = _title;
        newPoll.options = _options;
        newPoll.endTime = block.timestamp + (_durationInMinutes * 1 minutes);
        newPoll.creator = msg.sender;
        newPoll.exists = true;
        
        emit PollCreated(pollId, _title, msg.sender, newPoll.endTime);
        
        return pollId;
    }
    
    /**
     * @dev Allows a user to vote on a poll
     * @param _pollId The ID of the poll
     * @param _optionIndex The index of the selected option
     */
    function vote(uint256 _pollId, uint256 _optionIndex) public {
        Poll storage poll = polls[_pollId];
        
        require(poll.exists, "Poll does not exist");
        require(block.timestamp < poll.endTime, "Poll has ended");
        require(!poll.hasVoted[msg.sender], "You have already voted");
        require(_optionIndex < poll.options.length, "Invalid option index");
        
        poll.hasVoted[msg.sender] = true;
        poll.voteCounts[_optionIndex]++;
        
        emit VoteCast(_pollId, msg.sender, _optionIndex);
    }
    
    /**
     * @dev Returns the winning option after poll ends
     * @param _pollId The ID of the poll
     */
    function getWinner(uint256 _pollId) public view returns (string memory winningOption, uint256 winningVoteCount) {
        Poll storage poll = polls[_pollId];
        
        require(poll.exists, "Poll does not exist");
        require(block.timestamp >= poll.endTime, "Poll is still active");
        
        uint256 winningIndex = 0;
        uint256 maxVotes = 0;
        
        for (uint256 i = 0; i < poll.options.length; i++) {
            if (poll.voteCounts[i] > maxVotes) {
                maxVotes = poll.voteCounts[i];
                winningIndex = i;
            }
        }
        
        return (poll.options[winningIndex], maxVotes);
    }
    
    /**
     * @dev Get poll details
     */
    function getPollDetails(uint256 _pollId) public view returns (
        string memory title,
        string[] memory options,
        uint256 endTime,
        address creator,
        bool isActive
    ) {
        Poll storage poll = polls[_pollId];
        require(poll.exists, "Poll does not exist");
        
        return (
            poll.title,
            poll.options,
            poll.endTime,
            poll.creator,
            block.timestamp < poll.endTime
        );
    }
    
    /**
     * @dev Get vote count for a specific option
     */
    function getVoteCount(uint256 _pollId, uint256 _optionIndex) public view returns (uint256) {
        Poll storage poll = polls[_pollId];
        require(poll.exists, "Poll does not exist");
        require(_optionIndex < poll.options.length, "Invalid option index");
        
        return poll.voteCounts[_optionIndex];
    }
    
    /**
     * @dev Check if an address has voted on a poll
     */
    function hasUserVoted(uint256 _pollId, address _user) public view returns (bool) {
        Poll storage poll = polls[_pollId];
        require(poll.exists, "Poll does not exist");
        
        return poll.hasVoted[_user];
    }
    
    /**
     * @dev Get all vote counts for a poll
     */
    function getAllVoteCounts(uint256 _pollId) public view returns (uint256[] memory) {
        Poll storage poll = polls[_pollId];
        require(poll.exists, "Poll does not exist");
        
        uint256[] memory counts = new uint256[](poll.options.length);
        for (uint256 i = 0; i < poll.options.length; i++) {
            counts[i] = poll.voteCounts[i];
        }
        
        return counts;
    }
}
