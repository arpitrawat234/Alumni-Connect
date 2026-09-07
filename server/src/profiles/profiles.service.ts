import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, isValidObjectId } from 'mongoose';
import { User, UserDocument, UserRole } from '../users/user.schema';
import { StudentProfile, StudentProfileDocument } from './schemas/student-profile.schema';
import { AlumniProfile, AlumniProfileDocument } from './schemas/alumni-profile.schema';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(StudentProfile.name)
    private readonly studentProfileModel: Model<StudentProfileDocument>,
    @InjectModel(AlumniProfile.name)
    private readonly alumniProfileModel: Model<AlumniProfileDocument>,
  ) {}

  async getProfileByUserId(userId: string, role: UserRole) {
    if (role === UserRole.STUDENT) {
      let profile = await this.studentProfileModel.findOne({ userId: new Types.ObjectId(userId) }).exec();
      if (!profile) {
        profile = await this.studentProfileModel.create({ userId: new Types.ObjectId(userId) });
      }
      const completionPercentage = this.calculateStudentCompletion(profile);
      return { profile, completionPercentage };
    } else {
      let profile = await this.alumniProfileModel.findOne({ userId: new Types.ObjectId(userId) }).exec();
      if (!profile) {
        profile = await this.alumniProfileModel.create({ userId: new Types.ObjectId(userId) });
      }
      const completionPercentage = this.calculateAlumniCompletion(profile);
      return { profile, completionPercentage };
    }
  }

  async updateProfile(userId: string, role: UserRole, updateDto: any) {
    if (role === UserRole.STUDENT) {
      const profile = await this.studentProfileModel.findOneAndUpdate(
        { userId: new Types.ObjectId(userId) },
        { $set: updateDto },
        { new: true, upsert: true },
      ).exec();
      const completionPercentage = this.calculateStudentCompletion(profile);
      return { profile, completionPercentage };
    } else {
      const profile = await this.alumniProfileModel.findOneAndUpdate(
        { userId: new Types.ObjectId(userId) },
        { $set: updateDto },
        { new: true, upsert: true },
      ).exec();
      const completionPercentage = this.calculateAlumniCompletion(profile);
      return { profile, completionPercentage };
    }
  }

  async findAlumni(query: {
    search?: string;
    company?: string;
    role?: string;
    industry?: string;
    skill?: string;
  }) {
    const filter: any = {};

    if (query.company && query.company !== 'All') {
      filter.currentCompany = new RegExp(`^${query.company}$`, 'i');
    }
    if (query.role && query.role !== 'All') {
      filter.currentRole = new RegExp(`^${query.role}$`, 'i');
    }
    if (query.industry && query.industry !== 'All') {
      filter.industry = new RegExp(`^${query.industry}$`, 'i');
    }
    if (query.skill && query.skill !== 'All') {
      filter.skills = { $in: [new RegExp(query.skill, 'i')] };
    }

    const profiles = await this.alumniProfileModel
      .find(filter)
      .populate('userId', 'name email role verificationStatus')
      .exec();

    // In-memory or regex search across name, company, role, skills, and bio
    if (query.search && query.search.trim()) {
      const term = query.search.toLowerCase().trim();
      return profiles.filter((p: any) => {
        const userName = p.userId?.name?.toLowerCase() || '';
        const company = p.currentCompany?.toLowerCase() || '';
        const role = p.currentRole?.toLowerCase() || '';
        const skillsMatch = p.skills?.some((s: string) => s.toLowerCase().includes(term));
        const helpMatch = p.helpTopics?.some((h: string) => h.toLowerCase().includes(term));
        return (
          userName.includes(term) ||
          company.includes(term) ||
          role.includes(term) ||
          skillsMatch ||
          helpMatch
        );
      });
    }

    return profiles;
  }

  async findAlumniById(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    let profile = await this.alumniProfileModel
      .findById(id)
      .populate('userId', 'name email role verificationStatus')
      .exec();

    // If not found by profile ID, check if it's the user's ObjectId
    if (!profile) {
      profile = await this.alumniProfileModel
        .findOne({ userId: new Types.ObjectId(id) })
        .populate('userId', 'name email role verificationStatus')
        .exec();
    }

    if (!profile) {
      throw new NotFoundException('Alumni profile not found');
    }

    return profile;
  }

  private calculateStudentCompletion(p: StudentProfileDocument): number {
    let score = 0;
    if (p.college) score += 20;
    if (p.branch) score += 20;
    if (p.graduationYear) score += 20;
    if (p.skills && p.skills.length > 0) score += 20;
    if (p.bio) score += 20;
    return score;
  }

  private calculateAlumniCompletion(p: AlumniProfileDocument): number {
    let score = 0;
    if (p.college) score += 15;
    if (p.currentCompany) score += 20;
    if (p.currentRole) score += 15;
    if (p.skills && p.skills.length > 0) score += 15;
    if (p.bio) score += 15;
    if (p.helpTopics && p.helpTopics.length > 0) score += 10;
    if (p.servicesOffered && p.servicesOffered.length > 0) score += 10;
    return score;
  }
}
