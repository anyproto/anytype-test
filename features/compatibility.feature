@S134793a4
Feature: Compatibility

  @Ta4e6136d @compatibility
  Scenario Outline: 3 versions compatibility
    Given the server <version1> 1 is running
    And the metrics parameters are set
    And the user is using client 1
    And the user creates a new account
    And the user creates an object 1 in the account
    And the server 1 is stopped
    And the server <version2> 2 is running
    And the metrics parameters are set
    And the user is using client 2
    When the user logs in to their account
    Then the user can open the object 1
    And the server 2 is stopped

    Examples:
      | version1 | version2 |
      # | "default" | "default" |
