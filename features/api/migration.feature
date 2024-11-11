Feature: Compatibility and Migration Scenarios

  @migration
  Scenario: Release 6 to Release 7 migration from Nodes
    Given the server "v0.35.7" 1 is running
    And the user is using client 1
    And the user creates a new account on "staging"
    And the account is synced
    And the server 1 is stopped
    And data is deleted
    And the server "v0.36.4" 2 is running
    And the user is using client 2
    When the user logs in to their account on "staging"
    And the server 2 is stopped

  @migration
  Scenario: Release 6 to Release 7 migration local only
    Given the server "v0.35.7" 1 is running
    And the user is using client 1
    And the user creates a new account on "local only"
    And the server 1 is stopped
    And the server "v0.36.4" 2 is running
    And the user is using client 2
    When the user logs in to their account on "local only"
    And the server 2 is stopped

  @migration
  Scenario: New account creation on Release 7
    Given the server "default" 1 is running
    And the user is using client 1
    When the user creates a new account on "staging"
    Then the account should have an analyticsId, profile picture and name
    And the server 1 is stopped

  @migration
  Scenario: Opening Release 7 version on Release 6
    Given the server "default" 1 is running
    And the user is using client 1
    And the user creates a new account on "staging"
    And the server 1 is stopped
    And the server "v0.35.7" 2 is running
    And the user is using client 2
    When the user logs in to their account on "staging"
    Then the ProfileObject should be empty
    And the server 2 is stopped
  # Scenario: Recovering Release 7 version from nodes
  #   Given the server "v0.36.0-rc4" 1 is running
  #   And the user is using client 1
  #   And the user creates a new account
  #   And the user adds data to their account
  #   And the server 1 is stopped
  #   When the local database is cleared
  #   And the server "v0.36.0-rc4" 2 is running
  #   And the user is using client 2
  #   And the user recovers their account from nodes
  #   Then the recovery should complete without errors
  #   And all the user's data should be present as before
  #   And the server 2 is stopped
  # Scenario: Migrating from middleware without tech space to Release 7
  #   Given the server "v0.27.21" 1 is running on middleware without tech space
  #   And the user is using client 1
  #   And the user creates a new account
  #   And the user adds a profile picture, name, and description
  #   And the server 1 is stopped
  #   When the server "v0.36.0-rc4" 2 is running
  #   And the user is using client 2
  #   And the user opens the app
  #   Then the app should open successfully
  #   And the user's profile should be migrated properly
  #   And the server 2 is stopped
  # Scenario: Recovering middleware account on Release 7 via peer-to-peer
  #   Given the server "v0.27.21" 1 is running on middleware without tech space
  #   And the user is using client 1
  #   And the user creates a new account
  #   And the user adds a profile picture, name, and description
  #   And the server 1 is stopped
  #   And the server "v0.36.0-rc4" 2 is running on another device
  #   When the user recovers their account on the other device using peer-to-peer
  #   Then the recovery should complete successfully
  #   And the user's profile should be migrated properly on the new device
  #   And the server 2 is stopped
