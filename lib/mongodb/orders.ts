import clientPromise from ".";

export async function getOrders() {
    try {
        const client = await clientPromise
        const db = client.db()
        const orders = await db.collection('orders')
        .find()
        .toArray()
    
        return orders
    } catch (err) {
        console.error(err)
    }
}

// Example Response Object
/*
  {
    _id: new ObjectId(""),
    user: new ObjectId(""),
    orderItems: [ 
    {   
        name
        "String"
        quantity
        Number
        image
        "URL"
        price
        Number
        _id
        String
    }
    ],
    shippingAddress: {
      fullName: 'String',
      address: 'String',
      city: 'String',
      postalCode: 'String',
      country: 'String'
    },
    paymentMethod: 'String',
    itemsPrice: Number,
    shippingPrice: Number,
    taxPrice: Number,
    totalPrice: Number,
    isPaid: Boolean,
    isDelivered: Boolean,
    createdAt: Date,
    updatedAt: Date,
    __v: 0
  }*/

export async function calculateAverageOrderValue() {
    try {
      const client = await clientPromise;
      const db = client.db();
  
      const result = await db.collection('orders').aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalPrice' },
            totalOrders: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            averageOrderValue: { $divide: ['$totalRevenue', '$totalOrders'] },
          },
        },
      ]).toArray();
  
      return result[0].averageOrderValue;
    } catch (err) {
      console.error(err);
    }
  }

export async function getTotalSales() {
    try {
        const client = await clientPromise
        const db = client.db()

        const orders = await db.collection('orders')
        .aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m', date: '$createdAt'}},
                    totalSales: { $sum: '$totalPrice' }
                }
            }
        ]).toArray()

        return orders
    } catch (err) {
        console.error(err)
    }
}

export async function getUserSales() {
    try {
        const client = await clientPromise
        const db = client.db()

        const orders = await db.collection('orders')
        .aggregate([
            {
                $group: {
                _id: '$shippingAddress.fullName',
                totalRevenue: { $sum: '$totalPrice' }
            }
        }
    ]).toArray();
    
        return orders
    } catch(err) {
    console.error(err)
    }      
}

// This query focuses on finding the most popular items, regardless of how they were ordered. 
// It counts how many times each product appears in the order items across all orders. 
// This gives you an idea of which products are being ordered frequently, 
// regardless of the quantity ordered in each individual order.
export async function getPopularItems() {
    try {
        const client = await clientPromise
        const db = client.db()
        const orders = await db.collection('orders')
        .aggregate([
            {
              $unwind: "$orderItems"
            },
            {
              $group: {
                _id: "$orderItems.name",
                itemCount: { $sum: 1 }
              }
            },
            {
              $sort: { itemCount: -1 }
            }
          ]).toArray()
        return orders
    } catch(err) {
        console.error(err)
    }
}

// This query focuses on finding orders with the highest total quantity of products sold. 
// It sums up the quantities of each product in the order items for each order. 
// This gives you an insight into which orders had the most impact on your overall sales, 
// regardless of the variety of products ordered.
export async function bestSellingOrders() {
    try {
        const client = await clientPromise
        const db = client.db()

        const products = await db.collection('orders')          
              .aggregate([
            { $unwind: "$orderItems" },
            { 
              $group: {
                _id: "$orderItems.name",
                totalQuantity: { $sum: "$orderItems.quantity" }
              }
            }
          ])
        .toArray()
        return products   
    } catch (err) {
        console.error(err);
    }
} 

export async function getOrdersByMinute() {
    try {
        const client = await clientPromise
        const db = client.db()

        const orders = await db.collection('orders')
        .aggregate([
        {
            $group: {
            _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
                day: { $dayOfMonth: "$createdAt" },
                hour: { $hour: "$createdAt" },
                minute: { $minute: "$createdAt" }
            },
            ordersCount: { $sum: 1 },
            totalSales: { $sum: "$totalPrice" }
            }
        },
        {
            $addFields: {
            minuteOfDay: {
                $add: [
                { $multiply: ["$_id.hour", 60] },
                "$_id.minute"
                ]
            }
            }
        },
        {
            $group: {
            _id: {
                year: "$_id.year",
                month: "$_id.month"
            },
            minutesData: {
                $push: {
                minuteOfDay: "$minuteOfDay",
                ordersCount: "$ordersCount",
                totalSales: "$totalSales"
                }
            }
            }
        },
        {
            $project: {
            _id: 0,
            year: "$_id.year",
            month: "$_id.month",
            minutesData: 1
            }
        },
        {
            $unwind: "$minutesData"
        },
        {
            $sort: { year: 1, month: 1, "minutesData.minuteOfDay": 1 }
        }
        ]).toArray()

        return orders
          
    } catch(err) {
        console.error(err)
    }
}