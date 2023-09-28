/**
 * @typedef {object} IMenuItem
 * @property {string} name The name of the menu item 
 * @property {string|URL} [url] The on click target ofvhe item.
 * @property {ID} [id] the id of the item within the list. Defaults to the initial index with prefix item.
 * @property {Array<IMenuItem>} [list=[]] The submenu.
 * @property {string|Node|Node[]} [content] The content of the entry. The string is the HTML content.. Defaults to the name as text node
 */

/**
 * Create menu id.
 * @param {string} name The name of the menu iten.
 * @param {string} [prefix] The prefix of the menu item.
 */
function createId(name, prefix = null) {
  const result = (prefix == null ? `${name}` : `${prefix}${name}`);
  console.log("Created menu id: ", result);
  return result;
}


/**
 * Create toggler.
 */
function createMenuToggler(
{
  hidden = false,
  open = { display: undefined },
  close = { display: "none" },
  preserve = false,
  logger = undefined
}) {
  return {
    hidden: hidden,
    preserve: preserve,
    open: open || {},
    close: close || {},
    show(t, log = logger) {
      if (this.hidden) {
        this.hidden = false;
        if (this.preserve || this.close.display === undefined)
          this.close.didplay = t.style.display;
        t.style.display = this.open.display
        log(`Now reavealed`);
      } else {
        log(`Already revealed`);
      }
    },
    hide(t, log = logger) {
      if (!this.hidden) {
        this.hidden = true;
        if (this.preserve || this.open.display === undefined) {
          this.open.display = t.style.display;
        }
        t.style.display = this.close.display;
        log("Now hidden");
      } else {
        log("Already hidden");
      }
    },
    toggle(t, log = logger) {
      log("Toggling value:");
      if (this.hidden) {
        this.show(t, log);
      } else {
        this.hide(t, log);
      }
    }
  }
};

/**
 * The options of the menu item.
 * @typedef {object} MenuItemOptions
 * @property {string} [prefix] The identifier prefix.
 */

/**
 * Crwate a menu item.
 * @param {string} name The name of the menu item.
 * @param {string} [id] The identifier of the menu item.
 * @param {URL|string} The url performing the list item action.
 * @param {Array<IMenuItem>} [list=[]] The submenu of the list item.
 * @param {*} [content] The content of the menu item.
 * @param {MenuItemOptions} [options] The options of the menu itgm.
 */
function createMenuItem({
  name,
  id = undefined,
  url = undefined,
  list = [],
  content = undefined,
  ...options
}) {
  if (!(/^\p{Lu}[-\p{L}\d_]*$/u).test(name)) {
    throw TypeError("Invalid item name: [" + name + "]")
  }
  if (id === undefined) {
    id = createId(name, options.prefix)
  }
  if (content != null) {
    if (content instanceof Array) {
      // Array of nodes
      content = [...content];
    } else if (typeof content === "object") {
      content = createMenuItem(content);
    } 
  } else {
    content = name.replaceAll(/_+/g, " ").trim();

  return {
    name,
    id,
    url,
    list,
    content
  };
}

/**
 * Activate state reporter.
 * @param {string|URL} state The activated state.
 */
function activateState(state) {
  if (typeof state === "string") {
    console.log(`State transition: ${state}`);
  } else if (state instanceof URL) {
    console.log(`Activate link: ${state}`);
  } else {
    console.log(`Unknown state ${state}`)
  }
}

/**
 * Create a nenu structure.
 * @param {string} menuNane The name of the menu.
 * @param {Array<Part<IMenuItem>>}
 */
function createMenu(menuName, menuItems = [], options = {}) {

  const result = menuItems.map(
    (entry, index) => {

      try {
        return createMenuItem({
          id: createId("" + index, "item"),
          ...entry
        });
      } catch (err) {
        throw new TypeError(
          `Invalid item at ${index}`, { cause: err });
      }

    });

  // Add menu header
  result.unshift(createMenuItem({
    name: menuName,
    list: null,
    id: options.id,
    url: options.url,
    content: options.content,
    conditions: options.conditions
  }));

  return result;
}

function createHALMenuItem(
  resource,
  options = {}
) {
  if (resource instanceof Object &&
    "resource._links"
    instanceof Array) {
    const result = {
      name: resource.name,
      id: resource.id,
      url: resource._links.find((lnk) => (lnk.rel === "self"))?.href,
    };
    result.list = resource._links.filter((lnk) => (lnk.rel !== "self")).map(
      (lnk) => {
        createMenuItem({
          name: lnk.rel,
          url: lnk.href
        })
      }
    );

  } else {
    throw new TypeError("Invalid resource");
  }
}

/**
 * @param {(Document|Element)} target
 * @param {Array<IMenuItem>} [items=[]] The menu items added to the menu.
 */
function populateMenu(target, items = [], activateState = (e) => { alert(`Activated state: ${e}`); }, options = {}) {
  const menuItem = (target instanceof Document ? target.getElementById("nav-main") : target);
  if (menuItem === undefined) {
    return;
  }
  const owner = menuItem.ownerDocument;
  const menuTag = options.menuTag || "ul";
  const itemTag = options.itemTag || "li";
  const menuClass = options.menuClass || "nav menu";
  const itemClass = options.itemClass || "nav item";
  items.forEach(
    (item, index) => {
      if (item == null) {
        console.log(`Undefined element: ${options.prefix || ""} at ${index}`)
        return;
      }
      const entry = owner.createElement(itemTag);
      const id = ((item.id === undefined) ?
        createId("" + index, createId("item", options.prefix)) :
        (item.id ? createId(item.id, options.prefix) : undefined));
      if (id) {
        entry.setAttribute("id", id);
      }
      const content = owner.createElement("a");
      entry.appendChild(content);
      if (item.content !== null) {
        content.appendChild(
          owner.createTextNode(item.content === undefined ?
            item.name.replaceAll(/_+/g, " ") :
            item.content)
        );

        // Add link
        if (item.url) {
          content.addEventListener(
            "click",
            (e) => {
              if (item.url) {
                e.preventDefault();
                activateState(item.url);
              }
            })
        }
      }

      // Submenu
      menuItem.appendChild(entry);
      if (item.list != null) {
        const menu = owner.createElement(menuTag);
        const oldStyle = createMenuToggler({ preserve: true });
        console.log("Toggler", oldStyle);

        entry.appendChild(menu);
        if (!item.url) {
          content.addEventListener("click", (e) => {
            console.group(`Toggle submenu of ${item.name}`);
            oldStyle.toggle(menu, console.log);
            console.groupEnd();
          });
        } else {
          // Adding hover listener
          entry.addEventListener(
            "pointerenter",
            (e) => {
              console.group("Enter");
              oldStyle.show(menu, console.log);
              console.groupEnd();
            }
          );
          entry.addEventListener(
            "pointerleave",
            (e) => {
              console.group("Enter");
              oldStyle.hide(menu);
              console.groupEnd();
            }
          )
        }
        populateMenu(menu, item.list, activateState, {
          ...options,
          prefix: createId(".", id)
        });
      }
    }
  );
}

exports = { createMenuToggler, createMenu, createMenuItem, populateMenu };