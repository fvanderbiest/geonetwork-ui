describe('header', () => {
  beforeEach(() => cy.visit('/'))

  describe('general display', () => {
    it('should display the title', () => {
      cy.get('[data-cy="dh-title"]')
    })
    it('should display the header image', () => {
      cy.get('header')
        .should('have.css', 'background')
        .and('include', 'header_bg.webp')
    })
    it('should display the search bar, button and placeholder', () => {
      cy.get('gn-ui-fuzzy-search')
      cy.get('gn-ui-autocomplete').should('have.length.gt', 0)
      cy.get('mat-icon').contains('search')
    })
    it('display three buttons that go to other pages on click', () => {
      cy.get('datahub-navigation-menu').find('button').eq(0).click()
      cy.url().should('include', '/home/news')
      cy.visit('/')
      cy.get('datahub-navigation-menu').find('button').eq(1).click()
      cy.url().should('include', '/home/search')
      cy.visit('/')
      cy.get('datahub-navigation-menu').find('button').eq(2).click()
      cy.url().should('include', '/home/organisations')
    })
  })

  describe('search actions', () => {
    it('should display the search with autocomplete result', () => {
      cy.get('gn-ui-fuzzy-search').type('velo')
      cy.get('mat-option').should('have.text', ' Accroches vélos MEL ')
    })
    it('should display the search results on click on icon', () => {
      cy.get('gn-ui-fuzzy-search').type('velo')
      cy.get('mat-icon').contains('search').trigger('click')
      cy.get('gn-ui-record-preview-row').should('have.length', 1)
      cy.get('gn-ui-record-preview-row')
        .find('div')
        .first()
        .should('have.attr', 'title', 'Accroches vélos MEL')
    })
    it('should display the search results on enter touch', () => {
      cy.get('gn-ui-fuzzy-search').type('velo{enter}')
      cy.get('gn-ui-record-preview-row').should('have.length', 1)
      cy.get('gn-ui-record-preview-row')
        .find('div')
        .first()
        .should('have.attr', 'title', 'Accroches vélos MEL')
    })
    it('should go to dataset page when click on the autocomplete result', () => {
      cy.get('gn-ui-fuzzy-search').type('velo')
      cy.get('mat-option').should('have.text', ' Accroches vélos MEL ')
      cy.get('mat-option').click()
      cy.url().should('include', '/dataset/')
    })
  })

  describe('reset search actions', () => {
    it('should create a cancel icon when typing', () => {
      cy.get('gn-ui-fuzzy-search').type('velo')
      cy.get('mat-icon').contains('close')
    })
    it('should delete text input on click on cancel button', () => {
      cy.get('gn-ui-fuzzy-search').type('velo')
      cy.get('mat-icon').contains('close').trigger('click')
      cy.get('gn-ui-autocomplete')
        .find('div')
        .find('input')
        .should('have.value', '')
    })
    it('should reset search results on click on cancel button', () => {
      cy.get('gn-ui-fuzzy-search').type('velo')
      cy.get('mat-icon').contains('close').trigger('click')
      cy.get('gn-ui-record-preview-row').should('have.length.gt', 1)
    })
  })

  describe('filter search actions', () => {
    it('should create two filter buttons upon loading page', () => {
      cy.get('gn-ui-fuzzy-search')
        .next()
        .find('button')
        .should('have.length', 2)
    })

    beforeEach(() => {
      cy.visit('/home/search')
      cy.get('gn-ui-record-preview-row').as('initialList')
      cy.visit('/home/news')
    })

    it('should filter results by latest date', () => {
      cy.get('gn-ui-fuzzy-search').next().find('button').first().click()
      cy.get('gn-ui-record-preview-row').should('not.eq', '@initialList')
      cy.get('select#sort-by- option:selected').should(
        'have.value',
        '-createDate'
      )
    })
    it('should filter results by popularity', () => {
      cy.get('gn-ui-fuzzy-search').next().find('button').eq(1).click()
      cy.get('gn-ui-record-preview-row').should('not.eq', '@initialList')
      cy.get('select#sort-by- option:selected').should(
        'have.value',
        '-userSavedCount'
      )
    })
  })
})
