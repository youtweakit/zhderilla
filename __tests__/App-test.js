import {
  render,
  fireEvent,
  waitForElement,
} from 'react-native-testing-library';
import React from 'react';
import App from '../App';
import Storija from '../src/vendors/storija.json';

describe('The app', () => {
  it('should render multiple vendors correctly', async () => {
    const anotherVendor = copyVendor(Storija, 'Fast Food Rizzo');
    const { getByText } = render(<App vendors={[Storija, anotherVendor]} />);

    // Check for home screen title
    await waitForElement(() => getByText('Zhderilla'));

    // Check for vendor list
    await waitForElement(() => getByText('Fast Food Štorija'));
    await waitForElement(() => getByText('Fast Food Rizzo'));
  });

  it("selecting a vendor should display it's menu", async () => {
    const { getByText, getByTestId, getAllByText } = render(
      <App vendors={[Storija]} />,
    );

    fireEvent.press(
      await waitForElement(() => getByTestId('createOrder Fast Food Štorija')),
    );

    await waitForElement(() => getByText('Sendvič u tijestu'));
    await waitForElement(() => getByText('16,00'));
    await waitForElement(() => getByText('Salata piletina'));
    // Check for title
    expect(getAllByText('Menu - Fast Food Štorija').length).toBe(1);
  });

  it('creating an order', async () => {
    const { getByText, getByTestId } = render(<App vendors={[Storija]} />);

    fireEvent.press(
      await waitForElement(() => getByTestId('createOrder Fast Food Štorija')),
    );
    fireEvent.press(
      await waitForElement(() => getByTestId('add Sendvič u tijestu')),
    );

    // Wait for condiments screen
    await waitForElement(() => getByText('Choose condiments:'));
    fireEvent.press(await waitForElement(() => getByText('majoneza')));
    fireEvent.press(await waitForElement(() => getByText('kupus')));
    fireEvent.press(await waitForElement(() => getByText('kukuruz')));
  });
});

function copyVendor(original, newName) {
  return {
    ...original,
    data: { ...original.data, name: newName },
  };
}
