const CracoLessPlugin = require("craco-less");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              "@primary-color": "#1DA57A",
              "@body-background": "#ecf0f3",
              "@component-background": "#ecf0f3",
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
