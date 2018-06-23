import * as vscode from 'vscode';
import { IReviewMessage } from './IReviewMessage';
import * as rules from './rules';
import { processFatalErrors } from './processParseError';


let Gherkin = require('gherkin');

function validate(text: string, extraValidation:boolean): Array<IReviewMessage> {

    let results: Array<IReviewMessage> = [];

    let parser = new Gherkin.Parser();

    try {
        let gherkinDocument = parser.parse(text);
        results = rules.test(gherkinDocument, extraValidation);
    } catch (e) {
        if (e.errors) {
            results = processFatalErrors(e.errors);
        } else {
            results.push({ line: 0, type: 2, message: e.message });
        }
    }
    return results;
}
export function review(channel: vscode.OutputChannel) {

    let message: string;

    // Get the current text editor
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    let doc = editor.document;

    let extraValidation= <boolean> vscode.workspace.getConfiguration('reviewfeature').get('p2land');
    
    // Only update status if an Feature file
    if (doc.languageId !== "feature") {
        vscode.window.showInformationMessage('This is not a .feature file');
    }

    channel.clear();

    channel.appendLine('');
    channel.appendLine(`Start review ${doc.fileName}.`);

    let results = validate(doc.getText(), extraValidation);
    let isError = false;

    const msgTypes = ['Infomation', 'Warning', 'Error', 'Fatal Error'];
    const isErros = [false, false, true, true];

    if (results.length === 0) {
        channel.appendLine('No issue was found.');
        message = 'Feature file is good.';
        vscode.window.showInformationMessage(message);
    } else {
        results.forEach((r) => {
            let msgType: string;
            let lineNum: number = r.line;

            if (r.type < 0) {
                r.type = 0;
            }
            if (r.type > msgTypes.length) {
                r.type = msgTypes.length - 1;
            }

            isError=isErros[r.type];
            msgType=msgTypes[r.type];

            if (lineNum > 0) {
                channel.appendLine(`${msgType}: Line ${lineNum}, ${r.message}`);
            } else {
                channel.appendLine(`${msgType}: ${r.message}`);
            }
        });

        if (isError) {
            vscode.window.showErrorMessage('Feature file has errors. Please check output for details.');
        } else {
            vscode.window.showWarningMessage('Feature file has issues. Please check output for details.');
        }
    }



    channel.appendLine(`End review ${doc.fileName}.`);
}