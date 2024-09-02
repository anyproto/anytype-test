Feature: Vault Management

  Background:
    Given the application is running

  @e2e
  Scenario: Enter my Vault
    When I choose to sign up
    And I select the option to create a new vault
    And I complete the onboarding process
    Then I should be inside my vault
#   Background:
#     Given the application is running
#   Scenario: New user creates a vault
#     Given the user is on the Log in screen
#     When the user creates a new vault and obtains a key
#     Then the user can view and copy the key
#     And the user proceeds to the next step
#     And the user sets their name to "Friedolin"
#     And the user enters the vault
#     Then the user sees a welcome banner in their space
