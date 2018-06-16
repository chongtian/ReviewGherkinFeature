# P2 Land Review Feature README

This is the README for the extension "P2 Land Review Feature". 

## Features

This extension reviews Gherkin feature file following P2 Land team's feature file guideline. It verifies:
- In a Gherkin table, all table rows should have the same number of columns.
- Each Gherkin line should begin with a Gherkin keyword, unless this line is part of the Feature section.
- Each Gherkin scenario should refer to a VSTS Test Case.
- Each Gherkin scenario should refer to at least one User Story or Bug.

## How to use the extension

After you complet your feature file, press F1 to show Command Palette, and type and execute <b>Review Feature</b>. The extension will review the feature file.
> Tip: To open Command Palette, press F1 or Ctrl+Shift+P
>
If the feature file passes the review, you will see an information message "Feature file is good".<br>
If the feature file has issues, you will see an information message "Feature file has issues. Please check output for details". In this case, please open Output and select <b>P2 Land Review Feature</b> from the drop down on the Output. You will then see the details of the issues.

> Tip: To open Output, press Ctrl+Shift+U


## Known Issues


## Release Notes


