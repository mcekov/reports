const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Report schema
let reportSchema = new Schema({
  model: { type: String, required: true },
  sn: { type: String, required: true },
  warranty: { type: String, required: true },
  defect: { type: String, required: true },
  parts: { type: String, required: true },
  client: { type: String, required: true },
  reportDate: { type: String, required: true },
  endReqDate: { type: String, required: true },
  notes: { type: String, required: false },
  date: { type: Date, default: Date.now }
});

mongoose.model('reports', reportSchema);
