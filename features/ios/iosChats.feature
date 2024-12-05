Feature: Chats

  Background:
    Given "User A" is on the first screen of ios app
    And "User A" sets network to "staging"
    And "User B" is on the first screen of ios app
    And "User B" sets network to "staging"

  Scenario: End-to-End flow for sending a message in chat on iOS
    Given "User A" creates a new vault
    And "User B" creates a new vault
    And "User B" goes to home screen
    And "User A" creates a new space named "Playground"
    And "User A" is in "Playground" space
    And "User A" navigates to the "Playground" space settings screen
    And "User A" selects "Share" from space settings menu
    And "User A" selects Generate Invite Link
    And "User A" sends an invitation to "User B"
    And "User B" receives and clicks the invitation link
    When "User B" sends a request to join the "Playground" space
    And "User B" sees the Request to join Confirmation popup
    And "User A" approves the join request of "User B" with "Editor" rights
    And "User B" can access "Playground" space in the Anytype app
    And "User B" sends a message "Hello World" in chat
    And "User A" sees the message "Hello World" in chat
    And "User B" sends a message "How are you?" in chat
    And "User A" sees the message "How are you?" in chat
    And "User A" sends a message "I am fine, thank you" in chat
    And "User B" sees the message "I am fine, thank you" in chat
