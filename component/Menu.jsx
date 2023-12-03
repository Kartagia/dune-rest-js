import {useState, useContext} from "react";
import {DuneAppContext} from "./DuneAppContext.jsx";
import ComplexErrorContext from "./ErrorContext.jsx";
import SessionContext from "./SessionContext.jsx";

/**
 * @typedef {import("react").PropsWithChildren} MenuProps
 * @descriptiopn The properties of the menu component.
 * @property {strign|url} [icon] The icon of the menu.
 * @property {string} [position="top"] The position of the menu.
 * @property {string} [direction="horizontal"] The direction of
 * the menu. 
 * @property {Array<import("React").ReactElement>} [children=[]] The children
 * of the component.
 *  
 */

/**
 * The menu component for navigation menu.
 * @param {import("react").ReactPropTypes} props The properties of the react
 * element.
 * @returns {import("react").ReactElement} The react component of Menu.
 */
export function Menu(props) {
  const errors = useContext(ComplexErrorContext)
  const session = useContext(SessionContext);
  const app = useContext(DuneAppContext);
  
  const menuClass = [].concat(props.position || "top").concat(props.direction
    || "horizontal");

  return (<nav classNames={menuClass}>Menu not yet implemented.</nav>)
}

export default Menu;