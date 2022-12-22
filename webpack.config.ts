import { CleanPlugin, Configuration } from "webpack";
import GasPlugin from "gas-webpack-plugin";

const config: Configuration = {
  mode: "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [new GasPlugin(), new CleanPlugin()],
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  output: {
    filename: "Code.gs",
  }
};

export default config;
