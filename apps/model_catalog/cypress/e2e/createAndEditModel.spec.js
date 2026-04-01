/*


*/

function configureApp() {
    // wait for /vocab call to complete
    cy.wait(5000);
    // click on the cog to open config dialog
    cy.get('button[title="Change Configuration"]').click();
    // select "Only Models"
    cy.get("label").contains("Only Models").click();
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
}

function addModelEntry() {
    const now = Date.now();
    const modelData = {
        name: `[-TEST-] Model created by Cypress script @ ${now}`,
        authors: "Bilbo Baggins; Thorin Oakenshield",
        owners: "Thorin Oakenshield",
        alias: `test-${now}`,
        project_id: "myspace-testing",
        description: "The description goes here{enter}",
        species: "Callithrix jacchus",
        brain_region: "stratum pyramidale",
        cell_type: "interneuron",
        model_scope: "network",
        abstraction_level: "spiking neurons",
        instance: {
            version: "0.1.2",
            source: "https://example.com/path/to/my/code",
            license: "Apache License 2.0",
            code_format: "text/x-python",
        },
    };
    // open Add New Model dialog and enter information
    cy.get('button[title="Add New Model"]').click();
    cy.get("input[name=name]").type(modelData.name);
    cy.get("[name=authors]").type(modelData.authors);
    cy.get("[name=owners]").type(modelData.owners);
    cy.get("input[name=alias]").type(modelData.alias);
    cy.get("#select-Collab").type(modelData.project_id);
    cy.get('li[role="option"]').contains(modelData.project_id).click();
    cy.get("textarea[name=description]").type(modelData.description);
    cy.get("#select-species").type(modelData.species);
    cy.get('li[role="option"]').contains(modelData.species).click();
    cy.get("#select-brain_region").type(modelData.brain_region);
    cy.get('li[role="option"]').contains(modelData.brain_region).click();
    cy.get("#select-cell_type").type(modelData.cell_type);
    cy.get('li[role="option"]').contains(modelData.cell_type).click();
    cy.get("#select-model_scope").type(modelData.model_scope);
    cy.get('li[role="option"]').contains(modelData.model_scope).click();
    cy.get("#select-abstraction_level").type(modelData.abstraction_level);
    cy.get('li[role="option"]').contains(modelData.abstraction_level).click();

    cy.get("input[name=version]").type(modelData.instance.version);
    cy.get("input[name=source]").type(modelData.instance.source);
    cy.get("#select-license").type(modelData.instance.license);
    cy.get('li[role="option"]').contains(modelData.instance.license).click();
    cy.get("#select-code_format").type(modelData.instance.code_format);
    cy.get('li[role="option"]').contains(modelData.instance.code_format).click();
    // click the submit button
    cy.get("button").contains("Add Model").click();
    return modelData;
}

describe("Adding a model to the catalog", () => {
    beforeEach(function () {
        if (!Cypress.env("hasValidToken")) {
            this.skip();
        }
        cy.visit("/");
        configureApp();
    });

    it("Provides a button to add a new model", () => {
        // open Add New Model dialog and enter information
        const modelData = addModelEntry();
        // should now be on model detail page
        cy.get("h4", { timeout: 30000 }).should("contain", modelData.name);
        cy.get("h5").should("contain", modelData.owners);
        cy.get("ul").should("contain", "Model scope");
        cy.get("ul").should("contain", modelData.model_scope);
        cy.contains("Version:").should("exist");
        // now close model detail page and check if model is in list
        cy.get("button[aria-label=close]").click();
        cy.get("td").contains(modelData.name);
    });
});

describe("Editing a model", () => {
    let modelData = {};

    beforeEach(function () {
        if (!Cypress.env("hasValidToken")) {
            this.skip();
        }
        cy.visit("/");
        configureApp();
        cy.wait(8000); // wait for snackbar message to go away
        modelData = addModelEntry();
        // wait for model detail page to appear, then close it
        cy.get("h4", { timeout: 30000 }).should("contain", modelData.name);
        cy.get("button[aria-label=close]").click();
    });

    // Skipped: API returns 500 when adding a model instance - server-side bug to investigate
    it.skip("Allows a user to edit a model they have permissions for", () => {
        cy.get("td").contains(modelData.name).click();
        // click Edit button
        cy.get('[aria-label="edit model"]').click();
        cy.get("h2").contains("Edit an existing model in the catalog");
        // change model scope
        cy.get("#select-model_scope").clear().type("network: microcircuit");
        cy.get('li[role="option"]').contains("network: microcircuit").click();
        // save changes
        cy.wait(6000); // wait for snackbar message to go away
        cy.get("button").contains("Save changes").click();
        cy.wait(10000);
        // check changes have been applied
        cy.get("ul").should("contain", "Model scope");
        cy.get("ul").should("contain", "network: microcircuit");

        // now add a version
        const newVersion = {
            version: "0.2.0",
            source: "https://example.com/path/to/my/code/v2",
            license: "Apache License 2.0",
            code_format: "text/x-python",
        };
        cy.get("button").contains("Add new version").click();
        cy.wait(6000);
        cy.get("input[name=version]").type(newVersion.version);
        cy.get("input[name=source]").type(newVersion.source);
        cy.get("#select-license").type(newVersion.license);
        cy.get('li[role="option"]').contains(newVersion.license).click();
        cy.get("#select-code_format").type(newVersion.code_format);
        cy.get('li[role="option"]').contains(newVersion.code_format).click();
        // click the submit button
        cy.get("button").contains("Add Model Version").click();
        cy.contains("0.2.0", { timeout: 30000 });

        // edit the version we just added
        cy.get('button[aria-label="edit model instance"]').last().click();
        cy.get("input[name=source]")
            .clear()
            .type("https://example.com/path/to/my/code/v2.0");
        cy.get("button").contains("Save changes").click();
        cy.wait(60000); // why does this take so long?
        cy.get(".MuiBox-root").contains(
            "https://example.com/path/to/my/code/v2.0"
        );
    });
});
