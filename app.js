/**
 * Application entry point.
 *
 * Loads the MVC controller as an ES module and starts the app only after the
 * DOM is fully parsed, so `document.getElementById` calls inside View succeed.
 */
import { Controller } from "./controller.js";

document.addEventListener("DOMContentLoaded", () => Controller.init());
