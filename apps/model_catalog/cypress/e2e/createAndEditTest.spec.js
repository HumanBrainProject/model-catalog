/*

*/

function configureApp() {
    // wait for /vocab call to complete
    cy.wait(5000);
    // click on the cog to open config dialog
    cy.get('button[title="Change Configuration"]').click();
    // select "Only Tests"
    cy.get("label").contains("Only Tests").click();
    // Choose one option from the species menu
    cy.get("#select-species").click();
    cy.get('[data-value="Callithrix jacchus"]').click();
    // click outside the menu to close it
    cy.get("body").click(200, 0);
    // check the input contains the correct value
    cy.get("input[name=species]").should("have.value", "Callithrix jacchus");
    // click "OK" to apply the filters
    cy.get("button span").contains("Ok").click();
    // check there is a Chip with the correct species
    cy.get("[title=Species] span.MuiChip-label").contains("Callithrix jacchus");
    cy.wait(10000);
}

function addTestEntry() {
    const now = Date.now();
    const testData = {
        name: `[-TEST-] Validation test created by Cypress script @ ${now} for software testing purposes`,
        authors: "Bilbo Baggins; Thorin Oakenshield",
        alias: `test-${now}`,
        project_id: "myspace-testing",
        description: "The description goes here{enter}",
        data_location: ["https://example.com/my_data.csv"],
        species: "Callithrix jacchus",
        brain_region: "stratum pyramidale",
        cell_type: "interneuron",
        test_type: "network",
        score_type: "chi-squared statistic",
        recording_modality: "electrophysiology",
        instance: {
            version: "0.1.2",
            repository: "https://example.com/path/to/my/code",
            path: "path.to.TestClass",
        },
    };
    // open Add New Test dialog and enter information
    cy.get('button[title="Add New Test"]').click();
    cy.get("input[name=name]").type(testData.name);
    cy.get("[name=authors]").type(testData.authors);
    cy.get("input[name=alias]").type(testData.alias);
    cy.get("#select-Collab").type(testData.project_id);
    cy.get('li[role="option"]').contains(testData.project_id).click();
    cy.get("textarea[name=description]").type(testData.description);
    cy.get("textarea[name=data_location]").type(
        testData.data_location[0] + "{enter}"
    );
    cy.get("#select-species").clear().type(testData.species);
    cy.get('li[role="option"]').contains(testData.species).click();
    cy.get("#select-brain_region").clear().type(testData.brain_region);
    cy.get('li[role="option"]').contains(testData.brain_region).click();
    cy.get("#select-cell_type").clear().type(testData.cell_type);
    cy.get('li[role="option"]').contains(testData.cell_type).click();
    cy.get("#select-test_type").clear().type(testData.test_type);
    cy.get('li[role="option"]').contains(testData.test_type).click();
    cy.get("#select-score_type").clear().type(testData.score_type);
    cy.get('li[role="option"]').contains(testData.score_type).click();
    cy.get("#select-recording_modality").clear().type(testData.recording_modality);
    cy.get('li[role="option"]').contains(testData.recording_modality).click();
    cy.get("input[name=version]").type(testData.instance.version);
    cy.get("input[name=repository]").type(testData.instance.repository);
    cy.get("input[name=path]").type(testData.instance.path);
    // click the submit button
    cy.get("button").contains("Add Test").click();
    return testData;
}

describe("Adding a test to the catalog", () => {
    beforeEach(function () {
        if (!Cypress.env("hasValidToken")) {
            this.skip();
        }
        cy.visit("/");
        configureApp();
    });

    it("Provides a button to add a new test", () => {
        // open Add New Test dialog and enter information
        const testData = addTestEntry();
        // should now be on test detail page
        cy.get("h4", { timeout: 30000 }).should("contain", testData.name);
        cy.get("h5").should("contain", testData.authors.replace(";", ","));
        cy.get("ul").should("contain", "Test type");
        cy.get("ul").should("contain", testData.test_type);
        cy.contains("Version:").should("exist");
        // now close test detail page and check if test is in list
        cy.get("button[aria-label=close]").click();
        cy.get("td").contains(testData.name);
    });
});

describe("Editing a validation test", () => {
    let testData = {};

    beforeEach(function () {
        if (!Cypress.env("hasValidToken")) {
            this.skip();
        }
        cy.visit("/");
        configureApp();
        testData = addTestEntry();
        // wait for test detail page to appear, then close it
        cy.get("h4", { timeout: 30000 }).should("contain", testData.name);
        cy.get("button[aria-label=close]").click();
    });

    // Skipped: API returns 500 when adding a test instance - server-side bug to investigate
    it.skip("Allows a user to edit a test they have permissions for", () => {
        cy.get("td").contains(testData.name).click();
        // click Edit button
        cy.get('[aria-label="edit test"]').click();
        cy.get("h2").contains("Edit an existing test in the library");
        // save changes
        cy.wait(6000); // wait for snackbar message to go away
        cy.get("button").contains("Save changes").click();
        cy.wait(15000);

        // now add a version
        const newVersion = {
            version: "0.2.0",
            repository: "https://example.com/path/to/my/code/0.2.0",
            path: "path.to.TestClass",
        };
        cy.get("button").contains("Add new version").click();
        cy.wait(6000);
        cy.get("input[name=version]").type(newVersion.version);
        cy.get("input[name=repository]").type(newVersion.repository);
        cy.get("input[name=path]").type(newVersion.path);
        // click the submit button
        cy.get("button").contains("Add Test Version").click();
        cy.contains("0.2.0", { timeout: 30000 });

        // edit the version we just added
        cy.get('button[aria-label="edit test instance"]').last().click();
        cy.get("input[name=repository]")
            .clear()
            .type("https://example.com/path/to/my/code/0.2.0");
        cy.get("button").contains("Save changes").click();
        cy.wait(30000);
        cy.get(".MuiBox-root").contains(
            "https://example.com/path/to/my/code/0.2.0"
        );
    });
});
