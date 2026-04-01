describe("The test detail and edit views", () => {
    beforeEach(function () {
        if (!Cypress.env("hasValidToken")) {
            this.skip();
        }
        // Hippocampus_SomaticFeaturesTest_CA1_pyr_cACpyr
        cy.visit("/#test_id.100abccb-6d30-4c1e-a960-bc0489e0d82d");
    });

    it("Shows relevant metadata", () => {
        cy.get("h4", { timeout: 10000 }).should(
            "contain",
            "Hippocampus_SomaticFeaturesTest_CA1_pyr_cACpyr"
        );
        cy.get("h5").should("contain", "Sara Saray");
        cy.get("ul").should("contain", "Recording modality");
        cy.get("ul").should("contain", "electrophysiology");
    });
});
