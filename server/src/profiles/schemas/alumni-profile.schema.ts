import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AlumniProfileDocument = AlumniProfile & Document;

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
export class AlumniProfile {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ default: '' })
  college: string;

  @Prop({ default: null })
  graduationYear: number;

  @Prop({ default: '' })
  currentCompany: string;

  @Prop({ default: '' })
  currentRole: string;

  @Prop({ default: '' })
  industry: string;

  @Prop({ default: '' })
  location: string;

  @Prop({ type: [String], default: [] })
  skills: string[];

  @Prop({ default: '' })
  bio: string;

  @Prop({ default: '' })
  experience: string;

  @Prop({ type: [String], default: [] })
  helpTopics: string[];

  @Prop({ type: [String], default: [] })
  servicesOffered: string[];
}

export const AlumniProfileSchema = SchemaFactory.createForClass(AlumniProfile);
