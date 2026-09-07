import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type StudentProfileDocument = StudentProfile & Document;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_, ret: any) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class StudentProfile {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ default: '' })
  college: string;

  @Prop({ default: '' })
  branch: string;

  @Prop({ default: null })
  graduationYear: number;

  @Prop({ type: [String], default: [] })
  skills: string[];

  @Prop({ type: [String], default: [] })
  careerInterests: string[];

  @Prop({ default: '' })
  bio: string;
}

export const StudentProfileSchema = SchemaFactory.createForClass(StudentProfile);
