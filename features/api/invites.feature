@invite @S0cea2fd6 @smoke
Feature: Invites

  Background:
    Given the server "v0.38.8" 1 is running
    And the user 1 is using client 1
    And the user creates a new account on "staging"
    And the account is synced within 60 seconds

  @T542b35d4
  Scenario: Make space shareable and generate an invite link
    When the user makes his first space shareable
    Then the user can generate an invite link
    And the account is deleted
    And the server 1 is stopped

  @T2d184d47
  Scenario: Revoking an invite link
    Given the user has shared his space and generated an invite link
    When the user revokes the invite link
    Then the invite link should be invalid
    And the account is deleted
    And the server 1 is stopped

  @Td4806591
  Scenario: User cancels their join request
    Given the user creates an object 1 in the account
    And the user can open the object 1
    And the user has shared his space and generated an invite link
    And the account is synced within 60 seconds
    And the server "v0.38.8" 2 is running
    And the user 2 is using client 2
    And the user creates a new account on "staging"
    And the user sends requests to join the space
    And the user cancels their join request
    And the user 1 is using client 1
    Then there is no request pending for joining the space
    And both accounts are deleted
    And both servers are stopped

  @T131f1ad1
  Scenario: User deletes the space and rejoins later
    Given the user creates an object 1 in the account
    And the user can open the object 1
    And the user has shared his space and generated an invite link
    And the account is synced within 60 seconds
    And the server "v0.38.8" 2 is running
    And the user 2 is using client 2
    And the user creates a new account on "staging"
    And the user sends requests to join the space
    When the user 1 approves the join request of user 2 with "Viewer" rights
    And the user 2 is using client 2
    And the user 2 leaves the shared space
    And the user sends requests to join the space
    Then the request is automatically approved as "Viewer" again
    And both accounts are deleted
    And both servers are stopped

  @T04ece8d3
  Scenario: Owner approves a join request with Viewer permissions
    Given the user creates an object 1 in the account
    And the user can open the object 1
    And the user has shared his space and generated an invite link
    And the account is synced within 60 seconds
    And the server "v0.38.8" 2 is running
    And the user 2 is using client 2
    And the user creates a new account on "staging"
    And the user sends requests to join the space
    When the user 1 approves the join request of user 2 with "Viewer" rights
    And the user 2 is using client 2
    Then the user can open the object 1
    And the user can't rename the object 1
    And both accounts are deleted
    And both servers are stopped

  @Tb83f3025
  Scenario: Owner changes the rights of a user from Viewer to Editor
    Given the user creates an object 1 in the account
    And the user can open the object 1
    And the user has shared his space and generated an invite link
    And the account is synced within 60 seconds
    And the server "v0.38.8" 2 is running
    And the user 2 is using client 2
    And the user creates a new account on "staging"
    And the user sends requests to join the space
    When the user 1 approves the join request of user 2 with "Viewer" rights
    And the user 1 changes the rights of user 2 from "Viewer" to "Editor"
    And the user 2 is using client 2
    Then the user can open the object 1
    And the user can rename the object 1
    And both accounts are deleted
    And both servers are stopped

  @T25be283b
  Scenario: Owner approves a join request with Editor permissions
    Given the user creates an object 1 in the account
    And the user can open the object 1
    And the user has shared his space and generated an invite link
    And the account is synced within 60 seconds
    And the server "v0.38.8" 2 is running
    And the user 2 is using client 2
    And the user creates a new account on "staging"
    And the user sends requests to join the space
    When the user 1 approves the join request of user 2 with "Editor" rights
    And the user 2 is using client 2
    Then the user can open the object 1
    And the user can rename the object 1
    And both accounts are deleted
    And both servers are stopped

  @Tfc45a1ca
  Scenario: Owner declines a join request
    Given the user creates an object 1 in the account
    And the user can open the object 1
    And the user has shared his space and generated an invite link
    And the account is synced within 60 seconds
    And the server "v0.38.8" 2 is running
    And the user 2 is using client 2
    And the user creates a new account on "staging"
    And the user sends requests to join the space
    When the user 1 declines the join request of user 2
    And the user 2 is using client 2
    Then the user can't open the object 1
    And both accounts are deleted
    And both servers are stopped

  @T37ee5567
  Scenario: Owner removes a participant from the space
    Given the user creates an object 1 in the account
    And the user can open the object 1
    And the user has shared his space and generated an invite link
    And the account is synced within 60 seconds
    And the server "v0.38.8" 2 is running
    And the user 2 is using client 2
    And the user creates a new account on "staging"
    And the user sends requests to join the space
    When the user 1 approves the join request of user 2 with "Editor" rights
    When the user 1 removes the user 2 from the space
    And the user 2 is using client 2
    Then the user can't open the object 1
    And both accounts are deleted
    And both servers are stopped

  @Td75a5aab
  Scenario: Owner deletes a space
    Given the user creates an object 1 in the account
    And the user can open the object 1
    And the user has shared his space and generated an invite link
    And the account is synced within 60 seconds
    And the server "v0.38.8" 2 is running
    And the user 2 is using client 2
    And the user creates a new account on "staging"
    And the user sends requests to join the space
    When the user 1 approves the join request of user 2 with "Editor" rights
    And the user 1 deletes the shared space
    And the user 2 is using client 2
    Then the user can't open the object 1
    And both accounts are deleted
    And both servers are stopped

  @Tea501913
  Scenario: Owner approves leave request
    Given the user creates an object 1 in the account
    And the user can open the object 1
    And the user has shared his space and generated an invite link
    And the account is synced within 60 seconds
    And the server "v0.38.8" 2 is running
    And the user 2 is using client 2
    And the user creates a new account on "staging"
    And the user sends requests to join the space
    When the user 1 approves the join request of user 2 with "Viewer" rights
    And the user 2 is using client 2
    And the user 2 leaves the shared space
    And the user 1 approves the leave request of user 2
    And both accounts are deleted
    And both servers are stopped
