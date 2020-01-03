const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const imageSchema = new Schema({
	title:{type: String},
	description:{type: String},
	descript:{type: String},
	name:{type: String},
	year:{type: Number},
	favorite:{type: String},
	religion:{type: String},
	mimetype:{type: String},
	originalname:{type: String},
	filename:{type: String},
	path:{type: String},
	size:{type: Number},
	fieldname:{type: String},
	encoding:{type: String},
	status:{
		default:false,
		type:Boolean
	},
	created_at: {type: Date, default: Date.now},
	user:{type: String}
});

module.exports=mongoose.model('Image',imageSchema);
