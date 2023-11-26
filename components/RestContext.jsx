
import { createContext, Fragment } from 'react';

const restContext = {

}

const RestContext = createContext({...restContext});


function readResources() {
  return ["menu/", "data/", "data/skills/", "data/traits/", "data/motivations,/"];
}

function readBaseUrl() {
  return "https://localhost/rest";
}

function RestContextProvider(props) {
  const [traits, setTraits] = useState([]);
  const [skills, setSkills] = useState([])
  const [drives, setDrives] = useatate([])
  
  const context = {
    baseUrl: props.baseUrl || readBaseUrl(),
    resources: props.resources || readResources(),
    
    getMenu(resourceName) {},
    getMotivation(motivationName) {
      return motivation.filter((v) => (v.name === motivationName));
    },
    getSkill(skillName) {
      return skill.filter((v) => (skill.name === skillName))
    },
    getTrait(traitName) {
      return traits.filter( (v) => (v.traitName === traitName))
    },
    addTrait(trait) {
      const old = this.getTrait(trait.traitName);
      if (old) {
        // Send update trait
        
      } else {
        // Send post request
      }
    },
    all(resource) {
      const resource = this.getResource(resource);
      if (resource && resource.all) {
        return fetch(resource.all(), {
          method: "GET",
          headers: [["Content-Type", "application/json"]],
        }).then((response) => {
          if (response.ok) {
            // Parse the jsons
            resource.parseAll(response.body);
          } else {
            return null;
          }
        });
      } else {
        return new Promise((resolve, reject) => {
          resolve(undefined);
        })
      }
    },
    one(resource, id) {
      const resource = this.getResource(resource);
      if (resource && resource.one) {
        return fetch(resource.one(id), {
          method: "GET",
          headers: [["Content-Type", "application/json"]]
        }).then((response) => {
          if (response.ok) {
            // Parse the jsons
            resource.parseOne(response.body);
          } else {
            return null;
          }
        });
      } else {
        return new Promise((resolve, reject) => {
          resolve(undefined);
        }).then((response) => {
          if (response.ok) {
            // Parse the jsons
            return id;
          } else {
            return null;
          }
        });
      }
    },
    update(resource, id, value) {
      const resource = this.getResource(resource);
      if (resource && resource.update) {
        return fetch(resource.update(id), {
          method: "PUT",
          headers: [["Content-Type", "application/json"]],
          body: resource.stringify(value)
        }).then((response) => {
          if (response.ok) {
            // Parse the jsons
            resource.parseId(response.body);
          } else {
            return null;
          }
        });;
      } else {
        return new Promise((resolve, reject) => {
          resolve(undefined);
        })
      }
    },
    remove(resource, id) {
      const resource = this.getResource(resource);
      if (resource && resource.remove) {
        return fetch(resource.remove(id), {
          method: "DELETE"
        }).then((response) => {
          if (response.ok) {
            // Parse the jsons
            resource.parseId(response.body);
          } else {
            return null;
          }
        });
      } else {
        return new Promise((resolve, reject) => {
          resolve(undefined);
        })
      }
    },
    create(resource, value) {
      const resource = this.getResource(resource);
      if (resource && resource.create()) {
      return fetch(resource.create, {
        method: "POST",
        headers: [ ["Content-Type", "application/json"] ],
        body: resource.stringify(value)
      }).then((response) => {
        if (response.ok) {
          // Parse the jsons
          resource.parseId(response.body);
        } else {
          return null;
        }
      });
      } else {
        return new Promise((resolve, reject) => {
          resolve(undefined);
        })
      }
    }
  };
  
  return (<RestContext.Provider value={context}>
  {props.children}
  </RestContext.Provider>);
}



export default restContext;