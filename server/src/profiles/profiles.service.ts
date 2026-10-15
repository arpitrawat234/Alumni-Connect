import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole, VerificationStatus } from '../users/user.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfileByUserId(userId: string, role: UserRole) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, verificationStatus: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (role === UserRole.STUDENT) {
      let profile = await this.prisma.studentProfile.findUnique({ where: { userId } });
      if (!profile) {
        profile = await this.prisma.studentProfile.create({
          data: { userId },
        });
      }

      return {
        user,
        profile: { ...profile, userId: profile.userId },
        completionPercentage: this.calculateStudentCompletion(profile),
      };
    }

    let profile = await this.prisma.alumniProfile.findUnique({ where: { userId } });
    if (!profile) {
      profile = await this.prisma.alumniProfile.create({
        data: { userId },
      });
    }

    return {
      user,
      profile: { ...profile, userId: profile.userId },
      completionPercentage: this.calculateAlumniCompletion(profile),
    };
  }

  async updateProfile(userId: string, role: UserRole, updateDto: UpdateProfileDto) {
    const { name, email, ...profileFields } = updateDto;
    const normalizedEmail = email?.toLowerCase().trim();

    if (normalizedEmail) {
      const existing = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });
      if (existing && existing.id !== userId) {
        throw new ConflictException('A user with this email address already exists');
      }
    }

    const profileData =
      role === UserRole.STUDENT
        ? this.pickFields(profileFields, [
            'college',
            'branch',
            'graduationYear',
            'skills',
            'careerInterests',
            'bio',
          ])
        : this.pickFields(profileFields, [
            'college',
            'graduationYear',
            'currentCompany',
            'currentRole',
            'industry',
            'location',
            'skills',
            'bio',
            'experience',
            'helpTopics',
            'servicesOffered',
          ]);

    const userUpdate: { name?: string; email?: string } = {};
    if (name !== undefined) userUpdate.name = name.trim();
    if (normalizedEmail !== undefined) userUpdate.email = normalizedEmail;

    if (role === UserRole.STUDENT) {
      const [profile, user] = await this.prisma.$transaction([
        this.prisma.studentProfile.upsert({
          where: { userId },
          update: profileData,
          create: { userId, ...profileData },
        }),
        this.prisma.user.update({
          where: { id: userId },
          data: userUpdate,
          select: { id: true, name: true, email: true, role: true, verificationStatus: true },
        }),
      ]);

      return {
        user,
        profile: { ...profile, userId: profile.userId },
        completionPercentage: this.calculateStudentCompletion(profile),
      };
    }

    const [profile, user] = await this.prisma.$transaction([
      this.prisma.alumniProfile.upsert({
        where: { userId },
        update: profileData,
        create: { userId, ...profileData },
      }),
      this.prisma.user.update({
        where: { id: userId },
        data: userUpdate,
        select: { id: true, name: true, email: true, role: true, verificationStatus: true },
      }),
    ]);

    return {
      user,
      profile: { ...profile, userId: profile.userId },
      completionPercentage: this.calculateAlumniCompletion(profile),
    };
  }

  async getRecommendations(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.role !== UserRole.STUDENT) {
      throw new ForbiddenException('Alumni recommendations are available to student accounts');
    }

    const studentProfile = await this.prisma.studentProfile.findUnique({ where: { userId } });
    if (!studentProfile) {
      return [];
    }

    const studentTags = this.normalizeTags([
      ...studentProfile.skills,
      ...studentProfile.careerInterests,
    ]);
    if (studentTags.length === 0) {
      return [];
    }

    const alumniProfiles = await this.prisma.alumniProfile.findMany({
      where: { user: { is: { verificationStatus: VerificationStatus.VERIFIED } } },
      include: {
        user: {
          select: { id: true, name: true, role: true, verificationStatus: true },
        },
      },
    });

    return alumniProfiles
      .map((profile) => {
        const alumniTags = this.normalizeTags([...profile.skills, ...profile.helpTopics]);
        const matchingTags = studentTags.filter((tag) => alumniTags.includes(tag));
        return {
          ...profile,
          userId: profile.user,
          user: undefined,
          matchingTags,
          matchScore: Math.round((matchingTags.length / studentTags.length) * 100),
        };
      })
      .filter((profile) => profile.matchingTags.length > 0)
      .sort((a, b) => b.matchScore - a.matchScore || a.userId.name.localeCompare(b.userId.name));
  }

  async findAlumni(query: {
    search?: string;
    company?: string;
    role?: string;
    industry?: string;
    skill?: string;
  }) {
    let profiles = await this.prisma.alumniProfile.findMany({
      where: { user: { is: { verificationStatus: VerificationStatus.VERIFIED } } },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true,
            verificationStatus: true,
          },
        },
      },
    });

    if (query.company && query.company !== 'All') {
      const term = query.company.toLowerCase();
      profiles = profiles.filter((profile) => profile.currentCompany.toLowerCase() === term);
    }
    if (query.role && query.role !== 'All') {
      const term = query.role.toLowerCase();
      profiles = profiles.filter((profile) => profile.currentRole.toLowerCase() === term);
    }
    if (query.industry && query.industry !== 'All') {
      const term = query.industry.toLowerCase();
      profiles = profiles.filter((profile) => profile.industry.toLowerCase() === term);
    }
    if (query.skill && query.skill !== 'All') {
      const term = query.skill.toLowerCase();
      profiles = profiles.filter((profile) =>
        profile.skills.some((skill) => skill.toLowerCase().includes(term)),
      );
    }

    if (query.search && query.search.trim()) {
      const term = query.search.toLowerCase().trim();
      profiles = profiles.filter((profile) => {
        const userName = profile.user?.name?.toLowerCase() || '';
        const company = profile.currentCompany?.toLowerCase() || '';
        const role = profile.currentRole?.toLowerCase() || '';
        const skillsMatch = profile.skills.some((skill) => skill.toLowerCase().includes(term));
        const helpMatch = profile.helpTopics.some((topic) => topic.toLowerCase().includes(term));

        return (
          userName.includes(term) ||
          company.includes(term) ||
          role.includes(term) ||
          skillsMatch ||
          helpMatch
        );
      });
    }

    return profiles.map((profile) => ({
      ...profile,
      userId: {
        id: profile.user.id,
        name: profile.user.name,
        role: profile.user.role,
        verificationStatus: profile.user.verificationStatus,
      },
      user: undefined,
    }));
  }

  async findAlumniById(id: string) {
    const profile = await this.prisma.alumniProfile.findFirst({
      where: {
        OR: [{ id }, { userId: id }],
        user: { is: { verificationStatus: VerificationStatus.VERIFIED } },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true,
            verificationStatus: true,
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Alumni profile not found');
    }

    return {
      ...profile,
      userId: {
        id: profile.user.id,
        name: profile.user.name,
        role: profile.user.role,
        verificationStatus: profile.user.verificationStatus,
      },
      user: undefined,
    };
  }

  async findPeople(excludeUserId: string) {
    const users = await this.prisma.user.findMany({
      where: { id: { not: excludeUserId } },
      orderBy: [{ role: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        name: true,
        role: true,
        verificationStatus: true,
        studentProfile: { select: { college: true } },
        alumniProfile: { select: { currentCompany: true, currentRole: true } },
      },
    });

    return users.map((person) => ({
      id: person.id,
      name: person.name,
      role: person.role,
      verificationStatus: person.verificationStatus,
      college: person.studentProfile?.college,
      company: person.alumniProfile?.currentCompany,
      currentRole: person.alumniProfile?.currentRole,
    }));
  }

  private pickFields<T extends object, K extends keyof T>(
    fields: T,
    allowed: readonly K[],
  ): Pick<T, K> {
    return Object.fromEntries(
      Object.entries(fields).filter(([key, value]) => allowed.includes(key as K) && value !== undefined),
    ) as Pick<T, K>;
  }

  private normalizeTags(tags: string[]): string[] {
    return [...new Set(tags.map((tag) => tag.trim().toLocaleLowerCase()).filter(Boolean))];
  }

  private calculateStudentCompletion(profile: { college: string; branch: string; graduationYear: number | null; skills: string[]; bio: string }): number {
    let score = 0;
    if (profile.college) score += 20;
    if (profile.branch) score += 20;
    if (profile.graduationYear) score += 20;
    if (profile.skills && profile.skills.length > 0) score += 20;
    if (profile.bio) score += 20;
    return score;
  }

  private calculateAlumniCompletion(profile: {
    college: string;
    currentCompany: string;
    currentRole: string;
    skills: string[];
    bio: string;
    helpTopics: string[];
    servicesOffered: string[];
  }): number {
    let score = 0;
    if (profile.college) score += 15;
    if (profile.currentCompany) score += 20;
    if (profile.currentRole) score += 15;
    if (profile.skills && profile.skills.length > 0) score += 15;
    if (profile.bio) score += 15;
    if (profile.helpTopics && profile.helpTopics.length > 0) score += 10;
    if (profile.servicesOffered && profile.servicesOffered.length > 0) score += 10;
    return score;
  }
}
