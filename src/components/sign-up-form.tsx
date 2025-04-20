"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SetPasswordInput from "./set-password-input";
import DatePickerInput from "./date-picker-input";
import PhoneNumberInput from "./phone-number-input";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("CSE");
  const [gender, setGender] = useState("male");
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/student`,
          data: {
            name,
            role: "student",
            date_of_birth: dateOfBirth.toISOString().split("T")[0],
            phone_number: phoneNumber,
            image_url:
              gender === "male"
                ? "https://avatar.iran.liara.run/public/boy"
                : "https://avatar.iran.liara.run/public/girl",
          },
        },
      });
      if (error) throw error;
      if (data?.user) {
        // Populate the Students table
        const { data: studentData, error: studentError } = await supabase
          .from("Students")
          .insert([
            {
              name,
              email: email,
              credits_completed: 0,
              cgpa: 0,
              date_of_birth: dateOfBirth.toISOString().split("T")[0],
              gender: gender,
              image_url:
                gender === "Male"
                  ? "https://avatar.iran.liara.run/public/boy"
                  : "https://avatar.iran.liara.run/public/girl",
              phone_number: phoneNumber,
              user_id: data.user.id,
              department: department,
            },
          ]);
        if (studentError) throw studentError;
        console.log(studentError);
        console.log(studentData);
      }

      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn("flex flex-col gap-6 items-center", className)}
      {...props}
    >
      <Card className="w-full lg:w-[800px]">
        <CardHeader>
          <CardTitle className="text-2xl">Sign up</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className="grid lg:grid-cols-2 lg:border border-gray-200 rounded-lg lg:p-6 mb-6">
              {/* First Column */}
              <div className="flex flex-col gap-6 lg:border-r lg:border-gray-200 lg:p-6 lg:pe-10">
                {/* Name Input */}
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {/* Department, Gender Input */}
                <div className="grid grid-cols-2 gap-2">
                  {/* Department Input */}
                  <div className="grid gap-2">
                    <Label htmlFor="department">Department</Label>
                    <Select onValueChange={setDepartment} required>
                      <SelectTrigger className="w-[100%]">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {/* <SelectLabel>Fruits</SelectLabel> */}
                          <SelectItem value="CSE">CSE</SelectItem>
                          <SelectItem value="BBA">BBA</SelectItem>
                          <SelectItem value="EEE">EEE</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Gender Input */}
                  <div className="grid gap-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select onValueChange={setGender} required>
                      <SelectTrigger className="w-[100%]">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Date of Birth Input */}
                <div className="grid gap-2">
                  <DatePickerInput
                    dateOfBirth={dateOfBirth}
                    setDateOfBirth={setDateOfBirth}
                  />
                </div>

                {/* Phone Number Input */}
                <div className="grid gap-2">
                  <PhoneNumberInput
                    phoneNumber={phoneNumber}
                    setPhoneNumber={setPhoneNumber}
                  />
                </div>
              </div>

              {/* Second Column */}
              <div className="flex flex-col gap-6 lg:p-6 lg:ps-10">
                {/* Email Input */}
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="student@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    A confirmation mail will be sent to this address
                  </p>
                </div>

                {/* Set Password Input */}
                <div className="grid gap-2">
                  <SetPasswordInput
                    password={password}
                    setPassword={setPassword}
                  />
                </div>
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating an account..." : "Sign up"}
            </Button>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
