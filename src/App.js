import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { publicRoutes } from "./routes";

import Header from "./components/DefaultLayouts/Header";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          {publicRoutes.map((route, index) => {
            const Page = route.component;
            return (
              <Route
                key={index}
                path={route.path}
                element={<Page params={route.params} />}
              />
            );
          })}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
