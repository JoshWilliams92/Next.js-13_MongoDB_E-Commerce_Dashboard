import clientPromise from ".";

export async function getProducts() {
    try {
        const client = await clientPromise
        const db = client.db()
        const products = await db.collection('products')
        .find()
        .toArray()
    
        return products
    } catch (err) {
        console.error(err);
    }
}

// Example Response Object
/*
{
    _id: new ObjectId(""),
    name: 'String',
    slug: 'String',
    category: 'String',
    image: 'URL',
    price: Number,
    brand: 'String',
    rating: Number,
    numReviews: Number,
    countInStock: Number,
    description: 'String',
    __v: 0,
    createdAt: Date,
    updatedAt: Date
  }*/