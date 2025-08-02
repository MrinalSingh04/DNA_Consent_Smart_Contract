// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract DNAConsent {
    address public owner;

    struct Consent {
        bool accessGranted;
        address[] approvedResearchers;
        mapping(address => bool) hasAccess;
    }

    mapping(address => Consent) private userConsents;

    event AccessRequested(address indexed researcher, address indexed user);
    event AccessGranted(address indexed user, address indexed researcher);
    event AccessRevoked(address indexed user, address indexed researcher);

    constructor() {
        owner = msg.sender;
    }

    // Researcher requests access to a user's DNA data
    function requestAccess(address user) external {
        emit AccessRequested(msg.sender, user);
    }

    // User approves a researcher
    function approveResearcher(address researcher) external {
        Consent storage consent = userConsents[msg.sender];
        if (!consent.hasAccess[researcher]) {
            consent.approvedResearchers.push(researcher);
            consent.hasAccess[researcher] = true;
            emit AccessGranted(msg.sender, researcher);
        }
    }

    // User revokes a researcher's access
    function revokeResearcher(address researcher) external {
        Consent storage consent = userConsents[msg.sender];
        if (consent.hasAccess[researcher]) {
            consent.hasAccess[researcher] = false;
            emit AccessRevoked(msg.sender, researcher);
        }
    }

    // Check if researcher has access
    function hasAccess(
        address user,
        address researcher
    ) external view returns (bool) {
        return userConsents[user].hasAccess[researcher];
    }

    // Get list of approved researchers
    function getApprovedResearchers(
        address user
    ) external view returns (address[] memory) {
        return userConsents[user].approvedResearchers;
    }
}
