import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
class Analitycs {
  @Prop()
  totalRedirects: number;

  @Prop()
  lastRedirects: Date[];
}

@Schema()
export class Url extends Document {
  @Prop({ required: true })
  originalUrl: string;

  @Prop({ unique: true, required: true, index: true })
  alias: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop()
  expiresAt: Date;

  @Prop({ type: Analitycs })
  analytics: Analitycs;
}

export const UrlSchema = SchemaFactory.createForClass(Url);
