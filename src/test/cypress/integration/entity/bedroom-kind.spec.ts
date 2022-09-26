import { entityItemSelector } from '../../support/commands';
import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('BedroomKind e2e test', () => {
  const bedroomKindPageUrl = '/bedroom-kind';
  const bedroomKindPageUrlPattern = new RegExp('/bedroom-kind(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'admin';
  const password = Cypress.env('E2E_PASSWORD') ?? 'admin';

  before(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });
    cy.visit('');
    cy.login(username, password);
    cy.get(entityItemSelector).should('exist');
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/bedroom-kinds+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/bedroom-kinds').as('postEntityRequest');
    cy.intercept('DELETE', '/api/bedroom-kinds/*').as('deleteEntityRequest');
  });

  it('should load BedroomKinds', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('bedroom-kind');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('BedroomKind').should('exist');
    cy.url().should('match', bedroomKindPageUrlPattern);
  });

  it('should load details BedroomKind page', function () {
    cy.visit(bedroomKindPageUrl);
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        this.skip();
      }
    });
    cy.get(entityDetailsButtonSelector).first().click({ force: true });
    cy.getEntityDetailsHeading('bedroomKind');
    cy.get(entityDetailsBackButtonSelector).click({ force: true });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', bedroomKindPageUrlPattern);
  });

  it('should load create BedroomKind page', () => {
    cy.visit(bedroomKindPageUrl);
    cy.wait('@entitiesRequest');
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('BedroomKind');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.get(entityCreateCancelButtonSelector).click({ force: true });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', bedroomKindPageUrlPattern);
  });

  it('should load edit BedroomKind page', function () {
    cy.visit(bedroomKindPageUrl);
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        this.skip();
      }
    });
    cy.get(entityEditButtonSelector).first().click({ force: true });
    cy.getEntityCreateUpdateHeading('BedroomKind');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.get(entityCreateCancelButtonSelector).click({ force: true });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', bedroomKindPageUrlPattern);
  });

  it('should create an instance of BedroomKind', () => {
    cy.visit(bedroomKindPageUrl);
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('BedroomKind');

    cy.get(`[data-cy="name"]`).type('withdrawal services ').should('have.value', 'withdrawal services ');

    cy.get(`[data-cy="description"]`).type('Molière').should('have.value', 'Molière');

    cy.get(entityCreateSaveButtonSelector).click({ force: true });
    cy.scrollTo('top', { ensureScrollable: false });
    cy.get(entityCreateSaveButtonSelector).should('not.exist');
    cy.wait('@postEntityRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(201);
    });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', bedroomKindPageUrlPattern);
  });

  it('should delete last instance of BedroomKind', function () {
    cy.intercept('GET', '/api/bedroom-kinds/*').as('dialogDeleteRequest');
    cy.visit(bedroomKindPageUrl);
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length > 0) {
        cy.get(entityTableSelector).should('have.lengthOf', response.body.length);
        cy.get(entityDeleteButtonSelector).last().click({ force: true });
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('bedroomKind').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', bedroomKindPageUrlPattern);
      } else {
        this.skip();
      }
    });
  });
});
