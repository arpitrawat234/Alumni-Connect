import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { StudentProfile, StudentProfileSchema } from './schemas/student-profile.schema';
import { AlumniProfile, AlumniProfileSchema } from './schemas/alumni-profile.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StudentProfile.name, schema: StudentProfileSchema },
      { name: AlumniProfile.name, schema: AlumniProfileSchema },
    ]),
    forwardRef(() => UsersModule),
  ],
  controllers: [ProfilesController],
  providers: [ProfilesService],
  exports: [ProfilesService, MongooseModule],
})
export class ProfilesModule {}
