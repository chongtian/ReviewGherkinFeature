import * as vscode from 'vscode';

function VerifyMultipleFeatureSections(text: string, channel: vscode.OutputChannel): boolean {
    let regex = /^feature\W/gim;
    let matches = text.match(regex);
    if (matches == null) {
        channel.appendLine('Warning: No Feature section is found.');
        return false;
    } else if (matches.length > 1) {
        channel.appendLine('Error: Multiple Feature sections are found.');
        return false;
    }
    return true;
}
function VerifyReferenceToVstsWorkItems(text: string, channel: vscode.OutputChannel): boolean {

    let nonissue = true;

    let regex_scenario = /^\s*Scenario.*$/igm;
    let regex_workitem = /^\s*Scenario.*$\s*#\s*(Stories:|Bugs:)\s*\d*/igm;
    let regex_testcase = /^\s*(scenario outline\W|scenario\W)\s*TC\d{5,}\s*-/igm;

    let matches_scenario = text.match(regex_scenario);
    let matches_workitem = text.match(regex_workitem);
    let matches_testcase = text.match(regex_testcase);

    let count_scenarios = matches_scenario == null ? 0 : matches_scenario.length;
    let count_workitem = matches_workitem == null ? 0 : matches_workitem.length;
    let count_testcase = matches_testcase == null ? 0 : matches_testcase.length;

    if (count_scenarios > count_workitem) {
        channel.appendLine('Warning: Found Scenario(s) which is not referred to User Story or Bug.');
        nonissue = false;
    }

    if (count_scenarios > count_testcase) {
        channel.appendLine('Warning: Found Scenario(s) which is not referred to Test Case.');
        nonissue = false;
    }
    return nonissue;
}
function VerifyLines(text: string, channel: vscode.OutputChannel): boolean {
    let nonissue = true;

    let regex_keywords = /^\s*(background\W|scenario\W|given\s|when\s|then\s|and\s|but\s|examples:|#|@|\|)/gim;
    let isFeatureSection = true;

    let prevCountOfCol = 0;
    let curCountOfCol = 0;

    text
        .split(/\r?\n/g)
        .map((line, i, textArr) => {

            // each Gherkin line should begin with a Gherkin keyword,
            // unless the line is in the Feature section
            if (!isFeatureSection) {
                if (line.match(regex_keywords) == null && line.match(/^\s*$/) == null) {
                    channel.appendLine(`Error: Line ${i + 1}, line does not begin with Gherkin keyword: ${line}`);
                    nonissue = false;
                }
            } else {
                let reg = /^\s*(scenario|background)/gim;
                if (line.match(reg) != null) {
                    isFeatureSection = false;
                }
            }
            //

            // Each table row should have the same number of column
            if (line.match(/^\s*\|/) != null) {
                // This line is a part of a Gherkin table

                curCountOfCol = line.split(/\s*\|\s*/).length;

                if (prevCountOfCol == 0) {
                    prevCountOfCol = curCountOfCol;
                }

                if (prevCountOfCol != curCountOfCol) {
                    channel.appendLine(`Error: Line ${i + 1}, Table is invalid. Count of Column on previous row: ${prevCountOfCol} and Count of Column on current row: ${curCountOfCol}.`);
                    nonissue = false;
                }
                prevCountOfCol = curCountOfCol;
            } else if (line.match(/^\s*$/) == null) {
                //This line is not blank, which means the table reaches the last row
                prevCountOfCol=0;
                curCountOfCol=0
            }

        });

    return nonissue;
}
function validate(text: string, channel: vscode.OutputChannel): boolean {

    let nonissue = true;

    nonissue = VerifyMultipleFeatureSections(text, channel) && nonissue;
    nonissue = VerifyReferenceToVstsWorkItems(text, channel) && nonissue;
    nonissue = VerifyLines(text, channel) && nonissue;

    return nonissue;
}
export function review(doc: vscode.TextDocument, channel: vscode.OutputChannel): string {

    let retText: string;

    // Only update status if an Feature file
    if (doc.languageId !== "feature") {
        return 'This is not a .feature file';
    }

    channel.appendLine('');
    channel.appendLine(`Start review ${doc.fileName}.`);

    let nonissue = validate(doc.getText(), channel);

    if (nonissue) {
        channel.appendLine('No issue was found.');
        retText = 'Feature file is good.';
    } else {
        retText = 'Feature file has issues. Please check output for details.';
    }

    channel.appendLine(`End review ${doc.fileName}.`);

    return retText;
}