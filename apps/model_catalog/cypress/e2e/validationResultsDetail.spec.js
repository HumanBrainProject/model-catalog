describe("The model validation result detail view", () => {
    beforeEach(function () {
        if (!Cypress.env("hasValidToken")) {
            this.skip();
        }
        // Migliore_et_al_2011_Schizophr
        cy.visit("/#result_id.c0f5decd-0d3b-4e82-a725-78d0e076d7c2");
    });

    it("Shows detailed metadata about the validation result", () => {
        cy.contains("h6", "Validated Model:", { timeout: 10000 })
            .siblings()
            .contains("CA1 hypofunction in schizophrenia");
        cy.contains("h6", "Validated Model:")
            .siblings()
            .contains("3342e542-5fb1-45aa-b7be-69e94f809160");

        cy.contains("h6", "Validation Test:")
            .siblings()
            .contains("Hippocampus_CA1_BackpropagatingAPTest");
        cy.contains("h6", "Validation Test:")
            .siblings()
            .contains("4d1210a6-e674-4cb6-a9cd-981a11d31175");

        cy.get("p")
            .contains("TimeStamp")
            .parent()
            .parent()
            .children()
            .contains("Fri, 29 May 2020 11:11:45 GMT");
    });

    it("Has a list of additional files produced by the validation", () => {
        cy.contains("Result Files", { timeout: 10000 }).click();
        cy.get(".MuiAccordionSummary-root").its("length").should("equal", 15);
    });

    it("Has a tab showing details about the model and test", () => {
        cy.contains("Model/Test Info", { timeout: 10000 }).click();

        cy.get("#panel_model_test_common")
            .siblings()
            .contains("CA1 hypofunction in schizophrenia");
        cy.get("#panel_model_test_common")
            .siblings()
            .contains("Hippocampus_CA1_BackpropagatingAPTest");
        cy.get("#panel_model_test_common")
            .siblings()
            .contains("Rattus norvegicus");

        cy.get("#panel_model_test_instance_others")
            .siblings()
            .contains("Migliore_et_al_2011");
        cy.get("#panel_model_test_instance_others")
            .siblings()
            .contains("hippounit.tests.BackpropagatingAPTest");
    });
});
