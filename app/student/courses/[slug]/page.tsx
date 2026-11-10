import CourseDetail from "./CourseDetail";
import { courses } from "@/lib/portal";

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export const dynamicParams = false;

export default function CoursePage({ params }: { params: { slug: string } }) {
  return <CourseDetail slug={params.slug} />;
}
