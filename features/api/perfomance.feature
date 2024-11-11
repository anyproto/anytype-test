@perfomance
Feature: Middleware Performance Testing

  Scenario: Measure response times for AccountSelectHot
    Given the server "v0.36.0-rc4" 1 is running
    And the user is using client 1
    And the user has a large account
    When the user calls walletRecover
    And the user calls accountSelect on "fakeStaging"
    Then the account select time should be less than 25000 milliseconds
    And the server 1 is stopped

  Scenario: Measure response times for AccountSelectCold
    Given the server "v0.36.0-rc4" 1 is running
    And the user is using client 1
    And the user has a large account
    When the user calls walletRecover
    And the user calls accountSelect on "fakeStaging"
    And the user calls accountStop
    Then the user calls accountSelect on "local only"
    And the account select time should be less than 25000 milliseconds
    And the server 1 is stopped
