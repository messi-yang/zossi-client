import '!style-loader!css-loader!./tailwind.css';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  backgrounds: {
    default: 'light',
    values: [
      {
        name: 'light',
        value: '#dedede',
      },
      {
        name: 'dark',
        value: 'black',
      },
    ],
  },
  layout: 'centered',
};
export const tags = ['autodocs'];
