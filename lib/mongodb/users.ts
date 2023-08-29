import clientPromise from ".";

export async function getUsers() {
    try {
        const client = await clientPromise
        const db = client.db()
        const users = await db.collection('users')
        .find()
        .toArray()
    
        return users
    } catch (err) {
        console.error(err)
    }
}

// Example Response Object
/*{
      _id: new ObjectId(""),
      name: 'String',
      email: 'String',
      password: 'Hashed password using bcrypt',
      isAdmin: Boolean,
      __v: 0,
      createdAt: Date,
      updatedAt: Date
}*/