@Sacfc5c28
Feature: Compatibility local only
  # to run test with local middleware use "default" as version variable and clone anytype-heart to cmd folder

  @compatibility @Te360e532 @local
  Scenario Outline: 3 versions compatibility local only
    Given the server <version1> 1 is running
    And the metrics parameters are set
    And the user is using client 1
    And the user creates a new account on "local only"
    And the user creates an object 1 in the account
    And the server 1 is stopped
    And the server <version2> 2 is running
    And the metrics parameters are set
    And the user is using client 2
    When the user logs in to their account on "local only"
    Then the user can open the object 1
    And the server 2 is stopped

    Examples:
      | version1 | version2 |
