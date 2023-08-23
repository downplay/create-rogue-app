import React, { Suspense } from "react"
import ReactDOM from "react-dom/client"
import { App } from "./App"

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Suspense>
            <App />
        </Suspense>
    </React.StrictMode>
)
