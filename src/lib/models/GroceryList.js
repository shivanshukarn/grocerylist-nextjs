import mongoose from 'mongoose';

const GroceryListSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  items: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    completed: { type: Boolean, default: false }
  }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.GroceryList || mongoose.model('GroceryList', GroceryListSchema);