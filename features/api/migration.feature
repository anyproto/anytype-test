# Feature: Compatibility and Migration Scenarios
#   @migration
#   Scenario: New account creation on Release 7
#     Given the server "default" 1 is running
#     And the user is using client 1
#     When the user creates a new account on "staging"
#     Then the account should have an analyticsId, profile picture and name
#     And the server 1 is stopped
#   @migration
#   Scenario: Opening Release 7 version on Release 6
#     Given the server "default" 1 is running
#     And the user is using client 1
#     And the user creates a new account on "staging"
#     And the server 1 is stopped
#     And the server "v0.35.7" 2 is running
#     And the user is using client 2
#     When the user logs in to their account on "staging"
#     Then the ProfileObject should be empty
#     And the server 2 is stopped
