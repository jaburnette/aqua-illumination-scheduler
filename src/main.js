// any CSS you import will output into a single css file (app.css in this case)
import './app.css';

import App from "./App.svelte";

if (document.getElementById("app")) {
  const app = new App({target: document.getElementById("app")});

}
