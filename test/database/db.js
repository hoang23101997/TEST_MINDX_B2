import { MongoClient } from 'mongodb';
const db = {};
const uri =
  'mongodb+srv://builehoang1997:mVRWeUDeSxQPU3hE@cluster0.gldwneo.mongodb.net/';
const connectToDb = async () => {
   const client = new MongoClient(uri);
   try {
      await client.connect();
      const database = client.db('product');
      db.inventories = database.collection('inventories');
      db.orders = database.collection('orders');
      db.users = database.collection('users');

      const userData = [
        { username: "admin", password: "MindX@2022" },
        { username: "alice", password: "MindX@2022" }
     ];
     await db.users.insertMany(userData);
      // Import inventory data
      const inventoryData = [
         { id: 13213, sku: 'almonds', description: 'product 1', instock: 120 },
         { id: 42142, sku: 'bread', description: 'product 2', instock: 80 },
         { id: 31231, sku: 'cashews', description: 'product 3', instock: 60 },
         { id: 44213, sku: 'pecans', description: 'product 4', instock: 70 },
      ];

      await db.inventories.insertMany(inventoryData);
      console.log('Inventory data imported successfully');

      // Import order data
      const orderData = [
         { id: 1123213, item: 'almonds', price: 12, quantity: 2 },
         { id: 2421312, item: 'pecans', price: 20, quantity: 1 },
         { id: 34213123, item: 'pecans', price: 20, quantity: 3 },
      ];

      await db.orders.insertMany(orderData);
      console.log('Order data imported successfully');
   } catch (err) {
      console.error('Error connecting to MongoDB:', err);
   } 
};

export { connectToDb, db };