'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { review } from './reviewFeature';

export function activate(context: vscode.ExtensionContext) {

    let channel = vscode.window.createOutputChannel('P2 Land Review Feature');
    let disposable_review = vscode.commands.registerCommand('extension.reviewFeature', ()=>review(channel));
    context.subscriptions.push(disposable_review);
}

// this method is called when your extension is deactivated
export function deactivate() {
}