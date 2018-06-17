# P2 Land Review Feature README

This is the README for the extension "P2 Land Review Feature".  

## Features

This extension reviews Gherkin feature file following P2 Land team's feature file guideline. It verifies:
- In a Gherkin table, all table rows should have the same number of columns.
- Each Gherkin line should begin with a Gherkin keyword, unless this line is part of the Feature section.
- Each Gherkin scenario should refer to a VSTS Test Case.
- Each Gherkin scenario should refer to at least one User Story or Bug.

## Install
This extension is not published to VS Code Marketplace. Thus, please install from local vsix file.

## How to use the extension
![](https://raw.githubusercontent.com/chongtian/ReviewP2LandFeature/master/img/HowToUse.gif)
After you complete your feature file, press F1 to show Command Palette, and type and execute **Review Feature**. The extension will review the feature file.
> Tip: To open Command Palette, press F1 or Ctrl+Shift+P
>
- If the feature file passes the review, you will see an information message *Feature file is good*.
- If the feature file has issues, you will see an information message *Feature file has issues. Please check output for details*. In this case, please open Output and select **P2 Land Review Feature** from the drop down on the Output. You will then see the details of the issues.

> Tip: To open Output, press Ctrl+Shift+U

## Source codes
[GitHub](https://github.com/chongtian/ReviewP2LandFeature)


