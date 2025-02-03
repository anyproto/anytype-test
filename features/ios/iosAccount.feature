@Sc466b93d
Feature: Setting up a vault and creating a new space

  Background:
    Given "User A" is on the first screen of ios app
    And "User A" sets network to "staging"

  @smoke @T92190e1c
  Scenario: Setting up a new account on iPhone app
    Given "User A" chooses to create a new vault
    When "User A" should see his recovery key and copy it
    And "User A" enters his name
    Then "User A" can enter his vault
    And "User A" sees "My First Space" in his spaces list

  @smoke @Tefdf15a4
  Scenario: Creating a new space
    Given "User A" creates a new vault
    And "User A" sees "My First Space" in his spaces list
    When "User A" creates a new space named "Workspace"
    Then "User A" is in "Workspace" space
    And "User A" can tap navigate back button
    And "User A" sees "Workspace" and "My First Space" in his spaces list

  @smoke @T15e51ca8
  Scenario: Delete an account
    Given "User A" creates a new vault
    And "User A" sees "My First Space" in his spaces list
    When "User A" navigates to the vault settings screen
    And "User A" selects "Vault and Access" from vault settings menu
    And "User A" chooses to delete her vault and confirm
    And "User A" chooses to logout and and clear data
    Then "User A" is on the first screen of ios app
