import { type AppType } from "next/app";

import { api } from "~/utils/api";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <ToastContainer />
      <Component {...pageProps} />
    </>
  );
};

export default api.withTRPC(MyApp);
