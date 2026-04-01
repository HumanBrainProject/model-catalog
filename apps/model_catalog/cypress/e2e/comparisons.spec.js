describe("Comparing models starting from the homepage", () => {
    beforeEach(function () {
        if (!Cypress.env("hasValidToken")) {
            this.skip();
        }
        cy.visit("/");

        // wait for /vocab call to complete
        cy.wait(5000);
        // click on the cog to open config dialog
        cy.get('button[title="Change Configuration"]').click();
        // select "Only Models"
        cy.get("label").contains("Only Models").click();
        // Choose options
        cy.get("#select-species").click();
        cy.get('[data-value="Rattus norvegicus"]').click();
        cy.get("body").click(200, 0);
        cy.get('[role="listbox"]').should("not.exist");
        cy.get("#select-brain_region").click();
        cy.get('[data-value="CA1 field of hippocampus"]').scrollIntoView().click();
        cy.get("body").click(200, 0);
        cy.get('[role="listbox"]').should("not.exist");
        cy.get("#select-cell_type").click();
        cy.get('[data-value="pyramidal cell"]').scrollIntoView().click();
        cy.get("body").click(200, 0);
        cy.get('[role="listbox"]').should("not.exist");
        cy.get("#select-model_scope").click();
        cy.get('[data-value="single cell"]').scrollIntoView().click();
        cy.get("body").click(200, 0);
        // click "OK" to apply the filters
        cy.get("button span").contains("Ok").click();
        cy.wait(10000);
    });

    it("should allow us to choose the models to compare using Compare All", () => {
        cy.get("[data-testid=Search-iconButton]").click();
        cy.get("input[type=text]").type("mpg14");
        cy.get("td")
            .contains("CA1_pyr_cACpyr_mpg141017_a1-2_idC_20170918151638")
            .siblings()
            .first()
            .click();
        cy.get("td")
            .contains("CA1_pyr_cACpyr_mpg141017_a1-2_idC_20190328143405")
            .siblings()
            .first()
            .click();
        cy.get("td")
            .contains("CA1_pyr_cACpyr_mpg141216_A_idA_20190305133333")
            .siblings()
            .first()
            .click();
        cy.get('[title="Add to Compare"]').click();
        cy.wait(8000);
        cy.get('[aria-label="Compare results"]').click();

        cy.get("h4").should("contain", "Compare Validation Results");
        cy.get("h6").contains("3 models, 3 model instances");
        cy.get("button").contains("Compare All").scrollIntoView().click();
        // check that a results table appears
        cy.get("table", { timeout: 30000 }).should("exist");
    });

    it("should allow us to remove unwanted versions before using Compare Models", () => {
        cy.get("[data-testid=Search-iconButton]").click();
        cy.get("input[type=text]").type("mpg14");
        cy.get("td")
            .contains("CA1_pyr_cACpyr_mpg141209_A_idA_20190328144646")
            .siblings()
            .first()
            .click();
        cy.get("td")
            .contains("CA1_pyr_cACpyr_mpg141208_B_idA_20190328144006")
            .siblings()
            .first()
            .click();
        cy.get('[title="Add to Compare"]').click();
        cy.wait(6000);
        cy.get('[aria-label="Compare results"]').click();

        cy.get("h4").should("contain", "Compare Validation Results");
        cy.get("h6").contains("2 models, 2 model instances");
        cy.get("button").contains("Compare Models").scrollIntoView().click();
        // check that a results table appears
        cy.get("table", { timeout: 30000 }).should("exist");
    });

    it("should tell us if no results are found", () => {
        cy.get("[data-testid=Search-iconButton]").click();
        cy.get("input[type=text]").type("mpg14");
        cy.get("td")
            .contains("CA1_pyr_cACpyr_mpg141209_A_idA_20190328144646")
            .siblings()
            .first()
            .click();
        cy.get("td")
            .contains("CA1_pyr_cACpyr_mpg141208_B_idA_20190328144006")
            .siblings()
            .first()
            .click();
        cy.get('[title="Add to Compare"]').click();
        cy.wait(6000);
        cy.get('[aria-label="Compare results"]').click();

        cy.get("h4").should("contain", "Compare Validation Results");
        cy.get("h6").contains("2 models, 2 model instances");

        cy.get("button").contains("Compare Models").scrollIntoView().click();
        cy.wait(20000);
        cy.get(".MuiTypography-root").contains(
            "There are no validation results matching the specified criteria!"
        );
    });
});
