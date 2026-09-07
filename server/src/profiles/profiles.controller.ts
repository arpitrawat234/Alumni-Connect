import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { UserDocument } from '../users/user.schema';

@Controller()
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('profiles/me')
  @UseGuards(JwtAuthGuard)
  getMyProfile(@GetUser() user: UserDocument) {
    return this.profilesService.getProfileByUserId(user._id.toString(), user.role);
  }

  @Put('profiles/me')
  @UseGuards(JwtAuthGuard)
  updateMyProfile(@GetUser() user: UserDocument, @Body() updateDto: any) {
    return this.profilesService.updateProfile(user._id.toString(), user.role, updateDto);
  }

  @Get('alumni')
  findAlumni(
    @Query('search') search?: string,
    @Query('company') company?: string,
    @Query('role') role?: string,
    @Query('industry') industry?: string,
    @Query('skill') skill?: string,
  ) {
    return this.profilesService.findAlumni({
      search,
      company,
      role,
      industry,
      skill,
    });
  }

  @Get('alumni/:id')
  findAlumniById(@Param('id') id: string) {
    return this.profilesService.findAlumniById(id);
  }
}
