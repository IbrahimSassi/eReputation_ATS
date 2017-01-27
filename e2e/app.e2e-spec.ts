import { EReputationPage } from './app.po';

describe('e-reputation App', function() {
  let page: EReputationPage;

  beforeEach(() => {
    page = new EReputationPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
