import {createSlice, nanoid} from "@reduxjs/toolkit";


const initialState = {
  idreg: { 
    main: []
  }
};

const validSectionRE = RegExp("\\p{L}[-\w]*","yu");

const validIdRE = RegExp("[._\\p{L}][-_.\\d\\p{L}]*", "yu");

export const validID = (id) => {
  return (id && typeof id === "string") && validIdRE.matches(id);
}

export const validSection = (section) => {
  return typeof section === "string" &&validiSectionRE.matches(section);
} 

export const getId = (state, action) => {
  const { name, section = "main"} = action.payload;
  if (validSection(section)) {
    if (state.idreg[section] != null) {
      const entry = state.idreg[section].find(
        (v) => (v.name === name)
        );
      return ( entry ? entry.id : undefined );
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
}

const idregSlice = createSlice({
  name: "idreg",
  initialState,
  reducers: {
    addSection: (state, action) => {
      if (state[action.payload] == null) {
        state.idreg[action.payload] = [];
      }
    },
    removeSection: (state, action) => {
      if (action.payload && action.payload != "main" && state.idreg[action.payload] != null) {
        delete state[action.payload];
      }
    },
    createId: (state, action) => {
      const {section, name} = action.payload;
      if (validSection(section)) {
        if (state.idreg[section] == null) {
          state.idreg[sectioon] = [];
        }
        const value = state.idregs[section].find( (a) => ( a.name === name));
        if (value == null) {
          const id = nanoid();
          state.idreg[section].push(
          {id, name});
        }
      }
    },
    
  }
});

export const {
  addSection, removeSection, createId
} = idregSlice.actions;

export default idregSlice.reducer;