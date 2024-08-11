const internal = Symbol("internal");
class Type {
  constructor(typename, struct) {
    this[internal] = { };
    this[internal].struct = struct;
    function getNestedValue(obj, path) {
      return path.split(".").reduce((o, i) => o[i], obj);
    }
    const ReadyProxy = new Proxy(this, {
      get: (target, name) => {
        if (name in this[internal].struct == false) {
          throw new Error(`Unknown property '${name}'`);
          return;
        }
        return this[internal].struct[name][1] || null;
      },
      set: (target, name, value) => {
        if (this[internal].struct[name][0] === undefined) {
          throw new Error(`Cannot set property '${name}' of type '${typename}'`);
          return;
        }
        if (!value instanceof this[internal].struct[name][0] && value != null) {
          throw new Error(`Cannot set property '${name}' of type '${typename}' to value of type '${typeof value}'`);
          return;
        }
        this[internal].struct[name][1] = value;
        return true;
      },
      deleteProperty: (target, name) => {
        if (this[internal].struct[name][0] === undefined) {
          throw new Error(`Cannot delete property '${name}' of type '${typename}'`);
          return;
        }
        this[internal].struct[name][1] = undefined;
        return true;
      }
    });
    this.instance = function() {
      return ReadyProxy;
    }
  }
};

export var Type = Type;