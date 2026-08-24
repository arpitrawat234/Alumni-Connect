import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TestRecordDocument = TestRecord & Document;

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
export class TestRecord {
  @Prop({ required: true, trim: true })
  name: string;
}

export const TestRecordSchema = SchemaFactory.createForClass(TestRecord);
