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
    cy.get('[data-value="Homo sapiens"]').click();
    // click outside the menu to close it
    cy.get("body").click(200, 0);
    // check the input contains the correct value
    cy.get("input[name=species]").should("have.value", "Homo sapiens");
    // click "OK" to apply the filters
    cy.get("button span").contains("Ok").click();
    // check there is a Chip with the correct species
    cy.get("[title=Species] span.MuiChip-label").contains("Homo sapiens");
    // wait for model data to load
    cy.get("tbody td", { timeout: 15000 }).should("exist");
}

describe("The Model Catalog Homepage", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("Shows a link the documentation if no filters are set", () => {
        cy.contains("More information").click();
        cy.url().should("equal", Cypress.config().baseUrl + "/docs");
    });

    it("Can be configured", configureApp);

    describe("The table of models", () => {
        beforeEach(configureApp);

        it("has Name and Author columns by default", () => {
            cy.get("th.MuiTableCell-head").contains("Name");
            cy.get("th.MuiTableCell-head").contains("Author");
        });

        it("can be configured to show additional columns", () => {
            cy.get('button[data-testid="View Columns-iconButton"]').click();
            cy.get("fieldset label").contains("Species").click();
            cy.get("fieldset label").contains("Brain region").click();
            cy.get("fieldset label").contains("Model scope").click();
            // click outside the menu to close it
            cy.get("body").click(200, 0);
            cy.get("th.MuiTableCell-head").contains("Name");
            cy.get("th.MuiTableCell-head").contains("Author");
            cy.get("th.MuiTableCell-head").contains("Species");
            cy.get("th.MuiTableCell-head").contains("Brain region");

            cy.get("tbody tr").each((row) => {
                // note that MUIDataTable creates two <td>s for each cell, one of which has visible: none
                // this is why we need element 6, not 3
                cy.wrap(row).children().eq(6).contains("Homo sapiens");
            });
        });
    });
});
