import { IReviewMessage } from '../IReviewMessage';

export function scenarioShouldReferToVstsTestCase(gherkinDocument: any): Array<IReviewMessage> {
    let results: Array<IReviewMessage> = [];
    let feature = gherkinDocument.feature;

    if (feature.children) {
        feature.children.forEach((scenario: any) => {

            if (scenario.type === 'ScenarioOutline' || scenario.type === 'Scenario') {
                let title = scenario.name;
                let regex_testcase = /^\s*TC\d{5,}\s*-/;
                if (!regex_testcase.test(title)) {
                    results.push({
                        line: scenario.location.line,
                        type: 1,
                        message: `Scenario is not referred to VSTS Test Case.`
                    });
                }
            }

        });
    }
    return results;
}