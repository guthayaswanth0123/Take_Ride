import { Outlet } from "react-router-dom";
import CommonLayout from "./components/layout/CommonLayout";

function App() {
  return (
    <div>
      <CommonLayout>
        <Outlet />
      </CommonLayout>
    </div>
  );
}

export default App;
