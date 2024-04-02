const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      
    },
    numberViews: {
      type: Number,
      default: 0
    },
    
    likes: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    ],
    disLikes: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    ],
    image: {
        type: String,
        default: 'https://previews.123rf.com/images/peshkov/peshkov1910/peshkov191000715/133391093-modern-blogging-sketch-on-white-wall-background-blog-and-media-concept-3d-rendering.jpg'
    },
    author: {
        type: String,
        default: 'Admin'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true}, // chi chay khi dung .json
    toObject: {virtuals: true} // chi chay khi goi ham object
  }
);

//Export the model
module.exports = mongoose.model("Blog", blogSchema);
