@S27ebe52d
Feature: Compatibility with Sync
  # to run test with local middleware use "default" as version variable and clone anytype-heart to cmd folder

  @compatibility @T75496a29 @staging
  Scenario Outline: 3 versions compatibility with sync on staging nodes
    Given the server <version1> 1 is running
    And the user is using client 1
    And the user creates a new account on "staging"
    And the user creates an object 1 in the account
    And the user can open the object 1
    And the account is synced
    And the server 1 is stopped
    And data is deleted
    And the server <version2> 2 is running
    And the user is using client 2
    When the user logs in to their account on "staging"
    Then the account should have an analyticsId, profile picture and name
    Then the user can open the object 1
    And the account is deleted
    And the server 2 is stopped
    #
    #
    #For every intended run you need to add a row with the versions you want to test
    #It should look like this:
    # Examples:
    # | version1  | version2  |
    # | "v0.38.0" | "v0.38.1" |

    Examples:
      | version1 | version2 |
