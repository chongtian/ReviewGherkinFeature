# Review Gherkin Feature

This is the README for the extension "Review Gherkin Feature".  

## Features

This extension reviews Gherkin feature file following P2 Land team's feature file guideline. It is based on [Gherkin Parser](https://github.com/cucumber/gherkin-javascript). It verifies:

1. The feature file should not have any fatal error, including:
   * Count of cells should be consistent within a Gherkin table
   * Each Gherkin line should begin with a Gherkin keyword, unless this line is part of the Feature section.
   * Should not have multiple Feature sections
   * Should not have multiple Background sections
   * Scenario should not have Examples section
2. The feature file should follow some good practices, including:
   * Scenario Outline should have Examples section
   * Scenario should not use variables(parameters) 
   * Scenario Outline should not have undefined variables
   * Should use And if the scenario has multiple Given, When, or Then steps
3. The feature file should follow extra customized guidelines
   * Scenario should refer to a VSTS Test Case
   * Scenario should refer to at least one User Story or Bug
   * Duplicate test case id is not allowed

If your feature file has errors of the first type, you must fix your feature file before check-in. Otherwise the sync tool and the Automation test cannot handle your feature file.

If your feature file has errors of the third type, you should consider fixing it. Otherwise the sync tool will not pick up your scenario(s).

## Install
This extension is not published to VS Code Marketplace. Thus, please install from local vsix file.

## How to use the extension
![](https://raw.githubusercontent.com/chongtian/ReviewGherkinFeature/master/img/HowToUse.gif)
After you complete your feature file, press F1 to show Command Palette, and type and execute **Review Feature**. The extension will review the feature file.
> Tip: To open Command Palette, press F1 or Ctrl+Shift+P
>
- If the feature file passes the review, you will see an information message *Feature file is good*.
- If the feature file has issues, you will see an warning message *Feature file has issues. Please check output for details*, or an error message in case fatal error occurred. In this case, please open Output and select **Review Gherkin Feature** from the drop down on the Output. You will then see the details of the issues.

> Tip: To open Output, press Ctrl+Shift+U

## Source codes
[GitHub](https://github.com/chongtian/ReviewGherkinFeature)


