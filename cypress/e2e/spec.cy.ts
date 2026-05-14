describe("landing page works", () => {
  it("passes", () => {
    cy.visit("localhost:5173/");
    cy.get('[data-cy="landing-page-header"]').should("be.visible");

    cy.get('[data-cy="landing-page-start-button"]').should("be.visible").click();

    cy.url().should("contain", "/questionnaire");

    cy.get('[data-cy="questionnaire-card"]').should("be.visible");

    cy.get('[data-cy="question-page-progress-bar"]').should("not.be.visible");

    const questionButtonNo = cy.get('[data-cy="question-button-no"]').should("be.visible");
    const questionButtonYes = cy.get('[data-cy="question-button-yes"]').should("be.visible");
    cy.get('[data-cy="question-button-maybe"]').should("be.visible");

    questionButtonNo.click();

    cy.get('[data-cy="question-page-progress-bar"]').should("be.visible");

    const questionCount = 56;
    const timesClickedYes = 4;
    const timeClickedNo = questionCount - timesClickedYes;

    Cypress._.times(timesClickedYes, () => {
      questionButtonYes.click();
    });

    Cypress._.times(timeClickedNo, () => {
      questionButtonNo.click();
    });

    cy.get('[data-cy="results-page"]').should("be.visible");
    cy.get('[data-cy="results-list"]').should("be.visible").children().should("have.length", timesClickedYes);
  });
});
