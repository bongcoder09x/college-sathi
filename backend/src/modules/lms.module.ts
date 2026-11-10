import { Body, Controller, Get, Module, Param, Post } from "@nestjs/common";

const COURSES = [
  { code: "CSE501", title: "Machine Learning", materials: 14, assignments: 4, quizzes: 3 },
  { code: "CSE502", title: "Compiler Design", materials: 9, assignments: 3, quizzes: 2 },
];

@Controller("lms")
export class LmsController {
  /** GET /api/lms/courses */
  @Get("courses")
  courses() {
    return { courses: COURSES };
  }

  /** POST /api/lms/materials — material upload (presigned file + metadata). */
  @Post("materials")
  material(@Body() body: { courseCode: string; title: string; fileKey: string }) {
    return { published: true, id: `mat_${Date.now()}`, ...body };
  }

  /** POST /api/lms/assignments/:id/submissions — submission + plagiarism job. */
  @Post("assignments/:id/submissions")
  submit(@Param("id") id: string, @Body() body: { studentId: string; fileKey: string }) {
    return { submissionId: `sub_${Date.now()}`, assignmentId: id, status: "received", plagiarism: { status: "queued", job: "import.process" }, ...body };
  }

  /** POST /api/lms/quizzes/:id/attempts — auto-graded attempt. */
  @Post("quizzes/:id/attempts")
  attempt(@Param("id") id: string, @Body() body: { studentId: string; answers: number[] }) {
    const score = Math.min(body.answers.length * 2, 10);
    return { quizId: id, studentId: body.studentId, score, total: 10, graded: true };
  }

  /** GET /api/lms/courses/:code/discussions */
  @Get("courses/:code/discussions")
  discussions(@Param("code") code: string) {
    return { courseCode: code, threads: [{ id: "th_1", author: "Ritwik M.", text: "Is the quiz open book?", replies: 2 }] };
  }
}

@Module({ controllers: [LmsController] })
export class LmsModule {}
