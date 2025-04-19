import { redirect } from "next/navigation";

import { LogoutButton } from "@/components/logout-button";
import { createClient } from "@/lib/supabase/server";

export default async function StudentDashboard() {
  const supabase = await createClient();

  // Get user
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("auth/login");
  }

  const user = data.user;
  console.log("Logged in as: ", user.email);
  console.log(user.user_metadata);

  // Get student profile of that user
  const { data: studentProfile, error: profileError } = await supabase
    .from("Students")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (profileError || !studentProfile) {
    console.log("Student profile not found:", profileError?.message);
    return <div>Student profile not found</div>;
  }

  console.log("Student profile:", studentProfile);

  // Get all courses of that user
  const { data: enrollments, error: enrollmentsError } = await supabase
    .from("Enrollments")
    .select("*, Sections(*, Courses(*))")
    .eq("student_id", studentProfile.id);

  if (enrollmentsError) {
    console.log("Error fetching enrollments:", enrollmentsError.message);
  } else {
    console.log("Enrollments:", enrollments);
  }

  return (
    <div className="flex h-svh w-full items-center justify-center gap-2">
      <p>
        Hello <span>{data.user.email}</span>
      </p>
      <LogoutButton />
    </div>
  );
}
