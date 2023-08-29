import clientPromise from ".";

export async function countUsers() {
    try {
        const client = await clientPromise
        const db = client.db()
        const users = await db.collection('users')
        .countDocuments()
    
        return users
    } catch (err) {
        console.error(err)
    }
}

export async function countProducts() {
    try {
        const client = await clientPromise
        const db = client.db()
        const products = await db.collection('products')
        .countDocuments()
    
        return products
    } catch (err) {
        console.error(err)
    }
}

export async function countOrders() {
    try {
        const client = await clientPromise
        const db = client.db()
        const orders = await db.collection('orders')
        .countDocuments()
    
        return orders
    } catch (err) {
        console.error(err)
    }
}