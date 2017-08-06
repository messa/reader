import Users from './users'

class Model {

  constructor() {
    this.users = new Users();
  }

}

export default function getModel() {
  return new Model();
}
