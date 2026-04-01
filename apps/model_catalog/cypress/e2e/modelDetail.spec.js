describe("The model detail and edit views", () => {
    beforeEach(function () {
        if (!Cypress.env("hasValidToken")) {
            this.skip();
        }
        // Potjans & Diesmann, 2014
        cy.visit("/#model_id.95866c59-26d2-4d84-b1aa-95e1f9cf53bd");
    });

    it("Shows relevant metadata", () => {
        cy.get("h4", { timeout: 10000 }).should(
            "contain",
            "Potjans & Diesmann, 2014 - microcircuit model of early sensory cortex"
        );
        cy.get("h5").should("contain", "Markus Diesmann");
        cy.get("ul").should("contain", "Model scope");
        cy.get("ul").should("contain", "network: microcircuit");
    });

    it("Has version information", () => {
        cy.contains("Version:", { timeout: 10000 }).scrollIntoView().should("be.visible");
    });

    // Skipped: this model instance currently has no alternatives (KG Search links)
    it.skip("Links to KG Search", () => {
        // link to KG Search
        cy.get(".MuiGrid-item img.MuiAvatar-img").click();
    });
});
