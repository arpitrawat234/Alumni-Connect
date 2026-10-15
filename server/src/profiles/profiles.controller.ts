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
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller()
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('profiles/me')
  @UseGuards(JwtAuthGuard)
  getMyProfile(@GetUser() user: UserDocument) {
    const userId = user.id || user._id || '';
    return this.profilesService.getProfileByUserId(userId, user.role);
  }

  @Put('profiles/me')
  @UseGuards(JwtAuthGuard)
  updateMyProfile(@GetUser() user: UserDocument, @Body() updateDto: UpdateProfileDto) {
    const userId = user.id || user._id || '';
    return this.profilesService.updateProfile(userId, user.role, updateDto);
  }

  @Get('profiles/recommendations')
  @UseGuards(JwtAuthGuard)
  getRecommendations(@GetUser() user: UserDocument) {
    return this.profilesService.getRecommendations(user.id || user._id || '');
  }

  @Get('people')
  @UseGuards(JwtAuthGuard)
  findPeople(@GetUser() user: UserDocument) {
    return this.profilesService.findPeople(user.id || user._id || '');
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
