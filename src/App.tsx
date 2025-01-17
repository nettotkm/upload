import { render } from "react-dom";
import { createContext, StrictMode, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faHouse,
  faPaste,
} from "@fortawesome/free-solid-svg-icons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { trpc } from "./client";

import Home from "./Components/Home";
import Header from "./Components/Header";
import About from "./Components/About";
import MyDocuments from "./Components/MyDocuments";
import EditMyDocument from "./Components/EditMyDocument";
import ViewMyDocument from "./Components/ViewMyDocument";
import CreateMyDocument from "./Components/CreateMyDocument";
import Breadcrumbs from "./Components/Breadcrumbs";

export const AppContext = createContext<[boolean, (open: boolean) => void]>([
  true,
  () => {},
]);

const App = () => {
  const [open, setOpen] = useState(true);
  const [showAboutModal, setShowAboutModal] = useState(false);

  const location = useLocation();

  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:4000/trpc",
        }),
      ],
    })
  );

  return (
    <StrictMode>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <AppContext.Provider value={[open, setOpen]}>
            <header>
              <Header></Header>
            </header>
            <div className="flex h-screen pb-4">
              <nav
                className={`border-r border-gray max-md:absolute max-md:z-10 bg-white ${
                  open ? "" : "max-md:hidden"
                } h-full`}
              >
                <ul>
                  <li className="items-center  text-gray-200 text-sm p-2 border-b border-gray ">
                    <Link
                      className={`flex justify-between hover:text-blue ${
                        location.pathname === "/"
                          ? "text-blue"
                          : "text-gray-200"
                      }`}
                      to="/"
                    >
                      <span className={`${open ? "" : "hidden"}`}>Início</span>
                      <FontAwesomeIcon
                        className=" h-[1rem] ml-2"
                        icon={faHouse}
                      />
                    </Link>
                  </li>
                  <li className="items-center text-gray-200 text-sm p-2 border-b border-gray">
                    <Link
                      className={`flex justify-between ${
                        location.pathname === "/my-documents"
                          ? "text-blue"
                          : "text-gray-200"
                      }`}
                      to="/my-documents"
                    >
                      <span className={`${open ? "" : "hidden"}`}>
                        Meus Documentos
                      </span>
                      <FontAwesomeIcon
                        className=" h-[1rem] ml-2"
                        icon={faPaste}
                      />
                    </Link>
                  </li>
                  <li className=" items-center text-gray-200 text-sm p-2 border-b border-gray">
                    <button
                      className={`flex justify-between hover:text-blue text-gray-200 w-full`}
                      onClick={() => setShowAboutModal(true)}
                    >
                      <span className={`${open ? "" : "hidden"}`}>Sobre</span>
                      <FontAwesomeIcon
                        className=" h-[1rem] ml-2"
                        icon={faCircleInfo}
                      />
                    </button>
                  </li>
                </ul>
              </nav>
              <main className="container py-4 px-2">
                <div className="grid grid-cols-12 gap-x-2">
                  <div className="col-span-12">
                    <Breadcrumbs />
                  </div>
                  <div className="col-span-12">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/my-documents" element={<MyDocuments />} />
                      <Route
                        path="/my-documents/:id"
                        element={<ViewMyDocument />}
                      />
                      <Route
                        path="/my-documents/:id/edit"
                        element={<EditMyDocument />}
                      />
                      <Route
                        path="/my-documents/new"
                        element={<CreateMyDocument />}
                      />
                    </Routes>
                  </div>
                </div>
              </main>
            </div>
            {showAboutModal ? (
              <About onClose={() => setShowAboutModal(false)} />
            ) : null}
          </AppContext.Provider>
        </QueryClientProvider>
      </trpc.Provider>
    </StrictMode>
  );
};

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
