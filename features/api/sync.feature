@sync @smoke
Feature: Syncing

  Scenario: 3 versions compatibility with sync on staging nodes
    Given the server "default" 1 is running
    And the user is using client 1
    And the user creates a new account on "staging"
    And the user creates an object 1 in the account
    And the user can open the object 1
    And the account is synced within 80 seconds
    And the server 1 is stopped
    And data is deleted
    And the server "default" 2 is running
    And the user is using client 2
    When the user logs in to their account on "staging"
    Then the account should have an analyticsId, profile picture and name
    Then the user can open the object 1
    And the account is deleted
    And the server 2 is stopped
