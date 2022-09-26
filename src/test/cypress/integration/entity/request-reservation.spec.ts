import { entityItemSelector } from '../../support/commands';

import {
  entityTableSelector,
  entityConfirmDeleteButtonSelector,
  entityCreateSaveButtonSelector,
  entityDetailsBackButtonSelector,
  entityDeleteButtonSelector,
  entityEditButtonSelector,
  reservationRequestStepTwo,
} from '../../support/entity';

describe('Resservation request e2e test', () => {
  const reservationPageUrl = '/reservation';
  const reservationPageUrlPattern = new RegExp('/reservation(\\?.*)?$');
  const customerPageUrl = '/customer';
  const customerPageUrlPattern = new RegExp('/customer(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'admin';
  const password = Cypress.env('E2E_PASSWORD') ?? 'admin';
  const requestPageUrl = '/gestionhebergement/reservation-request/new';
  const requestPageUrlDetail = '/gestionhebergement/reservation-request/df53dd96-0177-49ae-b8cd-6499d7e54f37';
  // const customerPageUrlPattern = new RegExp('/customer(\\?.*)?$');
  const reservationRequestSelector = '[data-cy="reservation-request"]';
  const reservationRequestRegex = new RegExp('/reservation-request/new');
  const reservationRequestDetailRegex = new RegExp('/reservation-request/df53dd96-0177-49ae-b8cd-6499d7e54f37');
  before(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });
    cy.visit('');
    cy.get(reservationRequestSelector).should('exist');
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/reservationrequest/df53dd96-0177-49ae-b8cd-6499d7e54f37').as('entitiesRequest');
    cy.intercept('POST', '/api/reservationrequest').as('postEntityRequest');
    cy.intercept('PATCH', '/api/reservationrequest/df53dd96-0177-49ae-b8cd-6499d7e54f37').as('patchEntityRequest');
  });

  it('should load create Reservation request page and click on the next button stay on the same page', () => {
    cy.visit(requestPageUrl);
    cy.get(reservationRequestStepTwo).click({ force: true });
    cy.get(reservationRequestStepTwo).should('exist');
    cy.url().should('match', reservationRequestRegex);
  });

  it('should load a reservation request and modify the reservation request', function () {
    cy.visit(requestPageUrlDetail);
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });

    cy.get(entityDetailsBackButtonSelector).click({ force: true });
    cy.get(entityConfirmDeleteButtonSelector).should('exist');
    cy.get(entityDetailsBackButtonSelector).click({ force: true });
    cy.get(entityEditButtonSelector).click({ force: true });

    cy.get(`[data-cy="firstname"]`).clear().type('Bobi').should('have.value', 'Bobi');

    cy.get(`[data-cy="lastname"]`).clear().type('Avona').should('have.value', 'Avona');

    cy.get(`[data-cy="age"]`).clear().type('11').should('have.value', '11');

    cy.get(`[data-cy="phoneNumber"]`).clear().type('056558898978').should('have.value', '056558898978');

    cy.get(`[data-cy="email"]`).clear().type('dalric.Lambert80@yahoo.fr').should('have.value', 'dalric.Lambert80@yahoo.fr');

    cy.get(reservationRequestStepTwo).click({ force: true });

    cy.get(`[data-cy="personNumber"]`).clear().type('15').should('have.value', '15');

    cy.get(`[data-cy="paymentMode"]`).should('not.exist');

    cy.get(`[data-cy="isPaid"]`).should('not.exist');

    cy.get(`[data-cy="isConfirmed"]`).should('not.exist');

    cy.get(`[data-cy="specialDietNumber"]`).clear().type('3').should('have.value', '3');

    cy.get(`[data-cy="isArrivalLunch"]`).should('be.visible').check({ force: true }).should('be.checked');
    cy.get(`[data-cy="isDepartureLunch"]`).should('be.visible').check({ force: true }).should('be.checked');
    cy.get(`[data-cy="arrivalDate"]`).clear().type('2022-08-24').should('have.value', '2022-08-24');

    cy.get(`[data-cy="departureDate"]`).clear().type('2022-09-23').should('have.value', '2022-09-23');

    cy.get(entityCreateSaveButtonSelector).click({ force: true });
    cy.wait('@patchEntityRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });

    cy.url().should('match', reservationRequestDetailRegex);
  });

  it('should create an instance of Reservation request', () => {
    cy.visit('');

    cy.get(reservationRequestSelector).invoke('removeAttr', 'target').click({ force: true });

    cy.get(`[data-cy="firstname"]`).type('Bob').should('have.value', 'Bob');

    cy.get(`[data-cy="lastname"]`).type('Avon').should('have.value', 'Avon');

    cy.get(`[data-cy="age"]`).type('101').should('have.value', '101');

    cy.get(`[data-cy="phoneNumber"]`).type('056558898978').should('have.value', '056558898978');

    cy.get(`[data-cy="email"]`).type('Adalric.Lambert80@yahoo.fr').should('have.value', 'Adalric.Lambert80@yahoo.fr');

    cy.get(reservationRequestStepTwo).click({ force: true });
    cy.scrollTo('top', { ensureScrollable: false });
    cy.get(entityCreateSaveButtonSelector).should('exist');

    cy.get(`[data-cy="personNumber"]`).type('4').should('have.value', '4');

    cy.get(`[data-cy="paymentMode"]`).should('not.exist');

    cy.get(`[data-cy="isPaid"]`).should('not.exist');

    cy.get(`[data-cy="isConfirmed"]`).should('not.exist');

    cy.get(`[data-cy="specialDietNumber"]`).type('3').should('have.value', '3');
    cy.get(`[data-cy="isArrivalDiner"]`).should('be.checked');
    cy.get(`[data-cy="isArrivalDiner"]`).click().should('not.be.checked');

    cy.get(`[data-cy="isDepartureDiner"]`).should('not.be.checked');
    cy.get(`[data-cy="isDepartureDiner"]`).click().should('be.checked');

    cy.get(`[data-cy="isArrivalLunch"]`).should('be.checked');
    cy.get(`[data-cy="isArrivalLunch"]`).click().should('not.be.checked');

    cy.get(`[data-cy="isDepartureLunch"]`).should('be.checked');
    cy.get(`[data-cy="isDepartureLunch"]`).click().should('not.be.checked');

    cy.get(`[data-cy="arrivalDate"]`).type('2022-08-24').should('have.value', '2022-08-24');

    cy.get(`[data-cy="departureDate"]`).type('2022-09-23').should('have.value', '2022-09-23');

    cy.get(`[data-cy="comment"]`).type('back-end HTTP enterprise').should('have.value', 'back-end HTTP enterprise');
    cy.get(entityCreateSaveButtonSelector).click({ force: true });
    cy.wait('@postEntityRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(201);
    });
    cy.url().should('match', reservationRequestRegex);
  });

  it('should delete last instance of Reservation and Customer', function () {
    cy.intercept('GET', '/api/reservations+(?*|)').as('reservationsRequest');
    cy.intercept('GET', '/api/customers+(?*|)').as('customersRequest');
    cy.intercept('DELETE', '/api/reservations/*').as('deleteResEntityRequest');
    cy.intercept('DELETE', '/api/customers/*').as('deleteCusEntityRequest');
    cy.window().then(win => {
      win.sessionStorage.clear();
    });
    cy.visit('');
    cy.login(username, password);
    cy.get(entityItemSelector).should('exist');

    cy.intercept('GET', '/api/reservations/*').as('dialogDeleteRequest');
    cy.visit(reservationPageUrl);
    cy.wait('@reservationsRequest').then(({ response }) => {
      if (response.body.length > 0) {
        cy.get(entityTableSelector).should('have.lengthOf', response.body.length);
        cy.get(entityDeleteButtonSelector).last().click({ force: true });
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('reservation').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteResEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@reservationsRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', reservationPageUrlPattern);
      } else {
        this.skip();
      }
    });
    cy.intercept('GET', '/api/customers/*').as('dialogDeleteRequest');
    cy.visit(customerPageUrl);
    cy.wait('@customersRequest').then(({ response }) => {
      if (response.body.length > 0) {
        cy.get(entityTableSelector).should('have.lengthOf', response.body.length);
        cy.get(entityDeleteButtonSelector).last().click({ force: true });
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('customer').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteCusEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@customersRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', customerPageUrlPattern);
      } else {
        this.skip();
      }
    });
  });
});
