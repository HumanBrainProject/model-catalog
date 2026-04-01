describe("The model validation result and figures tabs", () => {
    beforeEach(function () {
        if (!Cypress.env("hasValidToken")) {
            this.skip();
        }
        // Migliore_et_al_2011_Schizophr
        cy.visit("/#model_id.3ff4367a-ea8f-402c-b75f-5bdeed876940");
    });

    it('Shows a summary of the validation results in the "Results" tab', () => {
        cy.get("h4", { timeout: 10000 }).should("contain", "CA1 hypofunction in schizophrenia");
        cy.get(".MuiTabs-flexContainer").children().contains("Validations").click();
        cy.get(".MuiTabs-flexContainer").children().contains("Results").click();

        cy.get("table th", { timeout: 30000 }).contains("Validation Test");
        cy.get("td").contains("hippo_somafeat_CA1_pyr_patch");

        cy.get("td").contains("3.33").click();
        cy.url().should(
            "equal",
            Cypress.config().baseUrl +
                "/#result_id.c0f5decd-0d3b-4e82-a725-78d0e076d7c2"
        );
    });

    it('Shows graphs comparing validation results in the "Figures" tab', () => {
        cy.get("h4", { timeout: 30000 }).should("contain", "CA1 hypofunction in schizophrenia");
        cy.get(".MuiTabs-flexContainer").children().contains("Validations").click();
        cy.get(".MuiTabs-flexContainer").children().contains("Figures").click();

        cy.get(".svg-container > svg", { timeout: 30000 });
        cy.get("td p").contains("Observation Data Type");
    });
});

describe("The validation test result and figures tabs", () => {
    beforeEach(function () {
        if (!Cypress.env("hasValidToken")) {
            this.skip();
        }
        // Hippocampus_SomaticFeaturesTest_CA1_pyr_cACpyr
        cy.visit("/#test_id.100abccb-6d30-4c1e-a960-bc0489e0d82d");
    });

    it('Shows a summary of the validation results in the "Results" tab', () => {
        cy.get("h4", { timeout: 10000 }).should(
            "contain",
            "Hippocampus_SomaticFeaturesTest_CA1_pyr_cACpyr"
        );
        cy.get(".MuiTabs-flexContainer").children().contains("Validations").click();
        cy.get(".MuiTabs-flexContainer").children().contains("Results").click();

        cy.get("table th", { timeout: 90000 }).contains("Model Name");
    });
});
