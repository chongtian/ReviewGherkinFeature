import * as vscode from 'vscode';

function VerifyMultipleFeatureSections(text: string, channel: vscode.OutputChannel): boolean {
    let regex = /^\s*feature\W/gim;
    let matches = text.match(regex);
    if (matches === null) {
        channel.appendLine('Warning: No Feature section is found.');
        return false;
    } else if (matches.length > 1) {
        channel.appendLine('Error: Multiple Feature sections are found.');
        return false;
    }
    return true;
}
function VerifyScenarioOutlineShouldHaveExamples(text: string, channel: vscode.OutputChannel): boolean {

    let nonissue = true;

    let regex_outline = /^\s*scenario outline.*$/gim;
    let regex_examples = /^\s*scenario outline(?:[^\n]|\n(?!\s*scenario))+examples/gim;

    let outline_index = [];
    let example_index = [];
    let scenarios = [];

    let tmpArr;
    while ((tmpArr = regex_outline.exec(text)) !== null) {
        outline_index.push(tmpArr.index);
        scenarios.push(tmpArr[0]);
    }
    while ((tmpArr = regex_examples.exec(text)) !== null) {
        example_index.push(tmpArr.index);
    }

    if (outline_index.length > example_index.length) {
        for (let i = 0; i < outline_index.length; i++) {
            if (example_index.indexOf(outline_index[i]) < 0) {
                channel.appendLine(`Error: Found Scenario Outline which has no Examples: ${scenarios[i].trim()}`);
                nonissue = false;
            }
        }
    }

    return nonissue;
}
function VerifyScenarioShouldNotHaveExamples(text: string, channel: vscode.OutputChannel): boolean {

    let nonissue = true;

    let regex_examples = /^\s*scenario:(?:[^\n]|\n(?!\s*scenario))+examples/gim;

    let examples_index = [];
    let scenarios = [];

    let tmpArr;
    while ((tmpArr = regex_examples.exec(text)) !== null) {
        examples_index.push(tmpArr.index);
        scenarios.push(tmpArr[0].trim().split(/\r?\n/g)[0]);
    }

    if (scenarios.length > 0) {
        for (let i = 0; i < scenarios.length; i++) {
            channel.appendLine(`Error: Found Scenario which has Examples: ${scenarios[i].trim()}`);
            nonissue = false;
        }
    }

    return nonissue;
}
function VerifyReferenceToVstsWorkItems(text: string, channel: vscode.OutputChannel): boolean {

    let nonissue = true;

    let regex_scenario = /^\s*Scenario.*$/igm;
    let regex_workitem = /^\s*Scenario.*$\s*#\s*(Stories:|Bugs:)\s*\d*/igm;
    let regex_testcase = /^\s*(scenario outline\W|scenario\W)\s*TC\d{5,}\s*-/igm;

    let scenario_index = [];
    let workitem_index = [];
    let testcase_index = [];
    let scenarios = [];

    let tmpArr;
    while ((tmpArr = regex_scenario.exec(text)) !== null) {
        scenario_index.push(tmpArr.index);
        scenarios.push(tmpArr[0]);
    }
    while ((tmpArr = regex_workitem.exec(text)) !== null) {
        workitem_index.push(tmpArr.index);
    }
    while ((tmpArr = regex_testcase.exec(text)) !== null) {
        testcase_index.push(tmpArr.index);
    }

    if (scenario_index.length > workitem_index.length) {
        for (let i = 0; i < scenario_index.length; i++) {
            if (workitem_index.indexOf(scenario_index[i]) < 0) {
                channel.appendLine(`Warning: Found Scenario which is not referred to User Story or Bug: ${scenarios[i].trim()}`);
                nonissue = false;
            }
            if (testcase_index.indexOf(scenario_index[i]) < 0) {
                channel.appendLine(`Warning: Found Scenario which is not referred to Test Case: ${scenarios[i].trim()}`);
                nonissue = false;
            }

        }
    }

    return nonissue;
}
function VerifyLines(text: string, channel: vscode.OutputChannel): boolean {
    let nonissue = true;

    let regex_keywords = /^\s*(background\W|scenario\W|given\s|when\s|then\s|and\s|but\s|examples:|#|@|\|)/gim;
    let regex_table = /^\s*\|/;
    let regex_blank = /^\s*$/;

    let isFeatureSection = true;
    let prevCountOfCol = 0;
    let curCountOfCol = 0;

    text
        .split(/\r?\n/g)
        .map((line, i, textArr) => {

            // each Gherkin line should begin with a Gherkin keyword,
            // unless the line is in the Feature section
            if (!isFeatureSection) {
                if (line.match(regex_keywords) === null && line.match(/^\s*$/) === null) {
                    channel.appendLine(`Error: Line ${i + 1}, line does not begin with Gherkin keyword: ${line}`);
                    nonissue = false;
                }
            } else {
                let reg = /^\s*(scenario|background)/gim;
                if (line.match(reg) !== null) {
                    isFeatureSection = false;
                }
            }
            //

            // Each table row should have the same number of column
            if (regex_table.test(line)) {
                // This line is a part of a Gherkin table

                curCountOfCol = line.split(/\s*\|\s*/).length;

                if (prevCountOfCol === 0) {
                    prevCountOfCol = curCountOfCol;
                }

                if (prevCountOfCol !== curCountOfCol) {
                    channel.appendLine(`Error: Line ${i + 1}, Table is invalid. Count of Column on previous row: ${prevCountOfCol} and Count of Column on current row: ${curCountOfCol}.`);
                    nonissue = false;
                }
                prevCountOfCol = curCountOfCol;
            } else if (!regex_blank.test(line)) {
                //This line is not blank, which means the table reaches the last row
                prevCountOfCol = 0;
                curCountOfCol = 0;
            }

        });

    return nonissue;
}
function validate(text: string, channel: vscode.OutputChannel): boolean {

    let nonissue = true;

    nonissue = VerifyMultipleFeatureSections(text, channel) && nonissue;
    nonissue = VerifyReferenceToVstsWorkItems(text, channel) && nonissue;
    nonissue = VerifyLines(text, channel) && nonissue;
    nonissue = VerifyScenarioOutlineShouldHaveExamples(text, channel) && nonissue;
    nonissue = VerifyScenarioShouldNotHaveExamples(text, channel) && nonissue;

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