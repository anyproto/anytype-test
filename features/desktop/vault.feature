@S1eda0917
Feature: Vault Management

  Background:
    Given the application is running

  @e2e @T6f2dd234
  Scenario: Create an account
    When I choose to sign up
    And I select the option to create a new vault
    And I complete the onboarding process
    Then I should be inside my vault

  @e2e @T47fd10a8
  Scenario: Log out
    Given I am logged into my vault
    When I navigate to settings
    And I click the logout button
    Then I should be logged out

  @Ta84df390
  Scenario: Log in as existing user
    Given I am on the login page
    When I enter my vault key
    And I submit the login form
    Then I should be logged into my vault

  @Te884e5b6
  Scenario: Create new Personal Project space
    Given I am logged into my vault
    When I create a new Personal Project space
    Then I should see the new space created

  @T3c16da78
  Scenario: Try to log in with non-existing key
    Given I am on the login page
    When I enter an invalid vault key
    And I submit the login form
    Then I should see an error message
