import mongoose  from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "course tittle is required"],
      trim: true,
      maxLength: [100, "Course title cannot exceed 100 character"],
    },
    description: {
      type: String,
      trim: true,
      maxLength: [500, "Course title cannot exceed 500 character"],
    },
    videoUrl: {
      type: String,
      required: [true, "course tittle is required"],
    },
    duration: {
      type: Number,
      default: 0,
    },
    publicId: {
      type: String,
      required: [true, "Public ID is required"],
    },
    isPreview: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      required: [true, "Public ID is required"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

lectureSchema.pre('save',function(next){
    if(this.duration){
        this.duration = Math.round(this.duration * 100) / 100;
        //optional thing
    }
    next();
});

export const Lecture = mongoose.model('Lecture',lectureSchema)