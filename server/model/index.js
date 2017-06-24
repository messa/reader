const ObjectID = require('mongodb').ObjectID;

class Model {

  constructor({db}) {
    this.db = db;
  }

  async createIndexes() {
    const cUsers = this.db.collection('users');
    await cUsers.createIndex(
      {'fb.fbId': 1},
      {unique: true, sparse: true});
    await cUsers.createIndex(
      {email: 1},
      {unique: true, sparse: true});
  }

  async getUserById(userIdStr) {
    const userOId = new ObjectID(userIdStr);
    const cUsers = this.db.collection('users');
    const doc = await cUsers.findOne({_id: userOId});
    return new User(doc);
  }

  async loginUserFB({fbId, email, displayName}) {
    console.info('loginUserFB:', fbId, email, displayName);
    const cUsers = this.db.collection('users');
    let doc = await cUsers.findOne({'fb.fbId': fbId});
    if (doc) {
      // found user by fbId
      // update fb info
      if (email && doc.fb.email != email) {
        console.info('updating FB email', doc.fb.email, '->', emai);
        await cUsers.updateOne(
          {_id: doc._id},
          {$set: {'fb.email': email}})
      }
      if (displayName && doc.fb.displayName != displayName) {
        console.info('updating FB displayName', doc.fb.displayName, '->', displayName);
        await cUsers.updateOne(
          {_id: doc._id},
          {$set: {'fb.displayName': displayName}})
      }
    }

    if (!doc && email) {
      // for example if someone used Google sign-in previously
      doc = await cUsers.findOne({email: email, 'fb.fbId': null});
      if (doc) {
        // set FB login info
        await cUsers.updateOne(
          {_id: doc._id},
          {$set: {
            'fb.fbId': fbId,
            'fm.email': email,
            'fb.displayName': displayName,
          }})
      }
    }

    if (!doc) {
      // insert new user
      const res = await cUsers.insertOne({
        fb: { fbId, email, displayName },
      });
      doc = await cUsers.findOne({_id: res.insertedId});
    }

    if (email && doc.email != email) {
      // inserted new user (with only fbId) or found user via fbId
      // update email info
      // this may fail in some special cases
      await cUsers.updateOne(
        {
          _id: doc._id,
          email: doc.email || null,
        }, {
          $set: {
            email: email,
          }
        });
    }

    doc = await cUsers.findOne({_id: doc._id});
    console.info('loginUserFB doc:', doc);
    return new User(doc);
  }

}

class User {

  constructor(doc) {
    this.userId = doc._id.toString();
    this.displayName = getDisplayName(doc);
    this.doc = doc;
  }

  toString() {
    return `User ${this.userId} ${JSON.stringify(this.displayName)}`;
  }

}

const getDisplayName = (doc) => {
  if (doc.fb && doc.fb.displayName) {
    return doc.fb.displayName;
  }
  return null;
}


const modelFromConfiguration = async (configuration) => {
  const MongoClient = require('mongodb').MongoClient;
  const url = configuration.get('mongodb:uri');
  const db = await MongoClient.connect(url);
  console.info('connected to MongoDB');
  const model = new Model({ db });
  await model.createIndexes();
  return model;
}

export { modelFromConfiguration };
