import uuid4 from 'uuid/v4'

export default class Users {

  constructor() {
    this.allUsers = [];
  }

  getById(userId) {
    const user = this.allUsers.find(u => (u.id == userId));
    if (!user) {
      throw new Error(`User id ${userId} not found`);
    }
    return user;
  }

  getOrCreateByGoogleId({ userInfo }) {
    const { googleId } = userInfo;
    let user = this.allUsers.find(u => (u.googleId == googleId));
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

  addTwitterAccount(twitterAccountInfo) {
    const { twitterId, token, tokenSecret } = twitterAccountInfo;
    const presentTA = this.twitterAccounts.find(ta => (ta.twitterId == twitterId));
    if (presentTA) {
      presentTA.updateToken({ token, tokenSecret });
    } else {
      const ta = new TwitterAccount(twitterAccountInfo);
      this.twitterAccounts.push(ta);
    }
  }

}

const generateUserId = () => (uuid4());

class TwitterAccount {

  constructor(twitterAccountInfo) {
    const {token, tokenSecret, twitterId, username, displayName, rawProfile} = twitterAccountInfo;
    this.token = token;
    this.tokenSecret = tokenSecret;
    this.twitterId = twitterId;
    this.username = username;
    this.displayName = displayName;
    this.rawProfile = rawProfile;
  }

}
