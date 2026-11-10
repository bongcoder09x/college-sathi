import { Module } from "@nestjs/common";
import { DbModule } from "./db/db.module";
import { TenancyModule } from "./core/tenancy/tenancy.module";
import { AuthModule } from "./core/auth/auth.module";
import { IamModule } from "./core/iam/iam.module";
import { AuditModule } from "./core/audit/audit.module";
import { FilesModule } from "./core/files/files.module";
import { NotificationsModule } from "./core/notifications/notifications.module";
import { CampusModule } from "./modules/campus.module";
import { StructureModule } from "./modules/structure.module";
import { AdmissionsModule } from "./modules/admissions.module";
import { StudentsModule } from "./modules/students.module";
import { FacultyModule } from "./modules/faculty.module";
import { TimetableModule } from "./modules/timetable.module";
import { AttendanceModule } from "./modules/attendance.module";
import { LmsModule } from "./modules/lms.module";
import { ExamsModule } from "./modules/exams.module";
import { FeesModule } from "./modules/fees.module";
import { PaymentsModule } from "./modules/payments.module";
import { LibraryModule } from "./modules/library.module";
import { HostelModule } from "./modules/hostel.module";
import { TransportModule } from "./modules/transport.module";
import { ParentsModule } from "./modules/parents.module";
import { CommunicationModule } from "./modules/communication.module";
import { CertificatesModule } from "./modules/certificates.module";
import { HelpdeskModule } from "./modules/helpdesk.module";
import { ReportsModule } from "./modules/reports.module";
import { RealtimeModule } from "./realtime/realtime.module";
import { WorkersModule } from "./workers/workers.module";

@Module({
  imports: [
    DbModule,
    TenancyModule,
    AuthModule,
    IamModule,
    AuditModule,
    FilesModule,
    NotificationsModule,
    // domain modules
    CampusModule,
    StructureModule,
    AdmissionsModule,
    StudentsModule,
    FacultyModule,
    TimetableModule,
    AttendanceModule,
    LmsModule,
    ExamsModule,
    FeesModule,
    PaymentsModule,
    LibraryModule,
    HostelModule,
    TransportModule,
    ParentsModule,
    CommunicationModule,
    CertificatesModule,
    HelpdeskModule,
    ReportsModule,
    // infrastructure
    RealtimeModule,
    WorkersModule,
  ],
})
export class AppModule {}
