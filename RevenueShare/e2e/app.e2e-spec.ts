import { RevenuesharePage } from './app.po';

describe('revenueshare App', function() {
  let page: RevenuesharePage;

  beforeEach(() => {
    page = new RevenuesharePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
