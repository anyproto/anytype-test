Feature: Setting up a secure personal vault and creating a workspace

  Background:
    Given I am a new user starting the Anytype iOS app

  Scenario: Setting up a new vault on iPhone app
    Given I create a new vault
    When I should see my recovery key and copy it
    And I enter my name
    Then I can enter my vault
    And I see "My First Space" in my spaces list

  Scenario: Creating a new workspace
    Given I am logged into my vault
    And I see "My First Space" in my spaces list
    When I create a new space named "Workspace"
    Then I see "Workspace" in my spaces list
    And I should be able to access its contents

  Scenario: Viewing available workspaces
    Given I have created multiple spaces
    When I view my spaces list
    Then I should see "My First Space"
    And I should see "Workspace"
    Given I am logged into my vault

  Scenario: Performing a complete logout
    When I navigate to the settings screen
    And I perform a complete logout
    Then all my local data should be cleared
    And I should return to the initial setup screen
