import uuid4 from 'uuid/v4'

export default class Users {

  constructor() {
    this.allUsers = [];
  }

  getById(userId) {
    const user = this.allUsers.find(u => u.id);
    if (!user) {
      throw new Error(`User id ${userId} not found`);
    }
    return user;
  }

  getOrCreateByGoogleId({ userInfo }) {
    let user = this.allUsers.find(u => u.googleId);
    if (!user) {
      user = new User(userInfo);
      this.allUsers.push(user);
    }
    return user;
  }

}

class User {

  constructor(userInfo) {
    this.id = generateUserId();
    this.googleId = userInfo.googleId || null;
    this.displayName = userInfo.displayName;
    this.twitterAccounts = [];
  }

}

const generateUserId = () => (uuid4());
