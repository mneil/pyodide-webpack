function setup(fs) {
  const root = "/home/pyodide";
  fs.mkdir(`${root}/steps`);
  console.log("made dir");
  fs.writeFile(
    `${root}/tutorial.feature`,
    `\
Feature: showing off behave

Scenario: run a simple test
    Given we have behave installed
    When we implement a test
    Then behave will test it for us!`
  );
  fs.writeFile(
    `${root}/steps/tutorial.py`,
    `\
from behave import *

@given('we have behave installed')
def step_impl(context):
    pass

@when('we implement a test')
def step_impl(context):
    assert True is not False

@then('behave will test it for us!')
def step_impl(context):
    assert context.failed is False`
  );
}

module.exports = {
  setup,
};
